const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const LmsTeacherSubject = sequelize.define(
  'lms_teacher_subject',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    teacher_id: { type: DataTypes.INTEGER, allowNull: false },
    subject_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    tableName: 'lms_teacher_subjects',
    timestamps: false
  }
);

module.exports = LmsTeacherSubject;
