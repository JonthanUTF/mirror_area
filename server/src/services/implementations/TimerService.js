const ServiceBase = require('../ServiceBase');

class TimerService extends ServiceBase {
    constructor() {
        super('timer', 'Timer', 'http://localhost:8080/assets/timer-icon.png');

        this.registerAction('interval', 'Triggers at specified time intervals', {
            interval: 'number' // milliseconds
        });
    }

    async checkTrigger(action, area, params) {
        const now = Date.now();

        if (action === 'interval') {
            const interval = params.interval || 60000;
            const lastTriggered = area.lastTriggered ? new Date(area.lastTriggered).getTime() : 0;

            if (now - lastTriggered >= interval) {
                console.log(`[TimerService] Interval ${interval}ms elapsed`);
                return true;
            }
        }

        return false;
    }
}

module.exports = new TimerService();
