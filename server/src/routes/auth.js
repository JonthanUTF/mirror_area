const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: 'User with this email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name: name || null,
      role: "user"
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Failed to register user',
      details: error.message
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Failed to login',
      details: error.message
    });
  }
});

router.get('/google', (req, res, next) => {
  console.log('[Auth] Initiating Google Login...');
  next();
},
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),
  (req, res) => {
    try {
      const token = generateToken(req.user);

      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8081'}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.redirect('/login?error=authentication_failed');
    }
  }
);

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'googleId', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// ===== TWITCH OAUTH ROUTES =====

/**
 * @route   GET /auth/twitch
 * @desc    Initiate Twitch OAuth flow
 * @access  Private (requires JWT authentication) OR with state param
 */
router.get('/twitch', (req, res, next) => {
  console.log('[Auth] Initiating Twitch OAuth...');
  
  // Get JWT from Authorization header OR from state query param
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.state) {
    token = req.query.state;
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please login first.' });
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    // Store token in session for callback
    req.session = req.session || {};
    req.session.jwtToken = token;
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  next();
}, (req, res, next) => {
  // Pass the JWT as state to Twitch OAuth
  const token = req.session?.jwtToken || req.query.state;
  passport.authenticate('twitch', { 
    session: false,
    state: token
  })(req, res, next);
});

/**
 * @route   GET /auth/twitch/callback
 * @desc    Twitch OAuth callback
 * @access  Public (handled by Twitch)
 */
router.get('/twitch/callback', 
  // Extract JWT from query or state
  (req, res, next) => {
    const token = req.query.state || req.query.token;
    if (token) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.id, email: payload.email };
      } catch (err) {
        console.error('Token verification failed in Twitch callback:', err);
      }
    }
    next();
  },
  passport.authenticate('twitch', { 
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:8081'}/settings?twitch_error=auth_failed`
  }),
  (req, res) => {
    try {
      console.log('[Auth] Twitch connected successfully');
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8081'}/settings?twitch_connected=true`);
    } catch (error) {
      console.error('Twitch callback error:', error);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:8081'}/settings?twitch_error=callback_failed`);
    }
  }
);

/**
 * @route   POST /auth/twitch/disconnect
 * @desc    Disconnect Twitch account
 * @access  Private
 */
router.post('/twitch/disconnect', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({
      twitchAccessToken: null,
      twitchRefreshToken: null,
      twitchTokenExpiresAt: null,
      twitchId: null,
      twitchUsername: null,
      twitchStreamLastStatus: null
    });

    res.json({ 
      success: true, 
      message: 'Twitch disconnected successfully' 
    });
  } catch (error) {
    console.error('Error disconnecting Twitch:', error);
    res.status(500).json({ 
      error: 'Failed to disconnect Twitch' 
    });
  }
});

/**
 * @route   GET /auth/twitch/status
 * @desc    Check Twitch connection status
 * @access  Private
 */
router.get('/twitch/status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['twitchAccessToken', 'twitchRefreshToken', 'twitchId', 'twitchUsername']
    });

    const isConnected = !!(user && user.twitchAccessToken && user.twitchRefreshToken);

    res.json({
      connected: isConnected,
      twitchId: user?.twitchId || null,
      twitchUsername: user?.twitchUsername || null
    });
  } catch (error) {
    console.error('Error checking Twitch status:', error);
    res.status(500).json({ error: 'Failed to check Twitch status' });
  }
});

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Load full user from DB to get role and other fields
    const user = await User.findByPk(payload.id, {
      attributes: ['id', 'email', 'name', 'role']
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // attach minimal safe user info
    req.user = { id: user.id, email: user.email, name: user.name, role: user.role };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal auth error' });
  }
}

module.exports = { router, authenticateToken };
