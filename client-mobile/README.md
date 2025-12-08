# AREA - Android Application

Native Android mobile application built with Kotlin and Jetpack Compose for the AREA automation platform.

## 🚀 Features

- ✅ Authentication (Login/Register)
- ✅ Dashboard with statistics
- ✅ AREA Management (Actions-REActions)
- ✅ Available services list
- ✅ Activity log
- ✅ User settings
- ✅ Modern interface with Material Design 3
- ✅ Dark theme

## 🛠️ Technologies

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM
- **Dependency Injection**: Hilt
- **Navigation**: Navigation Compose
- **Async**: Kotlin Coroutines & Flow
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## 📦 Project Structure

```
app/src/main/java/com/area/mobile/
├── data/
│   ├── model/          # Data models
│   └── repository/     # Repository with mocked data
├── di/                 # Hilt modules
├── ui/
│   ├── screen/         # Compose screens
│   ├── theme/          # Theme and colors
│   └── viewmodel/      # ViewModels
├── AreaApplication.kt
└── MainActivity.kt
```

## 🔧 Installation

### Prerequisites
- Android Studio Hedgehog or higher
- JDK 17
- Android device or Emulator with API 24+

### Build & Run

```bash
# From the client-mobile folder
./gradlew assembleDebug

# To install directly on connected device
./gradlew installDebug
```

## 📱 Available Screens

1. **Login/Register** - Authentication with OAuth and email
2. **Dashboard** - AREA overview with statistics
3. **Services** - List of connectable services
4. **Activity** - AREA execution log
5. **AREA Builder** - Create/Edit automations
6. **Settings** - Settings and user profile

## 🎨 Design

The application follows the design system defined in Figma_mobile with:
- Purple/slate color palette
- Material 3 components
- Smooth animations and transitions
- Dark mode support

## 🔌 Backend API

Currently the application uses mocked data. To connect to the real API:

1. Create a Retrofit service in `data/remote/`
2. Implement endpoints in `data/remote/api/`
3. Modify the `MockRepository` to use the API

## 📝 Notes

- The application is currently in development mode with mocked data
- All screens are functional and navigable
- Authentication simulates a successful login
- Statistics and logs are dynamically generated

## 🤝 Contributing

See HOWTOCONTRIBUTE.md at the project root.
