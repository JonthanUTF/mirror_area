const express = require('express');
const router = express.Router();
const { Area } = require('../models');
const { authenticateToken } = require('./auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const areas = await Area.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ areas });
  } catch (error) {
    console.error('Get areas error:', error);
    res.status(500).json({ error: 'Failed to retrieve areas' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const area = await Area.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }

    res.json({ area });
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
      active 
    } = req.body;

    if (!name || !actionService || !actionType || !reactionService || !reactionType) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, actionService, actionType, reactionService, reactionType' 
      });
    }

    const area = await Area.create({
      userId: req.user.id,
      name,
      actionService,
      actionType,
      reactionService,
      reactionType,
      parameters: parameters || {},
      active: active !== undefined ? active : true
    });

    res.status(201).json({ 
      message: 'Area created successfully',
      area 
    });
  } catch (error) {
    console.error('Create area error:', error);
    res.status(500).json({ 
      error: 'Failed to create area',
      details: error.message 
    });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const area = await Area.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
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
      active 
    } = req.body;

    await area.update({
      ...(name !== undefined && { name }),
      ...(actionService !== undefined && { actionService }),
      ...(actionType !== undefined && { actionType }),
      ...(reactionService !== undefined && { reactionService }),
      ...(reactionType !== undefined && { reactionType }),
      ...(parameters !== undefined && { parameters }),
      ...(active !== undefined && { active })
    });

    res.json({ 
      message: 'Area updated successfully',
      area 
    });
  } catch (error) {
    console.error('Update area error:', error);
    res.status(500).json({ 
      error: 'Failed to update area',
      details: error.message 
    });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const area = await Area.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!area) {
      return res.status(404).json({ error: 'Area not found' });
    }

    await area.destroy();

    res.json({ message: 'Area deleted successfully' });
  } catch (error) {
    console.error('Delete area error:', error);
    res.status(500).json({ 
      error: 'Failed to delete area',
      details: error.message 
    });
  }
});

module.exports = router;
