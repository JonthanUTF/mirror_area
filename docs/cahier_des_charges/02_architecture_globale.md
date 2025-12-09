# 2. Architecture globale

## 2.1 Vue d'ensemble
L’architecture est divisée en trois composants principaux :

- **Application Server (Backend)**
  - **Runtime**: Node.js / Express
  - **Architecture**: Service Repository Pattern (Modular Registry)
  - **Services**: Gestion dynamique via `ServiceRegistry`
  - **BDD**: PostgreSQL (Sequelize ORM)
  - Expose `about.json` et API REST

- **Client Web**
  - Vue.js / React (à définir)
  - Interface utilisateur responsive

- **Client Mobile**
  - React Native / Flutter (à définir)
  - Génération d'APK

## 2.2 Diagramme architecture (UML)
```plantuml
@startuml
node "Docker Host" {
  component "Reverse Proxy (Nginx)" as Proxy
  component "Backend API" as Server
  database "PostgreSQL" as DB
  database "Redis" as Cache
}

actor User
User --> Proxy : HTTP/HTTPS

Proxy --> Server : Port 8080
Server --> DB : Port 5432
Server --> Cache : Port 6379

note right of Server
  **Service Registry**
  - Weather
  - Timer
  - Email
  - Console
end note
@enduml
