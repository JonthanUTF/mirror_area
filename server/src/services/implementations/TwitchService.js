const ServiceBase = require('../ServiceBase');
const axios = require('axios');
const { User } = require('../../models');

class TwitchService extends ServiceBase {
    constructor() {
        super('twitch', 'Twitch', 'http://localhost:8080/assets/twitch-icon.png');

        this.baseURL = 'https://api.twitch.tv/helix';
        this.tokenURL = 'https://id.twitch.tv/oauth2/token';

        // Register Action (Trigger)
        this.registerAction('streamer_live', 'Triggers when a specific streamer goes live', {
            username: 'string' // Twitch username to monitor
        });

        // Register Reaction
        this.registerReaction('block_user', 'Blocks a specified user on Twitch', {
            username: 'string' // Username to block
        });
    }

    /**
     * CRITICAL: Get a fresh access token for the user
     * Automatically refreshes if expired
     */
    async getFreshAccessToken(user) {
        try {
            // Check if token is still valid (with 5-minute buffer)
            const now = new Date();
            const expiresAt = new Date(user.twitchTokenExpiresAt);
            const bufferTime = 5 * 60 * 1000; // 5 minutes

            if (expiresAt > new Date(now.getTime() + bufferTime)) {
                // Token is still valid
                return user.twitchAccessToken;
            }

            // Token expired or about to expire - refresh it
            console.log(`[TwitchService] Refreshing token for user ${user.id}`);

            if (!user.twitchRefreshToken) {
                throw new Error('No refresh token available for user');
            }

            const response = await axios.post(
                this.tokenURL,
                null,
                {
                    params: {
                        grant_type: 'refresh_token',
                        refresh_token: user.twitchRefreshToken,
                        client_id: process.env.TWITCH_CLIENT_ID,
                        client_secret: process.env.TWITCH_CLIENT_SECRET
                    }
                }
            );

            const { access_token, refresh_token, expires_in } = response.data;
            const newExpiresAt = new Date(Date.now() + expires_in * 1000);

            // Update user in database
            await user.update({
                twitchAccessToken: access_token,
                twitchTokenExpiresAt: newExpiresAt,
                // Twitch may return a new refresh token
                ...(refresh_token && { twitchRefreshToken: refresh_token })
            });

            return access_token;
        } catch (error) {
            console.error('[TwitchService] Token refresh failed:', error.response?.data || error.message);
            throw new Error(`Failed to refresh Twitch token: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Make authenticated request to Twitch API
     * CRITICAL: Must include BOTH Authorization and Client-Id headers
     */
    async makeRequest(user, method, endpoint, data = null, params = null) {
        try {
            const accessToken = await this.getFreshAccessToken(user);

            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Client-Id': process.env.TWITCH_CLIENT_ID, // CRITICAL: Twitch requires this
                    'Content-Type': 'application/json'
                }
            };

            if (params) {
                config.params = params;
            }

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                // Token invalid, try refreshing once
                console.log('[TwitchService] 401 error, attempting token refresh...');
                try {
                    const newToken = await this.getFreshAccessToken(user);
                    // Retry request with new token
                    const retryConfig = {
                        method,
                        url: `${this.baseURL}${endpoint}`,
                        headers: {
                            'Authorization': `Bearer ${newToken}`,
                            'Client-Id': process.env.TWITCH_CLIENT_ID,
                            'Content-Type': 'application/json'
                        }
                    };
                    if (params) retryConfig.params = params;
                    if (data) retryConfig.data = data;

                    const retryResponse = await axios(retryConfig);
                    return retryResponse.data;
                } catch (retryError) {
                    throw new Error('Twitch authentication failed. User needs to reconnect.');
                }
            }
            throw error;
        }
    }

    /**
     * Resolve Twitch username to user ID
     */
    async resolveUsernameToId(user, username) {
        try {
            const response = await this.makeRequest(user, 'GET', '/users', null, { login: username });

            if (!response.data || response.data.length === 0) {
                throw new Error(`Twitch user '${username}' not found`);
            }

            return response.data[0].id;
        } catch (error) {
            console.error('[TwitchService] Error resolving username:', error.message);
            throw new Error(`Failed to resolve Twitch username: ${error.message}`);
        }
    }

    /**
     * Check if a stream is live
     */
    async getStreamStatus(user, userId) {
        try {
            const response = await this.makeRequest(user, 'GET', '/streams', null, { user_id: userId });

            if (!response.data || response.data.length === 0) {
                // Stream is offline
                return { isLive: false };
            }

            // Stream is live
            const stream = response.data[0];
            return {
                isLive: true,
                streamId: stream.id,
                title: stream.title,
                viewerCount: stream.viewer_count,
                startedAt: stream.started_at,
                gameName: stream.game_name,
                thumbnailUrl: stream.thumbnail_url
            };
        } catch (error) {
            console.error('[TwitchService] Error checking stream status:', error.message);
            throw new Error(`Failed to check stream status: ${error.message}`);
        }
    }

    /**
     * Block a user on Twitch
     */
    async blockUser(user, targetUserId) {
        try {
            await this.makeRequest(user, 'PUT', '/users/blocks', null, { target_user_id: targetUserId });
            return { success: true, message: 'User blocked successfully' };
        } catch (error) {
            console.error('[TwitchService] Error blocking user:', error.response?.data || error.message);
            throw new Error(`Failed to block user: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Check if user has Twitch connected
     */
    isConnected(user) {
        return !!(user.twitchAccessToken && user.twitchRefreshToken);
    }

    /**
     * ACTION: Check if streamer goes live
     * This is the trigger that detects "Offline -> Live" transition
     */
    async checkTrigger(action, area, params) {
        if (action !== 'streamer_live') {
            return false;
        }

        try {
            // Fetch user from database
            const user = await User.findByPk(area.userId);

            if (!user) {
                console.error(`[TwitchService] User ${area.userId} not found`);
                return false;
            }

            if (!this.isConnected(user)) {
                console.log(`[TwitchService] Twitch not connected for user ${area.userId}`);
                return false;
            }

            // Get streamer username from parameters
            const streamerUsername = params.username;
            if (!streamerUsername) {
                console.error(`[TwitchService] Missing 'username' parameter for trigger`);
                return false;
            }

            // Resolve username to ID
            const streamerId = await this.resolveUsernameToId(user, streamerUsername);

            // Get current stream status
            const currentStatus = await this.getStreamStatus(user, streamerId);

            // Get stored state (previous status)
            const stateKey = `streamer_${streamerUsername}`;
            const storedState = user.twitchStreamLastStatus || {};
            const previouslyLive = storedState[stateKey]?.isLive || false;

            // Update stored state
            const newState = { ...storedState };
            newState[stateKey] = {
                isLive: currentStatus.isLive,
                checkedAt: new Date().toISOString()
            };

            await user.update({
                twitchStreamLastStatus: newState
            });

            // Check for "Offline -> Live" transition
            if (currentStatus.isLive && !previouslyLive) {
                console.log(`[TwitchService] Streamer ${streamerUsername} went LIVE for user ${area.userId}`);

                // Store trigger data for reactions
                area.triggerData = {
                    streamerId: streamerId,
                    streamerUsername: streamerUsername,
                    streamId: currentStatus.streamId,
                    title: currentStatus.title,
                    viewerCount: currentStatus.viewerCount,
                    startedAt: currentStatus.startedAt,
                    gameName: currentStatus.gameName,
                    thumbnailUrl: currentStatus.thumbnailUrl
                };

                return true;
            }

            return false;
        } catch (error) {
            console.error(`[TwitchService] Error in checkTrigger:`, error.message);
            return false;
        }
    }

    /**
     * REACTION: Execute reactions
     */
    async executeReaction(reaction, area, params) {
        try {
            // Fetch user from database
            const user = await User.findByPk(area.userId);

            if (!user) {
                throw new Error('User not found');
            }

            if (!this.isConnected(user)) {
                throw new Error('Twitch not connected for this user');
            }

            if (reaction === 'block_user') {
                // Get username from parameters
                const usernameToBlock = params.username;

                if (!usernameToBlock) {
                    throw new Error('Username is required to block a user');
                }

                // Resolve username to ID
                const targetUserId = await this.resolveUsernameToId(user, usernameToBlock);

                // Block the user
                const result = await this.blockUser(user, targetUserId);
                console.log(`[TwitchService] User ${usernameToBlock} blocked for user ${user.id}`);
                return result;
            }
            else {
                throw new Error(`Unknown reaction: ${reaction}`);
            }
        } catch (error) {
            console.error(`[TwitchService] Error executing reaction ${reaction}:`, error.message);
            throw error;
        }
    }
}

module.exports = new TwitchService();
