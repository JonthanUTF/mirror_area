# Frontend Web - Vue d'ensemble

Documentation du client web AREA développé avec React et Vite.

## Structure du Projet

```
front-web/
├── src/
│   ├── main.jsx           # Point d'entrée React
│   ├── App.jsx            # Composant racine avec routing
│   ├── App.css            # Styles globaux
│   ├── index.css          # Styles de base
│   ├── components/
│   │   └── Sidebar.jsx    # Barre de navigation latérale
│   └── pages/
│       ├── Login.jsx              # Page de connexion
│       ├── Signup.jsx             # Page d'inscription
│       ├── Home.jsx               # Dashboard principal
│       ├── Settings.jsx           # Paramètres utilisateur
│       ├── AdminPage.jsx          # Administration
│       ├── AuthCallback.jsx       # Callback OAuth
│       ├── ServiceCallback.jsx    # Callback services
│       ├── servicesCallback.jsx   # Gestion connexion services
│       ├── MobileAPK.jsx          # Téléchargement APK
│       └── workflowCreation/      # Création d'AREAs
├── public/                # Assets statiques
├── index.html             # Template HTML
├── vite.config.js         # Configuration Vite
├── package.json
├── Dockerfile
└── nginx.conf             # Configuration Nginx (production)
```

## Démarrage

### Installation

```bash
cd front-web
npm install
```

### Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173` (ou le port indiqué).

### Production

```bash
npm run build
npm run preview
```

## Configuration

Le fichier `vite.config.js` configure :

- Proxy vers l'API backend
- Port de développement
- Alias d'import

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

## Pages principales

### Login / Signup

Authentification par email/mot de passe ou OAuth Google.

- Formulaires de connexion/inscription
- Boutons OAuth
- Redirection vers le dashboard après connexion

### Home (Dashboard)

Vue d'ensemble de l'utilisateur :

- Liste des AREAs actives
- Statistiques rapides
- Raccourcis vers les actions communes

### Settings

Gestion du profil et des services connectés :

- Modification du profil
- Connexion/déconnexion des services OAuth
- Statut des connexions

### Création d'AREA

Assistant de création d'automatisation :

1. Sélection du service d'action
2. Configuration du trigger
3. Sélection du service de réaction
4. Configuration de la réaction
5. Nommage et activation

## Composants

### Sidebar

Navigation principale avec liens vers :

- Dashboard
- Mes AREAs
- Créer une AREA
- Services
- Paramètres

### AreaCard

Affichage d'une AREA avec :

- Nom et description
- Services utilisés
- État (actif/inactif)
- Actions (modifier, supprimer, activer/désactiver)

## Authentification

Le token JWT est stocké dans `localStorage` et envoyé dans les headers :

```javascript
const token = localStorage.getItem('token');

fetch('/api/areas', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Appels API

Exemple d'appel pour récupérer les AREAs :

```javascript
const fetchAreas = async () => {
  const response = await fetch('/api/areas', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  setAreas(data);
};
```

## Styles

Le projet utilise CSS standard avec :

- Variables CSS pour les couleurs
- Flexbox et Grid pour le layout
- Media queries pour le responsive
