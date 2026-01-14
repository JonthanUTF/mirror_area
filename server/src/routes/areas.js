const express = require('express');
const router = express.Router();
const { Area } = require('../models');
const { authenticateToken } = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const areas = await Area.findAll({ where: { userId: req.user.id } });
    res.json(areas);
  } catch (error) {
    console.error('Get areas error:', error);
    res.status(500).json({ error: 'Failed to retrieve areas' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const area = await Area.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }
    res.json(area);
  } catch (error) {
    console.error('Get area error:', error);
    res.status(500).json({ error: 'Failed to retrieve area' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      name,
      actionService, 
      actionType, 
      reactionService, 
      reactionType, 
      parameters,
      actionParams,
      reactionParams,
      active 
    } = req.body;

    if (!name || !actionService || !actionType || !reactionService || !reactionType) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, actionService, actionType, reactionService, reactionType' 
      });
    }

    const finalParams = {
      action: actionParams || {},
      reaction: reactionParams || {},
      ...(parameters || {})
    };

    if (!actionParams && !reactionParams && parameters) {
      console.log('[Areas] Using legacy merged parameters mode');
    }

    const area = await Area.create({
      userId: req.user.id,
      name,
      actionService,
      actionType,
      reactionService,
      reactionType,
      parameters: finalParams,
      active: active !== undefined ? active : true
    });

    res.status(201).json({ 
      message: 'Area created successfully',
      area 
    });
  } catch (error) {
    console.error('Create area error:', error);
    res.status(500).json({ error: 'Failed to create area' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const area = await Area.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }

    const { 
      name, 
      actionService, 
      actionType, 
      reactionService, 
      reactionType, 
      parameters,
      actionParams,
      reactionParams,
      active 
    } = req.body;

    let finalParams = parameters;
    if (actionParams || reactionParams) {
      finalParams = {
        action: actionParams || area.parameters?.action || {},
        reaction: reactionParams || area.parameters?.reaction || {},
      };
    }

    await area.update({
      name: name !== undefined ? name : area.name,
      actionService: actionService !== undefined ? actionService : area.actionService,
      actionType: actionType !== undefined ? actionType : area.actionType,
      reactionService: reactionService !== undefined ? reactionService : area.reactionService,
      reactionType: reactionType !== undefined ? reactionType : area.reactionType,
      parameters: finalParams !== undefined ? finalParams : area.parameters,
      active: active !== undefined ? active : area.active
    });

    res.json({ message: 'Area updated', area });
  } catch (error) {
    console.error('Update area error:', error);
    res.status(500).json({ error: 'Failed to update area' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const area = await Area.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }

    await area.destroy();
    res.json({ message: 'Area deleted' });
  } catch (error) {
    console.error('Delete area error:', error);
    res.status(500).json({ error: 'Failed to delete area' });
  }
});

module.exports = router;
