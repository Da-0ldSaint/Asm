require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// Models (load all for sync)
const User = require('./models/User');
const Site = require('./models/Site');
const Location = require('./models/Location');
const Category = require('./models/Category');
const Asset = require('./models/Asset');
const Employee = require('./models/Employee');
const Alert = require('./models/Alert');
const ActivityLog = require('./models/ActivityLog');

// Associations
Site.hasMany(Location, { foreignKey: 'site_id', as: 'Locations' });
Location.belongsTo(Site, { foreignKey: 'site_id', as: 'Site' });

Category.hasMany(Asset, { foreignKey: 'category_id', as: 'Assets' });
Asset.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });
Asset.belongsTo(Site, { foreignKey: 'site_id', as: 'Site' });
Asset.belongsTo(Location, { foreignKey: 'location_id', as: 'Location' });

Employee.belongsTo(Site, { foreignKey: 'site_id', as: 'Site' });
Employee.belongsTo(Location, { foreignKey: 'location_id', as: 'Location' });

Alert.belongsTo(Asset, { foreignKey: 'asset_id', as: 'Asset' });
ActivityLog.belongsTo(Asset, { foreignKey: 'asset_id', as: 'Asset' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const assetRoutes = require('./routes/assets');
const employeeRoutes = require('./routes/employees');
const dashboardRoutes = require('./routes/dashboard');
const referenceRoutes = require('./routes/references');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', referenceRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Sync DB and start server
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 ASM Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });
