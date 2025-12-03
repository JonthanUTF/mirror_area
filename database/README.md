# Database - AREA Project

Documentation complète de la base de données du projet AREA.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Migrations](#migrations)
- [Seed](#seed)
- [Backup & Restore](#backup--restore)
- [Outils](#outils)
- [Architecture](#architecture)

## 🔧 Prérequis

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm ou yarn

## 📦 Installation

### 1. Installer PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Télécharger depuis [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Créer la base de données
```bash
# Se connecter à PostgreSQL
psql postgres

# Créer l'utilisateur et la base de données
CREATE USER area_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE area_db OWNER area_user;
GRANT ALL PRIVILEGES ON DATABASE area_db TO area_user;

# Quitter
\q
```

### 3. Configuration
```bash
# Copier le template d'environnement
cp .env.example .env

# Générer des clés sécurisées
openssl rand -base64 32  # DATABASE_ENCRYPTION_KEY
openssl rand -base64 32  # ACCESS_TOKEN_SECRET
openssl rand -base64 32  # REFRESH_TOKEN_SECRET

# Éditer .env avec vos valeurs
nano .env
```

### 4. Initialiser la base de données
```bash
# Méthode 1: Script automatique (recommandé)
npm run db:init

# Méthode 2: Manuelle
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

## ⚙️ Configuration

Toute la configuration est dans `.env`:

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL complète de connexion | `postgresql://user:pass@localhost:5432/db` |
| `DATABASE_HOST` | Hôte PostgreSQL | `localhost` |
| `DATABASE_PORT` | Port PostgreSQL | `5432` |
| `DATABASE_NAME` | Nom de la base | `area_db` |
| `DATABASE_USER` | Utilisateur | `area_user` |
| `DATABASE_PASSWORD` | Mot de passe | `secure_password` |
| `DATABASE_ENCRYPTION_KEY` | Clé de chiffrement (32+ chars) | Généré avec openssl |

## 🔄 Migrations

### Créer une nouvelle migration
```bash
npx prisma migrate dev --name description_de_la_migration
```

### Appliquer les migrations (production)
```bash
npx prisma migrate deploy
```

### Reset complet de la DB (⚠️ SUPPRIME TOUTES LES DONNÉES)
```bash
npm run db:reset
```

## 🌱 Seed

Peupler la base de données avec des données de test:
```bash
npm run db:seed
```

Le seed est défini dans `database/prisma/seed.ts`.

## 💾 Backup & Restore

### Créer un backup
```bash
npm run db:backup
```

Les backups sont sauvegardés dans `database/backups/` avec un timestamp.

### Restaurer un backup
```bash
npm run db:restore database/backups/area_db_backup_20240101_120000.sql.gz
```

⚠️ **Attention:** Cela écrasera la base de données actuelle!

### Backup automatique

Pour configurer des backups automatiques avec cron:
```bash
# Éditer crontab
crontab -e

# Ajouter (backup quotidien à 3h du matin)
0 3 * * * cd /path/to/project && npm run db:backup
```

## 🛠️ Outils

### Prisma Studio (GUI)

Interface visuelle pour explorer et modifier les données:
```bash
npm run db:studio
```

Ouvre automatiquement http://localhost:5555

### Vérifier l'état des migrations
```bash
npx prisma migrate status
```

### Format du schéma Prisma
```bash
npx prisma format
```

## 📊 Architecture

### Structure des dossiers
```
database/
├── prisma/
│   ├── schema.prisma         # Schéma de la base de données
│   ├── migrations/           # Historique des migrations
│   └── seed.ts               # Données de seed
├── config/
│   └── database.config.ts    # Configuration centralisée
├── scripts/
│   ├── init-db.sh           # Script d'initialisation
│   ├── backup.sh            # Script de backup
│   └── restore.sh           # Script de restauration
├── docs/
│   ├── schema.md            # Documentation du schéma
│   └── erd.png              # Diagramme ERD
└── README.md                # Ce fichier
```

### Schéma de la base de données

Voir [docs/schema.md](docs/schema.md) pour la documentation complète du schéma.

## 🔐 Sécurité

- **Tokens OAuth2**: Chiffrés avec AES-256-GCM
- **Mots de passe**: Hashés avec bcrypt (10 rounds)
- **Variables sensibles**: Stockées dans `.env` (git-ignoré)
- **Clés de chiffrement**: Minimum 32 caractères

## 🐛 Troubleshooting

### Erreur: "role 'area_user' does not exist"
```bash
psql postgres
CREATE USER area_user WITH PASSWORD 'your_password';
\q
```

### Erreur: "database 'area_db' does not exist"
```bash
psql postgres
CREATE DATABASE area_db OWNER area_user;
\q
```

### Erreur: "P1001: Can't reach database server"

Vérifier que PostgreSQL est démarré:
```bash
# macOS
brew services list

# Linux
sudo systemctl status postgresql
```

### Reset complet en cas de problème
```bash
# Supprimer les migrations et la DB
rm -rf database/prisma/migrations
npx prisma migrate reset --force

# Réinitialiser
npm run db:init
```

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Documentation du projet AREA](../README.md)

## 👥 Contribution

Voir [HOWTOCONTRIBUTE.md](../HOWTOCONTRIBUTE.md) pour ajouter de nouvelles tables ou migrations.