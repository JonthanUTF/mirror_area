# AREA Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AREA Backend System                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Client     │      │   Mobile     │                     │
│  │   Web App    │◄────►│     App      │                     │
│  └──────────────┘      └──────────────┘                     │
│         │                      │                             │
│         └──────────┬───────────┘                             │
│                    │                                         │
│                    ▼                                         │
│         ┌─────────────────────┐                             │
│         │   Express Server    │                             │
│         │   (Port 8080)       │                             │
│         └─────────────────────┘                             │
│                    │                                         │
│         ┌──────────┼──────────┐                             │
│         │          │          │                             │
│         ▼          ▼          ▼                             │
│    ┌────────┐ ┌────────┐ ┌──────────┐                      │
│    │  Auth  │ │ Areas  │ │  About   │                      │
│    │ Routes │ │ Routes │ │ Service  │                      │
│    └────────┘ └────────┘ └──────────┘                      │
│         │          │                                         │
│         └──────────┼──────────────┐                         │
│                    │              │                         │
│                    ▼              ▼                         │
│         ┌─────────────────┐ ┌──────────────┐               │
│         │   PostgreSQL    │ │  Automation  │               │
│         │   Database      │ │    Engine    │               │
│         └─────────────────┘ └──────────────┘               │
│                                     │                        │
│                                     ▼                        │
│                            ┌─────────────────┐              │
│                            │  External APIs  │              │
│                            │  (Open-Meteo)   │              │
│                            └─────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### 1. Authentication Flow
```
User Request
    │
    ├──► POST /auth/register
    │       │
    │       ├─► Validate input
    │       ├─► Hash password (bcrypt)
    │       ├─► Create user in DB
    │       └─► Return JWT token
    │
    ├──► POST /auth/login
    │       │
    │       ├─► Find user by email
    │       ├─► Verify password
    │       └─► Generate JWT token
    │
    └──► GET /auth/google
            │
            ├─► Redirect to Google OAuth
            ├─► Google authentication
            ├─► Create/Find user
            └─► Return JWT token
```

### 2. AREA Creation Flow
```
User Request (with JWT)
    │
    ▼
POST /areas
    │
    ├─► Authenticate JWT token
    │       │
    │       └─► Extract user ID
    │
    ├─► Validate area data
    │       │
    │       ├─► actionService
    │       ├─► actionType
    │       ├─► reactionService
    │       ├─► reactionType
    │       └─► parameters
    │
    ├─► Create Area in database
    │       │
    │       └─► Link to user ID
    │
    └─► Return created area
```

### 3. Automation Engine Flow
```
Every 10 seconds
    │
    ▼
Automation Loop
    │
    ├─► Query active areas from DB
    │
    ├─► For each area:
    │   │
    │   ├─► Check Action Condition
    │   │   │
    │   │   ├─► weather/check_temp
    │   │   │       │
    │   │   │       └─► Call Open-Meteo API
    │   │   │           └─► Compare temperature
    │   │   │
    │   │   ├─► weather/check_conditions
    │   │   │       │
    │   │   │       └─► Check weather codes
    │   │   │
    │   │   └─► timer/interval
    │   │           │
    │   │           └─► Check time elapsed
    │   │
    │   └─► If condition met:
    │       │
    │       ├─► Execute Reaction
    │       │   │
    │       │   ├─► console/log_message
    │       │   │       └─► Log to console
    │       │   │
    │       │   └─► email/send_email
    │       │           └─► Log email details
    │       │
    │       └─► Update lastTriggered timestamp
    │
    └─► Wait 10 seconds and repeat
```

## Database Schema

