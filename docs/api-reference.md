# API Reference# 📡 API Reference



Documentation complète de l'API REST du backend AREA.Documentation complète de l'API REST du backend AREA.



URL de base : `http://localhost:8080`**URL de base** : `http://localhost:8080`



## Authentification## 🔐 Authentification



L'API utilise des tokens JWT pour l'authentification. Incluez le token dans le header de vos requêtes :L'API utilise des tokens JWT pour l'authentification. Incluez le token dans le header de vos requêtes :



```http```http

Authorization: Bearer <votre_token_jwt>Authorization: Bearer <votre_token_jwt>

``````



## Routes d'Authentification---



### POST /auth/register## 📝 Routes d'Authentification



Inscription d'un nouvel utilisateur.### `POST /auth/register`



Corps de la requête :Inscription d'un nouvel utilisateur.

```json

{**Corps de la requête** :

  "email": "user@example.com",```json

  "password": "motdepasse123",{

  "name": "John Doe"  "email": "user@example.com",

}  "password": "motdepasse123",

```  "name": "John Doe"

}

Réponse (201) :```

```json

{**Réponse (201)** :

  "message": "User registered successfully",```json

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",{

  "user": {  "message": "User registered successfully",

    "id": "uuid-v4",  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

    "email": "user@example.com",  "user": {

    "name": "John Doe"    "id": "uuid-v4",

  }    "email": "user@example.com",

}    "name": "John Doe"

```  }

}

Erreurs :```



| Code | Description |**Erreurs** :

|------|-------------|

| 400 | Email et mot de passe requis || Code | Description |

| 409 | Utilisateur déjà existant ||------|-------------|

| 400 | Email et mot de passe requis |

### POST /auth/login| 409 | Utilisateur déjà existant |



Connexion d'un utilisateur existant.---



Corps de la requête :### `POST /auth/login`

```json

{Connexion d'un utilisateur.

  "email": "user@example.com",

  "password": "motdepasse123"**Corps de la requête** :

}```json

```{

  "email": "user@example.com",

Réponse (200) :  "password": "motdepasse123"

```json}

