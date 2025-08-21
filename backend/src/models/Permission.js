const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Permission = sequelize.define('Permission', {
  code: { type: DataTypes.STRING(100), unique: true, allowNull: false },
  description: { type: DataTypes.STRING(191) }
});

module.exports = Permission;
