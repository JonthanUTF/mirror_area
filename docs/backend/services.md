# Services Backend

Guide détaillé de l'implémentation des services dans le backend AREA.

## Architecture des Services

Tous les services héritent de la classe `ServiceBase` qui définit l'interface commune.

### ServiceBase

```javascript
class ServiceBase {
    constructor(name, label, icon) {
        this.name = name;      // Identifiant technique
        this.label = label;    // Nom d'affichage
        this.icon = icon;      // URL de l'icône
        this.actions = [];     // Liste des actions (triggers)
        this.reactions = [];   // Liste des réactions
    }

    // Enregistrer une action
    registerAction(name, description, options = {}) { ... }
    
    // Enregistrer une réaction
    registerReaction(name, description, options = {}) { ... }
    
    // À implémenter : vérifier si le trigger est activé
    async checkTrigger(action, area, params) { ... }
    
    // À implémenter : exécuter la réaction
    async executeReaction(reaction, area, params) { ... }
}
```

## Google (Gmail) Service

Fichier : `EmailService.js`

### Actions

| Action | Description | Paramètres |
|--------|-------------|------------|
| new_email | Nouvel email reçu | from, subject |
| email_received | Email reçu générique | - |
| email_from_sender | Email d'un expéditeur | sender |
| email_with_keyword | Email avec mot-clé | keyword |
| email_with_attachment | Email avec pièce jointe | - |

### Réactions

| Réaction | Description | Paramètres |
|----------|-------------|------------|
| send_email | Envoyer un email | recipient, subject, body |

### Implémentation

```javascript
async checkTrigger(action, area, params) {
    const userService = await getUserServiceToken(area.userId, 'google');
    
    if (action === 'new_email') {
        const emails = await fetchGmailEmails(userService.accessToken);
        return emails.some(email => {
            const matchFrom = !params.from || email.from.includes(params.from);
            const matchSubject = !params.subject || 
                email.subject.includes(params.subject);
            return matchFrom && matchSubject;
        });
    }
    return false;
}

async executeReaction(reaction, area, params) {
    if (reaction === 'send_email') {
        await sendGmailEmail(
            userService.accessToken,
            params.recipient,
            params.subject,
            params.body
        );
    }
}
```

## GitHub Service

Fichier : `GitHubService.js`

### Actions

| Action | Description | Paramètres |
|--------|-------------|------------|
| issue_created | Nouvelle issue | owner, repo |
| pr_opened | PR ouverte | owner, repo |
| push_committed | Nouveau commit | owner, repo, branch |
| release_published | Nouvelle release | owner, repo |
| repo_starred | Repo mis en favori | owner, repo |

### Réactions

| Réaction | Description | Paramètres |
|----------|-------------|------------|
| create_issue | Créer une issue | owner, repo, title, body |
| comment_issue | Commenter une issue | owner, repo, issue_number, body |
| create_file | Créer un fichier | owner, repo, path, content, message |
| create_release | Créer une release | owner, repo, tag_name, name, body |

## Dropbox Service

Fichier : `DropboxService.js`

### Actions

| Action | Description | Paramètres |
|--------|-------------|------------|
| file_added | Fichier ajouté | folder_path |
| file_modified | Fichier modifié | folder_path |
| file_deleted_anywhere | Fichier supprimé | - |

### Réactions

| Réaction | Description | Paramètres |
|----------|-------------|------------|
| upload_file | Uploader un fichier | path, content |
| create_folder | Créer un dossier | path |
| delete_file | Supprimer un fichier | path |

## Twitch Service

Fichier : `TwitchService.js`

### Actions

| Action | Description | Paramètres |
|--------|-------------|------------|
| streamer_live | Streamer en live | username |

### Réactions

| Réaction | Description | Paramètres |
|----------|-------------|------------|
| block_user | Bloquer un utilisateur | target_user_id, reason |

### Implémentation

```javascript
async checkTrigger(action, area, params) {
    if (action === 'streamer_live') {
        const isLive = await checkTwitchStreamStatus(params.username);
        const wasLive = area.metadata?.wasLive || false;
        
        // Déclenche uniquement lors du passage offline -> online
        if (isLive && !wasLive) {
            await area.update({ metadata: { wasLive: true } });
            return true;
        }
        
        if (!isLive) {
            await area.update({ metadata: { wasLive: false } });
        }
        return false;
    }
    return false;
}
```

## Microsoft Service

Fichier : `MicrosoftService.js`

### Actions OneDrive

| Action | Description | Paramètres |
|--------|-------------|------------|
| onedrive_new_file | Nouveau fichier | folder |
| onedrive_file_modified | Fichier modifié | folder |

### Actions Outlook

| Action | Description | Paramètres |
|--------|-------------|------------|
| outlook_new_email | Nouvel email | from, subject |
| outlook_email_important | Email important | - |

### Réactions

| Réaction | Description | Paramètres |
|----------|-------------|------------|
| onedrive_upload | Upload fichier | path, filename, content |
| onedrive_create_folder | Créer dossier | path |
| outlook_send_email | Envoyer email | recipient, subject, body |

## Timer Service

Fichier : `TimerService.js`

### Actions

| Action | Description | Paramètres |
|--------|-------------|------------|
| interval | Intervalle régulier | interval (ms) |

### Implémentation

```javascript
async checkTrigger(action, area, params) {
    const now = Date.now();
    
    if (action === 'interval') {
        const interval = params.interval || 60000;
        const lastTriggered = area.lastTriggered 
            ? new Date(area.lastTriggered).getTime() 
            : 0;
        
        if (now - lastTriggered >= interval) {
            return true;
        }
    }
    return false;
}
```

## Console Service

Fichier : `ConsoleService.js`

### Réactions

| Réaction | Description | Paramètres |
|----------|-------------|------------|
| log_message | Logger un message | message |

### Implémentation

```javascript
async executeReaction(reaction, area, params) {
    if (reaction === 'log_message') {
        const message = params.message || `AREA ${area.id} triggered`;
        console.log(`[ConsoleService] ${message}`);
    }
}
```

## Créer un nouveau service

1. Créer le fichier dans `implementations/`
2. Hériter de ServiceBase
3. Enregistrer les actions et réactions dans le constructeur
4. Implémenter checkTrigger et executeReaction
5. Exporter une instance singleton

```javascript
const ServiceBase = require('../ServiceBase');

class NouveauService extends ServiceBase {
    constructor() {
        super('nouveau', 'Nouveau Service', 'icon-url');
        
        this.registerAction('mon_action', 'Description', {
            param: 'string'
        });
        
        this.registerReaction('ma_reaction', 'Description', {
            param: 'string'
        });
    }
    
    async checkTrigger(action, area, params) {
        // Logique de vérification
        return false;
    }
    
    async executeReaction(reaction, area, params) {
        // Logique d'exécution
    }
}

module.exports = new NouveauService();
```

Le service sera automatiquement chargé par le loader au démarrage.
