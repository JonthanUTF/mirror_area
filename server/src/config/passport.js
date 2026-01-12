const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const { User } = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Registering Google OAuth strategy...');
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8080/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('Google OAuth callback received...');
          let user = await User.findOne({ where: { googleId: profile.id } });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: profile.emails && profile.emails[0] ? profile.emails[0].value : null,
              name: profile.displayName
            });
          }

          return done(null, user);
        } catch (error) {
          console.error('Error during Google OAuth callback:', error);
          return done(error, null);
        }
      }
    )
  );
}

// Spotify OAuth Strategy
if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) {
  console.log('Registering Spotify OAuth strategy...');
  passport.use(
    new SpotifyStrategy(
      {
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: process.env.SPOTIFY_CALLBACK_URL || 'http://localhost:8080/auth/spotify/callback',
        scope: [
          'user-library-read',
          'playlist-modify-public',
          'playlist-modify-private',
          'user-modify-playback-state'
        ],
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, expiresIn, profile, done) => {
        try {
          console.log('Spotify OAuth callback received...');
          
          // User must be authenticated via JWT to connect Spotify
          if (!req.user) {
            return done(null, false, { message: 'User must be logged in to connect Spotify' });
          }

          // Calculate token expiration date
          const expiresAt = new Date(Date.now() + expiresIn * 1000);

          // Find user by ID from JWT token
          const user = await User.findByPk(req.user.id);
          
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          // Update user with Spotify credentials
          await user.update({
            spotifyAccessToken: accessToken,
            spotifyRefreshToken: refreshToken,
            spotifyTokenExpiresAt: expiresAt,
            spotifyUserId: profile.id
          });

          console.log(`Spotify connected for user ${user.id}`);
          return done(null, user);
        } catch (error) {
          console.error('Spotify Strategy Error:', error);
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
