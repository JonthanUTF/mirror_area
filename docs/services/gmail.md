# Gmail (Google) Service

## Présentation

Le service Google (Gmail) permet d'interagir avec les emails via l'API Gmail. Il offre des déclencheurs basés sur la réception d'emails et la possibilité d'envoyer des emails en réaction.

Authentification : OAuth2 (Google)

## Configuration OAuth

### Créer un projet Google Cloud

1. Accédez à [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez l'API Gmail dans API et services > Bibliothèque

### Configurer OAuth

1. Menu > API et services > Identifiants
2. Créer des identifiants > ID client OAuth
3. Type d'application : Application Web
4. URI de redirection autorisés :
   - `http://localhost:8081/services/callback` (développement)
   - Votre URL de production

### Variables d'environnement

```env
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret
```

### Scopes requis

| Scope | Usage |
|-------|-------|
| gmail.send | Envoi d'emails |
| gmail.readonly | Lecture des emails |
| gmail.modify | Modification des emails |
| userinfo.email | Lecture de l'email utilisateur |
| userinfo.profile | Informations du profil |

## Actions (Triggers)

### new_email

Déclenche l'AREA quand un nouvel email correspondant aux critères est reçu.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| from | string | Non | Filtrer par adresse de l'expéditeur |
| subject | string | Non | Filtrer par mots dans le sujet |

```json
{
  "actionService": "google",
  "actionType": "new_email",
  "parameters": {
    "from": "boss@company.com",
    "subject": "urgent"
  }
}
```

### email_received

Déclenche l'AREA quand n'importe quel nouvel email est reçu dans la boîte de réception.

Aucun paramètre requis.

```json
{
  "actionService": "google",
  "actionType": "email_received",
  "parameters": {}
}
```

### email_from_sender

Déclenche l'AREA quand un email est reçu d'un expéditeur spécifique.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| sender | string | Oui | Adresse email de l'expéditeur à surveiller |

```json
{
  "actionService": "google",
  "actionType": "email_from_sender",
  "parameters": {
    "sender": "important@company.com"
  }
}
```

### email_with_keyword

Déclenche l'AREA quand un email contient un mot-clé spécifique dans le sujet ou le corps.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| keyword | string | Oui | Mot-clé à rechercher dans l'email |

```json
{
  "actionService": "google",
  "actionType": "email_with_keyword",
  "parameters": {
    "keyword": "URGENT"
  }
}
```

### email_with_attachment

Déclenche l'AREA quand un email avec une pièce jointe est reçu.

Aucun paramètre requis.

```json
{
  "actionService": "google",
  "actionType": "email_with_attachment",
  "parameters": {}
}
```

## Réactions

### send_email

Envoie un email via l'API Gmail au nom de l'utilisateur connecté.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| recipient | string | Oui | Adresse email du destinataire |
| subject | string | Oui | Sujet de l'email |
| body | string | Oui | Corps du message (texte brut) |

```json
{
  "reactionService": "google",
  "reactionType": "send_email",
  "parameters": {
    "recipient": "colleague@company.com",
    "subject": "Notification automatique",
    "body": "Ce message a été envoyé automatiquement par AREA."
  }
}
```

## Exemples d'AREA

### Timer vers Email quotidien

Envoyer un rappel quotidien par email :

```json
{
  "name": "Rappel quotidien",
  "actionService": "timer",
  "actionType": "interval",
  "reactionService": "google",
  "reactionType": "send_email",
  "parameters": {
    "interval": 86400000,
    "recipient": "me@example.com",
    "subject": "Rappel du jour",
    "body": "N'oubliez pas de vérifier vos tâches !"
  }
}
```

### Twitch vers Email

Recevoir un email quand un streamer est en live :

```json
{
  "name": "Notification Twitch",
  "actionService": "twitch",
  "actionType": "streamer_live",
  "reactionService": "google",
  "reactionType": "send_email",
  "parameters": {
    "username": "shroud",
    "recipient": "me@example.com",
    "subject": "Shroud est en live !",
    "body": "Votre streamer favori vient de commencer à diffuser sur Twitch."
  }
}
```
