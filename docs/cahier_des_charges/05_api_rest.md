# 5. API REST

## 5.1 Auth (`/auth`)
### POST /auth/register
Création de compte (email/password).
### POST /auth/login
Connexion (retourne un JWT).
### GET /auth/google
Initiation OAuth2 Google.
### GET /auth/me
Récupère l'utilisateur courant.

## 5.2 Users (`/users`)
### GET /users/:id
Récupère le profil d'un utilisateur.
### PUT /users/:id
Met à jour le profil (nom, mot de passe).
### DELETE /users/:id
Supprime le compte.

## 5.3 AREA (`/areas`)
### GET /areas
Liste les AREA de l'utilisateur.
### GET /areas/:id
Détails d'une AREA spécifique.
### POST /areas
Création d'une AREA (Action + Réaction + Paramètres).
### PUT /areas/:id
Modification d'une AREA.
### DELETE /areas/:id
Suppression d'une AREA.

## 5.4 Services (`/services`)
### GET /services
Liste les services connectés par l'utilisateur (avec date d'expiration).
### GET /services/:serviceName/connect
Initie la connexion OAuth2 pour un service donné (ex: `google`). Retourne l'URL d'autorisation.
### POST /services/:serviceName/callback
Finalise la connexion OAuth2 (échange du code contre tokens) et sauvegarde les identifiants.
### DELETE /services/:serviceName
Déconnecte un service (supprime les tokens).

## 5.4 about.json
### GET /about.json
