# Angular (Standalone) POC

POC Angular moderne (standalone components) pour évaluer l'approche framework complet : CLI, routing et opinionated architecture.

Technos
- Angular (dernière version)
- Standalone components / ApplicationConfig
- Outils de build & test fournis par Angular CLI

Pourquoi Angular pour AREA ?
- Architecture opinionnée pour applications larges / enterprise
- Outils intégrés (CLI, tests, AOT, bundling)
- Bon pour équipes préférant conventions fortes

Screenshots
![Angular - App](/docs/poc/web-angular-home.png)
*Interface principale du POC Angular — structure et styles globaux.*

![Angular - Counter](/docs/poc/web-angular-counter.png)
*Composant de démonstration (counter) — montre le cycle de vie et bindings.*

Run local
```bash
cd poc/front/web-angular
npm ci
npm run start
# build prod
npm run build
```

Integration points
- Entrée et config : [poc/front/web-angular/src/app/app.config.ts](poc/front/web-angular/src/app/app.config.ts)
- Exemple de composant : [poc/front/web-angular/src/app/app.ts](poc/front/web-angular/src/app/app.ts)

Compléments
- Placez les captures d'écran dans [docs/poc](docs/poc) et mettez à jour les chemins d'images ci-dessus si nécessaire.
