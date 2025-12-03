# POC Backend — Node.js (Fastify Gateway)

Ce POC montre une passerelle / agrégateur en Node.js (Fastify) qui appelle d'autres services backend (p.ex. l'Area service en Go) et ajoute du caching/rate-limit pour les tests de performance.

Objectifs
- Implémenter un proxy/agrégateur léger pour tester latence d'agrégation et bénéfice du cache.
- Mesurer overhead et gains lorsqu'un cache en mémoire (ou Redis) est activé.

Contrat API (JSON)

- GET /health
  - 200 { "status":"ok" }
- GET /aggregate/areas
  - Appelle l'upstream `/areas` (p.ex. Go POC) et retourne:
    ```json
    { "items": [...], "aggregated_at": "..." }
    ```
- GET /proxy/* => proxy simple vers `UPSTREAM_URL`

Stack recommandée
- Node.js 18+
- Fastify (rapide, plugins utiles)
- undici (client HTTP ultra-performant) ou `node-fetch`
- cache in-memory (node-cache) ou Redis pour évaluer l'impact

Scaffold rapide

```bash
mkdir -p poc/backend/node-js/gateway
cd poc/backend/node-js/gateway
npm init -y
npm i fastify undici node-cache
```

Exemple minimal (esquisse)

```js
// index.js
const Fastify = require('fastify')
const { request } = require('undici')
const server = Fastify()

server.get('/health', async () => ({ status: 'ok' }))
server.get('/aggregate/areas', async () => {
  const r = await request('http://localhost:8080/areas')
  const data = await r.body.json()
  return { items: data, aggregated_at: new Date().toISOString() }
})

server.listen({ port: 3000 })
```

Docker

```dockerfile
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
```

Bench & pratiques

- Lancer le gateway et le backend upstream (Go) puis mesurer :
  ```bash
  npm run dev # ou node index.js
  autocannon -c 100 -d 15 http://localhost:3000/aggregate/areas
  ```
- Mesurer avec/without cache et comparer p95

Critères de succès
- Overhead d'agrégation raisonnable (<100ms p95) quand upstream est sain
- Cache réduit le p95 de manière mesurable

Où est le code
- Le POC pour Node est dans `poc/backend/node-js/`.

Extensions
- Ajout d'un circuit-breaker, instrumentation OpenTelemetry, tests de résilience (chaos).
