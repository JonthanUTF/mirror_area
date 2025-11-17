# Backend Framework

## Benchmark Table

| Technology             | Perf  | Dev Ease | Ecosystem | Background Jobs | Docker | Maintainability | Notes                                   |
| ---------------------- | ----- | -------- | --------- | --------------- | ------ | --------------- | --------------------------------------- |
| **Node.js (NestJS)**   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐     | ⭐⭐⭐⭐            | ⭐⭐⭐⭐   | ⭐⭐⭐⭐            | Best ecosystem for OAuth + service SDKs |
| **Python (FastAPI)**   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐      | ⭐⭐⭐             | ⭐⭐⭐    | ⭐⭐⭐⭐            | Fastest to write glue logic             |
| **Go (Gin)**           | ⭐⭐⭐⭐  | ⭐⭐⭐      | ⭐⭐        | ⭐⭐⭐⭐⭐           | ⭐⭐⭐⭐⭐  | ⭐⭐⭐⭐⭐           | Best performance & reliability          |


## Node.js

Best ecosystem for third-party APIs (Google, GitHub, Outlook, Dropbox all have official Node SDKs).
Excellent async model for hook polling.

**Pros:**

- Easiest integration with OAuth2 providers
- NestJS makes clean, modular architecture
- Tons of libraries for queues (BullMQ), schedulers, webhooks
- Lightweight Docker images (node:18-slim)

**Cons:**

- CPU-bound tasks slower (not a big issue for the project)

## Python (FastAPI)

FastAPI is extremely productive and perfect for glue code.
Async is strong, but ecosystem for API SDKs is weaker than Node.

**Pros:**

- Fastest to prototype
- Beautiful docs auto-generated (Swagger)
- Best data model system (Pydantic)

**Cons:**

- Fewer official SDKs for big services
- Async workers require extra config (Celery / RQ)

## Go (Gin / Fiber)

Very good concurrency, tiny Docker images, simple deployment.
But OAuth2 + API SDKs require more manual handling.

**Pros:**

- Very fast & reliable
- Perfect for cron-like hooks
- Excellent for containerization

**Cons:**

- Less pleasant for complex business logic
- Weak ecosystem for services like Gmail, Google Drive, etc.


# Backend Database

| Database          | Data Modeling | Performance | Complexity | Docker Setup    | Best Use Case                         |
| ----------------- | ------------- | ----------- | ---------- | ------------ | ------------------------------------- |
| **PostgreSQL**    | ⭐⭐⭐⭐⭐         | ⭐⭐⭐⭐        | ⭐⭐⭐        | ⭐⭐⭐⭐             | Best all-purpose solution             |
| **MySQL/MariaDB** | ⭐⭐⭐⭐          | ⭐⭐⭐⭐        | ⭐⭐⭐        | ⭐⭐⭐⭐             | Good alternative, weaker JSON support |
| **SQLite**        | ⭐⭐⭐           | ⭐⭐⭐         | ⭐⭐         | ⭐⭐⭐⭐⭐            | Small projects, local dev only        |
| **MongoDB**       | ⭐⭐            | ⭐⭐⭐⭐        | ⭐⭐⭐⭐       | ⭐⭐            | Unstructured data, flexible schemas   |
| **Redis**         | ⭐             | ⭐⭐⭐⭐⭐       | ⭐⭐         | ⭐⭐⭐⭐             | Caching, deduplication, queues        |


## PostgreSQL — Recommended

PostgreSQL is the strongest contender for an automation platform.

**Pros:**
- Most powerful relational database in open-source ecosystem
- Great for modeling structured entities:
    - Users
    - UserServices
    - Actions
    - Reactions
    - AREA workflows
    - Hook logs

- Built-in JSONB column type (useful for storing dynamic config)
- Excellent support from backend frameworks (Node, FastAPI, Go)
- Runs easily in Docker Compose
- Strong indexing (B-tree, full-text, GIN/JSONB)

**Cons:**

- Heavier than SQLite
- Requires a bit more setup

## MySQL / MariaDB

Solid alternative if the team is familiar with it.

**Pros:**
- Good performance
- Easy to Dockerize
- Works well with ORMs (Prisma, Sequelize, TypeORM)

**Cons:**
- Weaker JSON support than PostgreSQL
- Less flexible for dynamic config structures

## SQLite

Useful only for:
- Prototyping
- PoC
- Unit tests
- Very lightweight deployments

**Pros:**
- Extremely easy to use
- No server required
- Fast setup for the early PoC milestone

**Cons:**

- Not suitable for concurrent workloads
- No real user management system
- Bad for a multi-user automation platform
- Hard to scale