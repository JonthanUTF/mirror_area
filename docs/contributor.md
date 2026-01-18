# Guide du Contributeur# 🤝 Guide du Contributeur



Bienvenue et merci de contribuer au projet AREA !Bienvenue et merci de contribuer au projet **AREA** !



Ce document décrit les conventions, le workflow git recommandé, la façon d'ouvrir des issues et des PR, et les bonnes pratiques de développement.Ce document décrit les conventions, le workflow git recommandé, la façon d'ouvrir des issues et des PR, et les bonnes pratiques de développement.



## Avant de commencer---



1. Lisez la documentation : Parcourez ce site MkDocs et le README.md## 📋 Avant de commencer

2. Vérifiez les issues : Évitez les doublons en cherchant les issues existantes

3. Fork le repo : Si vous n'avez pas d'accès direct, travaillez sur votre fork1. **Lisez la documentation** : Parcourez ce site MkDocs et le README.md

4. Configurez votre environnement : Suivez le guide d'installation2. **Vérifiez les issues** : Évitez les doublons en cherchant les issues existantes

3. **Fork le repo** : Si vous n'avez pas d'accès direct, travaillez sur votre fork

## Configuration de l'environnement4. **Configurez votre environnement** : Suivez le guide d'installation



### Prérequis---



- Node.js 18+## 🔧 Configuration de l'environnement

- Docker & Docker Compose

- Git### Prérequis

- Un éditeur (VS Code recommandé)

- Node.js 18+

### Installation- Docker & Docker Compose

- Git

```bash- Un éditeur (VS Code recommandé)

# Cloner le repository

git clone https://github.com/JonthanUTF/mirror_area.git### Installation

cd mirror_area

```bash

# Backend# Cloner le repository

cd servergit clone https://github.com/JonthanUTF/mirror_area.git

npm installcd mirror_area

cp .env.example .env

# Configurer les variables d'environnement# Backend

cd server

# Frontend Webnpm install

cd ../front-webcp .env.example .env

npm install# Configurer les variables d'environnement



# Application Mobile# Frontend Web

cd ../client-mobilecd ../front-web

npm installnpm install

```

# Application Mobile

### Lancer le projetcd ../client-mobile

npm install

```bash```

# Avec Docker (recommandé)

docker-compose up -d### Lancer le projet



# Sans Docker```bash

# Terminal 1 - Backend# Avec Docker (recommandé)

cd server && npm run devdocker-compose up -d



# Terminal 2 - Frontend# Ou en local

cd front-web && npm run dev# Terminal 1 - Backend

```cd server && npm run dev



## Workflow Git# Terminal 2 - Frontend

cd front-web && npm run dev

### Branches

# Terminal 3 - Mobile (optionnel)

| Branche | Usage |cd client-mobile && npx expo start

|---------|-------|```

| main | Production stable |

| dev | Développement actif |---

