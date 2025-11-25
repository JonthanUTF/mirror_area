# 📁 Dropbox — Service AREA

## Présentation
Permet d’automatiser des actions lors de la création/modification de fichiers.

Auth : OAuth2 Dropbox.

---

# 🔑 Authentification
Scopes :
- `files.metadata.read`
- `files.content.write`

---

# 🎬 Actions

| Action | Description |
|--------|-------------|
| file_added | Un fichier est ajouté |
| file_modified | Un fichier modifié |
| file_deleted | Un fichier supprimé |
| file_shared | Un fichier partagé |

---

# ⚡ Réactions

| Réaction | Description |
|----------|-------------|
| upload_file | Upload d’un fichier |
| create_folder | Créer un dossier |
| share_file | Partager un fichier |

---

# 🔁 Exemples d’AREA

### 📤 Quand un fichier est ajouté → Envoyer un email