// // Example Role.js
// const { DataTypes } = require('sequelize');
// const { sequelize } = require('../config/db');

// const User = sequelize.define('User', {
//   name: { type: DataTypes.STRING(50), unique: true, allowNull: false },
//   description: DataTypes.STRING(191)
// });

// module.exports = User;

////////////////////////////////


// backend/src/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id:       { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
  email:    { type: DataTypes.STRING(191), allowNull: false, unique: true },
  name:     { type: DataTypes.STRING(191), allowNull: true }, // <- allow null
  // description: { type: DataTypes.TEXT, allowNull: true },  // only if you actually have this column
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,
});

module.exports = User;
