# 4. Spécifications techniques

## 4.1 Stack Technique
- **Backend**: Node.js 18+
- **Framework**: Express.js
- **Base de données**: PostgreSQL 15
- **ORM**: Sequelize
- **Cache/Queue**: Redis
- **Architecture**: Docker Compose

## 4.2 Architecture Modulaire
L'application utilise un **Service Registry** dynamique :
- `ServiceBase` : Classe parente pour tous les services
- `ServiceRegistry` : Singleton gérant le chargement des services
- `automation.js` : Boucle d'exécution agnostique (ne connait pas les services spécifiques)

## 4.3 API REST
Endpoints exposés :
- `/auth/` : Authentification (JWT, OAuth2)
- `/users/` : Gestion profil
- `/areas/` : CRUD des automatisations
- `/about.json` : Découverte des services

## 4.4 Sécurité
- **Authentification**: JWT (Header `Authorization: Bearer <token>`)
- **Mots de passe**: Hachage via `bcryptjs`
- **OAuth2**: Stratégie Passport.js (Google)
- **Protection**: 
  - CORS configuré
  - Environnement via `.env`


## 4.4 Logs
- Log des hooks exécutés
- Log des erreurs API
- Log des authentifications
