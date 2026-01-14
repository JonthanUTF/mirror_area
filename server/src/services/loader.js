const registry = require('./registry');

const WeatherService = require('./implementations/WeatherService');
const TimerService = require('./implementations/TimerService');
const ConsoleService = require('./implementations/ConsoleService');
const EmailService = require('./implementations/EmailService');
const TwitchService = require('./implementations/TwitchService');
const MicrosoftService = require('./implementations/MicrosoftService');
const GitHubService = require('./implementations/GitHubService');
const DropboxService = require('./implementations/DropboxService');

function loadServices() {
    registry.register(WeatherService);
    registry.register(TimerService);
    registry.register(ConsoleService);
    registry.register(EmailService);
    registry.register(TwitchService);
    registry.register(MicrosoftService);
    registry.register(GitHubService);
    registry.register(DropboxService);

    console.log('[LOADER] All services loaded into registry');
}

module.exports = { loadServices };
