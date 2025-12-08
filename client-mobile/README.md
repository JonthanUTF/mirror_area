# AREA - Android Application

Application mobile native Android en Kotlin avec Jetpack Compose pour la plateforme d'automatisation AREA.

## 🚀 Fonctionnalités

- ✅ Authentification (Login/Register)
- ✅ Dashboard avec statistiques
- ✅ Gestion des AREAs (Actions-REActions)
- ✅ Liste des services disponibles
- ✅ Journal d'activité
- ✅ Paramètres utilisateur
- ✅ Interface moderne avec Material Design 3
- ✅ Thème sombre

## 🛠️ Technologies

- **Langage**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM
- **Dependency Injection**: Hilt
- **Navigation**: Navigation Compose
- **Async**: Kotlin Coroutines & Flow
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## 📦 Structure du projet

```
app/src/main/java/com/area/mobile/
├── data/
│   ├── model/          # Modèles de données
│   └── repository/     # Repository avec données mockées
├── di/                 # Modules Hilt
├── ui/
│   ├── screen/         # Écrans Compose
│   ├── theme/          # Thème et couleurs
│   └── viewmodel/      # ViewModels
├── AreaApplication.kt
└── MainActivity.kt
```

## 🔧 Installation

### Prérequis
- Android Studio Hedgehog ou supérieur
- JDK 17
- Device Android ou Émulateur avec API 24+

### Build & Run

```bash
# Depuis le dossier client-mobile
./gradlew assembleDebug

# Pour installer directement sur device connecté
./gradlew installDebug

# Ou via Android Studio: Run > Run 'app'
```

## 📱 Écrans disponibles

1. **Login/Register** - Authentification avec OAuth et email
2. **Dashboard** - Vue d'ensemble des AREAs avec statistiques
3. **Services** - Liste des services connectables
4. **Activity** - Journal d'exécution des AREAs
5. **AREA Builder** - Création/Édition d'automatisations
6. **Settings** - Paramètres et profil utilisateur

## 🎨 Design

L'application suit le design system défini dans Figma_mobile avec:
- Palette de couleurs violette/slate
- Components Material 3
- Animations et transitions fluides
- Support du dark mode

## 🔌 API Backend

Actuellement l'application utilise des données mockées. Pour connecter à l'API réelle:

1. Créer un service Retrofit dans `data/remote/`
2. Implémenter les endpoints dans `data/remote/api/`
3. Modifier le `MockRepository` pour utiliser l'API

## 📝 Notes

- L'application est actuellement en mode de développement avec données mockées
- Tous les écrans sont fonctionnels et navigables
- L'authentification simule une connexion réussie
- Les statistiques et logs sont générés dynamiquement

## 🤝 Contribution

Voir HOWTOCONTRIBUTE.md à la racine du projet.
