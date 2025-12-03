# AREA - Client Mobile (Auth Module)

Application mobile Android native en Kotlin avec Jetpack Compose pour la plateforme d'automatisation AREA.

## 📱 Issue actuelle: `pages-mobile--auth`

Ce module implémente le flow complet d'authentification de l'application mobile.

## ✅ Fonctionnalités implémentées

### Écrans d'authentification
- ✅ **Splash Screen** - Écran de démarrage avec animation
- ✅ **Onboarding** - Présentation de l'app pour les nouveaux utilisateurs (3 pages)
- ✅ **Login** - Connexion avec email/password et OAuth (Google, GitHub)
- ✅ **Register** - Inscription avec validation de mot de passe
- ✅ **Email Verification** - Vérification d'email avec resend
- ✅ **OAuth Deep Links** - Support des deep links pour OAuth (préparé)

### Composants techniques
- ✅ `AuthViewModel` - Gestion de l'état d'authentification
- ✅ `User` model - Modèle de données utilisateur
- ✅ Navigation entre écrans auth avec Jetpack Compose Navigation
- ✅ UI cohérente avec Material Design 3
- ✅ Thème personnalisé (Purple/Slate)

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
│   └── model/
│       └── User.kt              # Modèle utilisateur
├── di/
│   └── AppModule.kt             # Module Hilt
├── ui/
│   ├── screen/
│   │   ├── SplashScreen.kt      # ✅ Splash avec animation
│   │   ├── OnboardingScreen.kt  # ✅ Onboarding 3 pages
│   │   ├── LoginScreen.kt       # ✅ Login + OAuth
│   │   ├── RegisterScreen.kt    # ✅ Register
│   │   └── EmailVerificationScreen.kt # ✅ Email verification
│   ├── theme/
│   │   ├── Color.kt             # Couleurs du thème
│   │   ├── Theme.kt             # Configuration thème
│   │   └── Type.kt              # Typography
│   └── viewmodel/
│       └── AuthViewModel.kt     # ViewModel auth
├── AreaApplication.kt           # Application class
└── MainActivity.kt              # Navigation principale
```

## 🔧 Installation & Build

### Prérequis
- Android Studio Hedgehog ou supérieur
- JDK 17
- Device Android ou Émulateur avec API 24+
- Docker (optionnel, pour build APK)

### Build local

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

## 🎯 Flow d'authentification

```
Splash (2s)
    ├─> Onboarding (si première utilisation)
    │       └─> Login
    └─> Login (si déjà utilisé)
            ├─> Dashboard (après login réussi) [À implémenter]
            └─> Register
                    └─> Email Verification
                            └─> Login
```

## 🎨 Design

L'application utilise un design system cohérent:
- **Couleurs**: Purple Primary (#8B5CF6), Slate backgrounds
- **Components**: Material 3 (Buttons, TextFields, Cards)
- **Animations**: Transitions fluides entre écrans
- **Dark mode**: Theme sombre par défaut

## 🔗 OAuth & Deep Links

### Configuration OAuth (à compléter)

Les boutons OAuth sont préparés pour:
- **Google OAuth** - Via Google Sign-In SDK
- **GitHub OAuth** - Via OAuth2 flow

Les deep links permettront de revenir à l'app après l'authentification OAuth.

Configuration dans `AndroidManifest.xml`:
```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="area" android:host="oauth" />
</intent-filter>
```

## 📝 Prochaines issues

Les écrans suivants seront implémentés dans les issues à venir:

- [ ] **Dashboard** - Vue d'ensemble des AREAs
- [ ] **Services** - Liste des services connectables  
- [ ] **Areas Management** - Création et gestion des AREAs
- [ ] **Settings** - Paramètres et profil
- [ ] **Activity Log** - Historique des exécutions

## 🐛 État actuel

- ✅ Tous les écrans d'auth sont implémentés
- ✅ Navigation entre écrans fonctionne
- ⚠️ AuthViewModel simule l'authentification (pas encore connecté à l'API)
- ⚠️ OAuth buttons préparés mais non fonctionnels (nécessite configuration SDK)
- ⚠️ Email verification simule l'envoi (pas de vrai email)

## 🤝 Contribution

Voir HOWTOCONTRIBUTE.md à la racine du projet.
