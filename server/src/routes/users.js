const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authenticateToken } = require('./auth');

// helper to detect admin users (support isAdmin boolean or role string)
const isAdmin = (user) => {
    if (!user) return false;
    if (user.role && String(user.role).toLowerCase() === 'admin') return true;
    return false;
};

// Get all users (requires auth)
router.get('/', authenticateToken, async (req, res) => {
    try {
        // only admins may list all users
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: 'Admin privileges required' });
        }

        const users = await User.findAll({
            attributes: ['id', 'email', 'name', 'role', 'googleId', 'createdAt', 'updatedAt']
        });
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// Create a new user (admin only)
router.post('/create', authenticateToken, async (req, res) => {
    try {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: 'Admin privileges required' });
        }

        const { name, email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashed, role });

        const user = await User.findByPk(newUser.id, {
            attributes: ['id', 'email', 'name', 'role', 'googleId', 'createdAt', 'updatedAt']
        });

        res.status(201).json({ user });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Get user profile
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        // Users can access their own profile, admins can access any
        if (!isAdmin(req.user) && String(req.user.id) !== String(req.params.id)) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'email', 'name', 'role', 'googleId', 'createdAt', 'updatedAt']
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
        // allow admins to update other users
        if (!isAdmin(req.user) && String(req.user.id) !== String(req.params.id)) {
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        const { name, email, password, role } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        // Only admins can update the role
        if (role && isAdmin(req.user)) {
             updates.role = role;
        }

        const [updated] = await User.update(updates, {
            where: { id: req.params.id }
        });

        if (!updated) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'email', 'name', 'role', 'googleId', 'createdAt', 'updatedAt']
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
        // allow admins to delete other users
        if (!isAdmin(req.user) && String(req.user.id) !== String(req.params.id)) {
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
