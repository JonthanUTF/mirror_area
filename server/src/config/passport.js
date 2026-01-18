const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitchStrategy = require('passport-twitch-new').Strategy;
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
c});

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

// Twitch OAuth Strategy
if (process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET) {
  console.log('Registering Twitch OAuth strategy...');
  passport.use(
    new TwitchStrategy(
      {
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: process.env.TWITCH_CALLBACK_URL || (process.env.CLIENT_URL || 'http://localhost:8081') + '/services/callback',
        scope: ['user:read:follows', 'user:manage:blocked_users'],
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          console.log('Twitch OAuth callback received...');
          
          // User must be authenticated via JWT to connect Twitch
          if (!req.user) {
            return done(null, false, { message: 'User must be logged in to connect Twitch' });
          }

          // Calculate token expiration (Twitch tokens typically expire in ~4 hours)
          const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

          // Find user by ID from JWT token
          const user = await User.findByPk(req.user.id);
          
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          // Update user with Twitch credentials
          await user.update({
            twitchAccessToken: accessToken,
            twitchRefreshToken: refreshToken,
            twitchTokenExpiresAt: expiresAt,
            twitchId: profile.id,
            twitchUsername: profile.login
          });

          console.log(`Twitch connected for user ${user.id}`);
          return done(null, user);
        } catch (error) {
          console.error('Twitch Strategy Error:', error);
          return done(error, null);
        }
      }
    )
  );
}

module.exports = passport;
