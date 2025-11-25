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
![Angular - App](assets/Screenshot%20from%202025-11-24%2018-59-44.png)
*Interface principale du POC Angular.*

<!-- ![Angular - Counter](/docs/poc/web-angular-counter.png)
*Composant de démonstration (counter) — montre le cycle de vie et bindings.* -->

Run local
```bash
cd poc/front/web-angular
npm ci
npm run start
# build prod
npm run build
```

Voir le code source réel dans `/poc/front/web-angular` du dépôt.
