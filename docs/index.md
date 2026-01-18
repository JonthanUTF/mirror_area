# AREA - Action REAction

Documentation du projet **AREA** (Action REAction), une plateforme d'automatisation inspirée de services comme IFTTT ou Zapier.

## Présentation

AREA est une application full-stack permettant aux utilisateurs de créer des automatisations personnalisées en connectant différents services web. L'application suit le paradigme **"Si ceci se produit, alors faire cela"** (If This Then That).

## Architecture du Projet

Le projet est composé de 3 composants principaux :

| Composant | Technologie | Port | Description |
|-----------|-------------|------|-------------|
| Backend API | Node.js / Express | 8080 | API REST + Moteur d'automatisation |
| Frontend Web | React / Vite | 8081 | Interface web responsive |
| Application Mobile | React Native / Expo | - | Application iOS et Android |

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client Web    │     │  Client Mobile  │     │   PostgreSQL    │
│   (React/Vite)  │     │ (React Native)  │     │    Database     │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Backend API         │
                    │   (Node.js/Express)     │
                    │   Port: 8080            │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐            ┌─────▼─────┐          ┌──────▼─────┐
    │ Google  │            │  Twitch   │          │ Microsoft  │
    │ (Gmail) │            │    API    │          │ (OneDrive) │
    └─────────┘            └───────────┘          └────────────┘
```

## Démarrage Rapide

### Prérequis

- Docker & Docker Compose
- Node.js 18+ (pour développement local)
- Clés API pour les services OAuth (Google, Twitch, Microsoft)

### Lancement avec Docker

```bash
# Cloner le repository
git clone https://github.com/JonthanUTF/mirror_area.git
cd mirror_area

# Configurer les variables d'environnement
cp server/.env.example server/.env
# Éditer server/.env avec vos clés API

# Lancer tous les services
docker-compose up -d

# Accéder à l'application
# Web: http://localhost:8081
# API: http://localhost:8080
```

### Développement Local

```bash
# Backend
cd server
npm install
npm run dev

# Frontend Web
cd front-web
npm install
npm run dev

# Application Mobile
cd client-mobile
npm install
npx expo start
```

## Documentation

| Section | Description |
|---------|-------------|
| [Architecture](architecture.md) | Architecture technique détaillée |
| [API Reference](api-reference.md) | Documentation complète de l'API REST |
| [Backend](backend/index.md) | Documentation du serveur Node.js |
| [Frontend Web](frontend/index.md) | Documentation du client React |
| [Application Mobile](mobile/index.md) | Documentation React Native |
| [Services](services/index.md) | Guide des services intégrés |
| [Contribuer](contributor.md) | Guide de contribution |

## Services Supportés

| Service | Actions | Réactions |
|---------|---------|-----------|
| Google (Gmail) | Nouvel email reçu | Envoyer un email |
| GitHub | Issue créée, PR ouverte, Push | Créer issue, Commenter |
| Dropbox | Fichier ajouté/modifié | Upload, Créer dossier |
| Twitch | Streamer en live | Bloquer un utilisateur |
| Microsoft | Nouveau fichier OneDrive | Upload fichier, Envoyer email |
| Timer | Intervalle | - |
| Console | - | Logger un message |

## Authentification

L'application supporte plusieurs méthodes d'authentification :

- Email / Mot de passe : Inscription et connexion classiques
- Google OAuth : Connexion via compte Google
- JWT : Tokens d'authentification sécurisés

## Licence

Ce projet est développé dans le cadre du module B-DEV-500 AREA à Epitech.