```sql
┌─────────────────────────┐
│        Users            │
├─────────────────────────┤
│ id (UUID, PK)          │
│ email (VARCHAR)        │
│ password (VARCHAR)     │
│ googleId (VARCHAR)     │
│ name (VARCHAR)         │
│ createdAt (TIMESTAMP)  │
│ updatedAt (TIMESTAMP)  │
└─────────────────────────┘
            │
            │ 1:N
            │
            ▼
┌─────────────────────────┐
│         Areas           │
├─────────────────────────┤
│ id (UUID, PK)          │
│ userId (UUID, FK)      │
│ name (VARCHAR)         │
│ actionService (VARCHAR)│
│ actionType (VARCHAR)   │
│ reactionService (VARCHAR)│
│ reactionType (VARCHAR) │
│ parameters (JSONB)     │
│ active (BOOLEAN)       │
│ lastTriggered (DATE)   │
│ createdAt (TIMESTAMP)  │
│ updatedAt (TIMESTAMP)  │
└─────────────────────────┘
```

## API Endpoints Map

```
GET /
    └─► API information

GET /about.json
    └─► Service metadata (AREA spec)

POST /auth/register
    └─► Create new user account

POST /auth/login
    └─► Login and get JWT token

GET /auth/google
    └─► Initialize Google OAuth

GET /auth/google/callback
    └─► Handle Google OAuth callback

GET /auth/me [Protected]
    └─► Get current user info

GET /areas [Protected]
    └─► List user's areas

GET /areas/:id [Protected]
    └─► Get specific area

POST /areas [Protected]
    └─► Create new area

PUT /areas/:id [Protected]
    └─► Update area

DELETE /areas/:id [Protected]
    └─► Delete area
```

## Service Integration

```
┌─────────────────────────────────────────────────┐
│            Available Services                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  Weather Service (Open-Meteo API)               │
│  ├─► Actions:                                   │
│  │   ├─► check_temp                             │
│  │   └─► check_conditions                       │
│  └─► Reactions: None                            │
│                                                  │
│  Timer Service                                   │
│  ├─► Actions:                                   │
│  │   ├─► interval                               │
│  │   └─► schedule                               │
│  └─► Reactions: None                            │
│                                                  │
│  Console Service                                 │
│  ├─► Actions: None                              │
│  └─► Reactions:                                 │
│      └─► log_message                            │
│                                                  │
│  Email Service                                   │
│  ├─► Actions: None                              │
│  └─► Reactions:                                 │
│      └─► send_email                             │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────┐
│      Application Layer              │
│  ┌───────────────────────────────┐  │
│  │   Node.js 18 + Express.js     │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
            │
┌─────────────────────────────────────┐
│      Business Logic Layer           │
│  ┌───────────────────────────────┐  │
│  │  • Auth Service (Passport.js) │  │
│  │  • Area Service               │  │
│  │  • Automation Engine          │  │
│  │  • About Service              │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
            │
┌─────────────────────────────────────┐
│      Data Access Layer              │
│  ┌───────────────────────────────┐  │
│  │   Sequelize ORM               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
            │
┌─────────────────────────────────────┐
│      Database Layer                 │
│  ┌───────────────────────────────┐  │
│  │   PostgreSQL 15               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Docker Architecture

```
┌─────────────────────────────────────────────┐
│         Docker Compose Network              │
│          (area_network)                     │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │     Container: area_server         │    │
│  │     Image: Custom (Node 18)        │    │
│  │     Ports: 8080:8080              │    │
│  │     Depends: area_postgres        │    │
│  └────────────────────────────────────┘    │
│                  │                          │
│                  │                          │
│  ┌────────────────────────────────────┐    │
│  │     Container: area_postgres       │    │
│  │     Image: postgres:15-alpine      │    │
│  │     Ports: 5432:5432              │    │
│  │     Volume: postgres_data         │    │
│  └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

## Security Features

```
┌─────────────────────────────────────┐
│      Security Layers                │
├─────────────────────────────────────┤
│                                     │
│  Authentication                     │
│  ├─► JWT Token (7 day expiry)      │
│  ├─► OAuth 2.0 (Google)            │
│  └─► Password hashing (bcrypt)     │
│                                     │
│  Authorization                      │
│  ├─► JWT verification middleware   │
│  └─► User-specific data access     │
│                                     │
│  Data Protection                    │
│  ├─► Sequelize ORM (SQL injection) │
│  ├─► Environment variables         │
│  └─► CORS configuration            │
│                                     │
└─────────────────────────────────────┘
```
