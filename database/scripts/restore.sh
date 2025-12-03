#!/bin/bash

# Script de restauration de la base de données
# Usage: ./database/scripts/restore.sh <backup_file>

set -e

if [ -z "$1" ]; then
    echo "❌ Usage: ./database/scripts/restore.sh <backup_file.sql.gz>"
    echo ""
    echo "Backups disponibles:"
    ls -lh database/backups/*.sql.gz 2>/dev/null || echo "Aucun backup trouvé"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Fichier de backup non trouvé: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  ATTENTION: Cette opération va ÉCRASER la base de données actuelle!"
read -p "Êtes-vous sûr de vouloir continuer? (yes/no): " -r
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "❌ Restauration annulée"
    exit 1
fi

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env non trouvé"
    exit 1
fi

echo "📦 Décompression du backup..."
TEMP_FILE=$(mktemp)
gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"

echo "🗄️  Restauration de la base de données..."
PGPASSWORD=$DATABASE_PASSWORD pg_restore \
    -h $DATABASE_HOST \
    -p $DATABASE_PORT \
    -U $DATABASE_USER \
    -d $DATABASE_NAME \
    -c \
    -v \
    "$TEMP_FILE"

# Nettoyage
rm "$TEMP_FILE"

echo "✅ Base de données restaurée avec succès!"
echo "🔄 Pensez à régénérer le client Prisma: npx prisma generate"