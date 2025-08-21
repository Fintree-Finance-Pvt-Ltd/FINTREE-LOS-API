const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const UserRole = sequelize.define('UserRole', {
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  role_id:  { type: DataTypes.BIGINT, allowNull: false }
}, { tableName: 'user_roles' });

module.exports = UserRole;