{```

  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

  "user": {**Réponse (200)** :

    "id": "uuid-v4",```json

    "email": "user@example.com",{

    "name": "John Doe"  "message": "Login successful",

  }  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

}  "user": {

```    "id": "uuid-v4",

    "email": "user@example.com",

Erreurs :    "name": "John Doe"

  }

| Code | Description |}

|------|-------------|```

| 400 | Email et mot de passe requis |

| 401 | Identifiants invalides |**Erreurs** :



### GET /auth/google| Code | Description |

|------|-------------|

Initie le flux OAuth Google. Redirige vers la page de connexion Google.| 400 | Email et mot de passe requis |

| 401 | Identifiants invalides |

### GET /auth/google/callback

---

Callback OAuth Google. Retourne un token JWT après authentification réussie.

### `GET /auth/google`

### GET /auth/twitch

Initie le flux OAuth Google.

Initie le flux OAuth Twitch. Redirige vers la page de connexion Twitch.

**Redirection** : Redirige vers la page de connexion Google.

### GET /auth/twitch/callback

---

Callback OAuth Twitch. Retourne un token JWT après authentification réussie.

### `GET /auth/google/callback`

## Routes Utilisateurs

Callback OAuth Google (utilisé par Google après authentification).

### GET /users/me

**Redirection** : Redirige vers `{CLIENT_URL}/auth/callback?token=<jwt_token>`

Récupère les informations de l'utilisateur connecté.

---

Réponse (200) :

```json### `GET /auth/twitch`

{

  "id": "uuid-v4",Initie le flux OAuth Twitch.

  "email": "user@example.com",

  "name": "John Doe",**Headers requis** : `Authorization: Bearer <token>`

  "isAdmin": false,

  "createdAt": "2024-01-15T10:00:00.000Z"**Redirection** : Redirige vers la page de connexion Twitch.

}

```---



### PUT /users/me### `GET /auth/me`



Met à jour les informations de l'utilisateur.Récupère les informations de l'utilisateur connecté.



Corps de la requête :**Headers requis** : `Authorization: Bearer <token>`

```json

{**Réponse (200)** :

  "name": "Jane Doe"```json

}{

```  "user": {

    "id": "uuid-v4",

## Routes AREAs    "email": "user@example.com",

    "name": "John Doe",

### GET /areas    "googleId": "123456789",

    "createdAt": "2026-01-15T10:00:00.000Z"

Liste toutes les AREAs de l'utilisateur connecté.  }

}

Réponse (200) :```

```json

[---

  {

    "id": 1,## 🔄 Routes des AREAs

    "name": "Ma première AREA",

    "actionService": "timer",### `GET /areas`

    "actionType": "interval",

    "reactionService": "console",Liste toutes les AREAs de l'utilisateur connecté.

    "reactionType": "log_message",

    "parameters": {**Headers requis** : `Authorization: Bearer <token>`

      "interval": 60000,

      "message": "Test"**Réponse (200)** :

    },```json

    "isActive": true,{

    "lastTriggered": null,  "areas": [

    "createdAt": "2024-01-15T10:00:00.000Z"    {

  }      "id": "uuid-v4",

]      "name": "Email when stream starts",

```      "actionService": "twitch",

      "actionType": "streamer_live",

### GET /areas/:id      "reactionService": "google",

      "reactionType": "send_email",

Récupère une AREA spécifique.      "parameters": {

        "username": "ninja",

Réponse (200) :        "recipient": "me@example.com",

```json        "subject": "Stream Alert",

{        "body": "Ninja is live!"

  "id": 1,      },

  "name": "Ma première AREA",      "active": true,

  "actionService": "timer",      "lastTriggered": "2026-01-15T14:30:00.000Z",

  "actionType": "interval",      "createdAt": "2026-01-10T08:00:00.000Z"

  "reactionService": "console",    }

  "reactionType": "log_message",  ]

  "parameters": {}

    "interval": 60000,```

    "message": "Test"

  },---

  "isActive": true

}### `GET /areas/:id`

```

Récupère une AREA spécifique.

### POST /areas

**Headers requis** : `Authorization: Bearer <token>`

Crée une nouvelle AREA.

**Réponse (200)** :

