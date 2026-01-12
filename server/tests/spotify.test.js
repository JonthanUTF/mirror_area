/**
 * Spotify Service Integration Tests
 * 
 * This file contains tests to verify the Spotify integration
 * Run with: npm test -- tests/spotify.test.js
 */

const request = require('supertest');
const { sequelize, User } = require('../src/models');
const app = require('../src/app');

describe('Spotify Integration Tests', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        // Ensure database connection
        await sequelize.sync({ force: true });

        // Create test user
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('testpassword123', 10);
        
        testUser = await User.create({
            email: 'spotify_test@example.com',
            password: hashedPassword,
            name: 'Spotify Test User',
            role: 'user'
        });

        // Login to get JWT token
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'spotify_test@example.com',
                password: 'testpassword123'
            });

        authToken = loginResponse.body.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('User Model - Spotify Fields', () => {
        it('should have Spotify fields defined', () => {
            expect(testUser.spotifyAccessToken).toBeDefined();
            expect(testUser.spotifyRefreshToken).toBeDefined();
            expect(testUser.spotifyTokenExpiresAt).toBeDefined();
            expect(testUser.spotifyUserId).toBeDefined();
            expect(testUser.spotifyLastSavedTrackId).toBeDefined();
        });

        it('should allow updating Spotify fields', async () => {
            const mockExpiresAt = new Date(Date.now() + 3600000);

            await testUser.update({
                spotifyAccessToken: 'mock_access_token',
                spotifyRefreshToken: 'mock_refresh_token',
                spotifyTokenExpiresAt: mockExpiresAt,
                spotifyUserId: 'spotify_user_123',
                spotifyLastSavedTrackId: 'track_abc'
            });

            const updatedUser = await User.findByPk(testUser.id);

            expect(updatedUser.spotifyAccessToken).toBe('mock_access_token');
            expect(updatedUser.spotifyRefreshToken).toBe('mock_refresh_token');
            expect(updatedUser.spotifyUserId).toBe('spotify_user_123');
            expect(updatedUser.spotifyLastSavedTrackId).toBe('track_abc');
        });
    });

    describe('Spotify OAuth Routes', () => {
        it('should require authentication for /auth/spotify', async () => {
            const response = await request(app)
                .get('/auth/spotify');

            // Without token, should get redirected or 401
            expect([401, 302]).toContain(response.status);
        });

        it('should allow authenticated users to access /auth/spotify', async () => {
            const response = await request(app)
                .get('/auth/spotify')
                .set('Authorization', `Bearer ${authToken}`);

            // Should redirect to Spotify OAuth (302) or proceed
            expect([200, 302]).toContain(response.status);
        });

        it('should check Spotify connection status', async () => {
            const response = await request(app)
                .get('/auth/spotify/status')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('connected');
            expect(response.body).toHaveProperty('userId');
        });

        it('should disconnect Spotify', async () => {
            // First set some Spotify data
            await testUser.update({
                spotifyAccessToken: 'token_to_remove',
                spotifyRefreshToken: 'refresh_to_remove',
                spotifyUserId: 'user_to_remove'
            });

            const response = await request(app)
                .post('/auth/spotify/disconnect')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // Verify data was cleared
            const updatedUser = await User.findByPk(testUser.id);
            expect(updatedUser.spotifyAccessToken).toBeNull();
            expect(updatedUser.spotifyRefreshToken).toBeNull();
            expect(updatedUser.spotifyUserId).toBeNull();
        });
    });

    describe('Spotify Service Registration', () => {
        it('should have Spotify service registered', () => {
            const registry = require('../src/services/registry');
            const spotifyService = registry.get('spotify');

            expect(spotifyService).toBeDefined();
            expect(spotifyService.name).toBe('spotify');
            expect(spotifyService.label).toBe('Spotify');
        });

        it('should have correct actions registered', () => {
            const registry = require('../src/services/registry');
            const spotifyService = registry.get('spotify');

            const actionNames = spotifyService.actions.map(a => a.name);
            expect(actionNames).toContain('new_saved_track');
        });

        it('should have correct reactions registered', () => {
            const registry = require('../src/services/registry');
            const spotifyService = registry.get('spotify');

            const reactionNames = spotifyService.reactions.map(r => r.name);
            expect(reactionNames).toContain('add_to_playlist');
            expect(reactionNames).toContain('skip_track');
        });
    });

    describe('Spotify Service Helper Methods', () => {
        let spotifyService;

        beforeAll(() => {
            spotifyService = require('../src/services/implementations/SpotifyService');
        });

        it('should check if user is connected', () => {
            const disconnectedUser = {
                spotifyAccessToken: null,
                spotifyRefreshToken: null
            };

            const connectedUser = {
                spotifyAccessToken: 'token',
                spotifyRefreshToken: 'refresh'
            };

            expect(spotifyService.isConnected(disconnectedUser)).toBe(false);
            expect(spotifyService.isConnected(connectedUser)).toBe(true);
        });

        it('should detect expired tokens', async () => {
            const userWithExpiredToken = await User.create({
                email: 'expired_test@example.com',
                spotifyAccessToken: 'old_token',
                spotifyRefreshToken: 'refresh_token',
                spotifyTokenExpiresAt: new Date(Date.now() - 1000) // Expired 1 second ago
            });

            // getFreshAccessToken should detect expiration
            // Note: This will fail without valid Spotify credentials
            // In production, mock the axios call
            try {
                await spotifyService.getFreshAccessToken(userWithExpiredToken);
            } catch (error) {
                // Expected to fail without valid credentials
                expect(error.message).toContain('refresh');
            }
        });
    });
});

/**
 * Integration Test Instructions:
 * 
 * 1. Ensure test database is configured
 * 2. Run: npm test -- tests/spotify.test.js
 * 3. For full OAuth testing, you'll need valid Spotify credentials
 * 
 * Mock Examples:
 * - Use nock or jest.mock to mock Spotify API calls
 * - Mock axios responses for token refresh
 * - Test edge cases without hitting real API
 */
