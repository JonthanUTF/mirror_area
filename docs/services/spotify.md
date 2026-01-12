# Spotify Service Documentation

## Overview

The Spotify service integration allows users to automate actions based on their Spotify activity and control their Spotify playback.

## Features

### Action (Trigger)
- **new_saved_track**: Detects when a user saves a new track to their library (Liked Songs)

### Reactions
- **add_to_playlist**: Adds a track to a specified playlist
- **skip_track**: Skips to the next track in playback

## Setup Instructions

### 1. Create Spotify Application

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create app"
4. Fill in the details:
   - **App name**: AREA Spotify Integration (or your choice)
   - **App description**: Automation platform integration
   - **Redirect URI**: `http://localhost:8080/auth/spotify/callback`
   - **APIs used**: Web API
5. Save and note your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add to your `.env` file:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
SPOTIFY_CALLBACK_URL=http://localhost:8080/auth/spotify/callback
```

### 3. Install Required Packages

```bash
npm install passport-spotify
```

### 4. Run Database Migration

The User model has been updated with Spotify fields. You may need to run migrations or sync the database:

```bash
# If using Sequelize migrations
npx sequelize-cli db:migrate

# Or force sync (development only - will drop tables!)
# Update your app.js to use { force: true } temporarily
```

### 5. Test the Integration

1. Start your server: `npm start`
2. Authenticate a user via your app
3. Connect Spotify: GET `http://localhost:8080/auth/spotify` (with JWT token in Authorization header)
4. After authorization, the user will be redirected back with Spotify connected

## API Endpoints

### Connect Spotify
```
GET /auth/spotify
Authorization: Bearer <JWT_TOKEN>
```

### Spotify Callback (Automatic)
```
GET /auth/spotify/callback
```

### Check Connection Status
```
GET /auth/spotify/status
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "connected": true,
  "userId": "spotify_user_id"
}
```

### Disconnect Spotify
```
POST /auth/spotify/disconnect
Authorization: Bearer <JWT_TOKEN>

Response:
{
  "success": true,
  "message": "Spotify disconnected successfully"
}
```

## Creating AREAs with Spotify

### Example 1: Auto-add Liked Songs to Playlist

**Action**: `new_saved_track` (Spotify)
**Reaction**: `add_to_playlist` (Spotify)

```json
{
  "name": "Auto-add liked songs to my playlist",
  "actionService": "spotify",
  "actionType": "new_saved_track",
  "reactionService": "spotify",
  "reactionType": "add_to_playlist",
  "parameters": {
    "playlistId": "your_playlist_id_here"
  },
  "active": true
}
```

### Example 2: Skip Track when Liked

**Action**: `new_saved_track` (Spotify)
**Reaction**: `skip_track` (Spotify)

```json
{
  "name": "Skip track after liking it",
  "actionService": "spotify",
  "actionType": "new_saved_track",
  "reactionService": "spotify",
  "reactionType": "skip_track",
  "parameters": {},
  "active": true
}
```

## Technical Details

### Token Management

The integration includes automatic token refresh functionality:
- Tokens are checked before each API call
- If expired (or expiring within 5 minutes), they are automatically refreshed
- New tokens are saved to the database
- No user intervention required

### State Tracking

The trigger uses `spotifyLastSavedTrackId` to track the last processed track:
- When a new track is detected, this field is updated
- Prevents duplicate triggers for the same track
- Resets when user disconnects Spotify

### Required Scopes

The integration requests the following Spotify scopes:
- `user-library-read`: Read user's saved tracks
- `playlist-modify-public`: Add tracks to public playlists
- `playlist-modify-private`: Add tracks to private playlists
- `user-modify-playback-state`: Control playback (skip tracks)

### Error Handling

The service includes comprehensive error handling:
- Expired tokens are automatically refreshed
- Missing credentials return clear error messages
- API errors are logged with full context
- 404 errors on skip track indicate no active device

## Troubleshooting

### "No active playback device found"
**Problem**: The `skip_track` reaction fails
**Solution**: User must have Spotify playing on a device (phone, desktop, web player)

### "Spotify authentication failed. User needs to reconnect"
**Problem**: Token refresh failed
**Solution**: User needs to disconnect and reconnect Spotify via `/auth/spotify`

### "Playlist ID is required"
**Problem**: Missing playlist ID in parameters
**Solution**: Ensure the AREA parameters include a valid `playlistId`

### Finding Playlist ID
1. Open Spotify
2. Right-click on a playlist
3. Share → Copy link to playlist
4. Extract ID from URL: `https://open.spotify.com/playlist/PLAYLIST_ID`

## Database Schema

### User Model Fields Added

```javascript
spotifyAccessToken: TEXT       // OAuth access token
spotifyRefreshToken: TEXT      // OAuth refresh token
spotifyTokenExpiresAt: DATE    // Token expiration timestamp
spotifyUserId: STRING          // Spotify user ID
spotifyLastSavedTrackId: STRING // Last processed track ID
```

## Service Architecture

```
SpotifyService extends ServiceBase
├── Actions
│   └── new_saved_track
├── Reactions
│   ├── add_to_playlist
│   └── skip_track
└── Helper Methods
    ├── getFreshAccessToken()  // Automatic token refresh
    ├── makeRequest()          // Authenticated API calls
    ├── getSavedTracks()       // Fetch liked songs
    ├── addTrackToPlaylist()   // Add to playlist
    ├── skipToNext()           // Skip track
    └── isConnected()          // Check connection status
```

## Future Enhancements

Potential additional features:
- More triggers: new playlist, now playing, top tracks
- More reactions: pause, play, add to queue, create playlist
- Support for multiple playlists
- Batch operations
- Advanced filters (genre, artist, etc.)
