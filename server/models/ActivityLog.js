const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ActivityLog = sequelize.define('ActivityLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    asset_id: { type: DataTypes.UUID },
    type: { type: DataTypes.ENUM('check_out', 'check_in', 'repair'), allowNull: false },
    user_id: { type: DataTypes.UUID },
    date: { type: DataTypes.DATEONLY },
}, { tableName: 'activity_logs', underscored: true });

module.exports = ActivityLog;
