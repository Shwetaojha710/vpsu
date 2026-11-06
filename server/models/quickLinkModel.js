const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const QuickLink = sequelize.define(
  "quickLink",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "quick_links",
    timestamps: false
  }
);

module.exports = QuickLink;
