#!/bin/bash

# Script d'initialisation de la base de données
# Usage: ./database/scripts/init-db.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Initialisation de la base de données AREA..."

# Charger les variables d'environnement
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env non trouvé. Créez-le à partir de .env.example"
    exit 1
fi

# Vérifier que les variables sont définies
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL n'est pas défini dans .env"
    exit 1
fi

echo "📦 Installation des dépendances Prisma..."
npm install @prisma/client prisma --save-dev

echo "🔧 Génération du client Prisma..."
npx prisma generate

echo "🗄️  Application des migrations..."
npx prisma migrate deploy

echo "🌱 Seed de la base de données..."
npx prisma db seed

echo "✅ Base de données initialisée avec succès!"
echo ""
echo "📊 Pour visualiser la base de données:"
echo "   npx prisma studio"