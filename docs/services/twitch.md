# Twitch Service Documentation

## Overview

The Twitch service integration allows users to automate actions based on Twitch streams and control their Twitch account.

## Features

### Action (Trigger)
- **streamer_live**: Detects when a specific streamer goes live (Offline → Live transition)

### Reaction
- **block_user**: Blocks a specified user on Twitch

## Setup Instructions

### 1. Create Twitch Application

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Log in with your Twitch account
3. Click "Register Your Application"
4. Fill in the details:
   - **Name**: AREA Twitch Integration (or your choice)
   - **OAuth Redirect URLs**: `http://localhost:8080/auth/twitch/callback`
   - **Category**: Application Integration
5. Click "Create"
6. Click "Manage" on your new application
7. Note your **Client ID**
8. Click "New Secret" to generate a **Client Secret**

### 2. Configure Environment Variables

Add to your `.env` file:

```env
TWITCH_CLIENT_ID=your_twitch_client_id_here
TWITCH_CLIENT_SECRET=your_twitch_client_secret_here
TWITCH_CALLBACK_URL=http://localhost:8080/auth/twitch/callback
```

### 3. Install Required Package

The package is already installed, but for reference:

```bash
npm install passport-twitch-new
```

### 4. Run Database Migration

```bash
psql -U area -d area_db -f server/migrations/add_twitch_fields.sql
```

### 5. Test the Integration

1. Start your server: `npm start`
2. Authenticate a user via your app
3. Connect Twitch: GET `http://localhost:8080/auth/twitch` (with JWT token in Authorization header)
4. After authorization, the user will be redirected back with Twitch connected

## API Endpoints

### Connect Twitch
```
GET /auth/twitch
Authorization: Bearer <JWT_TOKEN>
```

### Twitch Callback (Automatic)
```
GET /auth/twitch/callback
```

### Check Connection Status
```
GET /auth/twitch/status
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "connected": true,
  "twitchId": "12345678",
  "twitchUsername": "username"
}
```

### Disconnect Twitch
```
POST /auth/twitch/disconnect
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "message": "Twitch disconnected successfully"
}
```

## Creating AREAs with Twitch

### Example 1: Get Notified When Favorite Streamer Goes Live

**Action**: `streamer_live` (Twitch)
**Reaction**: `log_console` (Console)

```json
{
  "name": "Alert when xQc goes live",
  "actionService": "twitch",
  "actionType": "streamer_live",
  "reactionService": "console",
  "reactionType": "log",
  "parameters": {
    "username": "xqc"
  },
  "active": true
}
```

### Example 2: Auto-block User When Streamer Goes Live

**Action**: `streamer_live` (Twitch)
**Reaction**: `block_user` (Twitch)

```json
{
  "name": "Block troll when streamer goes live",
  "actionService": "twitch",
  "actionType": "streamer_live",
  "reactionService": "twitch",
  "reactionType": "block_user",
  "parameters": {
    "username": "favorite_streamer",
    "blockUsername": "troll_account"
  },
  "active": true
}
```

## Technical Details

### Token Management

The integration includes automatic token refresh functionality:
- Tokens are checked before each API call
- If expired (or expiring within 5 minutes), they are automatically refreshed
- New tokens are saved to the database
- Handles 401 errors with automatic retry after refresh
- No user intervention required

### Twitch API Requirements (Helix)

**CRITICAL**: All Twitch API calls require TWO headers:
```javascript
{
  'Authorization': 'Bearer <access_token>',
  'Client-Id': '<your_client_id>'
}
```

Missing either header will result in 401 errors.

### State Tracking

The trigger uses `twitchStreamLastStatus` (JSONB field) to track stream states:
- Stores per-streamer state: `{ "streamer_username": { isLive: boolean, checkedAt: timestamp } }`
- Detects "Offline → Live" transitions
- Prevents duplicate triggers for the same stream session
- Resets when user disconnects Twitch

### Required Scopes

The integration requests the following Twitch scopes:
- `user:read:follows`: Read user's followed channels (used for stream checks)
- `user:manage:blocked_users`: Block/unblock users

### Error Handling

The service includes comprehensive error handling:
- Expired tokens are automatically refreshed
- 401 errors trigger token refresh and retry
- Missing credentials return clear error messages
- API errors are logged with full context
- Username resolution failures provide helpful messages

## API Methods

### Core Service Methods

#### `getFreshAccessToken(user)`
- Checks token expiration (5-minute buffer)
- Automatically refreshes if needed
- Updates database with new token
- Returns valid access token

