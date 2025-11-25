# 2. Architecture globale

## 2.1 Vue d'ensemble
L’architecture est divisée en trois composants principaux :

- **Application Server**
  - Logique métier
  - Gestion des utilisateurs, services, actions, AREA
  - Hooks
  - Base de données
  - Expose `about.json`
  
- **Client Web**
  - Interface seulement
  - Interaction exclusive avec l’API REST

- **Client Mobile**
  - Interface uniquement
  - Génération automatique de l’APK

## 2.2 Diagramme architecture (UML)
```plantuml
@startuml
actor User

User --> WebClient : utilise
User --> MobileClient : utilise

WebClient --> Server : API REST
MobileClient --> Server : API REST

Server --> Database : stocke / lit\n(utilisateurs, services, AREA)
@enduml
