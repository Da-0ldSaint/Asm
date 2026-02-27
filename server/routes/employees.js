const express = require('express');
const auth = require('../middleware/auth');
const Employee = require('../models/Employee');
const Site = require('../models/Site');
const Location = require('../models/Location');

const router = express.Router();

// GET /api/employees
router.get('/', auth, async (req, res) => {
    try {
        const employees = await Employee.findAll({ order: [['created_at', 'DESC']] });
        res.json(employees);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/employees/:id
router.get('/:id', auth, async (req, res) => {
    try {
        const emp = await Employee.findByPk(req.params.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        res.json(emp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/employees
router.post('/', auth, async (req, res) => {
    try {
        const { full_name, phone, email, gender, joining_date } = req.body;
        if (!full_name) return res.status(400).json({ message: 'Full name is required' });
        if (!phone) return res.status(400).json({ message: 'Phone is required' });
        if (!email) return res.status(400).json({ message: 'Email is required' });
        const emp = await Employee.create(req.body);
        res.status(201).json(emp);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError')
            return res.status(409).json({ message: 'Email already registered' });
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/employees/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const emp = await Employee.findByPk(req.params.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        await emp.update(req.body);
        res.json(emp);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/employees/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const emp = await Employee.findByPk(req.params.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        await emp.destroy();
        res.json({ message: 'Employee deleted' });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
