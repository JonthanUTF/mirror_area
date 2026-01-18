# Microsoft Service

## Présentation

Le service Microsoft permet d'intégrer OneDrive (stockage cloud) et Outlook (emails) dans vos automatisations AREA.

Authentification : OAuth2 (Microsoft Identity Platform)

## Configuration OAuth

### Créer une application Azure AD

1. Accédez au [Azure Portal](https://portal.azure.com/)
2. Allez dans Azure Active Directory > Inscriptions d'applications
3. Cliquez sur Nouvelle inscription
4. Remplissez :
   - Nom : AREA Microsoft Integration
   - Types de comptes : Comptes personnels Microsoft uniquement
   - URI de redirection : `http://localhost:8081/services/callback`
5. Notez l'ID d'application (client)
6. Dans Certificats et secrets, créez un nouveau secret client

### Variables d'environnement

```env
MICROSOFT_CLIENT_ID=votre-azure-client-id
MICROSOFT_CLIENT_SECRET=votre-azure-client-secret
```

### Scopes requis

| Scope | Usage |
|-------|-------|
| Files.Read | Lire les fichiers OneDrive |
| Files.ReadWrite | Écrire les fichiers OneDrive |
| Mail.Read | Lire les emails |
| Mail.Send | Envoyer des emails |
| User.Read | Informations utilisateur |
| offline_access | Refresh tokens |

## Actions OneDrive

### onedrive_new_file

Déclenche quand un nouveau fichier apparaît dans un dossier OneDrive.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| folder | string | Non | Dossier à surveiller (défaut: racine) |

```json
{
  "actionService": "microsoft",
  "actionType": "onedrive_new_file",
  "parameters": {
    "folder": "/Documents"
  }
}
```

### onedrive_file_modified

Déclenche quand un fichier est modifié dans OneDrive.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| folder | string | Non | Dossier à surveiller |

```json
{
  "actionService": "microsoft",
  "actionType": "onedrive_file_modified",
  "parameters": {
    "folder": "/Projects"
  }
}
```

## Actions Outlook

### outlook_new_email

Déclenche quand un nouvel email arrive dans Outlook.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| from | string | Non | Filtrer par expéditeur |
| subject | string | Non | Filtrer par sujet |

```json
{
  "actionService": "microsoft",
  "actionType": "outlook_new_email",
  "parameters": {
    "from": "boss@company.com"
  }
}
```

### outlook_email_important

Déclenche quand un email marqué comme important arrive.

Aucun paramètre requis.

```json
{
  "actionService": "microsoft",
  "actionType": "outlook_email_important",
  "parameters": {}
}
```

## Réactions OneDrive

### onedrive_upload

Upload un fichier vers OneDrive.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| path | string | Oui | Chemin de destination |
| content | string | Oui | Contenu du fichier |
| filename | string | Oui | Nom du fichier |

```json
{
  "reactionService": "microsoft",
  "reactionType": "onedrive_upload",
  "parameters": {
    "path": "/Backups",
    "filename": "log.txt",
    "content": "Contenu du fichier"
  }
}
```

### onedrive_create_folder

Crée un dossier dans OneDrive.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| path | string | Oui | Chemin du dossier à créer |

```json
{
  "reactionService": "microsoft",
  "reactionType": "onedrive_create_folder",
  "parameters": {
    "path": "/Projects/NewProject"
  }
}
```

## Réactions Outlook

### outlook_send_email

Envoie un email via Outlook.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| recipient | string | Oui | Adresse du destinataire |
| subject | string | Oui | Sujet de l'email |
| body | string | Oui | Corps du message |

```json
{
  "reactionService": "microsoft",
  "reactionType": "outlook_send_email",
  "parameters": {
    "recipient": "colleague@company.com",
    "subject": "Notification",
    "body": "Message automatique"
  }
}
```

## Exemples d'AREA

### Backup automatique

```json
{
  "name": "Backup journalier",
  "actionService": "timer",
  "actionType": "interval",
  "reactionService": "microsoft",
  "reactionType": "onedrive_upload",
  "parameters": {
    "interval": 86400000,
    "path": "/Backups",
    "filename": "daily-log.txt",
    "content": "Backup effectué"
  }
}
```

### Notification par email

```json
{
  "name": "Notification nouveau fichier",
  "actionService": "microsoft",
  "actionType": "onedrive_new_file",
  "reactionService": "microsoft",
  "reactionType": "outlook_send_email",
  "parameters": {
    "folder": "/Shared",
    "recipient": "me@example.com",
    "subject": "Nouveau fichier partagé",
    "body": "Un nouveau fichier a été ajouté dans le dossier partagé."
  }
}
```
