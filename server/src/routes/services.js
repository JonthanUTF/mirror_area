const express = require('express');
const router = express.Router();
const { Service, UserService } = require('../models');
const { authenticateToken } = require('./auth');
const axios = require('axios');

// Map of service factories for OAuth generation
const authFactories = {
    google: {
        getAuthUrl: () => {
            const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
            const options = {
                redirect_uri: (process.env.CLIENT_URL || 'http://localhost:8081') + '/services/callback',
                client_id: process.env.GOOGLE_CLIENT_ID,
                access_type: 'offline',
                response_type: 'code',
                prompt: 'consent',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/gmail.readonly',
                    'https://www.googleapis.com/auth/gmail.send',
                    'https://www.googleapis.com/auth/gmail.modify'
                ].join(' ')
            };

            const qs = new URLSearchParams(options);
            return `${rootUrl}?${qs.toString()}`;
        },
        exchangeCode: async (code, redirectUri) => {
            const tokenUrl = 'https://oauth2.googleapis.com/token';
            const values = {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            };

            const response = await axios.post(tokenUrl, new URLSearchParams(values).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        }
    },
    github: {
        getAuthUrl: () => {
            const rootUrl = 'https://github.com/login/oauth/authorize';
            const options = {
                client_id: process.env.GITHUB_CLIENT_ID,
                redirect_uri: (process.env.CLIENT_URL || 'http://localhost:8081') + '/services/callback',
                scope: 'user:email repo admin:repo_hook write:discussion'
            };
            const qs = new URLSearchParams(options);
            return `${rootUrl}?${qs.toString()}`;
        },
        exchangeCode: async (code, redirectUri) => {
            const tokenUrl = 'https://github.com/login/oauth/access_token';
            const values = {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: redirectUri
            };
            const response = await axios.post(tokenUrl, new URLSearchParams(values).toString(), {
                headers: { Accept: 'application/json' }
            });
            return response.data;
        }
    },
    twitch: {
        getAuthUrl: (state) => {
            const rootUrl = 'https://id.twitch.tv/oauth2/authorize';
            const options = {
                client_id: process.env.TWITCH_CLIENT_ID,
                redirect_uri: process.env.TWITCH_CALLBACK_URL || 'http://localhost:8080/auth/twitch/callback',
                response_type: 'code',
                scope: 'user:read:follows user:manage:blocked_users',
                state: state || ''
            };

            const qs = new URLSearchParams(options);
            return `${rootUrl}?${qs.toString()}`;
        },
        exchangeCode: async (code, redirectUri) => {
            const tokenUrl = 'https://id.twitch.tv/oauth2/token';
            const values = {
                code,
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                redirect_uri: redirectUri || process.env.TWITCH_CALLBACK_URL || 'http://localhost:8080/auth/twitch/callback',
                grant_type: 'authorization_code',
            };

            const response = await axios.post(tokenUrl, new URLSearchParams(values).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        }
    },
    microsoft: {
        getAuthUrl: () => {
            const rootUrl = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize';
            const options = {
                client_id: process.env.MICROSOFT_CLIENT_ID,
                response_type: 'code',
                redirect_uri: (process.env.CLIENT_URL || 'http://localhost:8081') + '/services/callback',
                prompt: 'consent',
                scope: [
                    'Files.Read',
                    'Files.Read.All',
                    'Files.ReadWrite',
                    'Files.ReadWrite.All',
                    'Mail.Read',
                    'Mail.ReadWrite',
                    'Mail.Send',
                    'offline_access',
                    'User.Read'
                ].join(' ')
            };

            const qs = new URLSearchParams(options);
            return `${rootUrl}?${qs.toString()}`;
        },
        exchangeCode: async (code, redirectUri) => {
            const tokenUrl = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/token';
            const values = {
                client_id: process.env.MICROSOFT_CLIENT_ID,
                client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri
            };
            const response = await axios.post(tokenUrl, new URLSearchParams(values).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log('[Microsoft] Token response:', JSON.stringify(response.data, null, 2));
            return response.data;
        }
    },
    dropbox: {
        getAuthUrl: () => {
            const rootUrl = 'https://www.dropbox.com/oauth2/authorize';
            const options = {
                client_id: process.env.DROPBOX_CLIENT_ID,
                redirect_uri: (process.env.CLIENT_URL || 'http://localhost:8081') + '/services/callback',
                response_type: 'code',
                token_access_type: 'offline',
                scope: 'files.metadata.read files.metadata.write files.content.read files.content.write'
            };

            const qs = new URLSearchParams(options);
            return `${rootUrl}?${qs.toString()}`;
        },
        exchangeCode: async (code, redirectUri) => {
            const response = await axios.post('https://api.dropboxapi.com/oauth2/token', null, {
                params: {
                    code,
                    grant_type: 'authorization_code',
                    client_id: process.env.DROPBOX_CLIENT_ID,
                    client_secret: process.env.DROPBOX_CLIENT_SECRET,
                    redirect_uri: redirectUri
                }
            });

            console.log('[DropBox] Token response:', JSON.stringify(response.data, null, 2));
            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                expiresIn: response.data.expires_in,
                accountId: response.data.account_id
            };
        }
    }
};

// List all available services
router.get('/available', authenticateToken, async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { active: true },
            attributes: ['id', 'name', 'label', 'icon']
        });
        res.json({ services });
    } catch (error) {
        console.error('List available services error:', error);
        res.status(500).json({ error: 'Failed to retrieve available services' });
    }
});

