# 6. Base de données

## 6.1 Modèle conceptuel (UML)

```plantuml
@startuml
entity User {
  id: UUID
  email: string
  password: string (hash)
  googleId: string
  name: string
}

entity Service {
  id: UUID
  name: string (unique)
  label: string
  icon: string
  active: boolean
}

entity UserService {
  id: UUID
  userId: UUID
  serviceId: UUID
  accessToken: text
  refreshToken: text
  expiresAt: Date
  profileId: string
  username: string
}

entity Area {
  id: UUID
  user_id: UUID
  name: string
  
  actionService: string
  actionType: string
  
  reactionService: string
  reactionType: string
  
  parameters: JSONB
  active: boolean
  lastTriggered: Date
}

User ||--o{ Area : has
User ||--o{ UserService : connects
Service ||--o{ UserService : provider
@enduml
