# Application Mobile - Vue d'ensemble

Documentation de l'application mobile AREA développée avec React Native et Expo.

## Structure du Projet

```
client-mobile/
├── App.tsx                   # Point d'entrée de l'application
├── src/
│   ├── api/
│   │   └── client.ts         # Client HTTP pour l'API
│   ├── components/
│   │   ├── AreaCard.tsx      # Carte d'affichage d'une AREA
│   │   └── ServiceCard.tsx   # Carte d'affichage d'un service
│   ├── navigation/
│   │   └── AppNavigator.tsx  # Configuration de la navigation
│   └── screens/
│       ├── LoginScreen.tsx       # Écran de connexion
│       ├── RegisterScreen.tsx    # Écran d'inscription
│       ├── DashboardScreen.tsx   # Dashboard principal
│       ├── AreasScreen.tsx       # Liste des AREAs
│       ├── CreateAreaScreen.tsx  # Création d'AREA
│       ├── ServicesScreen.tsx    # Gestion des services
│       └── ProfileScreen.tsx     # Profil utilisateur
├── app.json                  # Configuration Expo
├── babel.config.js           # Configuration Babel
├── metro.config.js           # Configuration Metro bundler
├── tsconfig.json             # Configuration TypeScript
├── package.json
└── Dockerfile
```

## Démarrage

### Prérequis

- Node.js 18+
- Expo CLI : `npm install -g expo-cli`
- Application Expo Go sur votre téléphone (iOS/Android)

### Installation

```bash
cd client-mobile
npm install
```

### Lancement

```bash
npx expo start
```

Options de lancement :

- Appuyez sur `a` pour ouvrir sur Android
- Appuyez sur `i` pour ouvrir sur iOS
- Scannez le QR code avec Expo Go

## Configuration

### app.json

```json
{
  "expo": {
    "name": "AREA",
    "slug": "area",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### Client API

Le fichier `client.ts` configure les appels vers le backend :

```typescript
const API_URL = 'http://localhost:8080';

export const api = {
  async get(endpoint: string, token?: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });
    return response.json();
  },
  
  async post(endpoint: string, data: any, token?: string) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
```

## Navigation

L'application utilise React Navigation avec une structure en onglets :

```typescript
const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Areas" component={AreasScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## Écrans

### LoginScreen

- Formulaire email/mot de passe
- Bouton de connexion Google
- Lien vers l'inscription

### DashboardScreen

- Résumé des AREAs actives
- Accès rapide aux fonctionnalités
- Notifications récentes

### AreasScreen

- Liste des AREAs de l'utilisateur
- Filtres (actives/inactives)
- Actions (modifier, supprimer)

### CreateAreaScreen

Assistant de création en plusieurs étapes :

1. Choix du service trigger
2. Configuration du trigger
3. Choix du service réaction
4. Configuration de la réaction
5. Confirmation

### ServicesScreen

- Liste des services disponibles
- État de connexion de chaque service
- Boutons de connexion/déconnexion OAuth

### ProfileScreen

- Informations de l'utilisateur
- Déconnexion
- Paramètres de l'application

## Composants

### AreaCard

```typescript
interface AreaCardProps {
  area: Area;
  onPress: () => void;
  onToggle: (isActive: boolean) => void;
}

function AreaCard({ area, onPress, onToggle }: AreaCardProps) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <Text style={styles.title}>{area.name}</Text>
        <Text>{area.actionService} → {area.reactionService}</Text>
        <Switch value={area.isActive} onValueChange={onToggle} />
      </View>
    </TouchableOpacity>
  );
}
```

### ServiceCard

```typescript
interface ServiceCardProps {
  service: Service;
  isConnected: boolean;
  onConnect: () => void;
}

function ServiceCard({ service, isConnected, onConnect }: ServiceCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: service.icon }} style={styles.icon} />
      <Text>{service.name}</Text>
      <Button
        title={isConnected ? 'Connecté' : 'Connecter'}
        onPress={onConnect}
        disabled={isConnected}
      />
    </View>
  );
}
```

## Stockage local

Le token JWT est stocké avec AsyncStorage :

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sauvegarder le token
await AsyncStorage.setItem('token', token);

// Récupérer le token
const token = await AsyncStorage.getItem('token');

// Supprimer le token (déconnexion)
await AsyncStorage.removeItem('token');
```

## Build

### APK Android

```bash
npx expo build:android
```

### IPA iOS

```bash
npx expo build:ios
```

### EAS Build

```bash
npx eas build --platform android
npx eas build --platform ios
```
