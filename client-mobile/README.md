# AREA - Client Mobile (Auth + Dashboard Module)

Application mobile Android native en Kotlin avec Jetpack Compose pour la plateforme d'automatisation AREA.

## 📱 Issue actuelle: `pages-mobile--dashboard`

Ce module implémente le flow complet d'authentification ET l'interface dashboard principale de l'application mobile.

## ✅ Fonctionnalités implémentées

### Écrans d'authentification (Issue précédente)
- ✅ **Splash Screen** - Écran de démarrage avec animation
- ✅ **Onboarding** - Présentation de l'app (3 pages)
- ✅ **Login** - Connexion avec email/password
- ✅ **Register** - Inscription avec validation
- ✅ **Email Verification** - Vérification d'email

### Écrans Dashboard (Issue actuelle)
- ✅ **Dashboard** - Vue d'ensemble avec statistiques
- ✅ **Profile** - Profil utilisateur avec informations
- ✅ **Settings** - Paramètres de l'application

### Navigation
- ✅ **Bottom Navigation Bar** - Navigation entre Dashboard, Profile, Settings
- ✅ **Top App Bar** - Barre supérieure avec logo et logout
- ✅ **MainScaffold** - Structure de navigation réutilisable

## 🛠️ Technologies

- **Langage**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM
- **Dependency Injection**: Hilt/Dagger
- **Navigation**: Navigation Compose
- **Async**: Kotlin Coroutines & Flow
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## 📦 Structure du projet

```
app/src/main/java/com/area/mobile/
├── data/
│   ├── model/
│   │   └── User.kt                  # Modèle utilisateur
│   └── repository/
│       └── MockRepository.kt        # Mock auth
├── di/
│   └── AppModule.kt                 # Module Hilt
├── ui/
│   ├── navigation/
│   │   └── MainScaffold.kt         # ✅ Scaffold avec Bottom Nav + Top Bar
│   ├── screen/
│   │   ├── SplashScreen.kt         # ✅ Auth
│   │   ├── OnboardingScreen.kt     # ✅ Auth
│   │   ├── LoginScreen.kt          # ✅ Auth
│   │   ├── RegisterScreen.kt       # ✅ Auth
│   │   ├── EmailVerificationScreen.kt # ✅ Auth
│   │   ├── DashboardScreen.kt      # ✅ Dashboard
│   │   ├── ProfileScreen.kt        # ✅ Dashboard
│   │   └── SettingsScreen.kt       # ✅ Dashboard
│   ├── theme/
│   │   ├── Color.kt                # Couleurs du thème
│   │   ├── Theme.kt                # Configuration thème
│   │   └── Type.kt                 # Typography
│   └── viewmodel/
│       ├── AuthViewModel.kt        # ViewModel auth
│       └── DashboardViewModel.kt   # ViewModel dashboard
├── AreaApplication.kt              # Application class
└── MainActivity.kt                 # Navigation auth + dashboard
```

## 🔧 Installation & Build

### Prérequis
- Android Studio Hedgehog ou supérieur
- JDK 17
- Device Android ou Émulateur avec API 24+

### Build & Run

```bash
# Depuis le dossier client-mobile
./gradlew assembleDebug

# Installer sur device connecté
./gradlew installDebug

# Via Android Studio: Run > Run 'app'
```

### Build Docker

```bash
# Build l'image
docker build -t area-mobile .

# Générer l'APK
docker run -v $(pwd)/app/build:/app/app/build area-mobile ./gradlew assembleRelease
```

L'APK sera dans `app/build/outputs/apk/`.

## 🎯 Flow de l'application

```
Splash (2s)
    ├─> Onboarding (si première utilisation)
    │       └─> Login
    └─> Login (si déjà utilisé)
            ├─> Register → Email Verification → Login
            └─> Dashboard (après login réussi)
                    ├─> Profile (bottom nav)
                    ├─> Settings (bottom nav)
                    └─> Logout → Login
```

## 🎨 Design

### Navigation
- **Bottom Navigation Bar** : 3 onglets (Dashboard, Profile, Settings)
- **Top App Bar** : Logo AREA + Bouton Logout
- **Drawer Menu** : Non implémenté dans cette issue (préparé pour évolution future)

### Écrans Dashboard

#### Dashboard Screen
- Vue d'ensemble des automatisations
- Statistiques (nombre d'AREAs, exécutions, etc.)
- Liste des AREAs actifs
- FAB pour créer une nouvelle AREA (préparé pour issue suivante)

#### Profile Screen
- Avatar utilisateur
- Informations du compte (nom, email)
- Date d'inscription
- Bouton logout

#### Settings Screen
- Paramètres de l'application
- Préférences utilisateur
- Gestion du compte

## 🔗 Navigation principale

Le `MainScaffold` fournit une structure cohérente avec:
- Top bar personnalisable
- Bottom navigation bar
- Support pour FAB (Floating Action Button)
- Gestion automatique du padding

## 📝 Prochaines issues

Les fonctionnalités suivantes seront implémentées dans les issues à venir:

- [ ] **Services Management** - Connexion et gestion des services (Gmail, GitHub, etc.)
- [ ] **AREA Builder** - Création et édition d'automatisations
- [ ] **Activity Log** - Historique détaillé des exécutions
- [ ] **Notifications** - Alertes et notifications push

## 🐛 État actuel

### ✅ Fonctionnel
- Tous les écrans d'auth
- Navigation complète auth → dashboard
- Bottom navigation entre les 3 écrans dashboard
- Logout depuis n'importe quel écran dashboard
- Design cohérent Material 3

### ⚠️ En développement (mocked)
- AuthViewModel simule l'authentification
- DashboardViewModel affiche des données mockées
- Statistiques générées aléatoirement
- Liste d'AREAs simulée

### 📌 Non implémenté (issues futures)
- Drawer menu latéral (préparé mais pas activé)
- Connexion réelle à l'API backend
- Gestion réelle des services
- Création/édition d'AREAs

## 🤝 Contribution

Voir HOWTOCONTRIBUTE.md à la racine du projet.
