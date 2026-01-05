# Guide d'utilisation GitHub - Frontend

## 🚀 Démarrage rapide

### 1. Accéder à l'application
Ouvrez votre navigateur et allez sur : **http://localhost:8081**

### 2. S'inscrire / Se connecter
- Cliquez sur "Sign up" pour créer un compte
- Ou connectez-vous si vous avez déjà un compte

### 3. Créer une Action-Reaction avec GitHub

#### Étape 1 : Connecter votre compte GitHub
1. Allez sur la page "Create Action-Reaction"
2. Cliquez sur le bouton **"Connect GitHub"**
3. Une fenêtre s'ouvrira pour autoriser l'application
4. Acceptez les permissions demandées
5. Vous serez redirigé vers l'application

#### Étape 2 : Créer votre workflow

## 📋 Actions GitHub disponibles

### 1. **GitHub: Issue Created** - Détecter une nouvelle issue
- **Paramètres requis:**
  - GitHub Owner (ex: `octocat`)
  - Repository Name (ex: `Hello-World`)

**Exemple d'utilisation:** Être notifié quand quelqu'un crée une issue sur votre repo

---

### 2. **GitHub: PR Opened** - Détecter une nouvelle Pull Request
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name

**Exemple d'utilisation:** Envoyer un email quand une PR est ouverte

---

### 3. **GitHub: Push/Commit** - Détecter un nouveau commit
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name
  - Branch (par défaut: `main`)

**Exemple d'utilisation:** Être notifié quand quelqu'un push du code

---

### 4. **GitHub: Release Published** - Détecter une nouvelle release
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name

**Exemple d'utilisation:** Créer une issue automatique quand une release est publiée

---

### 5. **GitHub: Repo Starred** - Détecter une nouvelle étoile
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name

**Exemple d'utilisation:** Enregistrer dans la console quand quelqu'un star votre repo

---

## ⚡ Réactions GitHub disponibles

### 1. **GitHub: Create Issue** - Créer une issue
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name
  - Issue Title
  - Issue Body (optionnel)

**Exemple d'utilisation:** Créer une issue automatique toutes les semaines

---

### 2. **GitHub: Comment Issue** - Commenter une issue ou PR
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name
  - Issue/PR Number
  - Comment

**Exemple d'utilisation:** Ajouter un commentaire automatique sur une issue spécifique

---

### 3. **GitHub: Create File** - Créer ou mettre à jour un fichier
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name
  - File Path (ex: `docs/report.md`)
  - File Content
  - Commit Message (optionnel)
  - Branch (par défaut: `main`)

**Exemple d'utilisation:** Mettre à jour un fichier de rapport quotidien

---

### 4. **GitHub: Create Release** - Créer une release
- **Paramètres requis:**
  - GitHub Owner
  - Repository Name
  - Tag Name (ex: `v1.0.0`)
  - Release Name (optionnel)
  - Release Description (optionnel)

**Exemple d'utilisation:** Créer une release automatiquement

---

## 🎯 Exemples de workflows complets

### Exemple 1: Push → Créer une issue
**Cas d'usage:** Créer une issue de suivi à chaque push sur la branche main

1. **Action Type:** GitHub: Push/Commit
   - Owner: `votre-username`
   - Repo: `votre-repo`
   - Branch: `main`

2. **Reaction Type:** GitHub: Create Issue
   - Owner: `votre-username`
   - Repo: `votre-repo`
   - Title: "New commit detected"
   - Body: "A new commit has been pushed to main branch"

---

### Exemple 2: Timer → Créer un fichier
**Cas d'usage:** Générer un rapport quotidien dans un fichier

1. **Action Type:** Interval Timer
   - Interval: `86400` (24h en secondes)

2. **Reaction Type:** GitHub: Create File
   - Owner: `votre-username`
   - Repo: `votre-repo`
   - Path: `reports/daily-report.md`
   - Content: "# Daily Report\n\nGenerated automatically"
   - Message: "Update daily report"

---

### Exemple 3: Issue créée → Envoyer un email
**Cas d'usage:** Recevoir un email quand une issue est créée

1. **Action Type:** GitHub: Issue Created
   - Owner: `votre-username`
   - Repo: `votre-repo`

2. **Reaction Type:** Send Mail
   - Recipient: `votre-email@example.com`
   - Subject: "New issue created!"
   - Body: "A new issue was created in your repository"

---

### Exemple 4: Nouvelle star → Console Log
**Cas d'usage:** Logger quand quelqu'un star votre repo

1. **Action Type:** GitHub: Repo Starred
   - Owner: `votre-username`
   - Repo: `votre-repo`

2. **Reaction Type:** Console Log
   - Message: "Someone starred the repository!"

---

## 🔧 Configuration

### Variables d'environnement backend
Assurez-vous d'avoir configuré dans votre `.env`:

```env
GITHUB_CLIENT_ID=your-github-oauth-app-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-secret
```

### Créer une OAuth App GitHub
1. Allez sur https://github.com/settings/developers
2. Cliquez sur "New OAuth App"
3. Remplissez:
   - Application name: `AREA Local`
   - Homepage URL: `http://localhost:8081`
   - Authorization callback URL: `http://localhost:8081/services/callback`
4. Copiez le Client ID et Client Secret dans votre `.env`

---

## ❓ Troubleshooting

### Le bouton "Connect GitHub" ne fonctionne pas
- Vérifiez que vous êtes bien connecté (token dans localStorage)
- Vérifiez que le backend est démarré sur le port 8080
- Vérifiez les credentials GitHub dans le `.env`

### Les actions ne se déclenchent pas
- Vérifiez que l'AREA est bien active (switch "Active" activé)
- Vérifiez que votre compte GitHub est bien connecté
- Les actions sont vérifiées toutes les 10 secondes par défaut
- Consultez les logs du serveur: `docker-compose logs -f server`

### Erreur "GitHub not connected for this user"
- Reconnectez votre compte GitHub via le bouton "Connect GitHub"
- Vérifiez dans Settings que GitHub apparaît dans vos services connectés

---

## 📝 Notes importantes

1. **Fréquence de vérification**: Les actions sont vérifiées toutes les 10 secondes
2. **Permissions**: L'app demande les scopes `repo`, `read:org`, et `user`
3. **Rate limits**: GitHub limite le nombre d'appels API, soyez raisonnable avec la fréquence
4. **Repos privés**: L'app peut accéder aux repos privés avec les bonnes permissions

---

## 🎨 Interface

L'interface de création d'AREA s'adapte dynamiquement:
- Les champs GitHub apparaissent automatiquement quand vous sélectionnez une action/réaction GitHub
- Les validations empêchent la création d'AREA avec des données manquantes
- Un dialog affiche le résultat de la création

---

## 🔄 Workflow type

```
1. Connecter GitHub (une seule fois)
2. Choisir une Action (trigger)
   └─> Remplir les paramètres requis
3. Choisir une Réaction 
   └─> Remplir les paramètres requis
4. Nommer votre AREA
5. Cliquer sur "Create"
6. Vérifier dans "Home" que votre AREA est active
```

---

Pour plus de détails techniques, consultez [github-implementation.md](./services/github-implementation.md)
