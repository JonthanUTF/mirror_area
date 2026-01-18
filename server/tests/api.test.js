const request = require('supertest');
const app = require('../src/app');
const { sequelize, User } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('AREA Backend API', () => {
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /about.json', () => {
    it('should return service metadata', async () => {
      const response = await request(app).get('/about.json');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('client');
      expect(response.body).toHaveProperty('server');
      expect(response.body.client).toHaveProperty('host');
      expect(response.body.server).toHaveProperty('current_time');
      expect(response.body.server).toHaveProperty('services');
      expect(Array.isArray(response.body.server.services)).toBe(true);
    });

    it('should include weather service', async () => {
      const response = await request(app).get('/about.json');
      
      const weatherService = response.body.server.services.find(s => s.name === 'weather');
      expect(weatherService).toBeDefined();
      expect(weatherService.actions).toContainEqual(
        expect.objectContaining({ name: 'check_temp' })
      );
    });

    it('should include console service', async () => {
      const response = await request(app).get('/about.json');
      
      const consoleService = response.body.server.services.find(s => s.name === 'console');
      expect(consoleService).toBeDefined();
      expect(consoleService.reactions).toContainEqual(
        expect.objectContaining({ name: 'log_message' })
      );
    });
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not register duplicate email', async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Areas CRUD', () => {
    let authToken;

    beforeAll(async () => {
      const registerResponse = await request(app)
        .post('/auth/register')
        .send({
          email: 'areas@example.com',
          password: 'password123'
        });
      
      authToken = registerResponse.body.token;
    });

    it('should create a new area', async () => {
      const response = await request(app)
        .post('/areas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Area',
          actionService: 'weather',
          actionType: 'check_temp',
          reactionService: 'console',
          reactionType: 'log_message',
          parameters: {
            latitude: 48.8566,
            longitude: 2.3522,
            tempThreshold: 15,
            message: 'Temperature alert!'
          }
        });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('area');
      expect(response.body.area.name).toBe('Test Area');
    });

    it('should list user areas', async () => {
      const response = await request(app)
        .get('/areas')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('areas');
      expect(Array.isArray(response.body.areas)).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/areas');
      
      expect(response.status).toBe(401);
    });
  });
});
