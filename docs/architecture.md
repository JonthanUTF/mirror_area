# Architecture Technique# 🏛️ Architecture Technique



## Vue d'ensemble## Vue d'ensemble



Le projet AREA suit une architecture microservices avec une séparation claire entre le frontend, le backend et la base de données.Le projet AREA suit une architecture **microservices** avec une séparation claire entre le frontend, le backend et la base de données.



## Stack Technique## Stack Technique



### Backend### Backend



| Technologie | Usage || Technologie | Usage |

|-------------|-------||-------------|-------|

| Node.js | Runtime JavaScript || **Node.js** | Runtime JavaScript |

| Express.js | Framework web || **Express.js** | Framework web |

| Sequelize | ORM PostgreSQL || **Sequelize** | ORM PostgreSQL |

| Passport.js | Authentification OAuth || **Passport.js** | Authentification OAuth |

| JWT | Tokens d'authentification || **JWT** | Tokens d'authentification |

| Axios | Client HTTP || **Axios** | Client HTTP |



### Frontend Web### Frontend Web



| Technologie | Usage || Technologie | Usage |

|-------------|-------||-------------|-------|

| React 18 | Bibliothèque UI || **React 18** | Bibliothèque UI |

| Vite | Build tool || **Vite** | Build tool |

| React Router | Routing || **React Router** | Routing |

| CSS Modules | Styling || **CSS Modules** | Styling |



### Application Mobile### Application Mobile



| Technologie | Usage || Technologie | Usage |

|-------------|-------||-------------|-------|

| React Native | Framework mobile || **React Native** | Framework mobile |

| Expo | Toolchain || **Expo** | Toolchain |

| React Navigation | Navigation || **React Navigation** | Navigation |



### Infrastructure### Infrastructure



| Technologie | Usage || Technologie | Usage |

|-------------|-------||-------------|-------|

| Docker | Conteneurisation || **Docker** | Conteneurisation |

| Docker Compose | Orchestration || **Docker Compose** | Orchestration |

| PostgreSQL | Base de données || **PostgreSQL** | Base de données |

| Nginx | Reverse proxy (production) || **Nginx** | Reverse proxy (production) |



## Schéma d'Architecture## Schéma d'Architecture



``````

┌─────────────────────────────────────────────────────────────────┐┌─────────────────────────────────────────────────────────────────┐

│                         CLIENTS                                  ││                         CLIENTS                                  │

├──────────────────────────┬──────────────────────────────────────┤├─────────────────────────────────┬───────────────────────────────┤

│      Frontend Web        │        Application Mobile            ││        Frontend Web             │       Application Mobile       │

│      (React/Vite)        │        (React Native/Expo)           ││        (React/Vite)             │       (React Native/Expo)      │

│      Port: 8081          │                                      ││        Port: 8081               │                                │

└──────────────┬───────────┴────────────────┬─────────────────────┘└─────────────────────────────────┴───────────────────────────────┘

               │                            │                                  │

               │         HTTP/HTTPS         │                                  │ HTTP/REST

               │                            │                                  ▼

┌──────────────▼────────────────────────────▼─────────────────────┐┌─────────────────────────────────────────────────────────────────┐

│                      BACKEND API                                 ││                         BACKEND API                              │

│                   (Node.js/Express)                              ││                     (Node.js/Express)                            │

│                      Port: 8080                                  ││                         Port: 8080                               │

├─────────────────────────────────────────────────────────────────┤├─────────────────────────────────────────────────────────────────┤

│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  ││  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │

│  │   Routes    │  │   Models    │  │   Services              │  ││  │    Routes    │  │   Services   │  │   Models     │           │

│  │  - auth     │  │  - User     │  │  - Gmail                │  ││  │              │  │              │  │              │           │

│  │  - areas    │  │  - Area     │  │  - GitHub               │  ││  │ - /auth      │  │ - Google     │  │ - User       │           │

│  │  - services │  │  - Service  │  │  - Dropbox              │  ││  │ - /areas     │  │ - Twitch     │  │ - Area       │           │

│  │  - users    │  │  - UserSvc  │  │  - Twitch               │  ││  │ - /users     │  │ - Microsoft  │  │ - Service    │           │

│  └─────────────┘  └─────────────┘  │  - Microsoft            │  ││  │ - /services  │  │ - Timer      │  │ - UserService│           │

│                                    │  - Timer                 │  ││  └──────────────┘  │ - Weather    │  └──────────────┘           │

│                                    │  - Console               │  ││                    │ - Console    │                              │

│                                    └─────────────────────────┘  ││                    └──────────────┘                              │

└─────────────────────────────┬───────────────────────────────────┘├─────────────────────────────────────────────────────────────────┤

                              ││                    AUTOMATION ENGINE                             │

                              │ Sequelize ORM│              (Boucle de vérification des AREAs)                  │

                              │└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────▼───────────────────────────────────┐                                  │

│                      PostgreSQL                                  │                                  │ Sequelize ORM

│                      Port: 5432                                  │                                  ▼

├─────────────────────────────────────────────────────────────────┤┌─────────────────────────────────────────────────────────────────┐

│  Tables:                                                         ││                         POSTGRESQL                               │

│  - users        : Utilisateurs                                   ││                         Port: 5432                               │

│  - areas        : Automatisations                                │├─────────────────────────────────────────────────────────────────┤

│  - services     : Services disponibles                           ││  Tables: users, areas, services, user_services                   │

│  - user_services: Connexions OAuth                               │└─────────────────────────────────────────────────────────────────┘

└─────────────────────────────────────────────────────────────────┘```

```

## Modèle de Données

## Flux d'authentification

### Entités principales

### Login classique

```

```┌─────────────────┐       ┌─────────────────┐

Client                    Backend                   Database│      User       │       │      Area       │

  │                          │                          │├─────────────────┤       ├─────────────────┤

  │  POST /auth/login        │                          ││ id (UUID)       │───┐   │ id (UUID)       │

  │  {email, password}       │                          ││ email           │   │   │ userId (FK)     │◄──┐

  │ ─────────────────────────>                          ││ password        │   │   │ name            │   │

  │                          │  SELECT user             ││ name            │   │   │ actionService   │   │

  │                          │ ─────────────────────────>│ googleId        │   │   │ actionType      │   │

  │                          │                          ││ role            │   └──►│ reactionService │   │

  │                          │  <─── user data          ││ twitchId        │       │ reactionType    │   │

  │                          │                          ││ twitchTokens... │       │ parameters      │   │

  │                          │  Verify password         │└─────────────────┘       │ active          │   │

  │                          │  Generate JWT            │         │                │ lastTriggered   │   │

  │                          │                          │         │                └─────────────────┘   │

  │  <─── {token, user}      │                          │         │                                      │

  │                          │                          │         │  ┌─────────────────┐                 │

```         │  │    Service      │                 │

         │  ├─────────────────┤                 │

### OAuth Google         │  │ id (UUID)       │                 │

         │  │ name            │                 │

```         │  │ label           │                 │

Client                 Backend              Google         │  │ icon            │                 │

  │                       │                    │         │  └─────────────────┘                 │

  │  GET /auth/google     │                    │         │           │                          │

  │ ──────────────────────>                    │         │           │                          │

  │                       │                    │         ▼           ▼                          │

  │  <── Redirect to Google auth page          │┌────────────────────────────┐                  │

  │ ──────────────────────────────────────────>││       UserService          │                  │

  │                       │                    │├────────────────────────────┤                  │

  │  User authorizes      │                    ││ userId (FK)     ───────────┼──────────────────┘

  │                       │                    ││ serviceId (FK)             │

  │  <── Redirect to callback with code        ││ accessToken                │

  │ ──────────────────────>                    ││ refreshToken               │

  │                       │  Exchange code     ││ expiresAt                  │

  │                       │ ──────────────────>│└────────────────────────────┘

  │                       │                    │```

  │                       │  <── tokens        │

  │                       │                    │## Flux d'Automatisation

  │  <── JWT + user       │                    │

  │                       │                    │Le moteur d'automatisation fonctionne selon le schéma suivant :

```

```

## Flux d'une AREA┌─────────────────────────────────────────────────────────────────┐

│                    AUTOMATION LOOP                               │

```│                  (Intervalle: 10 secondes)                       │

┌─────────────────────────────────────────────────────────────────┐└─────────────────────────────────────────────────────────────────┘

│                    MOTEUR D'AUTOMATISATION                       │                              │

│                    (automation.js)                               │                              ▼

├─────────────────────────────────────────────────────────────────┤              ┌───────────────────────────────┐

│                                                                  │              │  Récupérer toutes les AREAs   │

│  1. Charger les AREAs actives                                   │              │         actives               │

│     SELECT * FROM areas WHERE isActive = true                    │              └───────────────────────────────┘

│                                                                  │                              │

│  2. Pour chaque AREA:                                           │                              ▼

│     ┌──────────────────────────────────────────────────────┐    │              ┌───────────────────────────────┐

│     │  a. Récupérer le service d'action                    │    │              │   Pour chaque AREA active:    │

│     │     service = registry.get(area.actionService)       │    │              └───────────────────────────────┘

│     │                                                      │    │                              │

│     │  b. Vérifier le trigger                              │    │        ┌─────────────────────┼─────────────────────┐

│     │     triggered = service.checkTrigger(...)            │    │        ▼                     │                     │

│     │                                                      │    │┌───────────────┐             │             ┌───────────────┐

│     │  c. Si triggered:                                    │    ││ Action Service│             │             │Reaction Service│

│     │     - Récupérer le service de réaction               │    ││ checkTrigger()│             │             │executeReaction()│

│     │     - Exécuter la réaction                           │    │└───────────────┘             │             └───────────────┘

│     │     - Mettre à jour lastTriggered                    │    │        │                     │                     ▲

│     └──────────────────────────────────────────────────────┘    │        │         ┌───────────▼───────────┐        │

│                                                                  │        │         │   Trigger déclenché?  │        │

│  3. Répéter toutes les 30 secondes                              │        │         └───────────────────────┘        │

│                                                                  │        │                     │                    │

└─────────────────────────────────────────────────────────────────┘        │              Oui ───┼─── Non             │

```        │                     │      │             │

        └─────────────────────┼──────┘             │

## Configuration Docker                              │                    │

                              └────────────────────┘

### docker-compose.yml```



```yaml## Sécurité

version: '3.8'

### Authentification

services:

  postgres:1. **JWT (JSON Web Tokens)**

    image: postgres:14   - Durée de validité : 7 jours

    environment:   - Stockage côté client : localStorage

      POSTGRES_DB: area   - Header : `Authorization: Bearer <token>`

      POSTGRES_USER: area

      POSTGRES_PASSWORD: area2. **OAuth 2.0**

    volumes:   - Google OAuth pour l'authentification

      - postgres_data:/var/lib/postgresql/data   - Twitch OAuth pour les fonctionnalités

    ports:   - Microsoft OAuth pour OneDrive/Outlook

      - "5432:5432"

### Protection des Routes

  server:

    build: ./server```javascript

    ports:// Middleware d'authentification

      - "8080:8080"authenticateToken(req, res, next) {

    environment:  const token = req.headers['authorization']?.split(' ')[1];

      DATABASE_URL: postgres://area:area@postgres:5432/area  jwt.verify(token, JWT_SECRET, (err, user) => {

    depends_on:    if (err) return res.sendStatus(403);

      - postgres    req.user = user;

    next();

  client_web:  });

    build: ./front-web}

    ports:```

      - "8081:80"

    depends_on:## Configuration Docker

      - server

### docker-compose.yml

volumes:

  postgres_data:```yaml

```services:

  db:

## Sécurité    image: postgres:15-alpine

    environment:

### Authentification JWT      POSTGRES_DB: area_db

      POSTGRES_USER: area

- Tokens signés avec secret      POSTGRES_PASSWORD: area

- Expiration de 7 jours    ports:

- Stockage côté client (localStorage / AsyncStorage)      - "5432:5432"



### OAuth2  server:

    build: ./server

- Flux Authorization Code    ports:

- Tokens refresh pour les services externes      - "8080:8080"

- Scopes minimaux requis    depends_on:

      - db

### Protection des routes

  web:

```javascript    build: ./front-web

const authenticateToken = (req, res, next) => {    ports:

  const authHeader = req.headers['authorization'];      - "8081:80"

  const token = authHeader && authHeader.split(' ')[1];    depends_on:

      - server

  if (!token) {```

    return res.status(401).json({ error: 'Token manquant' });

  }## Variables d'Environnement



  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {### Backend (server/.env)

    if (err) {

      return res.status(403).json({ error: 'Token invalide' });| Variable | Description | Requis |

    }|----------|-------------|--------|

    req.user = user;| `PORT` | Port du serveur | Non (défaut: 8080) |

    next();| `NODE_ENV` | Environnement | Non |

  });| `JWT_SECRET` | Clé secrète JWT | **Oui** |

};| `DB_HOST` | Hôte PostgreSQL | Non (défaut: localhost) |

```| `DB_PORT` | Port PostgreSQL | Non (défaut: 5432) |

| `DB_NAME` | Nom de la base | Non (défaut: area_db) |
| `DB_USER` | Utilisateur DB | Non (défaut: area) |
| `DB_PASSWORD` | Mot de passe DB | Non (défaut: area) |
| `GOOGLE_CLIENT_ID` | ID client Google | Pour OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Secret Google | Pour OAuth Google |
| `TWITCH_CLIENT_ID` | ID client Twitch | Pour Twitch |
| `TWITCH_CLIENT_SECRET` | Secret Twitch | Pour Twitch |
| `MICROSOFT_CLIENT_ID` | ID client Microsoft | Pour Microsoft |
| `MICROSOFT_CLIENT_SECRET` | Secret Microsoft | Pour Microsoft |
| `CLIENT_URL` | URL du frontend | Non (défaut: http://localhost:8081) |
