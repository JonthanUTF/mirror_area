# Timer Service

## Présentation

Le service Timer permet de créer des déclencheurs basés sur le temps. Il ne nécessite aucune authentification externe et fonctionne entièrement en interne.

Authentification : Aucune (service interne)

## Actions (Triggers)

### interval

Déclenche l'AREA à intervalles réguliers.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| interval | number | Oui | Intervalle en millisecondes |

### Valeurs courantes

| Intervalle | Valeur (ms) |
|------------|-------------|
| 1 minute | 60000 |
| 5 minutes | 300000 |
| 15 minutes | 900000 |
| 30 minutes | 1800000 |
| 1 heure | 3600000 |
| 6 heures | 21600000 |
| 12 heures | 43200000 |
| 24 heures | 86400000 |

```json
{
  "actionService": "timer",
  "actionType": "interval",
  "parameters": {
    "interval": 300000
  }
}
```

Le service compare le timestamp actuel avec `lastTriggered` de l'AREA. Si la différence dépasse l'intervalle configuré, l'AREA est déclenchée.

## Exemples d'AREA

### Rappel toutes les heures

```json
{
  "name": "Rappel horaire",
  "actionService": "timer",
  "actionType": "interval",
  "reactionService": "google",
  "reactionType": "send_email",
  "parameters": {
    "interval": 3600000,
    "recipient": "me@example.com",
    "subject": "Rappel horaire",
    "body": "N'oubliez pas de faire une pause !"
  }
}
```

### Log quotidien

```json
{
  "name": "Log journalier",
  "actionService": "timer",
  "actionType": "interval",
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "interval": 86400000,
    "message": "Journée écoulée - système opérationnel"
  }
}
```

### Backup OneDrive toutes les 6 heures

```json
{
  "name": "Backup régulier",
  "actionService": "timer",
  "actionType": "interval",
  "reactionService": "microsoft",
  "reactionType": "onedrive_upload",
  "parameters": {
    "interval": 21600000,
    "path": "/Backups",
    "filename": "status.txt",
    "content": "Système OK"
  }
}
```

## Cas d'usage

Le Timer est utile pour :

- Rappels périodiques par email
- Vérifications de santé du système
- Backups automatiques
- Rapports quotidiens/hebdomadaires
- Nettoyage de données planifié
