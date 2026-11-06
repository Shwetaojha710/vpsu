const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const LmsContent = sequelize.define(
  'lms_content',
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    teacher_id: { type: DataTypes.INTEGER, allowNull: true },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    subject_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    title_hi: { type: DataTypes.STRING(255), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    type: { type: DataTypes.STRING(20), defaultValue: 'video' },
    file_path: { type: DataTypes.STRING(255), allowNull: true },
    link_url: { type: DataTypes.TEXT, allowNull: true },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
    published_at: { type: DataTypes.DATE, allowNull: true }
  },
  {
    tableName: 'lms_contents',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = LmsContent;
