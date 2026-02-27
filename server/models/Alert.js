const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alert = sequelize.define('Alert', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    asset_id: { type: DataTypes.UUID },
    type: { type: DataTypes.ENUM('due', 'insurance', 'lease'), allowNull: false },
    alert_date: { type: DataTypes.DATEONLY, allowNull: false },
    title: { type: DataTypes.STRING },
}, { tableName: 'alerts', underscored: true });

module.exports = Alert;
