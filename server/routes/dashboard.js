const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const auth = require('../middleware/auth');
const Asset = require('../models/Asset');
const Category = require('../models/Category');
const Alert = require('../models/Alert');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', auth, async (req, res) => {
    try {
        const activeAssetsCount = await Asset.count({ where: { status: 'active' } });
        const totalAssetValue = await Asset.sum('cost') || 0;

        const currentYear = new Date().getFullYear();
        const fiscalStart = new Date(`${currentYear}-04-01`);
        const fiscalEnd = new Date(`${currentYear + 1}-03-31`);
        const fiscalAssets = await Asset.findAll({
            where: { purchase_date: { [Op.between]: [fiscalStart, fiscalEnd] } },
        });
        const fiscalYearPurchases = fiscalAssets.reduce((sum, a) => sum + parseFloat(a.cost || 0), 0);

        res.json({
            activeAssetsCount,
            totalAssetValue,
            fiscalYearPurchases,
            fiscalYearAssetCount: fiscalAssets.length,
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/dashboard/category-value
router.get('/category-value', auth, async (req, res) => {
    try {
        const categories = await Category.findAll();
        const result = await Promise.all(
            categories.map(async (cat) => {
                const total = await Asset.sum('cost', { where: { category_id: cat.id } }) || 0;
                return { name: cat.name, value: parseFloat(total) };
            })
        );
        res.json(result.filter((r) => r.value > 0));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/dashboard/alerts
router.get('/alerts', auth, async (req, res) => {
    try {
        const alerts = await Alert.findAll();
        const events = alerts.map((a) => ({
            title: a.title || `${a.type} alert`,
            date: a.alert_date,
            backgroundColor: a.type === 'due' ? '#047481' : a.type === 'insurance' ? '#d97706' : '#7c3aed',
        }));
        res.json(events);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/dashboard/feeds
router.get('/feeds', auth, async (req, res) => {
    try {
        const logs = await ActivityLog.findAll({
            include: [
                { model: Asset, as: 'Asset', attributes: ['asset_tag_id', 'description'] },
                { model: User, as: 'User', attributes: ['first_name', 'last_name'] },
            ],
            order: [['created_at', 'DESC']],
            limit: 30,
        });
        const feeds = logs.map((log) => ({
            assetTagId: log.Asset?.asset_tag_id,
            description: log.Asset?.description,
            checkoutDate: log.date,
            dueDate: log.date,
            assignedTo: log.User ? `${log.User.first_name} ${log.User.last_name}` : '—',
            type: log.type === 'check_out' ? 'checked_out' : log.type === 'check_in' ? 'checked_in' : 'repair',
        }));
        res.json(feeds);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
