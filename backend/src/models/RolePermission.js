const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const RolePermission = sequelize.define('RolePermission', {
  role_id:       { type: DataTypes.BIGINT, allowNull: false },
  permission_id: { type: DataTypes.BIGINT, allowNull: false }
}, { tableName: 'role_permissions' });

module.exports = RolePermission;
