const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const LmsCourse = sequelize.define(
  'lms_course',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    name_hi: { type: DataTypes.STRING(255), allowNull: true },
    code: { type: DataTypes.STRING(50), allowNull: true },
    faculty_id: { type: DataTypes.INTEGER, allowNull: true },
    department_id: { type: DataTypes.INTEGER, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    tableName: 'lms_courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = LmsCourse;
