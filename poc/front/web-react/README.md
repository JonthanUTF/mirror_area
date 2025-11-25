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
> Remplacez les noms d'images si nécessaire ; mes captures sont dans [docs/poc](docs/poc).

![App - Home](/docs/poc/web-react-home.png)
*Accueil / Landing page — montre le design et CTA pour login/register.*

![App - Form](/docs/poc/web-react-form.png)
*Exemple de formulaire — illustre la création d'AREA / formulaire dynamique.*

Run local
```bash
cd poc/front/web-react
npm ci
npm run dev
# build
npm run build
```

Integration points
- Exemple d'entrée principale : [poc/front/web-react/src/App.tsx](poc/front/web-react/src/App.tsx)
- Config Vite : [poc/front/web-react/vite.config.ts](poc/front/web-react/vite.config.ts)

Compléments
- Utilisez ces captures pour documenter visuellement la page POC dans la doc MkDocs ([docs/poc](docs/poc)).
- Ajoutez des captures supplémentaires dans [docs/poc](docs/poc) et mettez à jour les chemins ci-dessus.