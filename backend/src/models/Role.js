// Example Role.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  description: DataTypes.STRING(191)
});

module.exports = Role;


