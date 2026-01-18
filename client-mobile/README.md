# AREA - Android Application

Native Android mobile application built with Kotlin and Jetpack Compose for the AREA automation platform.

## 🚀 Features

- ✅ **Authentication** - Login/Register with real backend integration
- ✅ **Dashboard** - Overview with real-time statistics from server
- ✅ **AREA Management** - Create, view, toggle, and delete automations
- ✅ **Services** - List available services from backend API
- ✅ **Modern UI** - Material Design 3 with smooth animations
- ✅ **Dark Theme** - Purple/slate color palette
- ✅ **Backend Integration** - Full REST API integration with token-based auth

## 🛠️ Technologies

- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM (Model-View-ViewModel)
- **Dependency Injection**: Hilt/Dagger
- **Navigation**: Navigation Compose
- **Networking**: Retrofit 2 + OkHttp
- **Async**: Kotlin Coroutines & Flow
- **Data Storage**: DataStore (for tokens)
- **Minimum SDK**: 24 (Android 7.0)
- **Target SDK**: 34 (Android 14)

## 📦 Project Structure

```
app/src/main/java/com/area/mobile/
├── data/
│   ├── local/
│   │   └── TokenManager.kt         # Secure token storage
│   ├── model/
│   │   ├── User.kt                 # Domain models
│   │   ├── Area.kt
│   │   ├── Service.kt
│   │   └── dto/                    # API DTOs
│   ├── remote/
│   │   ├── AuthApiService.kt       # API interfaces
│   │   ├── AreasApiService.kt
│   │   ├── ServicesApiService.kt
│   │   └── AuthInterceptor.kt      # JWT token injection
│   └── repository/
│       ├── AuthRepository.kt       # Data layer
│       ├── AreaRepository.kt
│       └── ServiceRepository.kt
├── di/
│   └── AppModule.kt                # Hilt DI configuration
├── ui/
│   ├── navigation/
│   │   └── MainScaffold.kt         # Bottom nav + top bar
│   ├── screen/
│   │   ├── SplashScreen.kt         # Auth screens
│   │   ├── OnboardingScreen.kt
│   │   ├── LoginScreen.kt
│   │   ├── RegisterScreen.kt
│   │   ├── EmailVerificationScreen.kt
│   │   ├── DashboardScreen.kt      # Main screens
│   │   ├── ProfileScreen.kt
│   │   └── SettingsScreen.kt
│   ├── theme/
│   │   ├── Color.kt
│   │   ├── Theme.kt
│   │   └── Type.kt
│   └── viewmodel/
│       ├── AuthViewModel.kt
│       └── DashboardViewModel.kt
├── AreaApplication.kt
└── MainActivity.kt
```

## 🔧 Installation & Setup

### Prerequisites
- Android Studio Hedgehog or higher
- JDK 17
- Android device or Emulator with API 24+
- Backend server running (see Backend Setup below)

### Backend Setup

The mobile app requires the backend server to be running:

```bash
# Navigate to server directory
cd ../server

# Install dependencies
npm install
npm install sqlite3  # For local testing

# Create .env file
cp .env.example .env

# Start the server
node src/app.js
```

Server will run on `http://localhost:8080`

### Mobile App Configuration

1. **For Physical Device**: Update the BASE_URL in `AppModule.kt`
   ```kotlin
   // In app/src/main/java/com/area/mobile/di/AppModule.kt
   private const val BASE_URL = "http://YOUR_COMPUTER_IP:8080/"
   ```
   
   Find your IP:
   ```bash
   # Linux/Mac
   hostname -I | awk '{print $1}'
   
   # Windows
   ipconfig
   ```

2. **For Android Emulator**: Use the default configuration
   ```kotlin
   private const val BASE_URL = "http://10.0.2.2:8080/"
   ```

### Build & Run

```bash
# From the client-mobile folder
./gradlew assembleDebug

# To install directly on connected device
./gradlew installDebug

# Or via Android Studio: Run > Run 'app'
```

## 📱 API Integration

### Endpoints Used

**Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

**Areas**
- `GET /areas` - List user's AREAs
- `POST /areas` - Create new AREA
- `GET /areas/:id` - Get AREA details
- `POST /areas/:id/toggle` - Toggle AREA active state
- `DELETE /areas/:id` - Delete AREA

**Services**
- `GET /about.json` - List available services with actions/reactions
- `GET /services/user` - List user's connected services
- `GET /services/:serviceName/connect` - Get OAuth connection URL

### Authentication Flow

1. User logs in/registers
2. Backend returns JWT token
3. Token stored securely in DataStore
4. AuthInterceptor adds token to all API requests
5. Token persists across app restarts

## 🎯 App Flow

```
Splash Screen (2s animation)
    ├─> Onboarding (if first time)
    │       └─> Login
    └─> Login (if returning user)
            ├─> Register → Email Verification → Login
            └─> Dashboard (after successful login)
                    ├─> Profile (bottom nav)
                    ├─> Settings (bottom nav)
                    └─> Logout → Login
```

## 🎨 Design

### Navigation
- **Bottom Navigation Bar**: 3 tabs (Dashboard, Profile, Settings)
- **Top App Bar**: Logo + Logout button
- **Material 3**: Modern design system with custom purple/slate theme

### Screens

#### Auth Screens
- **Splash**: Animated logo with scale transition
- **Onboarding**: 3-slide introduction with page indicators
- **Login**: Email/password with OAuth buttons (UI only)
- **Register**: Full registration form with validation
- **Email Verification**: Code input screen

#### Main Screens
- **Dashboard**: Statistics cards + AREA list with real backend data
- **Profile**: User info + account details
- **Settings**: App preferences

## 🔌 Backend Communication

### Request/Response Cycle

```kotlin
// Example: Login request
LoginScreen 
  → AuthViewModel.login()
    → AuthRepository.login()
      → AuthApiService.login() [Retrofit]
        → Backend API
      ← AuthResponse with token
    ← Save token via TokenManager
  ← Update UI state
```

### Error Handling

The app handles:
- Network errors (connection refused, timeout)
- Authentication errors (invalid credentials, expired token)
- Server errors (500, 503)
- Validation errors (empty fields, invalid format)

All errors are displayed to the user with appropriate messages.

## 📝 Testing

### Test User Credentials

When testing with the backend:
```
Email: test@example.com
Password: password123
Name: Test User
```

### Monitoring Backend

```bash
# View server logs
cd ../server
tail -f server.log

# Check if server is running
curl http://localhost:8080/about.json
```

### Debug Logging

The app includes HTTP logging via OkHttp interceptor. Check Logcat for:
- API requests/responses
- Network errors
- Token management
- ViewModel state changes

Filter by tag: `AREA` or `OkHttp`

## 🐛 Troubleshooting

### Common Issues

**Cannot connect to server**
- Verify backend is running: `curl http://localhost:8080/about.json`
- Check IP address in AppModule.kt matches your computer's IP
- Ensure phone and computer are on the same network
- Check firewall allows port 8080

**Build errors**
```bash
# Clean and rebuild
./gradlew clean
./gradlew assembleDebug
```

**Device not detected**
```bash
# Check ADB connection
adb devices

# Restart ADB if needed
adb kill-server
adb start-server
```

## 🔄 Development Notes

### Current Status

✅ **Implemented**
- Complete authentication flow with backend
- Real-time AREA management
- Token-based security
- Service discovery from /about.json
- MVVM architecture with repository pattern
- Navigation between screens

⚠️ **Mocked/Simplified**
- OAuth integration (UI ready, backend connection needed)
- Service connection flow (endpoint exists, needs OAuth implementation)
- AREA execution statistics (displayed but not real-time)

📌 **Future Enhancements**
- WebSocket for real-time AREA execution updates
- Push notifications
- Offline mode with local caching
- AREA builder UI with drag-and-drop
- Service-specific configuration screens

## 🤝 Contributing

See HOWTOCONTRIBUTE.md at the project root.

## 📄 License

See LICENSE file at project root.
