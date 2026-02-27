const express = require('express');
const auth = require('../middleware/auth');
const Site = require('../models/Site');
const Location = require('../models/Location');
const Category = require('../models/Category');

const router = express.Router();

// Sites
router.get('/sites', auth, async (req, res) => {
    try { res.json(await Site.findAll({ order: [['name', 'ASC']] })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/sites', auth, async (req, res) => {
    try {
        const site = await Site.create({ name: req.body.name });
        res.status(201).json(site);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Locations
router.get('/locations', auth, async (req, res) => {
    try {
        const where = {};
        if (req.query.site_id) where.site_id = req.query.site_id;
        res.json(await Location.findAll({ where, order: [['name', 'ASC']] }));
    } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/locations', auth, async (req, res) => {
    try {
        const loc = await Location.create({ name: req.body.name, site_id: req.body.site_id });
        res.status(201).json(loc);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Categories
router.get('/categories', auth, async (req, res) => {
    try { res.json(await Category.findAll({ order: [['name', 'ASC']] })); }
    catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/categories', auth, async (req, res) => {
    try {
        const cat = await Category.create({ name: req.body.name });
        res.status(201).json(cat);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
