const { Area } = require('../models');
const registry = require('./registry');

async function checkArea(area) {
  try {
    const actionService = registry.getService(area.actionService);

    if (!actionService) {
      console.log(`[AREA ${area.id}] Unknown action service: ${area.actionService}`);
      return;
    }

    const actionParams = area.parameters?.action || area.parameters || {};
    
    console.log(`[AREA ${area.id}] Checking trigger ${area.actionType} with params:`, JSON.stringify(actionParams));

    // Check Trigger
    const actionTriggered = await actionService.checkTrigger(
      area.actionType,
      area,
      actionParams
    );

    if (actionTriggered) {
      console.log(`[AREA ${area.id}] Trigger fired!`);
      
      const reactionService = registry.getService(area.reactionService);

      if (!reactionService) {
        console.log(`[AREA ${area.id}] Unknown reaction service: ${area.reactionService}`);
        return;
      }

      const reactionParams = area.parameters?.reaction || area.parameters || {};

      const triggerData = typeof actionTriggered === 'object' && actionTriggered.data ? actionTriggered.data : {};
      const finalReactionParams = { ...reactionParams, triggerData };

      console.log(`[AREA ${area.id}] Executing reaction ${area.reactionType} with params:`, JSON.stringify(finalReactionParams));

      // Execute Reaction
      await reactionService.executeReaction(
        area.reactionType,
        area,
        finalReactionParams
      );

      // Update lastTriggered
      await area.update({ lastTriggered: new Date() });
      console.log(`[AREA ${area.id}] Triggered and executed successfully`);
    }
  } catch (error) {
    console.error(`[AREA ${area.id}] Error checking area:`, error.message);
  }
}

async function runAutomationLoop() {
  try {
    const areas = await Area.findAll({ where: { active: true } });

    for (const area of areas) {
      await checkArea(area);
    }
  } catch (error) {
    console.error('[Automation] Error running automation:', error.message);
  }
}

function startAutomationLoop(intervalMs = 30000) {
  console.log(`[Automation] Starting automation loop (${intervalMs}ms interval)`);
  
  runAutomationLoop();
  
  setInterval(runAutomationLoop, intervalMs);
}

module.exports = { startAutomationLoop, runAutomationLoop, checkArea };