// Initiate Connection
router.get('/:serviceName/connect', authenticateToken, async (req, res) => {
    const { serviceName } = req.params;

    try {
        const factory = authFactories[serviceName];
        if (!factory) {
            return res.status(404).json({ error: 'Service connection not supported' });
        }

        const url = factory.getAuthUrl();
        console.log(`[Services] Generated Auth URL for ${serviceName}:`, url);
        res.json({ url });
    } catch (error) {
        console.error('Auth URL generation error:', error);
        res.status(500).json({ error: 'Failed to generate auth URL' });
    }
});

// Callback / Finalize Connection
router.post('/:serviceName/callback', authenticateToken, async (req, res) => {
    const { serviceName } = req.params;
    const { code, redirectUri } = req.body; // Frontend sends the code

    try {
        const factory = authFactories[serviceName];
        if (!factory) {
            return res.status(404).json({ error: 'Service connection not supported' });
        }

        // 1. Exchange Code for Tokens
        // Determine redirect URI (should match what was used in connect)
        // For simplicity, we assume generic or passed from frontend
        const finalRedirectUri = redirectUri || ((process.env.CLIENT_URL || 'http://localhost:8081') + '/services/callback');

        const tokenData = await factory.exchangeCode(code, finalRedirectUri);

        // 2. Find internal Service ID
        const service = await Service.findOne({ where: { name: serviceName } });
        if (!service) {
            return res.status(404).json({ error: 'Service not found in registry' });
        }

        // 3. Handle both camelCase (from our factories) and snake_case (raw API responses)
        const accessToken = tokenData.accessToken || tokenData.access_token;
        const refreshToken = tokenData.refreshToken || tokenData.refresh_token;
        const expiresIn = tokenData.expiresIn || tokenData.expires_in;

        console.log(`[Services] Token for ${serviceName}: hasAccess=${!!accessToken}, hasRefresh=${!!refreshToken}`);

        if (!accessToken) {
            console.error(`[Services] No access token received for ${serviceName}`);
            return res.status(400).json({ error: 'No access token received from provider' });
        }

        // 4. Save to UserService (Upsert)
        // Note: GitHub tokens don't expire (no expires_in), so we set a far-future date
        const expiresAt = expiresIn
            ? new Date(Date.now() + expiresIn * 1000)
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year for GitHub

        const [userService, created] = await UserService.upsert({
            userId: req.user.id,
            serviceId: service.id,
            accessToken: accessToken,
            refreshToken: refreshToken || null,
            expiresAt: expiresAt
        }, {
            returning: true
        });

        console.log(`[Services] ${serviceName} connected for user ${req.user.id}, token length: ${accessToken?.length}`);

        res.json({
            message: 'Service connected successfully',
            connected: true
        });

    } catch (error) {
        console.error('Service connection error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to connect service', details: error.response?.data });
    }
});

// List connected services
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userServices = await UserService.findAll({
            where: { userId: req.user.id },
            include: [{ model: Service, as: 'service', attributes: ['name', 'label', 'icon'] }]
        });

        res.json(userServices.map(us => ({
            service: us.service,
            connectedAt: us.createdAt,
            expiresAt: us.expiresAt
        })));
    } catch (error) {
        console.error('List services error:', error);
        res.status(500).json({ error: 'Failed to retrieve services' });
    }
});

// Disconnect a service (POST version for frontend compatibility)
router.post('/:serviceName/disconnect', authenticateToken, async (req, res) => {
    const { serviceName } = req.params;

    try {
        // Find the service by name
        const service = await Service.findOne({ where: { name: serviceName } });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Delete the user's connection to this service
        const deleted = await UserService.destroy({
            where: {
                userId: req.user.id,
                serviceId: service.id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Service connection not found' });
        }

        console.log(`[Services] User ${req.user.id} disconnected from ${serviceName}`);
        res.json({ message: `${serviceName} disconnected successfully`, disconnected: true });
    } catch (error) {
        console.error('Disconnect service error:', error);
        res.status(500).json({ error: 'Failed to disconnect service' });
    }
});

// Delete connection (DELETE version)
router.delete('/:serviceName', authenticateToken, async (req, res) => {
    const { serviceName } = req.params;

    try {
        // Find the service by name
        const service = await Service.findOne({ where: { name: serviceName } });
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Delete the user's connection to this service
        const deleted = await UserService.destroy({
            where: {
                userId: req.user.id,
                serviceId: service.id
            }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Service connection not found' });
        }

        console.log(`[Services] User ${req.user.id} disconnected from ${serviceName}`);
        res.json({ message: `${serviceName} disconnected successfully`, disconnected: true });
    } catch (error) {
        console.error('Disconnect service error:', error);
        res.status(500).json({ error: 'Failed to disconnect service' });
    }
});

module.exports = router;