Corps de la requête :```json

```json{

{  "area": {

  "name": "Notification Twitch",    "id": "uuid-v4",

  "actionService": "twitch",    "name": "My Area",

  "actionType": "streamer_live",    "actionService": "timer",

  "reactionService": "google",    "actionType": "interval",

  "reactionType": "send_email",    "reactionService": "console",

  "parameters": {    "reactionType": "log_message",

    "username": "ninja",    "parameters": {

    "recipient": "me@example.com",      "interval": 60000,

    "subject": "Ninja est en live !",      "message": "Timer triggered!"

    "body": "Votre streamer favori diffuse maintenant."    },

  }    "active": true

}  }

```}

```

Réponse (201) :

```json**Erreurs** :

{

  "id": 2,| Code | Description |

  "name": "Notification Twitch",|------|-------------|

  "actionService": "twitch",| 404 | AREA non trouvée |

  "actionType": "streamer_live",

  "reactionService": "google",---

  "reactionType": "send_email",

  "parameters": { ... },### `POST /areas`

  "isActive": true,

  "createdAt": "2024-01-15T10:00:00.000Z"Crée une nouvelle AREA.

}

```**Headers requis** : `Authorization: Bearer <token>`



### PUT /areas/:id**Corps de la requête** :

```json

Met à jour une AREA existante.{

  "name": "Mon automatisation",

Corps de la requête :  "actionService": "twitch",

```json  "actionType": "streamer_live",

{  "reactionService": "google",

  "name": "Nouveau nom",  "reactionType": "send_email",

  "isActive": false  "parameters": {

}    "username": "streamer_name",

```    "recipient": "me@example.com",

    "subject": "Notification",

### DELETE /areas/:id    "body": "Le streamer est en live!"

  },

Supprime une AREA.  "active": true

}

Réponse (200) :```

```json

{**Réponse (201)** :

  "message": "Area deleted successfully"```json

}{

```  "message": "Area created successfully",

  "area": {

## Routes Services    "id": "uuid-v4",

    "name": "Mon automatisation",

### GET /services    "actionService": "twitch",

    "actionType": "streamer_live",

Liste tous les services disponibles avec leurs actions et réactions.    "reactionService": "google",

    "reactionType": "send_email",

Réponse (200) :    "parameters": {...},

```json    "active": true

[  }

  {}

    "name": "google",```

    "label": "Google (Gmail)",

    "icon": "http://localhost:8080/assets/google-icon.png",**Champs obligatoires** :

    "actions": [

      {- `name` : Nom de l'AREA

        "name": "new_email",- `actionService` : Service de l'action (trigger)

        "description": "Triggers when a new email is received"- `actionType` : Type d'action

      }- `reactionService` : Service de la réaction

    ],- `reactionType` : Type de réaction

    "reactions": [

      {---

        "name": "send_email",

        "description": "Sends an email"### `PUT /areas/:id`

      }

    ]Met à jour une AREA.

  }

]**Headers requis** : `Authorization: Bearer <token>`

```

**Corps de la requête** (tous les champs sont optionnels) :

### GET /services/:serviceName/connect```json

{

Génère l'URL OAuth pour connecter un service.  "name": "Nouveau nom",

  "active": false,

Réponse (200) :  "parameters": {

```json    "interval": 120000

{  }

  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."}

}```

```

**Réponse (200)** :

### POST /services/:serviceName/callback```json

{

Échange le code OAuth contre des tokens d'accès.  "message": "Area updated successfully",

  "area": {...}

Corps de la requête :}

```json```

{

  "code": "authorization_code_from_oauth"---

}

```### `DELETE /areas/:id`



### GET /services/connectedSupprime une AREA.



Liste les services connectés par l'utilisateur.**Headers requis** : `Authorization: Bearer <token>`



Réponse (200) :**Réponse (200)** :

```json```json

{{

  "google": {  "message": "Area deleted successfully"

    "connected": true,}

    "email": "user@gmail.com"```

  },

  "twitch": {---

    "connected": false

  }## 👤 Routes Utilisateurs

}

```### `GET /users`



## Route AboutListe tous les utilisateurs (admin uniquement).



### GET /about.json**Headers requis** : `Authorization: Bearer <token>` (admin)



Retourne les informations du serveur au format spécifié.**Réponse (200)** :

```json

Réponse (200) :{

```json  "users": [

{    {

  "client": {      "id": "uuid-v4",

    "host": "10.0.2.1"      "email": "user@example.com",

  },      "name": "John Doe",

  "server": {      "role": "user",

    "current_time": 1705312800,      "createdAt": "2026-01-15T10:00:00.000Z"

    "services": [    }

      {  ]

        "name": "google",}

        "actions": [```

          {

            "name": "new_email",---

            "description": "Triggers when a new email is received"

          }### `POST /users/create`

        ],

        "reactions": [Crée un utilisateur (admin uniquement).

          {

            "name": "send_email",**Headers requis** : `Authorization: Bearer <token>` (admin)

            "description": "Sends an email"

          }**Corps de la requête** :

        ]```json

      }{

    ]  "email": "newuser@example.com",

  }  "password": "password123",

}  "name": "New User",

```  "role": "user"

}

## Codes d'erreur```



| Code | Description |---

|------|-------------|

| 400 | Requête invalide |### `GET /users/:id`

| 401 | Non authentifié |

| 403 | Accès interdit |Récupère un profil utilisateur.

| 404 | Ressource non trouvée |

| 409 | Conflit (ressource existante) |**Headers requis** : `Authorization: Bearer <token>`

| 500 | Erreur serveur |

!!! note "Permissions"

## Exemples avec cURL    Un utilisateur peut voir son propre profil. Les admins peuvent voir tous les profils.



### Inscription---



```bash### `PUT /users/:id`

curl -X POST http://localhost:8080/auth/register \

  -H "Content-Type: application/json" \Met à jour un profil utilisateur.

  -d '{"email":"test@example.com","password":"password123"}'

```**Headers requis** : `Authorization: Bearer <token>`



### Connexion**Corps de la requête** :

```json

```bash{

curl -X POST http://localhost:8080/auth/login \  "name": "Nouveau nom",

  -H "Content-Type: application/json" \  "email": "newemail@example.com",

  -d '{"email":"test@example.com","password":"password123"}'  "password": "newpassword"

```}

```

### Créer une AREA

---

```bash

curl -X POST http://localhost:8080/areas \### `DELETE /users/:id`

  -H "Content-Type: application/json" \

  -H "Authorization: Bearer YOUR_TOKEN" \Supprime un utilisateur.

  -d '{

    "name": "Test AREA",**Headers requis** : `Authorization: Bearer <token>`

    "actionService": "timer",

    "actionType": "interval",---

    "reactionService": "console",

    "reactionType": "log_message",## 🔌 Routes des Services

    "parameters": {

      "interval": 60000,### `GET /services`

      "message": "Triggered!"

    }Liste les services connectés par l'utilisateur.

  }'

```**Headers requis** : `Authorization: Bearer <token>`



### Lister les AREAs**Réponse (200)** :

```json

```bash[

curl http://localhost:8080/areas \  {

  -H "Authorization: Bearer YOUR_TOKEN"    "service": {

```      "name": "google",

      "label": "Google (Gmail)",
      "icon": "https://..."
    },
    "connectedAt": "2026-01-15T10:00:00.000Z",
    "expiresAt": "2026-01-22T10:00:00.000Z"
  }
]
```

---

### `GET /services/:serviceName/connect`

Génère une URL OAuth pour connecter un service.

**Headers requis** : `Authorization: Bearer <token>`

**Services supportés** : `google`, `twitch`, `microsoft`

**Réponse (200)** :
```json
{
  "url": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

---

### `POST /services/:serviceName/callback`

Finalise la connexion d'un service avec le code OAuth.

**Headers requis** : `Authorization: Bearer <token>`

**Corps de la requête** :
```json
{
  "code": "code_oauth_recu",
  "redirectUri": "http://localhost:8081/services/callback"
}
```

**Réponse (200)** :
```json
{
  "message": "Service connected successfully",
  "connected": true
}
```

---

## 📊 Route About

### `GET /about.json`

Retourne les informations sur le serveur et les services disponibles.

**Réponse (200)** :
```json
{
  "client": {
    "host": "192.168.1.1"
  },
  "server": {
    "current_time": 1705320000,
    "services": [
      {
        "name": "google",
        "actions": [...],
        "reactions": [...]
      },
      {
        "name": "twitch",
        "actions": [...],
        "reactions": [...]
      }
    ]
  }
}
```

---

## ⚠️ Codes d'Erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Ressource créée |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 409 | Conflit (ressource existante) |
| 500 | Erreur serveur |

---

## 📋 Exemples cURL

### Inscription
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"test123","name":"Test User"}'
```

### Connexion
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"test123"}'
```

### Créer une AREA
```bash
curl -X POST http://localhost:8080/areas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Timer to Console",
    "actionService": "timer",
    "actionType": "interval",
    "reactionService": "console",
    "reactionType": "log_message",
    "parameters": {
      "interval": 60000,
      "message": "Hello from AREA!"
    }
  }'
```
