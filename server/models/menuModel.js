const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Menu = sequelize.define(
  "menu",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "menus",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    title_hi: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    url: {
      type: DataTypes.STRING(255),
      defaultValue: "#"
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    page_type: {
      type: DataTypes.STRING(20),
      defaultValue: "custom"
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_header: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_faculty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_department: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: "menus",
    timestamps: false,
    indexes: [
      { name: "menus_parent_idx", fields: ["parent_id"] }
    ]
  }
);

module.exports = Menu;
