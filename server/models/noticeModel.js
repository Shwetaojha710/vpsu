const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Notice = sequelize.define(
  "notice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title_hi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      defaultValue: "general"
    },
    pdf_file: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "notices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Notice;
