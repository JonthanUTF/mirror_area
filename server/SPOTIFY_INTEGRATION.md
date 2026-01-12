# Spotify Integration - Quick Setup Guide

## ✅ What Has Been Integrated

The Spotify service has been fully integrated into your AREA project:

### Files Created:
- `/server/src/services/implementations/SpotifyService.js` - Main service implementation
- `/docs/services/spotify.md` - Complete documentation

### Files Modified:
- `/server/src/models/index.js` - Added Spotify fields to User model
- `/server/src/config/passport.js` - Added Spotify OAuth strategy
- `/server/src/routes/auth.js` - Added Spotify authentication routes
- `/server/src/services/loader.js` - Registered Spotify service
- `/server/.env.example` - Added Spotify environment variables
- `/docs/services/index.md` - Added Spotify to documentation index

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
cd /Users/macbookpro/Documents/tek/mirror_area/server
npm install passport-spotify
```

### 2. Create Spotify App

1. Go to https://developer.spotify.com/dashboard
2. Click "Create app"
3. Fill in details:
   - Name: "AREA Spotify Integration"
   - Redirect URI: `http://localhost:8080/auth/spotify/callback`
4. Copy your Client ID and Client Secret

### 3. Update .env File

Edit `/server/.env` and add:

```env
SPOTIFY_CLIENT_ID=your_client_id_from_spotify_dashboard
SPOTIFY_CLIENT_SECRET=your_client_secret_from_spotify_dashboard
SPOTIFY_CALLBACK_URL=http://localhost:8080/auth/spotify/callback
```

### 4. Update Database

The User model has new fields. You need to either:

**Option A: Drop and recreate (Development only)**
```javascript
// In your app.js, temporarily add { force: true }:
await sequelize.sync({ force: true });
```

**Option B: Manual SQL (Recommended)**
```sql
ALTER TABLE users ADD COLUMN "spotifyAccessToken" TEXT;
ALTER TABLE users ADD COLUMN "spotifyRefreshToken" TEXT;
ALTER TABLE users ADD COLUMN "spotifyTokenExpiresAt" TIMESTAMP;
ALTER TABLE users ADD COLUMN "spotifyUserId" VARCHAR(255);
ALTER TABLE users ADD COLUMN "spotifyLastSavedTrackId" VARCHAR(255);
```

### 5. Test the Integration

```bash
# Start your server
npm start

# Test endpoints (replace YOUR_JWT_TOKEN with actual token):
# 1. Connect Spotify
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/auth/spotify

# 2. Check status
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8080/auth/spotify/status
```

## 📝 Create Your First Spotify AREA

### Example: Auto-add Liked Songs to Playlist

```bash
# POST /areas
{
  "name": "Auto-add liked songs to my favorites",
  "actionService": "spotify",
  "actionType": "new_saved_track",
  "reactionService": "spotify",
  "reactionType": "add_to_playlist",
  "parameters": {
    "playlistId": "YOUR_SPOTIFY_PLAYLIST_ID"
  },
  "active": true
}
```

**To get your playlist ID:**
1. Open Spotify
2. Right-click a playlist → Share → Copy link
3. Extract ID from: `https://open.spotify.com/playlist/PLAYLIST_ID_HERE`

## 🔍 Available Features

### Action (Trigger):
- `new_saved_track` - Triggers when user likes a song

### Reactions:
- `add_to_playlist` - Adds track to specified playlist
- `skip_track` - Skips to next song

### Trigger Data Available:
When `new_saved_track` triggers, these fields are available:
- `trackId` - Spotify track ID
- `trackUri` - Spotify URI (spotify:track:xxx)
- `trackName` - Track title
- `artistName` - Artist(s) name
- `albumName` - Album title
- `albumImage` - Album cover URL
- `addedAt` - When track was saved
- `previewUrl` - 30-second preview URL
- `externalUrl` - Spotify web player URL

## ⚠️ Important Notes

1. **Token Refresh**: Tokens are automatically refreshed - no manual intervention needed
2. **Authentication Flow**: Users must be logged in (JWT) before connecting Spotify
3. **Polling**: The automation loop will check for new tracks periodically
4. **Device Required**: `skip_track` requires an active Spotify device (phone/desktop/web)

## 🐛 Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org/

### "No active playback device"
User needs to have Spotify playing on a device for `skip_track` to work

### "User must be logged in to connect Spotify"
Include JWT token in Authorization header when calling `/auth/spotify`

### "Failed to refresh Spotify token"
User needs to reconnect via `/auth/spotify`

## 📚 Full Documentation

See [/docs/services/spotify.md](../docs/services/spotify.md) for complete documentation.

## ✅ Integration Checklist

- [x] SpotifyService implementation created
- [x] Database model updated with Spotify fields
- [x] Passport OAuth strategy configured
- [x] Authentication routes added
- [x] Service registered in loader
- [x] Environment variables documented
- [x] Full documentation created
- [ ] **Install passport-spotify package** (run: `npm install passport-spotify`)
- [ ] **Configure Spotify Developer App**
- [ ] **Update .env with credentials**
- [ ] **Run database migration/sync**
- [ ] **Test OAuth flow**
- [ ] **Create test AREA**

---

**Ready to use!** Once you complete the setup steps, your Spotify integration will be fully functional.
