#!/bin/bash
# Spotify Integration - Automated Setup Script
# This script will help you complete the Spotify integration setup

echo "🎵 AREA - Spotify Integration Setup"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Node.js and npm
echo "📦 Step 1: Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found. Please install Node.js"
    exit 1
fi

echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
cd "$(dirname "$0")" || exit
if npm install passport-spotify; then
    echo -e "${GREEN}✓${NC} passport-spotify installed successfully"
else
    echo -e "${RED}✗${NC} Failed to install passport-spotify"
    exit 1
fi

echo ""

# Step 3: Check environment variables
echo "🔑 Step 3: Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "SPOTIFY_CLIENT_ID=" .env; then
        SPOTIFY_ID=$(grep "SPOTIFY_CLIENT_ID=" .env | cut -d '=' -f2)
        if [ "$SPOTIFY_ID" = "your-spotify-client-id" ] || [ -z "$SPOTIFY_ID" ]; then
            echo -e "${YELLOW}⚠${NC} SPOTIFY_CLIENT_ID not configured in .env"
            echo "   Please update .env with your Spotify credentials"
        else
            echo -e "${GREEN}✓${NC} SPOTIFY_CLIENT_ID configured"
        fi
    else
        echo -e "${YELLOW}⚠${NC} SPOTIFY_CLIENT_ID not found in .env"
        echo "   Adding Spotify configuration to .env..."
        echo "" >> .env
        echo "# Spotify OAuth Configuration" >> .env
        echo "SPOTIFY_CLIENT_ID=your-spotify-client-id" >> .env
        echo "SPOTIFY_CLIENT_SECRET=your-spotify-client-secret" >> .env
        echo "SPOTIFY_CALLBACK_URL=http://localhost:8080/auth/spotify/callback" >> .env
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo "   Creating .env from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓${NC} .env file created"
    else
        echo -e "${RED}✗${NC} .env.example not found"
        exit 1
    fi
fi

echo ""

# Step 4: Database migration check
echo "🗄️  Step 4: Database migration..."
echo -e "${YELLOW}⚠${NC} You need to run the database migration manually:"
echo ""
echo "   Option A - Using psql:"
echo "   psql -U area -d area_db -f migrations/add_spotify_fields.sql"
echo ""
echo "   Option B - Using Sequelize sync (dev only):"
echo "   Update app.js to use: sequelize.sync({ alter: true })"
echo ""

# Step 5: Spotify App setup reminder
echo "🎵 Step 5: Spotify Developer App Setup"
echo "======================================="
echo ""
echo "You need to create a Spotify App:"
echo "1. Go to: https://developer.spotify.com/dashboard"
echo "2. Click 'Create app'"
echo "3. Fill in the details:"
echo "   - App name: AREA Spotify Integration"
echo "   - Redirect URI: http://localhost:8080/auth/spotify/callback"
echo "4. Copy your Client ID and Client Secret"
echo "5. Update your .env file with these credentials"
echo ""

# Step 6: Summary
echo "📋 Setup Summary"
echo "================"
echo ""
echo -e "${GREEN}Completed Steps:${NC}"
echo "  ✓ Dependencies installed"
echo "  ✓ Environment file checked"
echo ""
echo -e "${YELLOW}Manual Steps Required:${NC}"
echo "  ⚠ Run database migration"
echo "  ⚠ Create Spotify Developer App"
echo "  ⚠ Update .env with Spotify credentials"
echo ""
echo -e "${GREEN}Next Steps:${NC}"
echo "  1. Complete the manual steps above"
echo "  2. Start your server: npm start"
echo "  3. Test OAuth flow: GET /auth/spotify"
echo "  4. Check status: GET /auth/spotify/status"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: SPOTIFY_INTEGRATION.md"
echo "  - Full Docs: ../docs/services/spotify.md"
echo "  - Summary: ../SPOTIFY_INTEGRATION_SUMMARY.md"
echo ""
echo "🎉 Setup script complete!"
