const ServiceBase = require('../ServiceBase');
const { google } = require('googleapis');
const { UserService, Service } = require('../../models');

class EmailService extends ServiceBase {
    constructor() {
        super('google', 'Google (Gmail)', 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg');

        // Actions (Triggers)
        this.registerAction('new_email', 'Triggers when a new email is received', {
            from: 'string', // Filter by sender (optional)
            subject: 'string' // Filter by subject (optional)
        });

        this.registerAction('email_received', 'Triggers when any email is received', {});

        this.registerAction('email_from_sender', 'Triggers when an email is received from a specific sender', {
            sender: 'string' // Required: sender email address
        });

        this.registerAction('email_with_keyword', 'Triggers when an email with a keyword in subject is received', {
            keyword: 'string' // Required: keyword to search in subject
        });

        this.registerAction('email_with_attachment', 'Triggers when an email with attachment is received', {
            from: 'string' // Optional: filter by sender
        });

        // Reactions
        this.registerReaction('send_email', 'Sends an email via Gmail', {
            recipient: 'string',
            subject: 'string',
            body: 'string'
        });
    }

    async getAuthClient(userId) {
        // 1. Find the service ID for 'email' (or 'google')
        // In our registry we called it 'email', but in DB it might be 'google' 
        // depending on how we seeded it. Let's assume we look up by name 'email' or 'google'.
        // NOTE: In routes/services.js we used the serviceName from URL.
        // If we registered "EmailService" as "email", we should consistent.

        const service = await Service.findOne({ where: { name: 'google' } });
        if (!service) throw new Error('Service "google" not found in DB');

        const userService = await UserService.findOne({
            where: { userId, serviceId: service.id }
        });

        if (!userService || !userService.accessToken) {
            throw new Error('User is not connected to Gmail');
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET
        );

        oauth2Client.setCredentials({
            access_token: userService.accessToken,
            refresh_token: userService.refreshToken
            // Note: If token is expired, googleapis handles refresh if refresh_token is present
        });

        return oauth2Client;
    }

    async checkTrigger(action, area, params) {
        try {
            const auth = await this.getAuthClient(area.userId);
            const gmail = google.gmail({ version: 'v1', auth });

            // Build query based on action type
            let q = '';

            switch (action) {
                case 'new_email':
                    // Original behavior: filter by from and/or subject
                    if (params.from) q += `from:${params.from} `;
                    if (params.subject) q += `subject:${params.subject} `;
                    break;

                case 'email_received':
                    // Any email received - no filters
                    break;

                case 'email_from_sender':
                    // Email from specific sender
                    if (params.sender) q += `from:${params.sender} `;
                    break;

                case 'email_with_keyword':
                    // Email with keyword in subject
                    if (params.keyword) q += `subject:${params.keyword} `;
                    break;

                case 'email_with_attachment':
                    // Email with attachment
                    q += 'has:attachment ';
                    if (params.from) q += `from:${params.from} `;
                    break;

                default:
                    console.log(`[GmailService] Unknown action: ${action}`);
                    return false;
            }

            // Only check emails received AFTER the last trigger
            if (area.lastTriggered) {
                const seconds = Math.floor(new Date(area.lastTriggered).getTime() / 1000);
                q += `after:${seconds}`;
            }

            const res = await gmail.users.messages.list({
                userId: 'me',
                q: q.trim(),
                maxResults: 10
            });

            if (res.data.messages && res.data.messages.length > 0) {
                console.log(`[GmailService] Found ${res.data.messages.length} new messages matching criteria for action: ${action}`);
                return true; // Triggered!
            }

            return false;

        } catch (error) {
            console.error('[GmailService] Check Action Error:', error.message);
            return false;
        }
    }

    async executeReaction(reaction, area, params) {
        if (reaction === 'send_email') {
            try {
                const auth = await this.getAuthClient(area.userId);
                const gmail = google.gmail({ version: 'v1', auth });

                const recipient = params.recipient;
                const subject = params.subject || 'No Subject';
                const body = params.body || '';

                // Constuct raw email (RFC 2822)
                const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
                const messageParts = [
                    `To: ${recipient}`,
                    'Content-Type: text/plain; charset=utf-8',
                    'MIME-Version: 1.0',
                    `Subject: ${utf8Subject}`,
                    '',
                    body
                ];
                const message = messageParts.join('\n');

                // Encode the message to base64url
                const encodedMessage = Buffer.from(message)
                    .toString('base64')
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=+$/, '');

                await gmail.users.messages.send({
                    userId: 'me',
                    requestBody: {
                        raw: encodedMessage
                    }
                });

                console.log(`[GmailService] Email sent to ${recipient}`);
            } catch (error) {
                console.error('[GmailService] Execute Reaction Error:', error.message);
            }
        }
    }
}

module.exports = new EmailService();
