# Service GitHub

Le service GitHub permet de surveiller les événements d'un repository et d'interagir avec les issues, pull requests et releases.

## Configuration

### Variables d'environnement

```bash
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### Scopes OAuth requis

- `user:email` - Accès à l'email de l'utilisateur
- `repo` - Accès complet aux repositories privés et publics
- `admin:repo_hook` - Gestion des webhooks
- `write:discussion` - Écriture dans les discussions

### URL de callback

```
{CLIENT_URL}/services/callback
```

## Actions (Triggers)

### `issue_created` - Nouvelle issue créée

Déclenché lorsqu'une nouvelle issue est créée dans un repository.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository (username ou organisation) |
| `repo` | `string` | Nom du repository |

**Données retournées :**

```json
{
  "issue_number": 42,
  "title": "Bug: Application crashes on startup",
  "body": "Description of the issue...",
  "author": "username",
  "created_at": "2024-01-15T10:30:00Z",
  "labels": ["bug", "priority-high"]
}
```

### `pr_opened` - Pull Request ouverte

Déclenché lorsqu'une nouvelle Pull Request est ouverte.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |

**Données retournées :**

```json
{
  "pr_number": 123,
  "title": "Feature: Add new authentication method",
  "body": "Description of the PR...",
  "author": "contributor",
  "branch": "feature/new-auth",
  "base_branch": "main",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### `push_committed` - Nouveau commit poussé

Déclenché lorsqu'un ou plusieurs commits sont poussés sur une branche.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |
| `branch` | `string` | Branche à surveiller (optionnel, défaut: toutes) |

**Données retournées :**

```json
{
  "commit_sha": "abc123def456",
  "message": "Fix login bug",
  "author": "developer",
  "branch": "main",
  "timestamp": "2024-01-15T10:30:00Z",
  "files_changed": 5
}
```

### `release_published` - Nouvelle release publiée

Déclenché lorsqu'une nouvelle release est publiée.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |

**Données retournées :**

```json
{
  "tag_name": "v1.2.0",
  "name": "Release 1.2.0",
  "body": "Release notes...",
  "author": "maintainer",
  "published_at": "2024-01-15T10:30:00Z",
  "prerelease": false
}
```

### `repo_starred` - Repository mis en favori

Déclenché lorsque quelqu'un ajoute le repository à ses favoris (star).

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |

**Données retournées :**

```json
{
  "starred_by": "new_user",
  "total_stars": 1234,
  "starred_at": "2024-01-15T10:30:00Z"
}
```

## Réactions

### `create_issue` - Créer une issue

Crée une nouvelle issue dans un repository.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |
| `title` | `string` | Titre de l'issue |
| `body` | `string` | Contenu de l'issue (optionnel) |
| `labels` | `array` | Labels à ajouter (optionnel) |

**Exemple d'utilisation :**

```json
{
  "reaction": "create_issue",
  "params": {
    "owner": "my-org",
    "repo": "my-project",
    "title": "Bug automatiquement détecté",
    "body": "Un problème a été détecté par le système de monitoring.",
    "labels": ["bug", "automated"]
  }
}
```

### `comment_issue` - Commenter une issue

Ajoute un commentaire à une issue existante.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |
| `issue_number` | `number` | Numéro de l'issue |
| `body` | `string` | Contenu du commentaire |

**Exemple d'utilisation :**

```json
{
  "reaction": "comment_issue",
  "params": {
    "owner": "my-org",
    "repo": "my-project",
    "issue_number": 42,
    "body": "Ce problème a été automatiquement assigné à l'équipe de support."
  }
}
```

### `create_file` - Créer un fichier

Crée ou met à jour un fichier dans le repository.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |
| `path` | `string` | Chemin du fichier (ex: `docs/log.md`) |
| `content` | `string` | Contenu du fichier |
| `message` | `string` | Message de commit |
| `branch` | `string` | Branche cible (optionnel, défaut: branche par défaut) |

**Exemple d'utilisation :**

```json
{
  "reaction": "create_file",
  "params": {
    "owner": "my-org",
    "repo": "my-project",
    "path": "logs/automated-log.txt",
    "content": "Log entry: Event triggered at 2024-01-15",
    "message": "Add automated log entry"
  }
}
```

### `create_release` - Créer une release

Crée une nouvelle release pour le repository.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `owner` | `string` | Propriétaire du repository |
| `repo` | `string` | Nom du repository |
| `tag_name` | `string` | Nom du tag (ex: `v1.2.0`) |
| `name` | `string` | Nom de la release |
| `body` | `string` | Notes de release |
| `prerelease` | `boolean` | Est-ce une pré-release ? (optionnel) |

**Exemple d'utilisation :**

```json
{
  "reaction": "create_release",
  "params": {
    "owner": "my-org",
    "repo": "my-project",
    "tag_name": "v1.0.0",
    "name": "Version 1.0.0",
    "body": "## Changelog\n- Initial release\n- Feature A\n- Feature B"
  }
}
```

## Exemples d'AREA

### Notification de nouvelles issues

**Trigger :** GitHub - Nouvelle issue créée sur `my-org/my-repo`  
**Reaction :** Gmail - Envoyer un email de notification

### Auto-commentaire sur PR

**Trigger :** GitHub - Pull Request ouverte  
**Reaction :** GitHub - Commenter avec les instructions de review

### Log des releases

**Trigger :** GitHub - Nouvelle release publiée  
**Reaction :** Dropbox - Uploader un fichier de changelog

### Création d'issue depuis email

**Trigger :** Gmail - Email reçu avec sujet contenant "BUG"  
**Reaction :** GitHub - Créer une issue automatiquement

## Architecture technique

```
GitHubService
├── extends ServiceBase
├── Actions
│   ├── issue_created
│   ├── pr_opened
│   ├── push_committed
│   ├── release_published
│   └── repo_starred
├── Reactions
│   ├── create_issue
│   ├── comment_issue
│   ├── create_file
│   └── create_release
└── API
    └── GitHub REST API v3
```

## Dépannage

### Erreur d'authentification

Si vous obtenez une erreur 401 ou 403 :

1. Vérifiez que `GITHUB_CLIENT_ID` et `GITHUB_CLIENT_SECRET` sont corrects
2. Assurez-vous que l'URL de callback est correctement configurée
3. Vérifiez que les scopes demandés sont autorisés dans l'OAuth App

### Repository non trouvé

Si vous obtenez une erreur "Not Found" :

1. Vérifiez que le nom du repository et du propriétaire sont corrects
2. Pour les repos privés, assurez-vous que le scope `repo` est autorisé
3. Vérifiez que l'utilisateur a accès au repository

### Webhooks non reçus

Si les triggers ne fonctionnent pas :

1. Vérifiez que les webhooks sont configurés dans les settings du repository
2. Assurez-vous que le serveur est accessible depuis Internet
3. Vérifiez les logs des webhooks dans GitHub
