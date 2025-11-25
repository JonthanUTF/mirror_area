# React + TypeScript + Vite (POC)

Ce POC démontre une implémentation SPA moderne basée sur React, TypeScript et Vite pour le front-end. Il sert d'exemple pour l'intégration avec l'API AREA, la gestion des routes et des formulaires, et l'intégration OAuth exposée dans la doc.

Technos
- React 18 + TypeScript
- Vite (dev rapide, build optimisée)
- CSS simple / POC styles
- Idéal pour composants réutilisables, large écosystème (OAuth, UI libs)

Pourquoi ce choix
- Développement très rapide grâce à Vite
- Écosystème riche (librairies d'UI, form, test)
- Docker-friendly (cf. [poc/front/web-react/vite.config.ts](poc/front/web-react/vite.config.ts))

Screenshots
![App - Home](assets/Screenshot%20from%202025-11-24%2018-59-06.png)
*Accueil / Landing page — montre le design et CTA.*

<!-- ![App - Form](/docs/poc/web-react-form.png)
*Exemple de formulaire — illustre la création d'AREA / formulaire dynamique.* -->

Run local
```bash
cd poc/front/web-react
npm ci
npm run dev
# build
npm run build
```

Voir le code source réel dans `/poc/front/web-react` du dépôt.