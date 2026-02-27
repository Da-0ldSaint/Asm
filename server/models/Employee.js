const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    full_name: { type: DataTypes.STRING, allowNull: false },
    employee_id: { type: DataTypes.STRING, unique: true },
    title: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    personal_email: { type: DataTypes.STRING },
    gender: { type: DataTypes.ENUM('male', 'female') },
    joining_date: { type: DataTypes.DATEONLY },
    notes: { type: DataTypes.TEXT },
    site_id: { type: DataTypes.UUID },
    location_id: { type: DataTypes.UUID },
}, { tableName: 'employees', underscored: true });

module.exports = Employee;
