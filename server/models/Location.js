const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('Location', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    site_id: { type: DataTypes.UUID, references: { model: 'sites', key: 'id' } },
}, { tableName: 'locations', underscored: true });

module.exports = Location;
