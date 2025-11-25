# Vue 3 + TypeScript + Vite (POC)

Ce POC illustre l'approche componente et réactive de Vue 3 avec TypeScript. Utile pour comparer ergonomie de templates, état (Composition API) et intégration rapide avec Vite.

Technos
- Vue 3 + Composition API + TypeScript
- Vite (build rapide)
- Style minimal pour démonstration

Points forts pour AREA
- Templates déclaratifs pour UI dynamique (forms, listes de services)
- Pinia possible pour state global (non inclus mais facilement ajoutable)
- Docker / CI friendly (cf. [poc/front/web-vue/vite.config.ts](poc/front/web-vue/vite.config.ts))

Screenshots
![Vue - Home](assets/Screenshot%20from%202025-11-24%2019-00-20.png)
*Page d'accueil du POC Vue.*

<!-- ![Vue - Counter](/docs/poc/web-vue-counter.png)
*Exemple d'interaction réactive (counter) — illustre Composition API et binding.* -->

Run local
```bash
cd poc/front/web-vue
npm ci
npm run dev
# build
npm run build
```

Voir le code source réel dans `/poc/front/web-vue` du dépôt.
