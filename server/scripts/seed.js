require('dotenv').config();
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Load models
const User = require('../models/User');
const Site = require('../models/Site');
const Location = require('../models/Location');
const Category = require('../models/Category');
const Asset = require('../models/Asset');

// Associations
Site.hasMany(Location, { foreignKey: 'site_id', as: 'Locations' });
Location.belongsTo(Site, { foreignKey: 'site_id', as: 'Site' });
Category.hasMany(Asset, { foreignKey: 'category_id', as: 'Assets' });
Asset.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });
Asset.belongsTo(Site, { foreignKey: 'site_id', as: 'Site' });
Asset.belongsTo(Location, { foreignKey: 'location_id', as: 'Location' });

const seed = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ DB Connected');
        await sequelize.sync({ alter: true });
        console.log('✅ Tables synced');

        // Admin user
        const existing = await User.findOne({ where: { email: 'admin@asm.com' } });
        if (!existing) {
            await User.create({
                first_name: 'Admin',
                last_name: 'User',
                email: 'admin@asm.com',
                password: 'admin@123',
                role: 'admin',
                timezone: 'Asia/Kolkata',
                date_format: 'MM/dd/yyyy',
                time_format: '12',
            });
            console.log('✅ Admin user created: admin@asm.com / admin@123');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Sites
        const [hq] = await Site.findOrCreate({ where: { name: 'Headquarters' }, defaults: { name: 'Headquarters' } });
        const [branch] = await Site.findOrCreate({ where: { name: 'Branch Office' }, defaults: { name: 'Branch Office' } });
        console.log('✅ Sites created');

        // Locations
        await Location.findOrCreate({ where: { name: 'Floor 1', site_id: hq.id }, defaults: { name: 'Floor 1', site_id: hq.id } });
        await Location.findOrCreate({ where: { name: 'Floor 2', site_id: hq.id }, defaults: { name: 'Floor 2', site_id: hq.id } });
        await Location.findOrCreate({ where: { name: 'Main Office', site_id: branch.id }, defaults: { name: 'Main Office', site_id: branch.id } });
        console.log('✅ Locations created');

        // Categories
        const categoryNames = ['Electronics', 'Furniture', 'Vehicles', 'Computers', 'Office Equipment', 'Others'];
        const categories = {};
        for (const name of categoryNames) {
            const [cat] = await Category.findOrCreate({ where: { name }, defaults: { name } });
            categories[name] = cat;
        }
        console.log('✅ Categories created');

        // Sample Assets
        const sampleAssets = [
            { description: 'Dell Laptop 15"', asset_tag_id: 'AST-001', brand: 'Dell', model: 'Inspiron 15', cost: 65000, status: 'active', category_id: categories['Computers'].id, site_id: hq.id, purchase_date: '2024-01-15' },
            { description: 'Office Chair Executive', asset_tag_id: 'AST-002', brand: 'Godrej', cost: 12000, status: 'active', category_id: categories['Furniture'].id, site_id: hq.id, purchase_date: '2024-03-01' },
            { description: 'HP LaserJet Printer', asset_tag_id: 'AST-003', brand: 'HP', model: 'LaserJet Pro', cost: 18000, status: 'active', category_id: categories['Electronics'].id, site_id: branch.id, purchase_date: '2024-02-20' },
        ];
        for (const a of sampleAssets) {
            try { await Asset.create(a); } catch { }
        }
        console.log('✅ Sample assets created');

        console.log('\n🎉 Seed complete!');
        console.log('   Login: admin@asm.com');
        console.log('   Password: admin@123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seed();
