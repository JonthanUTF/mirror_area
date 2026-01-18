# Test OAuth Google sur l'app mobile

## Configuration

L'application mobile a été configurée pour supporter OAuth2 avec Google. Voici ce qui a été mis en place:

### 1. Modifications Backend

#### `server/src/routes/auth.js`
- Le callback OAuth détecte maintenant si la requête vient du mobile via le paramètre `state=mobile`
- Si `state=mobile`, le backend redirige vers `/mobile-callback.html?token=<JWT>`
- Sinon, il redirige vers l'URL web classique

#### `server/public/mobile-callback.html` (NOUVEAU)
- Page intermédiaire qui tente automatiquement de lancer le deep link
- Affiche un bouton "Ouvrir l'application" si la redirection automatique échoue
- Design moderne avec animations

#### `server/src/app.js`
- Ajout de `express.static` pour servir les fichiers du dossier `/public`

### 2. Modifications Mobile

#### AndroidManifest.xml
- Ajout d'un intent-filter pour capturer les deep links `area://auth/callback`
- Configuration en mode `singleTask` pour éviter de créer plusieurs instances

#### MainActivity.kt
- Capture du deep link dans `onNewIntent()` et `onCreate()`
- Extraction du token JWT depuis l'URL `area://auth/callback?token=...`
- Passage du token à LoginScreen

#### LoginScreen.kt
- Bouton "Continue with Google" fonctionnel
- Ouverture de Chrome Custom Tabs vers `http://<serverIp>:8080/auth/google?state=mobile`
- Reception du token via LaunchedEffect et sauvegarde dans TokenManager
- Navigation automatique vers le dashboard après succès

#### build.gradle.kts
- Ajout de la dépendance `androidx.browser:browser:1.7.0` pour Chrome Custom Tabs

## Test sur le téléphone

### Prérequis
1. Backend en cours d'exécution (port 8080)
2. Téléphone sur le même réseau que le serveur
3. Server IP configuré dans l'app (par défaut: 10.15.192.62)

### Étapes de test

1. **Lancer l'app sur le téléphone**
   ```bash
   adb install -r client-mobile/app/build/outputs/apk/debug/app-debug.apk
   ```

2. **Sur l'écran de login**
   - Vérifier que le Server IP est correct (10.15.192.62)
   - Cliquer sur "Continue with Google"

3. **Flux OAuth attendu**
   - Chrome Custom Tab s'ouvre
   - Redirection vers la page Google OAuth
   - Authentification Google
   - Redirection automatique vers l'app avec le token
   - Navigation vers le dashboard

### Debugging

Si le deep link ne fonctionne pas, tester manuellement:
```bash
adb shell am start -W -a android.intent.action.VIEW \
  -d "area://auth/callback?token=test_token_123" \
  com.area.mobile
```

### Backend OAuth Endpoints

- `GET /auth/google?state=mobile` - Initie l'OAuth
- `GET /auth/google/callback` - Callback de Google
  - Détecte `state=mobile`
  - Génère un JWT
  - Redirige vers `area://auth/callback?token=<JWT>`

## Vérification

Pour vérifier que l'OAuth fonctionne:
1. Après login, vérifier que le token est sauvegardé (visible dans les requêtes API)
2. Le dashboard doit s'afficher avec les données de l'utilisateur
3. Les appels API suivants doivent inclure le header `Authorization: Bearer <token>`

## Architecture

```
[Mobile App]
     |
     | 1. Open Chrome Custom Tab
     | -> http://server:8080/auth/google?state=mobile
     v
[Backend]
     |
     | 2. Redirect to Google OAuth
     v
[Google]
     |
     | 3. User authenticates
     | 4. Callback to backend
     v
[Backend]
     |
     | 5. Generate JWT
     | 6. Detect state=mobile
     | 7. Redirect to /mobile-callback.html?token=<JWT>
     v
[Chrome Custom Tab - HTML Page]
     |
     | 8. JavaScript attempts area://auth/callback?token=<JWT>
     | 9. Android asks user to open app (if needed)
     v
[Mobile App - Deep Link]
     |
     | 10. Extract token
     | 11. Save to TokenManager
     | 12. Navigate to Dashboard
     v
[Dashboard]
```

## Solution au problème de redirection

**Problème initial**: Chrome ne redirige pas automatiquement vers le deep link de l'app

**Solution implémentée**: 
- Page HTML intermédiaire (`/mobile-callback.html`) qui:
  - Tente automatiquement de lancer le deep link via JavaScript
  - Affiche un bouton de secours si la redirection automatique échoue
  - Design agréable pour rassurer l'utilisateur pendant le processus
  
Cette approche évite les problèmes de sécurité liés aux WebViews tout en permettant une redirection fluide vers l'app.