| feature/* | Nouvelles fonctionnalités |

| fix/* | Corrections de bugs |## 📝 Conventions de Commit

| docs/* | Documentation |

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) pour un historique clair.

### Créer une branche

### Format

```bash

# Mettre à jour dev```

git checkout dev<type>(<scope>): <description>

git pull origin dev

[corps optionnel]

# Créer une branche feature

git checkout -b feature/ma-fonctionnalite[footer optionnel]

``````



### Commits### Types



Utilisez des messages de commit clairs et descriptifs :| Type | Description |

|------|-------------|

```| `feat` | Nouvelle fonctionnalité |

type(scope): description courte| `fix` | Correction de bug |

| `docs` | Documentation uniquement |

Corps optionnel avec plus de détails.| `style` | Formatage (pas de changement de code) |

```| `refactor` | Refactoring (pas de nouvelle feature ni fix) |

| `test` | Ajout ou modification de tests |

Types de commits :| `chore` | Maintenance (build, CI, dépendances) |



| Type | Description |### Scopes recommandés

|------|-------------|

| feat | Nouvelle fonctionnalité |- `backend` / `server` - API et serveur

| fix | Correction de bug |- `frontend` / `web` - Client web React

| docs | Documentation |- `mobile` - Application mobile

| style | Formatage (pas de changement de code) |- `services` - Services d'intégration

| refactor | Refactoring |- `auth` - Authentification

| test | Ajout de tests |- `docs` - Documentation

| chore | Maintenance |

### Exemples

Exemples :

```bash

```feat(services): ajouter le service Spotify

feat(services): add Dropbox service integration

fix(auth): resolve JWT expiration issuefix(auth): corriger la validation du token JWT

docs(api): update API reference for areas endpoint

```docs(api): documenter les endpoints utilisateur



### Pull Requestrefactor(backend): simplifier le moteur d'automation



1. Poussez votre branche :chore(deps): mettre à jour React vers 18.3

```bash```

git push origin feature/ma-fonctionnalite

```---



2. Ouvrez une PR vers `dev`## 🌿 Workflow Git



3. Remplissez le template de PR :### Branches

   - Description des changements

   - Screenshots si UI modifiée| Branche | Usage |

   - Checklist de tests|---------|-------|

| `main` | Production stable |

4. Attendez la review| `develop` | Développement en cours |

| `feature/*` | Nouvelles fonctionnalités |

## Standards de code| `fix/*` | Corrections de bugs |

| `doc` | Documentation |

### JavaScript/TypeScript

### Workflow

- Utilisez ESLint et Prettier

- Évitez les `any` en TypeScript1. **Créer une branche** depuis `develop`

- Documentez les fonctions complexes   ```bash

   git checkout develop

```javascript   git pull origin develop

/**   git checkout -b feature/mon-feature

 * Vérifie si un utilisateur est authentifié   ```

 * @param {Request} req - Requête Express

 * @returns {boolean} - True si authentifié2. **Développer** avec des commits atomiques

 */

