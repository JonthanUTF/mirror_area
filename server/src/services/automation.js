const { Area } = require('../models');
const registry = require('./registry');

const AUTOMATION_INTERVAL = 10000;
let automationTimer = null;

async function checkArea(area) {
  try {
    const actionService = registry.getService(area.actionService);

    if (!actionService) {
      console.log(`[AREA ${area.id}] Unknown action service: ${area.actionService}`);
      return;
    }

    // Check Trigger
    const actionTriggered = await actionService.checkTrigger(
      area.actionType,
      area,
      area.parameters
    );

    if (actionTriggered) {
      const reactionService = registry.getService(area.reactionService);

      if (!reactionService) {
        console.log(`[AREA ${area.id}] Unknown reaction service: ${area.reactionService}`);
        return;
      }

      // Execute Reaction
      await reactionService.executeReaction(
        area.reactionType,
        area,
        area.parameters
      );

      // Update lastTriggered
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
