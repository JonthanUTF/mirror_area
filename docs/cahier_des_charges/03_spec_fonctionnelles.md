# 3. Spécifications fonctionnelles

## 3.1 Gestion utilisateur
- Inscription (email, mot de passe)
- Confirmation de compte
- Connexion / déconnexion
- Auth via OAuth2

## 3.2 Services
L'utilisateur peut :
- Lier un service externe (OAuth2 si nécessaire)
- Voir les services connectés
- Déconnecter un service

## 3.3 Actions
Chaque service propose des conditions déclenchantes :
- Nouvel email reçu
- Nouveau tweet
- Fichier ajouté dans un drive
- Timer

## 3.4 Reactions
Chaque service propose des actions exécutables :
- Envoyer un message
- Ajouter un fichier
- Créer un événement calendrier

## 3.5 AREA
Un AREA = 1 Action + 1 ou plusieurs Reactions  
L'utilisateur peut :
- Créer un AREA
- Modifier un AREA
- Supprimer un AREA
- Activer / désactiver un AREA

## 3.6 Hooks
Le serveur doit :
- Vérifier les conditions des Actions
- Déclencher les Reactions associées
- Garantir qu’un événement ne se déclenche qu’une seule fois