function isAuthenticated(req) {3. **Push** et créer une Pull Request

  return !!req.user;   ```bash

}   git push origin feature/mon-feature

```   ```



### React4. **Review** par un autre contributeur



- Composants fonctionnels avec hooks5. **Merge** dans `develop` après approbation

- Props typées (TypeScript) ou PropTypes

- Un composant par fichier---



```jsx## 📮 Pull Requests

function MyComponent({ title, onClick }) {

  return (### Checklist PR

    <button onClick={onClick}>

      {title}- [ ] Le code compile sans erreur

    </button>- [ ] Les tests passent

  );- [ ] La documentation est mise à jour si nécessaire

}- [ ] Le code suit les conventions du projet

```- [ ] Les commits suivent Conventional Commits



### CSS### Template PR



- Utilisez des classes descriptives```markdown

- Évitez les styles inline## Description

- Préférez les variables CSS

Brève description des changements.

```css

.area-card {## Type de changement

  background: var(--bg-primary);

  border-radius: var(--radius-md);- [ ] Bug fix

  padding: var(--spacing-md);- [ ] Nouvelle fonctionnalité

}- [ ] Breaking change

```- [ ] Documentation



## Tests## Tests



### Lancer les testsDécrivez les tests effectués.



```bash## Screenshots (si applicable)

# Backend

cd serverAjoutez des captures d'écran.

npm test```



# Frontend---

cd front-web

npm test## 🐛 Signaler un Bug

```

### Avant de créer une issue

### Écrire des tests

1. Vérifiez que le bug n'est pas déjà signalé

```javascript2. Testez avec la dernière version

describe('Area API', () => {3. Isolez le problème (reproduire le bug)

  it('should create a new area', async () => {

    const response = await request(app)### Template Issue Bug

      .post('/areas')

      .set('Authorization', `Bearer ${token}`)```markdown

      .send({**Description**

        name: 'Test Area',Description claire du bug.

        actionService: 'timer',

        actionType: 'interval',**Étapes pour reproduire**

        reactionService: 'console',1. Aller sur '...'

        reactionType: 'log_message',2. Cliquer sur '...'

        parameters: { interval: 60000 }3. Voir l'erreur

      });

    **Comportement attendu**

    expect(response.status).toBe(201);Ce qui devrait se passer.

    expect(response.body.name).toBe('Test Area');

  });**Screenshots**

});Si applicable.

```

**Environnement**

## Ajouter un nouveau service- OS: [e.g. Ubuntu 22.04]

- Navigateur: [e.g. Chrome 120]

1. Créer le fichier dans `server/src/services/implementations/`- Version Node: [e.g. 18.19.0]

```

```javascript

const ServiceBase = require('../ServiceBase');---



class MonService extends ServiceBase {## 💡 Proposer une Fonctionnalité

    constructor() {

        super('monservice', 'Mon Service', 'icon-url');### Template Feature Request

        

        this.registerAction('mon_action', 'Description', {```markdown

            param1: 'string'**Problème**

        });Quel problème cette fonctionnalité résout-elle ?

        

        this.registerReaction('ma_reaction', 'Description', {**Solution proposée**

            param2: 'number'Description de la solution.

        });

    }**Alternatives considérées**

    Autres approches envisagées.

    async checkTrigger(action, area, params) {

        // Implémentation**Contexte supplémentaire**

        return false;Informations additionnelles.

    }```

    

    async executeReaction(reaction, area, params) {---

        // Implémentation

    }## 🧪 Tests

}

### Lancer les tests

module.exports = new MonService();

``````bash

# Backend

2. Le service sera automatiquement chargé par le loadercd server

npm test

3. Si OAuth nécessaire, ajouter la configuration dans `routes/services.js`

# Frontend (si configuré)

4. Documenter le service dans `docs/services/`cd front-web

npm test

## Issues```



### Ouvrir une issue### Écrire des tests



Utilisez les templates fournis :- Chaque nouvelle fonctionnalité doit avoir des tests

- Les corrections de bugs doivent inclure un test de régression

- Bug report : Pour signaler un bug- Visez une couverture de code > 80%

- Feature request : Pour proposer une fonctionnalité

- Documentation : Pour des améliorations de docs---



### Labels## 📁 Structure du Code



| Label | Description |### Backend (server/)

|-------|-------------|

| bug | Quelque chose ne fonctionne pas |```

| enhancement | Nouvelle fonctionnalité |server/src/

| documentation | Documentation |├── routes/        # Endpoints API

| good first issue | Bon pour débuter |├── models/        # Modèles Sequelize

| help wanted | Aide bienvenue |├── services/      # Logique métier et intégrations

│   └── implementations/  # Services AREA

## Questions└── config/        # Configuration

```

Si vous avez des questions :

### Frontend (front-web/)

1. Consultez d'abord la documentation

2. Cherchez dans les issues existantes```

3. Ouvrez une nouvelle issue avec le label "question"front-web/src/

├── pages/         # Pages/routes
├── components/    # Composants réutilisables
└── assets/        # Images, styles
```

### Mobile (client-mobile/)

```
client-mobile/src/
├── screens/       # Écrans
├── components/    # Composants
├── navigation/    # Configuration navigation
└── api/          # Client API
```

---

## 🎨 Style de Code

### JavaScript/TypeScript

- Indentation : 2 espaces
- Quotes : simples `'`
- Point-virgule : oui
- Nommage : camelCase pour variables/fonctions, PascalCase pour classes/composants

### Outils recommandés

- **ESLint** : Linting
- **Prettier** : Formatage
- **EditorConfig** : Cohérence éditeur

---

## 📞 Contact

- **Issues GitHub** : Pour bugs et features
- **Pull Requests** : Pour contributions
- **Email** : Voir le profil du repo

---

Merci de contribuer à AREA ! 🚀
- chore – tâches de maintenance (build, deps)
- refactor – refactor sans ajout de fonctionnalité
- test – ajout/modification de tests

---

## 3️⃣ Branches & workflow

Modèle proposé (adaptable selon règles du cours / orga) :

- `main` : code stable (production). Ne pas pousser directement.
- `dev` : intégration continue des fonctionnalités validées.
- `feature/<desc>` : branche pour chaque nouvelle fonctionnalité.
- `fix/<desc>` : branche pour correctifs.

Règles :

- Crée les branches depuis `dev`.
- Ouvre une PR de `feature/*` ou `fix/*` vers `dev`.
- `dev` est mergeable vers `main` via PR après validation (tests + revue).
- Protections recommandées : protection de `main` et `dev`, checks obligatoires, revue obligatoire.

Remarques pratiques :

- Rebase régulièrement sur `dev` pour limiter les conflits.
- Nomme les branches claires et courtes (`feature/login-oauth`).

---

## 4️⃣ Issues

- Toujours créer une issue pour un bug ou une nouvelle feature.
- Utilise les templates fournis (bug/feature/documentation/enhancement) si présents.

Contenu minimal d'une bonne issue :

- Titre explicite
- Contexte et version
- Étapes pour reproduire (pour les bugs)
- Comportement attendu vs observé
- Logs / captures / exemples
- Tags/label suggérés

Quand soumettre :

- Pour une feature : explique la valeur ajoutée, les critères d'acceptation et les dépendances.
- Pour un bug : fournis un cas reproductible et, si possible, une PR de correctif.

---

## 5️⃣ Pull Requests (PR)

PR → doit cibler `dev` (sauf règle contraire).

Chaque PR doit contenir :

- Titre clair (ex: `feat(api): support OAuth callback`)
- Description : ce qui change, pourquoi, impact, screenshots si nécessaire
- Issues liées : `Closes #<num>` pour fermer automatiquement une issue
- Checklist : tests, build, doc

Template de PR recommandé :

```
Titre: feat(<scope>): courte description

Description:
- Qu'est-ce qui a été changé ?
- Pourquoi ?

Issues liées:
- Closes #<num>

Checklist:
- [ ] Code formaté et lint passé
- [ ] Tests unitaires ajoutés / mis à jour (si applicable)
- [ ] Documentation mise à jour (si applicable)
```

Bonnes pratiques :

- Faire des PR petites et ciblées.
- Décrire clairement l'impact et tout risque potentiel.
- Demander au moins une revue — ajouter des reviewers pertinents.

---

## 6️⃣ Revue de code

Critères de revue :

- Lisibilité et architecture
- Tests ajoutés/maintenus
- Respect des règles de sécurité et absence de secrets
- Pas de régressions connues

Comportement attendu des reviewers :

- Être constructif et concret
- Proposer des alternatives/clés d'amélioration
- Valider les tests et checks CI

---

## 7️⃣ Tests & CI

- Ajoute/maintiens des tests pour les changements importants.
- Assure-toi que la CI (GitHub Actions etc.) passe avant de demander le merge.
- Les checks peuvent inclure lint, build, tests unitaires et déploiement de preview.

---

## 8️⃣ Documentation & MkDocs

- La documentation est gérée avec MkDocs (voir `mkdocs.yml`).
- Pour développer localement :

```bash
# créer et activer un venv (optionnel)
python3 -m venv .venv
source .venv/bin/activate
pip install mkdocs mkdocs-material
mkdocs serve
# ouvrir http://127.0.0.1:8000
```

- Pour déployer sur GitHub Pages : `mkdocs gh-deploy` (ou via Actions).
- Mets à jour la doc dans `docs/` et ajoute une ligne dans `mkdocs.yml` `nav:` si tu veux ordonner les pages.

---

## 9️⃣ Checklist contribution (avant PR)

- [ ] Le code compile et fonctionne localement
- [ ] Les tests passent
- [ ] Les messages de commit respectent Conventional Commits
- [ ] La PR contient une description et les issues liées
- [ ] La doc est mise à jour si nécessaire

---

## 🔧 Commandes utiles

```bash
# créer une branche
git checkout -b feature/ma-feature dev

# faire un commit
git add .
git commit -m "feat(scope): courte description"

# pousser
git push origin feature/ma-feature
```

---

## Note pour projets scolaires (ex: Epitech / Area)

Si ce dépôt correspond à un projet de type "Area" (ou un projet d'école comme Epitech) :

- Vérifie les consignes spécifiques du cours (naming, dépôt, livrables).
- Certaines écoles demandent des branches/PR spécifiques ou un format de rendu : adapte le workflow ci-dessus si nécessaire.

---

## Liens utiles

- Conventional Commits — https://www.conventionalcommits.org/
- GitHub Actions — https://docs.github.com/en/actions
- MkDocs — https://www.mkdocs.org/

Merci pour ta contribution — ouvre une PR et on te fera une revue rapidement !