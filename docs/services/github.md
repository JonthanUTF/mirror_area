## 🔍 Présentation
GitHub permet de créer des automatisations basées sur les issues, PR, commits et releases.

Auth : OAuth2 GitHub.

---

# 🔑 Authentification
- Type : OAuth2
- Scopes :
  - `repo`
  - `read:org`
  - `user`

---

# 🎬 Actions (Triggers)

| Action | Description |
|--------|-------------|
| issue_created | Une issue est créée |
| pr_opened | Pull request ouverte |
| push_committed | Un commit est envoyé |
| release_published | Une release est créée |
| repo_starred | Un utilisateur ajoute une étoile |

---

# ⚡ Réactions (Actions)

| Réaction | Description |
|----------|-------------|
| create_issue | Créer une issue |
| comment_issue | Commenter une issue/PR |
| create_file | Ajouter un fichier au repo |
| create_release | Créer une release |

---

# 🔁 Exemples d’AREA

### 🐛 Quand une issue est créée → Envoyer un message Discord