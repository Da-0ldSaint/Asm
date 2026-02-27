const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/users/me
router.get('/me', auth, (req, res) => {
    res.json(req.user);
});

// PUT /api/users/me
router.put('/me', auth, upload.single('profile_image'), async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.confirm_email;
        delete updates.password;
        if (req.file) updates.profile_image = req.file.filename;

        await User.update(updates, { where: { id: req.user.id } });
        const updated = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Update failed', error: err.message });
    }
});

// PUT /api/users/change-password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ message: 'Both passwords required' });
        if (newPassword.length < 8)
            return res.status(400).json({ message: 'Password must be at least 8 characters' });

        const user = await User.findByPk(req.user.id);
        const valid = await user.comparePassword(currentPassword);
        if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to change password', error: err.message });
    }
});

module.exports = router;
