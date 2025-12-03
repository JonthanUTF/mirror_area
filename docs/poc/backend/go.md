# POC Backend — Go (Gin + SQLite)

Ce POC illustre un microservice REST écrit en Go (framework Gin) pour gérer des ressources "Area" simples. Il met l'accent sur la performance, la simplicité du déploiement Docker et la possibilité d'ajouter des métriques Prometheus.

Objectifs
- Fournir une API CRUD minimale pour `Area`.
- Être léger pour les benchs (peu de dépendances, binaire natif).
- Montrer comment mesurer la perf avec `hey`/`wrk`.

Contrat API (JSON)

- GET /health
  - 200 { "status": "ok" }
- POST /areas
  - body: { "name": "string", "type": "string" }
  - 201 { "id": 1, "name": ..., "type": ..., "created_at": ... }
  - 400 en cas de payload invalide
- GET /areas
  - 200 [ {id,name,type,created_at}, ... ]
- GET /areas/{id}
  - 200 { ... } | 404

Modèle de données
- Area: id (int), name (string), type (string), created_at (timestamp)

Stack recommandée
- Go 1.20+ (module mode)
- Gin (router) — `github.com/gin-gonic/gin`
- GORM + sqlite driver (optionnel) — `gorm.io/gorm`, `gorm.io/driver/sqlite`
- Prometheus client (optionnel) — `github.com/prometheus/client_golang`

Scaffold rapide

```bash
mkdir -p poc/backend/Go/area
cd poc/backend/Go/area
go mod init github.com/JonthanUTF/mirror_area/poc/backend/area
go get github.com/gin-gonic/gin gorm.io/gorm gorm.io/driver/sqlite
```

Extrait minimal (esquisse)

```go
// main.go (esquisse)
package main

import (
  "time"
  "net/http"
  "github.com/gin-gonic/gin"
  "gorm.io/driver/sqlite"
  "gorm.io/gorm"
)

type Area struct {
  ID uint `gorm:"primaryKey"`
  Name string
  Type string
  CreatedAt time.Time
}

func main() {
  db, _ := gorm.Open(sqlite.Open("dev.db"), &gorm.Config{})
  db.AutoMigrate(&Area{})
  r := gin.Default()
  r.GET("/health", func(c *gin.Context){ c.JSON(http.StatusOK, gin.H{"status":"ok"}) })
  // routes POST /areas, GET /areas, GET /areas/:id ...
  r.Run() // :8080
}
```

Docker

```dockerfile
FROM golang:1.20-alpine AS build
WORKDIR /src
COPY . .
RUN go build -o /out/area ./...

FROM alpine:3.18
COPY --from=build /out/area /usr/local/bin/area
EXPOSE 8080
CMD ["/usr/local/bin/area"]
```

Bench & tests

- Build and run locally:
  ```bash
  go build -o area && ./area
  ```
- Bench simple (concurrence modérée):
  ```bash
  # install hey (Go) or use wrk
  hey -n 10000 -c 50 http://localhost:8080/areas
  wrk -t2 -c100 -d15s http://localhost:8080/areas
  ```
- Mesures utiles : RPS, latence p50/p95, erreurs

Critères de succès
- Endpoint /areas répond en < 200ms p95 sous charge modérée (50-100 concur.)
- Pas d'erreurs 5xx lors des benchs basiques

Où est le code
- Le POC de référence (squelette) se trouve dans `poc/backend/Go/`.

Extensions possibles
- Auth (JWT), métriques Prometheus, graceful shutdown, tests d'intégration.
