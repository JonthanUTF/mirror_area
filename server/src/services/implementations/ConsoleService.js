const ServiceBase = require('../ServiceBase');

class ConsoleService extends ServiceBase {
    constructor() {
        super('console', 'Console', 'http://localhost:8080/assets/console-icon.png');

        this.registerReaction('log_message', 'Logs a message to the server console', {
            message: 'string'
        });
    }

    async executeReaction(reaction, area, params) {
        if (reaction === 'log_message') {
            const message = params.message || `AREA ${area.id} triggered`;
            console.log(`[ConsoleService] ${message}`);
        }
    }
}

module.exports = new ConsoleService();
