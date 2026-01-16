# Twitch Service

## Présentation

Le service Twitch permet de créer des automatisations basées sur l'activité de streaming. Détectez quand un streamer passe en live et exécutez des actions automatiquement.

Authentification : OAuth2 (Twitch)

## Configuration OAuth

### Créer une application Twitch

1. Accédez à [Twitch Developer Console](https://dev.twitch.tv/console)
2. Connectez-vous avec votre compte Twitch
3. Cliquez sur "Register Your Application"
4. Remplissez les informations :
   - Name : AREA Twitch Integration
   - OAuth Redirect URLs : `http://localhost:8080/auth/twitch/callback`
   - Category : Application Integration
5. Cliquez sur "Create"
6. Notez le Client ID et générez un Client Secret

### Variables d'environnement

```env
TWITCH_CLIENT_ID=votre-twitch-client-id
TWITCH_CLIENT_SECRET=votre-twitch-client-secret
TWITCH_CALLBACK_URL=http://localhost:8080/auth/twitch/callback
```

### Scopes requis

| Scope | Usage |
|-------|-------|
| user:read:follows | Lire les abonnements |
| user:manage:blocked_users | Gérer les utilisateurs bloqués |

## Actions (Triggers)

### streamer_live

Déclenche l'AREA quand un streamer spécifique passe de offline à online.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| username | string | Oui | Nom d'utilisateur Twitch du streamer |

```json
{
  "actionService": "twitch",
  "actionType": "streamer_live",
  "parameters": {
    "username": "ninja"
  }
}
```

Le service vérifie périodiquement si le streamer spécifié est en live. L'AREA est déclenchée une seule fois lors du passage offline vers online.

## Réactions

### block_user

Bloque un utilisateur sur Twitch.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| target_user_id | string | Oui | ID de l'utilisateur à bloquer |
| reason | string | Non | Raison du blocage |

```json
{
  "reactionService": "twitch",
  "reactionType": "block_user",
  "parameters": {
    "target_user_id": "12345678",
    "reason": "spam"
  }
}
```

## Exemples d'AREA

### Notification email quand un streamer est live

```json
{
  "name": "Notification streamer",
  "actionService": "twitch",
  "actionType": "streamer_live",
  "reactionService": "google",
  "reactionType": "send_email",
  "parameters": {
    "username": "shroud",
    "recipient": "me@example.com",
    "subject": "Shroud est en live !",
    "body": "Votre streamer favori vient de commencer à diffuser."
  }
}
```

### Log console quand un streamer est live

```json
{
  "name": "Log streamer live",
  "actionService": "twitch",
  "actionType": "streamer_live",
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "username": "pokimane",
    "message": "Pokimane vient de passer en live !"
  }
}
```
