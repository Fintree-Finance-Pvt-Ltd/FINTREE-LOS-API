const { sequelize } = require('../config/db');

// ---- Require every model (no destructuring from an object) ----
const User            = require('./User');
const Role            = require('./Role');
const Permission      = require('./Permission');
const UserRole        = require('./UserRole');
const RolePermission  = require('./RolePermission');
const OTP             = require('./OTP');
const Dealer          = require('./Dealer');
const Partner         = require('./Partner');
const LoanApplication = require('./LoanApplication');
const Document        = require('./Document');

// ---- Quick sanity checks (uncomment if needed) ----
// console.log('Dealer is model?', !!Dealer?.getTableName);
// console.log('Partner is model?', !!Partner?.getTableName);
// console.log('LoanApplication is model?', !!LoanApplication?.getTableName);

// ---- Associations ----
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });

Dealer.hasMany(LoanApplication, { foreignKey: 'dealer_id' });
Partner.hasMany(LoanApplication, { foreignKey: 'partner_id' });
LoanApplication.belongsTo(Dealer,  { foreignKey: 'dealer_id' });
LoanApplication.belongsTo(Partner, { foreignKey: 'partner_id' });

LoanApplication.hasMany(Document,  { foreignKey: 'loan_application_id' });
Document.belongsTo(LoanApplication,{ foreignKey: 'loan_application_id' });

// ---- Export a flat object of models + sequelize ----
module.exports = {
  sequelize,
  User, Role, Permission,
  UserRole, RolePermission,
  OTP, Dealer, Partner, LoanApplication, Document
};
