# Service Dropbox

Le service Dropbox permet de surveiller les changements de fichiers et d'effectuer des opérations sur votre stockage cloud Dropbox.

## Configuration

### Variables d'environnement

```bash
DROPBOX_CLIENT_ID=your_client_id
DROPBOX_CLIENT_SECRET=your_client_secret
```

### Scopes OAuth requis

- `files.metadata.read` - Lecture des métadonnées de fichiers
- `files.metadata.write` - Écriture des métadonnées de fichiers
- `files.content.read` - Lecture du contenu des fichiers
- `files.content.write` - Écriture du contenu des fichiers

### URL de callback

```
{CLIENT_URL}/services/callback
```

## Actions (Triggers)

### `file_added` - Nouveau fichier ajouté

Déclenché lorsqu'un nouveau fichier est ajouté dans un dossier Dropbox spécifié.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `folder_path` | `string` | Chemin du dossier à surveiller (ex: `/Documents`) |

**Données retournées :**

```json
{
  "file_name": "document.pdf",
  "file_path": "/Documents/document.pdf",
  "file_size": 1024,
  "modified_date": "2024-01-15T10:30:00Z"
}
```

### `file_modified` - Fichier modifié

Déclenché lorsqu'un fichier existant est modifié.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `folder_path` | `string` | Chemin du dossier à surveiller |

**Données retournées :**

```json
{
  "file_name": "document.pdf",
  "file_path": "/Documents/document.pdf",
  "modified_date": "2024-01-15T10:30:00Z"
}
```

### `file_deleted_anywhere` - Fichier supprimé

Déclenché lorsqu'un fichier est supprimé n'importe où dans le Dropbox.

**Paramètres :** Aucun

**Données retournées :**

```json
{
  "file_path": "/Documents/old_file.pdf",
  "deleted_date": "2024-01-15T10:30:00Z"
}
```

## Réactions

### `upload_file` - Uploader un fichier

Crée ou met à jour un fichier dans Dropbox.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Chemin de destination (ex: `/Documents/file.txt`) |
| `content` | `string` | Contenu du fichier |

**Exemple d'utilisation :**

```json
{
  "reaction": "upload_file",
  "params": {
    "path": "/Notes/note.txt",
    "content": "Contenu de ma note créée automatiquement"
  }
}
```

### `create_folder` - Créer un dossier

Crée un nouveau dossier dans Dropbox.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Chemin du dossier à créer (ex: `/Projects/NewProject`) |

**Exemple d'utilisation :**

```json
{
  "reaction": "create_folder",
  "params": {
    "path": "/Projects/NewProject"
  }
}
```

### `delete_file` - Supprimer un fichier

Supprime un fichier ou dossier de Dropbox.

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `path` | `string` | Chemin du fichier ou dossier à supprimer |

**Exemple d'utilisation :**

```json
{
  "reaction": "delete_file",
  "params": {
    "path": "/Temp/old_file.txt"
  }
}
```

## Exemples d'AREA

### Sauvegarde automatique

**Trigger :** Timer - Intervalle de 24h  
**Reaction :** Dropbox - Créer un dossier de backup journalier

### Notification de nouveaux fichiers

**Trigger :** Dropbox - Nouveau fichier dans `/Shared`  
**Reaction :** Console - Logger l'événement

### Synchronisation GitHub → Dropbox

**Trigger :** GitHub - Nouveau commit  
**Reaction :** Dropbox - Uploader un fichier de log

## Architecture technique

```
DropboxService
├── extends ServiceBase
├── Actions
│   ├── file_added
│   ├── file_modified
│   └── file_deleted_anywhere
├── Reactions
│   ├── upload_file
│   ├── create_folder
│   └── delete_file
└── API
    └── Dropbox API v2
```

## Dépannage

### Erreur d'authentification

Si vous obtenez une erreur lors de la connexion à Dropbox :

1. Vérifiez que `DROPBOX_CLIENT_ID` et `DROPBOX_CLIENT_SECRET` sont correctement configurés
2. Assurez-vous que l'URL de callback est bien configurée dans l'app Dropbox
3. Vérifiez que les scopes demandés sont autorisés

### Fichiers non détectés

Si les triggers ne détectent pas les changements :

1. Vérifiez le chemin du dossier surveillé (doit commencer par `/`)
2. Assurez-vous que le token d'accès n'est pas expiré
3. Vérifiez les permissions de l'application