#### `makeRequest(user, method, endpoint, data, params)`
- Makes authenticated requests to Twitch API
- **Includes both Authorization and Client-Id headers**
- Handles 401 errors with automatic retry
- Supports GET, POST, PUT, DELETE methods

#### `resolveUsernameToId(user, username)`
- Converts Twitch username to user ID
- Required for stream checks and blocking
- Uses `GET /users?login=username`

#### `getStreamStatus(user, userId)`
- Checks if a stream is live
- Returns stream metadata (title, viewers, game, etc.)
- Uses `GET /streams?user_id=userId`

#### `blockUser(user, targetUserId)`
- Blocks a specified user
- Requires target user ID
- Uses `PUT /users/blocks?target_user_id=userId`

## Troubleshooting

### "Failed to refresh Twitch token"
**Problem**: Token refresh failed
**Solution**: User needs to disconnect and reconnect Twitch via `/auth/twitch`

### "Twitch user 'username' not found"
**Problem**: Invalid or non-existent username
**Solution**: Verify the username is correct and exists on Twitch

### "User must be logged in to connect Twitch"
**Problem**: JWT token missing or invalid
**Solution**: Include valid JWT token in Authorization header when calling `/auth/twitch`

### "Missing 'username' parameter for trigger"
**Problem**: AREA parameters don't include required username
**Solution**: Ensure the AREA parameters include `username` field

### Finding Twitch Username
- Go to a Twitch channel: `https://twitch.tv/username`
- The username is in the URL (case-insensitive)
- Or check profile settings when logged in

## Database Schema

### User Model Fields Added

```javascript
twitchAccessToken       TEXT          -- OAuth access token
twitchRefreshToken      TEXT          -- OAuth refresh token
twitchTokenExpiresAt    TIMESTAMP     -- Token expiration timestamp
twitchId                VARCHAR(255)  -- Twitch user ID
twitchUsername          VARCHAR(255)  -- Twitch username (login)
twitchStreamLastStatus  JSONB         -- Stream state tracking (per-streamer)
```

### Example `twitchStreamLastStatus` Structure

```json
{
  "streamer_xqc": {
    "isLive": true,
    "checkedAt": "2026-01-12T10:30:00Z"
  },
  "streamer_pokimane": {
    "isLive": false,
    "checkedAt": "2026-01-12T10:30:00Z"
  }
}
```

## Service Architecture

```
TwitchService extends ServiceBase
├── Actions
│   └── streamer_live (username)
├── Reactions
│   └── block_user (username)
└── Helper Methods
    ├── getFreshAccessToken()      // Automatic token refresh
    ├── makeRequest()              // Authenticated API calls (dual headers)
    ├── resolveUsernameToId()      // Username → ID conversion
    ├── getStreamStatus()          // Check if stream is live
    ├── blockUser()                // Block a user
    └── isConnected()              // Check connection status
```

## Twitch API Endpoints Used

| Endpoint | Method | Purpose | Required Params |
|----------|--------|---------|-----------------|
| `/users` | GET | Resolve username to ID | `login=username` |
| `/streams` | GET | Check stream status | `user_id=id` |
| `/users/blocks` | PUT | Block a user | `target_user_id=id` |

## Token Refresh Flow

```
1. makeRequest() called
   ↓
2. getFreshAccessToken() checks expiration
   ↓
3a. Token valid → Return existing token
   ↓
3b. Token expired → POST to /oauth2/token
   ↓
4. Update database with new token
   ↓
5. Return fresh token
   ↓
6. Make API call with fresh token + Client-Id
   ↓
7a. Success → Return data
   ↓
7b. 401 Error → Refresh token and retry once
```

## Rate Limits

- Twitch API: 800 requests per minute per application
- Our usage: ~1-2 requests per automation check
- Safe for: 100+ concurrent AREAs per user

## Future Enhancements

Potential additional features:
- More triggers: new follower, chat message, raid received, subscriber
- More reactions: start ad break, update title, create clip, send chat message
- Support for multiple streamers per AREA
- Webhook support for instant notifications (instead of polling)
- Stream category/game filters

## Example Use Cases

1. **Stream Notifications**: Trigger when favorite streamer goes live → Send email
2. **Auto-moderation**: Streamer goes live → Block known trolls
3. **Cross-platform**: Twitch stream live → Post to Twitter/Discord
4. **Analytics**: Track when streamers go live → Log to database
5. **Personal Security**: Streamer goes live → Block specific users automatically

## Additional Resources

- [Twitch API Documentation](https://dev.twitch.tv/docs/api/)
- [Twitch OAuth Guide](https://dev.twitch.tv/docs/authentication)
- [Twitch Developer Console](https://dev.twitch.tv/console)
