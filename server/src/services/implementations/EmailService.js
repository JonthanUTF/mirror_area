const ServiceBase = require('../ServiceBase');

class EmailService extends ServiceBase {
    constructor() {
        super('email', 'Email', 'http://localhost:8080/assets/email-icon.png');

        this.registerReaction('send_email', 'Sends an email notification', {
            recipient: 'string',
            subject: 'string',
            body: 'string'
        });
    }

    async executeReaction(reaction, area, params) {
        if (reaction === 'send_email') {
            const recipient = params.recipient || 'admin@area.com';
            const subject = params.subject || `AREA ${area.id} Triggered`;
            const body = params.body || 'Your AREA automation has been triggered.';

            console.log(`[EmailService] Sending email to ${recipient}`);
            console.log(`  Subject: ${subject}`);
            console.log(`  Body: ${body}`);
            // Actual email sending logic would go here
        }
    }
}

module.exports = new EmailService();
