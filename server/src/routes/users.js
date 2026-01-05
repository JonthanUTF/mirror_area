const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authenticateToken } = require('./auth');

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        // Users can only access their own profile
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'email', 'name', 'googleId', 'createdAt', 'updatedAt']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        console.log("Update user");
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        console.log("Update user 1");

        const { name, email, password } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        console.log("Update user 2");

        const [updated] = await User.update(updates, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'email', 'name', 'googleId', 'createdAt', 'updatedAt']
        });

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Delete user account
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const deleted = await User.destroy({
            where: { id: req.params.id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
