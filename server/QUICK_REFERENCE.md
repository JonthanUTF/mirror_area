# AREA Backend - Quick Reference Guide

## 🚀 Quick Start Commands

### Start Everything with Docker
```bash
# From project root
docker-compose up --build

# Or use the helper script
cd server
./start.sh
```

### Local Development
```bash
cd server
npm install
cp .env.example .env
# Edit .env file
npm run dev
```

### Run Tests
```bash
cd server
npm test
```

### Stop Services
```bash
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## 📡 API Quick Reference

### Base URL
```
http://localhost:8080
```

### Public Endpoints

#### Get API Info
```bash
curl http://localhost:8080/
```

#### Get Service Metadata
```bash
curl http://localhost:8080/about.json
```

### Authentication

#### Register New User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

#### Get Current User (with token)
```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### AREA Management

#### Create Area
```bash
curl -X POST http://localhost:8080/areas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weather Alert",
    "actionService": "weather",
    "actionType": "check_temp",
    "reactionService": "console",
    "reactionType": "log_message",
    "parameters": {
      "latitude": 48.8566,
      "longitude": 2.3522,
      "tempThreshold": 15,
      "message": "Temperature alert!"
    }
  }'
```

#### List Areas
```bash
curl http://localhost:8080/areas \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Specific Area
```bash
curl http://localhost:8080/areas/AREA_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Area
```bash
curl -X PUT http://localhost:8080/areas/AREA_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "active": false
  }'
```

#### Delete Area
```bash
curl -X DELETE http://localhost:8080/areas/AREA_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Environment Variables

### Required
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=area
DB_PASSWORD=area
DB_NAME=area_db
JWT_SECRET=your-secret-key
```

### Optional
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
CLIENT_URL=http://localhost:8081
```

## 🎯 Service Configurations

### Weather Action Example
```json
{
  "actionService": "weather",
  "actionType": "check_temp",
  "parameters": {
    "latitude": 48.8566,
    "longitude": 2.3522,
    "tempThreshold": 15
  }
}
```

### Timer Action Example
```json
{
  "actionService": "timer",
  "actionType": "interval",
  "parameters": {
    "interval": 60000
  }
}
```

### Console Reaction Example
```json
{
  "reactionService": "console",
  "reactionType": "log_message",
  "parameters": {
    "message": "Alert triggered!"
  }
}
```

### Email Reaction Example
```json
{
  "reactionService": "email",
  "reactionType": "send_email",
  "parameters": {
    "recipient": "user@example.com",
    "subject": "AREA Alert",
    "body": "Your automation was triggered."
  }
}
```

## 📊 Database Access

### PostgreSQL Connection
```bash
# Via Docker
docker exec -it area_postgres psql -U area -d area_db

# Via CLI (if installed locally)
psql -h localhost -p 5432 -U area -d area_db
```

### Common SQL Queries
```sql
-- List all users
SELECT * FROM users;

-- List all areas
SELECT * FROM areas;

-- List active areas with user info
SELECT a.*, u.email 
FROM areas a 
JOIN users u ON a."userId" = u.id 
WHERE a.active = true;
```

## 🔍 Debugging

### View Server Logs
```bash
docker-compose logs -f server
```

### View Database Logs
```bash
docker-compose logs -f db
```

### Check Service Status
```bash
docker-compose ps
```

### Restart Service
```bash
docker-compose restart server
```

### Rebuild After Code Changes
```bash
docker-compose up --build server
```

## 🧪 Testing Examples

### Test Registration Flow
```bash
# Register
TOKEN=$(curl -s -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | jq -r '.token')

# Use token
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Full AREA Flow
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | jq -r '.token')

# Create area
AREA_ID=$(curl -s -X POST http://localhost:8080/areas \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test",
    "actionService":"weather",
    "actionType":"check_temp",
    "reactionService":"console",
    "reactionType":"log_message",
    "parameters":{"tempThreshold":15}
  }' | jq -r '.area.id')

# View area
curl http://localhost:8080/areas/$AREA_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 📝 Common Issues

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or change port in docker-compose.yml
ports:
  - "8081:8080"  # Host:Container
```

### Database Connection Failed
```bash
# Check database is running
docker-compose ps db

# Restart database
docker-compose restart db

# Reset database
docker-compose down -v
docker-compose up db
```

### Module Not Found
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Response Examples

### Successful Login
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Created Area
```json
{
  "message": "Area created successfully",
  "area": {
    "id": "uuid",
    "userId": "user-uuid",
    "name": "Weather Alert",
    "actionService": "weather",
    "actionType": "check_temp",
    "reactionService": "console",
    "reactionType": "log_message",
    "parameters": {...},
    "active": true,
    "lastTriggered": null,
    "createdAt": "2025-12-02T...",
    "updatedAt": "2025-12-02T..."
  }
}
```

### About.json Response
```json
{
  "client": {
    "host": "::1"
  },
  "server": {
    "current_time": 1733155200,
    "services": [
      {
        "name": "weather",
        "actions": [
          {
            "name": "check_temp",
            "description": "Triggers if temperature is below a specified threshold"
          }
        ],
        "reactions": []
      },
      {
        "name": "console",
        "actions": [],
        "reactions": [
          {
            "name": "log_message",
            "description": "Logs a message to the server console"
          }
        ]
      }
    ]
  }
}
```

## 🔐 Security Best Practices

1. **Never commit .env files**
2. **Change JWT_SECRET in production**
3. **Use strong passwords** (min 8 chars)
4. **Enable HTTPS in production**
5. **Set up Google OAuth properly**
6. **Regularly update dependencies**

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [Passport.js Docs](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [Open-Meteo API](https://open-meteo.com/)

## 🆘 Support

Check logs for detailed error messages:
```bash
docker-compose logs server | tail -100
```

Database connection issues:
```bash
docker-compose exec db psql -U area -d area_db -c "SELECT version();"
```
