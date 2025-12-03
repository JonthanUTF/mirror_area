#!/bin/bash

# Script de backup de la base de données
# Usage: ./database/scripts/backup.sh

set -e

echo "💾 Backup de la base de données..."

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env non trouvé"
    exit 1
fi

# Créer le dossier de backup s'il n'existe pas
BACKUP_DIR="database/backups"
mkdir -p $BACKUP_DIR

# Nom du fichier avec timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/area_db_backup_$TIMESTAMP.sql"

echo "📂 Création du backup: $BACKUP_FILE"

# Backup avec pg_dump
PGPASSWORD=$DATABASE_PASSWORD pg_dump \
    -h $DATABASE_HOST \
    -p $DATABASE_PORT \
    -U $DATABASE_USER \
    -d $DATABASE_NAME \
    -F c \
    -b \
    -v \
    -f "$BACKUP_FILE"

# Compression
echo "🗜️  Compression du backup..."
gzip "$BACKUP_FILE"

echo "✅ Backup créé avec succès: ${BACKUP_FILE}.gz"
echo "📦 Taille: $(du -h ${BACKUP_FILE}.gz | cut -f1)"

# Nettoyage des backups de plus de 30 jours
echo "🧹 Nettoyage des anciens backups (>30 jours)..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup terminé!"