const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Section = sequelize.define(
  "section",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name_hi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "faculty"
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // matching faculty / department menu (menus.id)
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(150),
      unique: true
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
    tableName: "sections",
    timestamps: false
  }
);

module.exports = Section;
