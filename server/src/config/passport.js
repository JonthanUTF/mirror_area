const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

module.exports = passport;
