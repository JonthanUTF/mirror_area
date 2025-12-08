# AREA Backend

Node.js/Express backend for the AREA automation platform.

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)

## Quick Start with Docker

1. Start the services:
```bash
docker-compose up --build
```

The server will be available at `http://localhost:8080`

## Local Development

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file from example:
```bash
cp .env.example .env
```

3. Start PostgreSQL (via Docker):
```bash
docker-compose up db
```

4. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Public Endpoints

- `GET /` - API information
- `GET /about.json` - Service metadata (as per AREA specs)

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user (requires JWT)

### Areas (Protected)

- `GET /areas` - List user's areas
- `GET /areas/:id` - Get specific area
- `POST /areas` - Create new area
- `PUT /areas/:id` - Update area
- `DELETE /areas/:id` - Delete area

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test
```

## Project Structure

```
server/
├── src/
│   ├── app.js                 # Main application
│   ├── config/
│   │   └── passport.js        # Passport configuration
│   ├── models/
│   │   └── index.js           # Sequelize models
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── areas.js           # AREA CRUD routes
│   └── services/
│       ├── aboutService.js    # /about.json handler
│       └── automation.js      # Automation loop
├── Dockerfile
├── package.json
└── .env.example
```

## Environment Variables

See `.env.example` for required configuration.

## Automation Services

### Actions (Triggers)

- **weather**: Check temperature, weather conditions
- **timer**: Interval or scheduled triggers

### Reactions

- **console**: Log messages to server console
- **email**: Send email notifications (mocked)

## License

ISC
