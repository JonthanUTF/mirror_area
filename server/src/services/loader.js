const registry = require('./registry');

// Import services to register them
const WeatherService = require('./implementations/WeatherService');
const TimerService = require('./implementations/TimerService');
const ConsoleService = require('./implementations/ConsoleService');
const EmailService = require('./implementations/EmailService');
const TwitchService = require('./implementations/TwitchService');
const MicrosoftService = require('./implementations/MicrosoftService');

function loadServices() {
    registry.register(WeatherService);
    registry.register(TimerService);
    registry.register(ConsoleService);
    registry.register(EmailService);
    registry.register(TwitchService);
    registry.register(MicrosoftService);

    console.log('[LOADER] All services loaded into registry');
}

module.exports = { loadServices };
