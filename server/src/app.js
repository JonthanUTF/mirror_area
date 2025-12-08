require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('./config/passport');
const { sequelize } = require('./models');
const { startAutomationLoop } = require('./services/automation');
const { getAboutJson } = require('./services/aboutService');
const { router: authRouter } = require('./routes/auth');
const areasRouter = require('./routes/areas');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.json({ 
    message: 'AREA Backend API',
    version: '1.0.0',
    endpoints: {
      about: '/about.json',
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        google: 'GET /auth/google',
        me: 'GET /auth/me'
      },
      areas: {
        list: 'GET /areas',
        get: 'GET /areas/:id',
        create: 'POST /areas',
        update: 'PUT /areas/:id',
        delete: 'DELETE /areas/:id'
      }
    }
  });
});

app.get('/about.json', (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   req.ip;
  
  const aboutData = getAboutJson(clientIp);
  res.json(aboutData);
});

app.use('/auth', authRouter);
app.use('/areas', areasRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

async function startServer() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Synchronizing database models...');
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized.');

    startAutomationLoop();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API available at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;
