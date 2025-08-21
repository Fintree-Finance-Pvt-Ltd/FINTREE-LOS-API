const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Dealer = sequelize.define('Dealer', {
  name: { type: DataTypes.STRING(191), allowNull: false },
  type: { type: DataTypes.ENUM('existing', 'new'), defaultValue: 'new' },
  contact_email: { type: DataTypes.STRING(191) },
  contact_phone: { type: DataTypes.STRING(20) },
  address: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.BIGINT }
}, {
  tableName: 'dealers'
});

module.exports = Dealer;
