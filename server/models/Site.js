const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Site = sequelize.define('Site', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
}, { tableName: 'sites', underscored: true });

module.exports = Site;
