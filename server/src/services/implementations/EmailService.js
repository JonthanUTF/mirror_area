const ServiceBase = require('../ServiceBase');
const { google } = require('googleapis');
const { UserService, Service } = require('../../models');

class EmailService extends ServiceBase {
    constructor() {
        super('email', 'Gmail', 'http://localhost:8080/assets/gmail-icon.png');

        this.registerAction('new_email', 'Triggers when a new email is received', {
            from: 'string', // Filter by sender
            subject: 'string' // Filter by subject
        });

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

        const service = await Service.findOne({ where: { name: 'email' } });
        if (!service) throw new Error('Service "email" not found in DB');

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
        if (action === 'new_email') {
            try {
                const auth = await this.getAuthClient(area.userId);
                const gmail = google.gmail({ version: 'v1', auth });

                // Build query
                let q = '';
                if (params.from) q += `from:${params.from} `;
                if (params.subject) q += `subject:${params.subject} `;

                // Only check emails received AFTER the last trigger
                if (area.lastTriggered) {
                    const seconds = Math.floor(new Date(area.lastTriggered).getTime() / 1000);
                    q += `after:${seconds}`;
                } else {
                    // First run: don't trigger on old emails, just init
                    // Or maybe trigger on very recent ones? Let's say last 1 min for safety if null
                    // For now, let's treat "never triggered" as "check recent"
                    // But usually we don't want to trigger on backlog. 
                    // Let's return false if it's the very first run to "mark" the start time?
                    // Actually, automation.js updates active=true areas.
                    // Let's just look at unread or recent.
                }

                const res = await gmail.users.messages.list({
                    userId: 'me',
                    q: q.trim()
                });

                if (res.data.messages && res.data.messages.length > 0) {
                    console.log(`[GmailService] Found ${res.data.messages.length} new messages matching criteria`);
                    return true; // Triggered!
                }

                return false;

            } catch (error) {
                console.error('[GmailService] Check Action Error:', error.message);
                return false;
            }
        }
        return false;
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
