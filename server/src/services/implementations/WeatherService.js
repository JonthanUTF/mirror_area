const ServiceBase = require('../ServiceBase');
const axios = require('axios');

class WeatherService extends ServiceBase {
    constructor() {
        super('weather', 'Weather', 'http://localhost:8080/assets/weather-icon.png');

        this.registerAction('check_temp', 'Triggers if temperature is below a specified threshold', {
            latitude: 'number',
            longitude: 'number',
            tempThreshold: 'number'
        });

        this.registerAction('check_conditions', 'Triggers based on weather conditions', {
            latitude: 'number',
            longitude: 'number',
            condition: 'string' // rain, snow, clear
        });
    }

    async checkTrigger(action, area, params) {
        if (action === 'check_temp') {
            return await this.checkTemp(params);
        }
        if (action === 'check_conditions') {
            return await this.checkConditions(params);
        }
        return false;
    }

    async checkTemp(params) {
        try {
            const latitude = params.latitude || 48.8566;
            const longitude = params.longitude || 2.3522;
            const tempThreshold = params.tempThreshold || 15;

            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: { latitude, longitude, current_weather: true }
            });
            const currentTemp = response.data.current_weather.temperature;

            if (currentTemp < tempThreshold) {
                console.log(`[WeatherService] Temp ${currentTemp}°C < Threshold ${tempThreshold}°C`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[WeatherService] Error:', error.message);
            return false;
        }
    }

    async checkConditions(params) {
        try {
            const latitude = params.latitude || 48.8566;
            const longitude = params.longitude || 2.3522;
            const targetCondition = params.condition || 'rain';

            const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: { latitude, longitude, current_weather: true }
            });
            const weatherCode = response.data.current_weather.weathercode;

            const isRaining = weatherCode >= 51 && weatherCode <= 67;
            const isSnowing = weatherCode >= 71 && weatherCode <= 77;
            const isClear = weatherCode === 0;

            if ((targetCondition === 'rain' && isRaining) ||
                (targetCondition === 'snow' && isSnowing) ||
                (targetCondition === 'clear' && isClear)) {
                console.log(`[WeatherService] Condition "${targetCondition}" met (code: ${weatherCode})`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('[WeatherService] Error:', error.message);
            return false;
        }
    }
}

module.exports = new WeatherService();
