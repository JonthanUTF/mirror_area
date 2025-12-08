const axios = require('axios');
const { Area } = require('../models');

const AUTOMATION_INTERVAL = 10000;
let automationTimer = null;

async function checkWeatherAction(area) {
  try {
    const params = area.parameters || {};
    const latitude = params.latitude || 48.8566;
    const longitude = params.longitude || 2.3522;
    const tempThreshold = params.tempThreshold || 15;

    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current_weather: true
      }
    });

    const currentTemp = response.data.current_weather.temperature;
    const weatherCode = response.data.current_weather.weathercode;

    if (area.actionType === 'check_temp') {
      if (currentTemp < tempThreshold) {
        console.log(`[AREA ${area.id}] Temperature ${currentTemp}°C is below threshold ${tempThreshold}°C`);
        return true;
      }
    } else if (area.actionType === 'check_conditions') {
      const targetCondition = params.condition || 'rain';
      const isRaining = weatherCode >= 51 && weatherCode <= 67;
      const isSnowing = weatherCode >= 71 && weatherCode <= 77;
      const isClear = weatherCode === 0;

      let conditionMet = false;
      if (targetCondition === 'rain' && isRaining) conditionMet = true;
      if (targetCondition === 'snow' && isSnowing) conditionMet = true;
      if (targetCondition === 'clear' && isClear) conditionMet = true;

      if (conditionMet) {
        console.log(`[AREA ${area.id}] Weather condition "${targetCondition}" met (code: ${weatherCode})`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(`[AREA ${area.id}] Weather check error:`, error.message);
    return false;
  }
}

async function checkTimerAction(area) {
  try {
    const params = area.parameters || {};
    const now = Date.now();

    if (area.actionType === 'interval') {
      const interval = params.interval || 60000;
      const lastTriggered = area.lastTriggered ? new Date(area.lastTriggered).getTime() : 0;
      
      if (now - lastTriggered >= interval) {
        console.log(`[AREA ${area.id}] Timer interval ${interval}ms elapsed`);
        return true;
      }
    } else if (area.actionType === 'schedule') {
      const targetTime = params.targetTime ? new Date(params.targetTime).getTime() : 0;
      const lastTriggered = area.lastTriggered ? new Date(area.lastTriggered).getTime() : 0;
      
      if (now >= targetTime && targetTime > lastTriggered) {
        console.log(`[AREA ${area.id}] Scheduled time reached`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error(`[AREA ${area.id}] Timer check error:`, error.message);
    return false;
  }
}

async function executeConsoleReaction(area) {
  const params = area.parameters || {};
  const message = params.message || `AREA ${area.id} triggered`;
  console.log(`[CONSOLE REACTION] ${message}`);
}

async function executeEmailReaction(area) {
  const params = area.parameters || {};
  const recipient = params.recipient || 'admin@area.com';
  const subject = params.subject || `AREA ${area.id} Triggered`;
  const body = params.body || 'Your AREA automation has been triggered.';
  
  console.log(`[EMAIL REACTION] Sending email to ${recipient}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Body: ${body}`);
}

async function executeReaction(area) {
  try {
    switch (area.reactionService) {
      case 'console':
        if (area.reactionType === 'log_message') {
          await executeConsoleReaction(area);
        }
        break;
      
      case 'email':
        if (area.reactionType === 'send_email') {
          await executeEmailReaction(area);
        }
        break;

      default:
        console.log(`[AREA ${area.id}] Unknown reaction service: ${area.reactionService}`);
    }
  } catch (error) {
    console.error(`[AREA ${area.id}] Reaction execution error:`, error.message);
  }
}

async function checkArea(area) {
  try {
    let actionTriggered = false;

    switch (area.actionService) {
      case 'weather':
        actionTriggered = await checkWeatherAction(area);
        break;

      case 'timer':
        actionTriggered = await checkTimerAction(area);
        break;

      default:
        console.log(`[AREA ${area.id}] Unknown action service: ${area.actionService}`);
        return;
    }

    if (actionTriggered) {
      await executeReaction(area);
      await area.update({ lastTriggered: new Date() });
    }
  } catch (error) {
    console.error(`[AREA ${area.id}] Error checking area:`, error.message);
  }
}

async function runAutomationCycle() {
  try {
    const activeAreas = await Area.findAll({
      where: { active: true }
    });

    if (activeAreas.length === 0) {
      return;
    }

    console.log(`[AUTOMATION] Checking ${activeAreas.length} active area(s)...`);

    for (const area of activeAreas) {
      await checkArea(area);
    }
  } catch (error) {
    console.error('[AUTOMATION] Cycle error:', error.message);
  }
}

function startAutomationLoop() {
  if (automationTimer) {
    console.log('[AUTOMATION] Loop already running');
    return;
  }

  console.log(`[AUTOMATION] Starting automation loop (interval: ${AUTOMATION_INTERVAL}ms)`);
  
  runAutomationCycle();
  
  automationTimer = setInterval(runAutomationCycle, AUTOMATION_INTERVAL);
}

function stopAutomationLoop() {
  if (automationTimer) {
    clearInterval(automationTimer);
    automationTimer = null;
    console.log('[AUTOMATION] Loop stopped');
  }
}

module.exports = {
  startAutomationLoop,
  stopAutomationLoop
};
