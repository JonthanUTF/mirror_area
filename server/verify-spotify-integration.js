/**
 * Spotify Integration Verification
 * Run this file to verify the Spotify integration is properly configured
 * 
 * Usage: node verify-spotify-integration.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Spotify Integration...\n');

let errors = 0;
let warnings = 0;
let success = 0;

// Helper functions
function checkFile(filePath, description) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        console.log(`✅ ${description}`);
        success++;
        return true;
    } else {
        console.log(`❌ ${description}`);
        console.log(`   Missing: ${filePath}`);
        errors++;
        return false;
    }
}

function checkFileContains(filePath, searchString, description) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(searchString)) {
            console.log(`✅ ${description}`);
            success++;
            return true;
        } else {
            console.log(`❌ ${description}`);
            console.log(`   File exists but doesn't contain: "${searchString}"`);
            errors++;
            return false;
        }
    } else {
        console.log(`❌ ${description}`);
        console.log(`   File not found: ${filePath}`);
        errors++;
        return false;
    }
}

function checkEnvVar(envFile, varName, description) {
    const fullPath = path.join(__dirname, envFile);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(`${varName}=`)) {
            const line = content.split('\n').find(l => l.startsWith(varName));
            const value = line ? line.split('=')[1].trim() : '';
            
            if (value && value !== `your-${varName.toLowerCase().replace(/_/g, '-')}`) {
                console.log(`✅ ${description}: Configured`);
                success++;
                return true;
            } else {
                console.log(`⚠️  ${description}: Not configured yet`);
                warnings++;
                return false;
            }
        } else {
            console.log(`⚠️  ${description}: Variable not found in ${envFile}`);
            warnings++;
            return false;
        }
    } else {
        console.log(`⚠️  ${description}: ${envFile} not found`);
        warnings++;
        return false;
    }
}

function checkPackageJson(packageName, description) {
    const fullPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(fullPath)) {
        const pkg = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        if (pkg.dependencies && pkg.dependencies[packageName]) {
            console.log(`✅ ${description}: ${pkg.dependencies[packageName]}`);
            success++;
            return true;
        } else {
            console.log(`❌ ${description}: Not found in package.json`);
            console.log(`   Run: npm install ${packageName}`);
            errors++;
            return false;
        }
    } else {
        console.log(`❌ ${description}: package.json not found`);
        errors++;
        return false;
    }
}

// Start verification
console.log('📁 Checking Files...\n');

// Core implementation files
checkFile('src/services/implementations/SpotifyService.js', 'SpotifyService implementation');
checkFile('migrations/add_spotify_fields.sql', 'Database migration SQL');
checkFile('tests/spotify.test.js', 'Test suite');

console.log('\n📝 Checking Code Integration...\n');

// Model updates
checkFileContains('src/models/index.js', 'spotifyAccessToken', 'User model - Spotify fields added');

// Passport config
checkFileContains('src/config/passport.js', 'SpotifyStrategy', 'Passport - Spotify strategy imported');
checkFileContains('src/config/passport.js', 'SPOTIFY_CLIENT_ID', 'Passport - Spotify strategy configured');

// Routes
checkFileContains('src/routes/auth.js', '/auth/spotify', 'Auth routes - Spotify endpoints added');
checkFileContains('src/routes/auth.js', 'passport.authenticate(\'spotify\'', 'Auth routes - Spotify authentication');

// Service loader
checkFileContains('src/services/loader.js', 'SpotifyService', 'Service loader - Spotify imported');
checkFileContains('src/services/loader.js', 'registry.register(SpotifyService)', 'Service loader - Spotify registered');

console.log('\n📦 Checking Dependencies...\n');

// Package dependencies
checkPackageJson('passport-spotify', 'passport-spotify package');

console.log('\n🔑 Checking Environment Configuration...\n');

// Environment variables
checkEnvVar('.env', 'SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_ID');
checkEnvVar('.env', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_CLIENT_SECRET');
checkEnvVar('.env', 'SPOTIFY_CALLBACK_URL', 'SPOTIFY_CALLBACK_URL');

// .env.example should always have the vars
checkFileContains('.env.example', 'SPOTIFY_CLIENT_ID', '.env.example - Spotify vars documented');

console.log('\n📚 Checking Documentation...\n');

// Documentation
checkFile('../docs/services/spotify.md', 'Spotify service documentation');
checkFile('SPOTIFY_INTEGRATION.md', 'Quick start guide');
checkFile('../SPOTIFY_INTEGRATION_SUMMARY.md', 'Integration summary');

console.log('\n═══════════════════════════════════════════════════════\n');

// Summary
console.log('📊 Verification Summary:\n');
console.log(`   ✅ Passed: ${success}`);
console.log(`   ⚠️  Warnings: ${warnings}`);
console.log(`   ❌ Errors: ${errors}`);
console.log('');

if (errors > 0) {
    console.log('❌ Integration verification FAILED');
    console.log('   Please fix the errors above before proceeding.');
    console.log('');
    process.exit(1);
} else if (warnings > 0) {
    console.log('⚠️  Integration is INSTALLED but NOT CONFIGURED');
    console.log('   Complete these steps:');
    console.log('   1. Install dependencies: npm install passport-spotify');
    console.log('   2. Create Spotify App at https://developer.spotify.com/dashboard');
    console.log('   3. Update .env with your Spotify credentials');
    console.log('   4. Run database migration: psql -U area -d area_db -f migrations/add_spotify_fields.sql');
    console.log('');
    process.exit(0);
} else {
    console.log('✅ Integration verification PASSED');
    console.log('   All files are in place and configured!');
    console.log('   Your Spotify integration is ready to use.');
    console.log('');
    console.log('   Next steps:');
    console.log('   1. Start your server: npm start');
    console.log('   2. Test OAuth: GET /auth/spotify (with JWT token)');
    console.log('   3. Create an AREA using Spotify service');
    console.log('');
    process.exit(0);
}
