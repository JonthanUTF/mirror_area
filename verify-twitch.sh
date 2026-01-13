#!/bin/bash
# Twitch Integration - Verification Script
# Run with: ./verify-twitch.sh

echo "🎮 Verifying Twitch Integration..."
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASSED=0
FAILED=0
WARNINGS=0

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node.js not found"
    ((FAILED++))
fi

# Check npm
if command -v npm &> /dev/null; then
    VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm installed: $VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} npm not found"
    ((FAILED++))
fi

echo ""
echo "📁 Checking Files..."

# Check implementation file
if [ -f "server/src/services/implementations/TwitchService.js" ]; then
    echo -e "${GREEN}✓${NC} TwitchService.js exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} TwitchService.js not found"
    ((FAILED++))
fi

# Check migration file
if [ -f "server/migrations/add_twitch_fields.sql" ]; then
    echo -e "${GREEN}✓${NC} add_twitch_fields.sql exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} add_twitch_fields.sql not found"
    ((FAILED++))
fi

# Check test file
if [ -f "server/tests/twitch.test.js" ]; then
    echo -e "${GREEN}✓${NC} twitch.test.js exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} twitch.test.js not found"
    ((FAILED++))
fi

# Check documentation
if [ -f "docs/services/twitch.md" ]; then
    echo -e "${GREEN}✓${NC} twitch.md documentation exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} twitch.md not found"
    ((FAILED++))
fi

echo ""
echo "📝 Checking Code Integration..."

# Check User model
if grep -q "twitchAccessToken" server/src/models/index.js; then
    echo -e "${GREEN}✓${NC} User model has Twitch fields"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} User model missing Twitch fields"
    ((FAILED++))
fi

# Check passport config
if grep -q "TwitchStrategy" server/src/config/passport.js; then
    echo -e "${GREEN}✓${NC} Passport has Twitch strategy"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Passport missing Twitch strategy"
    ((FAILED++))
fi

# Check routes
if grep -q "/auth/twitch" server/src/routes/auth.js; then
    echo -e "${GREEN}✓${NC} Auth routes have Twitch endpoints"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Auth routes missing Twitch endpoints"
    ((FAILED++))
fi

# Check service loader
if grep -q "TwitchService" server/src/services/loader.js; then
    echo -e "${GREEN}✓${NC} Service loader includes Twitch"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Service loader missing Twitch"
    ((FAILED++))
fi

echo ""
echo "📦 Checking Dependencies..."

# Check package.json
if grep -q "passport-twitch-new" server/package.json; then
    echo -e "${GREEN}✓${NC} passport-twitch-new in package.json"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} passport-twitch-new not in package.json"
    ((FAILED++))
fi

# Check if installed
if [ -d "server/node_modules/passport-twitch-new" ]; then
    echo -e "${GREEN}✓${NC} passport-twitch-new installed"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} passport-twitch-new not installed (run: npm install)"
    ((WARNINGS++))
fi

echo ""
echo "🔑 Checking Environment Configuration..."

# Check .env.example
if grep -q "TWITCH_CLIENT_ID" server/.env.example; then
    echo -e "${GREEN}✓${NC} .env.example has Twitch variables"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} .env.example missing Twitch variables"
    ((FAILED++))
fi

# Check .env
if [ -f "server/.env" ]; then
    if grep -q "TWITCH_CLIENT_ID" server/.env; then
        VALUE=$(grep "TWITCH_CLIENT_ID" server/.env | cut -d'=' -f2)
        if [ "$VALUE" != "your-twitch-client-id" ] && [ -n "$VALUE" ]; then
            echo -e "${GREEN}✓${NC} TWITCH_CLIENT_ID configured in .env"
            ((PASSED++))
        else
            echo -e "${YELLOW}⚠${NC} TWITCH_CLIENT_ID not configured in .env"
            ((WARNINGS++))
        fi
    else
        echo -e "${YELLOW}⚠${NC} TWITCH_CLIENT_ID not found in .env"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠${NC} .env file not found"
    ((WARNINGS++))
fi

echo ""
echo "🧪 Testing Service Registration..."

# Test service registration
cd server
TEST_OUTPUT=$(node -e "
try {
    const registry = require('./src/services/registry');
    const loader = require('./src/services/loader');
    loader.loadServices();
    const twitch = registry.getService('twitch');
    if (twitch) {
        console.log('SUCCESS');
    } else {
        console.log('FAILED');
    }
} catch (e) {
    console.log('ERROR: ' + e.message);
}
" 2>&1 | tail -1)

if [ "$TEST_OUTPUT" = "SUCCESS" ]; then
    echo -e "${GREEN}✓${NC} Twitch service successfully registered"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Twitch service registration failed: $TEST_OUTPUT"
    ((FAILED++))
fi

cd ..

echo ""
echo "═══════════════════════════════════════"
echo ""
echo "📊 Verification Summary:"
echo ""
echo -e "   ${GREEN}✓ Passed:${NC} $PASSED"
echo -e "   ${YELLOW}⚠ Warnings:${NC} $WARNINGS"
echo -e "   ${RED}✗ Failed:${NC} $FAILED"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Integration verification FAILED${NC}"
    echo "   Please fix the errors above."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Integration INSTALLED but needs configuration${NC}"
    echo ""
    echo "   Complete these steps:"
    echo "   1. Create Twitch App: https://dev.twitch.tv/console"
    echo "   2. Update .env with credentials"
    echo "   3. Run migration: psql -U area -d area_db -f server/migrations/add_twitch_fields.sql"
    echo ""
    exit 0
else
    echo -e "${GREEN}✅ Integration verification PASSED${NC}"
    echo ""
    echo "   All checks passed! Your Twitch integration is ready."
    echo ""
    echo "   Next steps:"
    echo "   1. Start server: cd server && npm start"
    echo "   2. Test OAuth: GET /auth/twitch (with JWT)"
    echo "   3. Create AREA using Twitch service"
    echo ""
    exit 0
fi
