# AREA - Client Mobile

Application mobile Android native en Kotlin pour la plateforme d'automatisation AREA.

## 🚀 Technologies choisies

- **Langage**: Kotlin
- **SDK**: Android SDK 33
- **Build System**: Gradle (Kotlin DSL)
- **Architecture**: MVVM (à implémenter)
- **UI**: XML layouts (base), migration vers Jetpack Compose prévue

## 📦 Structure du projet

```
client-mobile/
├── build.gradle.kts           # Configuration Gradle du projet
├── settings.gradle.kts         # Settings Gradle
├── gradle.properties           # Propriétés Gradle
├── gradlew                     # Gradle wrapper (Unix)
├── Dockerfile                  # Build Docker pour génération APK
├── app/
│   ├── build.gradle.kts       # Configuration Gradle du module app
│   ├── proguard-rules.pro     # Règles ProGuard
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           ├── java/com/area/mobile/
│           │   ├── MainActivity.kt       # Activity principale
│           │   └── AreaApplication.kt    # Application class
│           └── res/
│               ├── layout/
│               │   └── activity_main.xml # Layout de base
│               ├── values/               # Ressources (strings, colors)
│               ├── drawable/             # Drawables
│               └── mipmap-*/            # Icônes de launcher
└── gradle/
    └── wrapper/                # Gradle wrapper files
```

## 🔧 Installation & Développement

### Prérequis
- JDK 17+
- Android SDK 33
- Android Studio (recommandé) ou IntelliJ IDEA

### Build local

```bash
# Depuis le dossier client-mobile

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Installer sur device/émulateur connecté
./gradlew installDebug
```

Les APK générés se trouvent dans :
- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release.apk`

## 🐳 Build Docker

Le Dockerfile permet de générer un APK dans un environnement isolé:

```bash
# Build de l'image Docker
docker build -t area-mobile .

# Générer l'APK debug
docker run -v $(pwd)/app/build:/app/app/build area-mobile ./gradlew assembleDebug

# Générer l'APK release
docker run -v $(pwd)/app/build:/app/app/build area-mobile ./gradlew assembleRelease
```

L'APK généré sera disponible dans `app/build/outputs/apk/`.

## 📱 Configuration Android

- **Package**: `com.area.mobile`
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 33 (Android 13)
- **Compile SDK**: 33

### Permissions déclarées
- `INTERNET` - Accès réseau pour l'API
- `ACCESS_NETWORK_STATE` - Vérifier la connectivité

## 🔗 Volume partagé

Les builds APK peuvent être partagés avec `client-web` via un volume Docker commun défini dans `docker-compose.yml`.

Exemple de configuration docker-compose:
```yaml
volumes:
  mobile-builds:
    driver: local

services:
  mobile:
    build: ./client-mobile
    volumes:
      - mobile-builds:/app/app/build/outputs/apk
  
  web:
    volumes:
      - mobile-builds:/app/public/downloads
```

## 📝 Prochaines étapes

### Fonctionnalités à implémenter
- [ ] Authentification (Login/Register)
- [ ] Dashboard avec statistiques
- [ ] Gestion des AREAs (Actions-REActions)
- [ ] Liste des services disponibles
- [ ] Journal d'activité
- [ ] Paramètres utilisateur

### Améliorations techniques
- [ ] Migration vers Jetpack Compose pour l'UI
- [ ] Implémenter l'architecture MVVM
- [ ] Ajouter Retrofit pour les appels API
- [ ] Intégrer Hilt/Dagger pour l'injection de dépendances
- [ ] Ajouter les tests unitaires et d'intégration
- [ ] Configurer CI/CD pour les builds automatiques

## 🛠️ Dépendances principales

Actuellement minimales pour le setup de base. À ajouter progressivement :
- **Networking**: Retrofit, OkHttp
- **DI**: Hilt/Dagger
- **UI**: Jetpack Compose, Material 3
- **Async**: Coroutines, Flow
- **Navigation**: Navigation Component

## 📚 Ressources

- [Documentation Android](https://developer.android.com/docs)
- [Guide Kotlin](https://kotlinlang.org/docs/home.html)
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Architecture MVVM](https://developer.android.com/topic/architecture)
