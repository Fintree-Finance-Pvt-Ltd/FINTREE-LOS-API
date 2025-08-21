

// OTP.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
module.exports = sequelize.define('OTP', {
email: { type: DataTypes.STRING(191), allowNull: false },
code: { type: DataTypes.STRING(10), allowNull: false },
expires_at: { type: DataTypes.DATE, allowNull: false },
consumed: { type: DataTypes.BOOLEAN, defaultValue: false }
});

