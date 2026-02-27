const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ message: 'Invalid email or password' });

        const token = signToken(user.id);
        const userData = { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email, role: user.role };
        res.json({ token, user: userData });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password)
            return res.status(400).json({ message: 'All fields required' });

        const existing = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const user = await User.create({ first_name, last_name, email: email.toLowerCase(), password });
        const token = signToken(user.id);
        res.status(201).json({ token, user: { id: user.id, first_name, last_name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
