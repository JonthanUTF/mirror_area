# 1. Contexte & Objectifs

## 1.1 Contexte du projet
AREA est une plateforme permettant d’automatiser des tâches entre différents services externes (Google, Github, Outlook, Dropbox…).  
Elle fonctionne sur le principe :

> **Si** un événement (Action) se produit  
> **Alors** exécuter automatiquement une tâche (REAction).

Le projet impose trois composants :
- un serveur REST (port 8080),
- un client web (port 8081),
- un client mobile (APK produite via Docker).

## 1.2 Objectifs principaux
- Reproduire une base fonctionnelle type IFTTT/Zapier
- Intégrer plusieurs services externes via OAuth2
- Permettre la création d’AREA par les utilisateurs
- Fournir une documentation claire et modulaire
- Assurer une architecture propre et extensible

## 1.3 Contraintes
- Docker Compose obligatoire
- Respect des normes d’accessibilité WCAG
- API REST unique
- Aucun traitement métier dans les clients
