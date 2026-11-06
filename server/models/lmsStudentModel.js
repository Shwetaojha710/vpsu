const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const LmsStudent = sequelize.define(
  'lms_student',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    roll_no: { type: DataTypes.STRING(50), allowNull: true },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    semester: { type: DataTypes.INTEGER, defaultValue: 1 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    tableName: 'lms_students',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);

module.exports = LmsStudent;
