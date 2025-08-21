const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
  loan_application_id: { type: DataTypes.BIGINT },
  doc_type: { type: DataTypes.STRING(50) },
  file_key: { type: DataTypes.STRING(255) },
  original_name: { type: DataTypes.STRING(255) },
  mime_type: { type: DataTypes.STRING(100) },
  size: { type: DataTypes.BIGINT },
  uploaded_by: { type: DataTypes.BIGINT }
}, { tableName: 'documents' });

module.exports = Document;
