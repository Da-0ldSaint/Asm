const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    timezone: { type: DataTypes.STRING, defaultValue: 'Asia/Kolkata' },
    date_format: { type: DataTypes.STRING, defaultValue: 'MM/dd/yyyy' },
    time_format: { type: DataTypes.STRING, defaultValue: '12' },
    profile_image: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
}, {
    tableName: 'users',
    underscored: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) user.password = await bcrypt.hash(user.password, 12);
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
        },
    },
});

User.prototype.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = User;
