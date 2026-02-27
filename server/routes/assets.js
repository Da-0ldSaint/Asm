const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const Asset = require('../models/Asset');
const Category = require('../models/Category');
const Site = require('../models/Site');
const Location = require('../models/Location');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `asset_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/assets
router.get('/', auth, async (req, res) => {
    try {
        const assets = await Asset.findAll({
            include: [
                { model: Category, as: 'Category', attributes: ['name'] },
                { model: Site, as: 'Site', attributes: ['name'] },
                { model: Location, as: 'Location', attributes: ['name'] },
            ],
            order: [['created_at', 'DESC']],
        });
        res.json(assets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/assets/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id, {
            include: [
                { model: Category, as: 'Category' },
                { model: Site, as: 'Site' },
                { model: Location, as: 'Location' },
            ],
        });
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        res.json(asset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/assets
router.post('/', auth, upload.single('asset_photo'), async (req, res) => {
    try {
        const { description, asset_tag_id } = req.body;
        if (!description) return res.status(400).json({ message: 'Description is required' });
        if (!asset_tag_id) return res.status(400).json({ message: 'Asset Tag ID is required' });

        const data = { ...req.body };
        if (req.file) data.asset_photo = req.file.filename;

        const asset = await Asset.create(data);
        res.status(201).json(asset);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ message: 'Asset Tag ID already exists' });
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/assets/:id
router.put('/:id', auth, upload.single('asset_photo'), async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        const data = { ...req.body };
        if (req.file) data.asset_photo = req.file.filename;
        await asset.update(data);
        res.json(asset);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/assets/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const asset = await Asset.findByPk(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        await asset.destroy();
        res.json({ message: 'Asset deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
