# Console Service

## Présentation

Le service Console est un service utilitaire pour le débogage et les tests. Il permet d'afficher des messages dans la console du serveur backend.

Authentification : Aucune (service interne)

## Réactions

### log_message

Affiche un message dans la console du serveur.

| Paramètre | Type | Requis | Description |
|-----------|------|--------|-------------|
| message | string | Non | Message à afficher (défaut: "AREA {id} triggered") |

```json
{
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "message": "Mon AREA a été déclenchée !"
  }
}
```

Format de sortie :

```
[ConsoleService] Mon AREA a été déclenchée !
```

## Exemples d'AREA

### Test de Timer

Vérifier que le Timer fonctionne :

```json
{
  "name": "Test Timer",
  "actionService": "timer",
  "actionType": "interval",
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "interval": 60000,
    "message": "Timer déclenché - test OK"
  }
}
```

### Debug Twitch

Vérifier la détection de stream :

```json
{
  "name": "Debug Twitch",
  "actionService": "twitch",
  "actionType": "streamer_live",
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "username": "ninja",
    "message": "Ninja est passé en live !"
  }
}
```

### Debug Email

Vérifier la réception d'emails :

```json
{
  "name": "Debug Email",
  "actionService": "google",
  "actionType": "new_email",
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "message": "Nouvel email détecté dans la boîte de réception"
  }
}
```

## Cas d'usage

Le service Console est utile pour :

- Tester que les triggers fonctionnent correctement
- Déboguer les automatisations en développement
- Vérifier le bon fonctionnement du moteur AREA
- Créer des logs de suivi simples
