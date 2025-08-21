const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LoanApplication = sequelize.define('LoanApplication', {
  application_no: { type: DataTypes.STRING(50), unique: true },
  customer_name: { type: DataTypes.STRING(191), allowNull: false },
  customer_email: { type: DataTypes.STRING(191) },
  customer_phone: { type: DataTypes.STRING(20) },
  loan_amount: { type: DataTypes.DECIMAL(15,2) },
  partner_id: { type: DataTypes.BIGINT },
  dealer_id: { type: DataTypes.BIGINT },
  status: {
    type: DataTypes.ENUM('Draft','Submitted','KYC','Bureau','Credit','Sanction','Documentation','Disbursement','Rejected','Closed'),
    defaultValue: 'Draft'
  },
  meta: { type: DataTypes.JSON },
  created_by: { type: DataTypes.BIGINT }
}, { tableName: 'loan_applications' });

module.exports = LoanApplication;
