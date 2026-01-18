# Backend Framework

## Benchmark Table

| Technology             | Perf  | Dev Ease | Ecosystem | Background Jobs | Docker | Maintainability | Notes                                   |
| ---------------------- | ----- | -------- | --------- | --------------- | ------ | --------------- | --------------------------------------- |
| **Node.js (NestJS)**   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐            | ⭐⭐⭐⭐   | ⭐⭐⭐⭐            | Best ecosystem for OAuth + service SDKs |
| **Python (FastAPI)**   | ⭐⭐⭐   | ⭐⭐⭐⭐⭐    | ⭐⭐⭐⭐      | ⭐⭐⭐              | ⭐⭐⭐     | ⭐⭐⭐⭐            | Fastest to write glue logic             |
| **Go (Gin)**           | ⭐⭐⭐⭐ | ⭐⭐⭐        | ⭐⭐          | ⭐⭐⭐⭐⭐          | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐           | Best performance & reliability          |

## Candidates

### Node.js

Best ecosystem for third-party APIs (Google, GitHub, Outlook, Dropbox all have official Node SDKs).
Excellent async model for hook polling.

**Pros:**

- Easiest integration with OAuth2 providers
- NestJS makes clean, modular architecture
- Tons of libraries for queues (BullMQ), schedulers, webhooks
- Lightweight Docker images (node:18-slim)

**Cons:**

- CPU-bound tasks slower (not a big issue for the project)

### Python (FastAPI)

FastAPI is extremely productive and perfect for glue code.
Async is strong, but ecosystem for API SDKs is weaker than Node.

**Pros:**

- Fastest to prototype
- Beautiful docs auto-generated (Swagger)
- Best data model system (Pydantic)

**Cons:**

- Fewer official SDKs for big services
- Async workers require extra config (Celery / RQ)

### Go (Gin / Fiber)

Very good concurrency, tiny Docker images, simple deployment.
But OAuth2 + API SDKs require more manual handling.

**Pros:**

- Very fast & reliable
- Perfect for cron-like hooks
- Excellent for containerization

**Cons:**

- Less pleasant for complex business logic
- Weak ecosystem for services like Gmail, Google Drive, etc.

## Our choice

We will choose Node.js for:

- Ecosystem: Most major providers offer first‑class Node SDKs (Google, GitHub, Outlook, Dropbox), reducing integration effort and edge cases.
- Deployment: Lightweight Docker images.

# Backend Database

| Database          | Data Modeling | Performance | Complexity | Docker Setup    | Best Use Case                         |
| ----------------- | ------------- | ----------- | ---------- | ------------ | ------------------------------------- |
| **PostgreSQL**    | ⭐⭐⭐⭐⭐         | ⭐⭐⭐⭐        | ⭐⭐⭐        | ⭐⭐⭐⭐             | Best all-purpose solution             |
| **MySQL/MariaDB** | ⭐⭐⭐⭐          | ⭐⭐⭐⭐        | ⭐⭐⭐        | ⭐⭐⭐⭐             | Good alternative, weaker JSON support |
| **SQLite**        | ⭐⭐⭐           | ⭐⭐⭐         | ⭐⭐         | ⭐⭐⭐⭐⭐            | Small projects, local dev only        |
| **MongoDB**       | ⭐⭐            | ⭐⭐⭐⭐        | ⭐⭐⭐⭐       | ⭐⭐            | Unstructured data, flexible schemas   |
| **Redis**         | ⭐             | ⭐⭐⭐⭐⭐       | ⭐⭐         | ⭐⭐⭐⭐             | Caching, deduplication, queues        |

## Candidate

### PostgreSQL

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

### MySQL / MariaDB

Solid alternative if the team is familiar with it.

**Pros:**

- Good performance
- Easy to Dockerize
- Works well with ORMs (Prisma, Sequelize, TypeORM)

**Cons:**

- Weaker JSON support than PostgreSQL
- Less flexible for dynamic config structures

### SQLite

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

## Our choice

We will choose PostgreSQL because:

- Highly relational
- Requires clean schemas
- Requires user/OAuth/workflow modeling
- Needs JSONB for flexible configs
- Needs strong integrity

---

# Password Hashing

| Technology | Security | Performance | Salt | Complexity | Best Use Case |
| ---------- | -------- | ----------- | ---- | ---------- | ------------- |
| **bcrypt** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Auto | ⭐⭐⭐⭐ | Industry standard for passwords |
| **argon2** | ⭐⭐⭐⭐⭐ | ⭐⭐ | Auto | ⭐⭐⭐ | Most secure, memory-hard |
| **scrypt** | ⭐⭐⭐⭐ | ⭐⭐ | Auto | ⭐⭐⭐ | Good alternative to bcrypt |
| **PBKDF2** | ⭐⭐⭐ | ⭐⭐⭐⭐ | Manual | ⭐⭐⭐⭐ | NIST approved, widely supported |
| **SHA-256** | ⭐ | ⭐⭐⭐⭐⭐ | Manual | ⭐⭐⭐⭐⭐ | ⚠️ NOT for passwords (too fast) |

## Candidates

### bcrypt

The de facto standard for password hashing in web applications.
Used in this project via [`bcryptjs`](https://www.npmjs.com/package/bcryptjs).

**Pros:**

- Industry-proven and battle-tested since 1999
- Adaptive cost factor (work rounds) - currently 10 rounds in AREA
- Automatic salt generation and storage
- Resistant to brute-force attacks
- Excellent library support across all platforms
- Pure JavaScript implementation available (bcryptjs)

**Cons:**

- Slower than argon2 for same security level
- Limited to 72-byte passwords
- Not memory-hard (vulnerable to GPU attacks)

**Implementation in AREA:**
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds
const isValid = await bcrypt.compare(password, hashedPassword);
```

### argon2

Winner of the Password Hashing Competition (2015).
Most secure modern algorithm.

**Pros:**

- Memory-hard algorithm (resistant to GPU/ASIC attacks)
- Configurable memory, time, and parallelism
- Best choice for high-security applications
- Recommended by OWASP

**Cons:**

- Newer (less battle-tested than bcrypt)
- Requires native bindings (harder in Docker)
- Slightly more complex configuration

### scrypt

Designed to be memory-hard and ASIC-resistant.

**Pros:**

- Memory-hard like argon2
- Good security properties
- Used by major platforms (Tarsnap, cryptocurrencies)

**Cons:**

- Less popular than bcrypt/argon2
- Configuration more complex
- Requires native bindings

### PBKDF2

NIST-approved standard, widely used in enterprise.

**Pros:**

- NIST/FIPS approved
- Very widely supported
- Simple to implement
- Good for compliance requirements

**Cons:**

- Not memory-hard (vulnerable to GPU attacks)
- Requires high iteration count (100,000+)
- Manual salt management
- Slower than modern alternatives for same security

## Our choice

We chose **bcrypt (bcryptjs)** for AREA because:

- **Maturity**: 25+ years of proven security in production
- **Simplicity**: Automatic salt generation, single cost factor
- **Ecosystem**: Excellent Node.js support with pure JS implementation
- **Docker-friendly**: No native dependencies with bcryptjs
- **Balance**: Good security/performance trade-off for a web application
- **Standard**: Expected by developers, well-documented

**Configuration used:**
- 10 rounds (2^10 = 1,024 iterations)
- Provides ~100ms hash time (good UX, secure enough)
- Automatic salt generation per password

**Future consideration**: Migrate to argon2 if high-security requirements emerge, but bcrypt is perfectly adequate for this application's threat model.