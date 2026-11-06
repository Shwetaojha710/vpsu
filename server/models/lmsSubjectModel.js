const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const LmsSubject = sequelize.define(
  'lms_subject',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    name_hi: { type: DataTypes.STRING(255), allowNull: true },
    code: { type: DataTypes.STRING(50), allowNull: true },
    // term_type 'semester' -> semester = semester no; 'year' -> semester = year no
    term_type: { type: DataTypes.STRING(10), defaultValue: 'semester' },
    semester: { type: DataTypes.INTEGER, defaultValue: 1 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    tableName: 'lms_subjects',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = LmsSubject;
