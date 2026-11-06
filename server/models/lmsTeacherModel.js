const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const LmsTeacher = sequelize.define(
  'lms_teacher',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    faculty_id: { type: DataTypes.INTEGER, allowNull: true },
    department_id: { type: DataTypes.INTEGER, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    tableName: 'lms_teachers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = LmsTeacher;
