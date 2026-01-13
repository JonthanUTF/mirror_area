#!/bin/bash

# Script de configuration rapide pour GitHub OAuth

echo "🔧 Configuration GitHub OAuth pour AREA"
echo "========================================"
echo ""

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "📝 Création du fichier .env depuis .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé"
    else
        echo "❌ Fichier .env.example introuvable"
        exit 1
    fi
else
    echo "✅ Fichier .env existe déjà"
fi

echo ""
echo "📋 Pour configurer GitHub OAuth:"
echo ""
echo "1. Allez sur: https://github.com/settings/developers"
echo "2. Cliquez sur 'New OAuth App'"
echo "3. Remplissez:"
echo "   - Application name: AREA Local"
echo "   - Homepage URL: http://localhost:8081"
echo "   - Authorization callback URL: http://localhost:8081/services/callback"
echo ""
echo "4. Copiez votre Client ID et Client Secret"
echo ""

read -p "Voulez-vous entrer vos credentials GitHub maintenant? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "GitHub Client ID: " GITHUB_CLIENT_ID
    read -p "GitHub Client Secret: " GITHUB_CLIENT_SECRET
    
    # Mise à jour du .env
    if grep -q "GITHUB_CLIENT_ID" .env; then
        # Remplacer les valeurs existantes
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/GITHUB_CLIENT_ID=.*/GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID/" .env
            sed -i '' "s/GITHUB_CLIENT_SECRET=.*/GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET/" .env
        else
            # Linux
            sed -i "s/GITHUB_CLIENT_ID=.*/GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID/" .env
            sed -i "s/GITHUB_CLIENT_SECRET=.*/GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET/" .env
        fi
        echo ""
        echo "✅ Credentials GitHub mis à jour dans .env"
    else
        echo ""
        echo "GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID" >> .env
        echo "GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET" >> .env
        echo "✅ Credentials GitHub ajoutés à .env"
    fi
    
    echo ""
    echo "🚀 Vous pouvez maintenant lancer l'application avec:"
    echo "   ./start.sh"
else
    echo ""
    echo "📝 Editez manuellement le fichier .env et ajoutez:"
    echo "   GITHUB_CLIENT_ID=votre-client-id"
    echo "   GITHUB_CLIENT_SECRET=votre-client-secret"
fi

echo ""
echo "📚 Documentation complète:"
echo "   - Guide utilisateur: docs/GUIDE_GITHUB_FRONTEND.md"
echo "   - Documentation technique: docs/services/github-implementation.md"
echo ""
