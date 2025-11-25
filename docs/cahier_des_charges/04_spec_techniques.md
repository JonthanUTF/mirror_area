# 4. Spécifications techniques

## 4.1 API REST
Le serveur expose des endpoints pour :
- Authentification
- Utilisateurs
- Services
- Actions & Reactions
- AREA
- Hooks
- about.json

## 4.2 Format about.json
Obligatoire sur `/about.json` :

- client.host
- server.current_time (UNIX)
- server.services[].name
- actions[]
- reactions[]

## 4.3 Sécurité
- Hashage mots de passe (bcrypt/argon2)
- JWT recommandé
- Tokens OAuth2 stockés chiffrés
- Rate limiting

## 4.4 Logs
- Log des hooks exécutés
- Log des erreurs API
- Log des authentifications
