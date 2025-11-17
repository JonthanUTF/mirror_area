# Guide du collaborateur

Bienvenue — merci de contribuer au projet **mirror_area** !

Ce document décrit les conventions, le workflow git recommandé, la façon d'ouvrir des issues et des PR, et les bonnes pratiques pour les commits et les revues.

---

## 1️⃣ Avant de commencer

- Lis le `readme.md` du projet et la documentation (site MkDocs).
- Vérifie les issues existantes pour éviter les doublons.
- Si tu n'as pas d'accès direct, fork le repo et travaille sur ta copie.

---

## 2️⃣ Norme de commit (Conventional Commits)

Nous utilisons la spécification Conventional Commits pour garder un historique clair et permettre un versioning/changelog automatiques.

Format strict :

```
<type>(<scope>): <subject>

[body]

BREAKING CHANGE: <description of breaking change>
```

Exemples :

```
feat(fishing): ajouter le mini-jeu de pêche et récompenses
fix(inventory): empêcher l'ajout d'un item quand l'inventaire est plein
docs(readme): ajouter les instructions d'installation
```

Bonnes pratiques :

- Titre (subject) en français/anglais selon le repo, impératif, < 72 caractères.
- Mettre le `scope` quand pertinent (ex: `player`, `ui`, `api`).
- Ajouter un corps si une explication est nécessaire.
- Utiliser `BREAKING CHANGE:` si le changement casse l'API ou le format stocké (génère une montée de version majeure).

Types recommandés :

- feat – nouvelle fonctionnalité
- fix – correction de bug
- docs – changements dans la documentation
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