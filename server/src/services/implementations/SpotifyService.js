const ServiceBase = require('../ServiceBase');
const axios = require('axios');
const { User } = require('../../models');

class SpotifyService extends ServiceBase {
    constructor() {
        super('spotify', 'Spotify', 'http://localhost:8080/assets/spotify-icon.png');

        this.baseURL = 'https://api.spotify.com/v1';
        this.tokenURL = 'https://accounts.spotify.com/api/token';

        // Register Action (Trigger)
        this.registerAction('new_saved_track', 'Triggers when user saves a new track to their library', {});

        // Register Reactions
        this.registerReaction('add_to_playlist', 'Adds a track to a specified playlist', {
            playlistId: 'string',
            trackUri: 'string' // Can come from trigger data or be specified
        });

        this.registerReaction('skip_track', 'Skips to the next track in playback', {});
    }

    /**
     * CRITICAL: Get a fresh access token for the user
     * Automatically refreshes if expired
     */
    async getFreshAccessToken(user) {
        try {
            // Check if token is still valid (with 5-minute buffer)
            const now = new Date();
            const expiresAt = new Date(user.spotifyTokenExpiresAt);
            const bufferTime = 5 * 60 * 1000; // 5 minutes

            if (expiresAt > new Date(now.getTime() + bufferTime)) {
                // Token is still valid
                return user.spotifyAccessToken;
            }

            // Token expired or about to expire - refresh it
            console.log(`[SpotifyService] Refreshing token for user ${user.id}`);

            if (!user.spotifyRefreshToken) {
                throw new Error('No refresh token available for user');
            }

            const response = await axios.post(
                this.tokenURL,
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: user.spotifyRefreshToken,
                    client_id: process.env.SPOTIFY_CLIENT_ID,
                    client_secret: process.env.SPOTIFY_CLIENT_SECRET
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const { access_token, expires_in, refresh_token } = response.data;
            const newExpiresAt = new Date(Date.now() + expires_in * 1000);

            // Update user in database
            await user.update({
                spotifyAccessToken: access_token,
                spotifyTokenExpiresAt: newExpiresAt,
                // Spotify may return a new refresh token
                ...(refresh_token && { spotifyRefreshToken: refresh_token })
            });

            return access_token;
        } catch (error) {
            console.error('[SpotifyService] Token refresh failed:', error.response?.data || error.message);
            throw new Error(`Failed to refresh Spotify token: ${error.response?.data?.error_description || error.message}`);
        }
    }

    /**
     * Make authenticated request to Spotify API
     */
    async makeRequest(user, method, endpoint, data = null) {
        try {
            const accessToken = await this.getFreshAccessToken(user);

            const config = {
                method,
                url: `${this.baseURL}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Spotify authentication failed. User needs to reconnect.');
            }
            throw error;
        }
    }

    /**
     * Get user's saved tracks (Liked Songs)
     */
    async getSavedTracks(user, limit = 1) {
        try {
            return await this.makeRequest(user, 'GET', `/me/tracks?limit=${limit}`);
        } catch (error) {
            console.error('[SpotifyService] Error fetching saved tracks:', error.response?.data || error.message);
            throw new Error(`Failed to fetch saved tracks: ${error.message}`);
        }
    }

    /**
     * Add track to playlist
     */
    async addTrackToPlaylist(user, playlistId, trackUri) {
        try {
            // Ensure trackUri is in correct format (spotify:track:ID)
            const uri = trackUri.startsWith('spotify:track:')
                ? trackUri
                : `spotify:track:${trackUri}`;

            await this.makeRequest(
                user,
                'POST',
                `/playlists/${playlistId}/tracks`,
                { uris: [uri] }
            );

            return { success: true, message: 'Track added to playlist' };
        } catch (error) {
            console.error('[SpotifyService] Error adding track to playlist:', error.response?.data || error.message);
            throw new Error(`Failed to add track to playlist: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Skip to next track in playback
     */
    async skipToNext(user) {
        try {
            await this.makeRequest(user, 'POST', '/me/player/next');
            return { success: true, message: 'Skipped to next track' };
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('No active playback device found');
            }
            console.error('[SpotifyService] Error skipping track:', error.response?.data || error.message);
            throw new Error(`Failed to skip track: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Check if user has Spotify connected
     */
    isConnected(user) {
        return !!(user.spotifyAccessToken && user.spotifyRefreshToken);
    }

    /**
     * ACTION: Check for new saved track
     * This is the trigger that detects when user saves a new song
     */
    async checkTrigger(action, area, params) {
        if (action !== 'new_saved_track') {
            return false;
        }

        try {
            // Fetch user from database
            const user = await User.findByPk(area.userId);

            if (!user) {
                console.error(`[SpotifyService] User ${area.userId} not found`);
                return false;
            }

            if (!this.isConnected(user)) {
                console.log(`[SpotifyService] Spotify not connected for user ${area.userId}`);
                return false;
            }

            // Get the most recent saved track
            const response = await this.getSavedTracks(user, 1);

            if (!response.items || response.items.length === 0) {
                console.log(`[SpotifyService] No saved tracks found for user ${area.userId}`);
                return false;
            }

            const latestTrack = response.items[0].track;
            const latestTrackId = latestTrack.id;

            // Compare with stored state
            if (user.spotifyLastSavedTrackId === latestTrackId) {
                // No new track
                return false;
            }

            // New track detected! Update state
            await user.update({
                spotifyLastSavedTrackId: latestTrackId
            });

            console.log(`[SpotifyService] New saved track detected for user ${area.userId}: ${latestTrack.name}`);

            // Store trigger data in area parameters for reactions to use
            area.triggerData = {
                trackId: latestTrack.id,
                trackUri: latestTrack.uri,
                trackName: latestTrack.name,
                artistName: latestTrack.artists.map(a => a.name).join(', '),
                albumName: latestTrack.album.name,
                albumImage: latestTrack.album.images[0]?.url,
                addedAt: response.items[0].added_at,
                previewUrl: latestTrack.preview_url,
                externalUrl: latestTrack.external_urls.spotify
            };

            return true;
        } catch (error) {
            console.error(`[SpotifyService] Error in checkTrigger:`, error.message);
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
                throw new Error('Spotify not connected for this user');
            }

            if (reaction === 'add_to_playlist') {
                // Use trackUri from params or trigger data
                const trackUri = params.trackUri || area.triggerData?.trackUri;
                const playlistId = params.playlistId;

                if (!playlistId) {
                    throw new Error('Playlist ID is required');
                }

                if (!trackUri) {
                    throw new Error('Track URI is required');
                }

                const result = await this.addTrackToPlaylist(user, playlistId, trackUri);
                console.log(`[SpotifyService] Track added to playlist ${playlistId} for user ${user.id}`);
                return result;
            }
            else if (reaction === 'skip_track') {
                const result = await this.skipToNext(user);
                console.log(`[SpotifyService] Skipped track for user ${user.id}`);
                return result;
            }
            else {
                throw new Error(`Unknown reaction: ${reaction}`);
            }
        } catch (error) {
            console.error(`[SpotifyService] Error executing reaction ${reaction}:`, error.message);
            throw error;
        }
    }
}

module.exports = new SpotifyService();
