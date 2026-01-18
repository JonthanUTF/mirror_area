# Backend - Vue d'ensemble

Documentation du serveur backend AREA développé avec Node.js et Express.js.

## Structure du Projet

```
server/
├── src/
│   ├── app.js              # Point d'entrée de l'application
│   ├── config/
│   │   └── passport.js     # Configuration OAuth (Google, Twitch)
│   ├── models/
│   │   ├── index.js        # Définition des modèles Sequelize
│   │   ├── Service.js      # Modèle Service
│   │   └── UserService.js  # Modèle UserService (jonction)
│   ├── routes/
│   │   ├── auth.js         # Routes d'authentification
│   │   ├── areas.js        # Routes CRUD des AREAs
│   │   ├── users.js        # Routes utilisateurs
│   │   └── services.js     # Routes connexion services
│   └── services/
│       ├── ServiceBase.js  # Classe de base des services
│       ├── automation.js   # Moteur d'automatisation
│       ├── registry.js     # Registre des services
│       ├── loader.js       # Chargement dynamique
│       ├── aboutService.js # Service about.json
│       └── implementations/
│           ├── ConsoleService.js
│           ├── DropboxService.js
│           ├── EmailService.js
│           ├── GitHubService.js
│           ├── MicrosoftService.js
│           ├── TimerService.js
│           └── TwitchService.js
├── config/
│   └── config.json         # Configuration Sequelize
├── migrations/             # Migrations SQL
├── tests/                  # Tests API
├── Dockerfile
├── package.json
└── seed.js                 # Seed de la base de données
```

## Démarrage

### Installation

```bash
cd server
npm install
```

### Configuration

Créez un fichier `.env` :

```env
# Base de données
DATABASE_URL=postgres://user:password@localhost:5432/area

# JWT
JWT_SECRET=votre-secret-jwt

# OAuth Google
GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret

# OAuth Twitch
TWITCH_CLIENT_ID=votre-client-id
TWITCH_CLIENT_SECRET=votre-client-secret
TWITCH_CALLBACK_URL=http://localhost:8080/auth/twitch/callback

# OAuth Microsoft
MICROSOFT_CLIENT_ID=votre-client-id
MICROSOFT_CLIENT_SECRET=votre-client-secret

# OAuth GitHub
GITHUB_CLIENT_ID=votre-client-id
GITHUB_CLIENT_SECRET=votre-client-secret

# OAuth Dropbox
DROPBOX_CLIENT_ID=votre-client-id
DROPBOX_CLIENT_SECRET=votre-client-secret

# Configuration
PORT=8080
CLIENT_URL=http://localhost:8081
```

### Développement

```bash
npm run dev
```

Le serveur sera disponible sur `http://localhost:8080`.

## Points d'API principaux

| Endpoint | Description |
|----------|-------------|
| POST /auth/register | Inscription |
| POST /auth/login | Connexion |
| GET /auth/google | OAuth Google |
| GET /auth/twitch | OAuth Twitch |
| GET /areas | Liste des AREAs |
| POST /areas | Créer une AREA |
| GET /services | Liste des services |
| GET /about.json | Informations serveur |

## Modèles de données

### User

| Champ | Type | Description |
|-------|------|-------------|
| id | INTEGER | Clé primaire |
| email | STRING | Email unique |
| password | STRING | Hash du mot de passe |
| isAdmin | BOOLEAN | Administrateur |
| googleId | STRING | ID Google OAuth |
| twitchId | STRING | ID Twitch OAuth |

### Area

| Champ | Type | Description |
|-------|------|-------------|
| id | INTEGER | Clé primaire |
| name | STRING | Nom de l'AREA |
| userId | INTEGER | Propriétaire |
| actionService | STRING | Service déclencheur |
| actionType | STRING | Type d'action |
| reactionService | STRING | Service réaction |
| reactionType | STRING | Type de réaction |
| parameters | JSON | Paramètres |
| isActive | BOOLEAN | État d'activation |
| lastTriggered | DATE | Dernier déclenchement |

### Service

| Champ | Type | Description |
|-------|------|-------------|
| id | INTEGER | Clé primaire |
| name | STRING | Nom du service |
| description | STRING | Description |
| icon | STRING | URL de l'icône |

## Architecture des services

Chaque service hérite de `ServiceBase` et implémente :

- `registerAction(name, description, params)` - Enregistre une action
- `registerReaction(name, description, params)` - Enregistre une réaction
- `checkTrigger(action, area, params)` - Vérifie si le trigger est déclenché
- `executeReaction(reaction, area, params)` - Exécute la réaction

```javascript
class MyService extends ServiceBase {
    constructor() {
        super('myservice', 'Mon Service', 'icon-url');
        
        this.registerAction('my_action', 'Description', {
            param1: 'string'
        });
        
        this.registerReaction('my_reaction', 'Description', {
            param2: 'number'
        });
    }
    
    async checkTrigger(action, area, params) {
        // Logique de vérification
        return true; // ou false
    }
    
    async executeReaction(reaction, area, params) {
        // Exécution de la réaction
    }
}
```

## Moteur d'automatisation

Le fichier `automation.js` contient le moteur qui :

1. Charge toutes les AREAs actives
2. Vérifie périodiquement les triggers
3. Exécute les réactions correspondantes
4. Met à jour `lastTriggered`

```javascript
// Boucle principale (toutes les 30 secondes)
setInterval(async () => {
    const areas = await Area.findAll({ where: { isActive: true } });
    
    for (const area of areas) {
        const service = registry.get(area.actionService);
        const triggered = await service.checkTrigger(
            area.actionType,
            area,
            area.parameters
        );
        
        if (triggered) {
            const reactionService = registry.get(area.reactionService);
            await reactionService.executeReaction(
                area.reactionType,
                area,
                area.parameters
            );
            await area.update({ lastTriggered: new Date() });
        }
    }
}, 30000);
```
