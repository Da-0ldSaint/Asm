const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    asset_tag_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    purchased_from: { type: DataTypes.STRING },
    purchase_date: { type: DataTypes.DATEONLY },
    brand: { type: DataTypes.STRING },
    cost: { type: DataTypes.DECIMAL(12, 2) },
    model: { type: DataTypes.STRING },
    serial_no: { type: DataTypes.STRING },
    windows_key: { type: DataTypes.STRING },
    office_key: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    site_id: { type: DataTypes.UUID },
    location_id: { type: DataTypes.UUID },
    category_id: { type: DataTypes.UUID },
    asset_photo: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('active', 'checked_out', 'repair'), defaultValue: 'active' },
}, { tableName: 'assets', underscored: true });

module.exports = Asset;
