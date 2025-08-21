const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Partner = sequelize.define('Partner', {
  code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(191), allowNull: false },
  process_json: { type: DataTypes.JSON, allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'partners' });

module.exports = Partner;
// This model represents a Partner entity with fields for code, name, process_json, and is_active status.