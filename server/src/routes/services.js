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
                redirect_uri: process.env.GOOGLE_CALLBACK_URL?.replace('/auth/google/callback', '/services/google/callback') || 'http://localhost:8080/services/google/callback',
                client_id: process.env.GOOGLE_CLIENT_ID,
                access_type: 'offline', // Essential for refresh_token
                response_type: 'code',
                prompt: 'consent',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/gmail.send'
                    // Add other scopes here as needed
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
    }
};

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
        const finalRedirectUri = redirectUri || (process.env.GOOGLE_CALLBACK_URL?.replace('/auth/google/callback', '/services/google/callback') || 'http://localhost:8080/services/google/callback');

        const tokenData = await factory.exchangeCode(code, finalRedirectUri);

        // 2. Find internal Service ID
        const service = await Service.findOne({ where: { name: serviceName } });
        if (!service) {
            return res.status(404).json({ error: 'Service not found in registry' });
        }

        // 3. Save to UserService (Upsert)
        const [userService, created] = await UserService.upsert({
            userId: req.user.id,
            serviceId: service.id,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token, // Only present if access_type=offline
            expiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
        }, {
            returning: true
        });

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

// Delete connection
router.delete('/:serviceName', authenticateToken, async (req, res) => {
    // ... Implementation for later
    res.status(501).json({ error: 'Not implemented yet' });
});

module.exports = router;
