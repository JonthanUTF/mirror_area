# 6. Base de données

## 6.1 Modèle conceptuel (UML)

```plantuml
@startuml
entity User {
  id: UUID
  email: string
  password: hash
}

entity Service {
  id: UUID
  name: string
}

entity UserService {
  user_id
  service_id
  oauth_token
}

entity Area {
  id: UUID
  user_id
  action_id
}

entity Reaction {
  id: UUID
  area_id
  type
}

User ||--o{ UserService
User ||--o{ Area
Area ||--o{ Reaction
@enduml
