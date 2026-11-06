const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const SideMenu = sequelize.define(
  "sideMenu",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sections",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title_hi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    page_type: {
      type: DataTypes.STRING(20),
      defaultValue: "static"
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content_hi: {
      type: DataTypes.TEXT,
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
    tableName: "side_menus",
    timestamps: false,
    indexes: [
      { name: "side_menus_section_idx", fields: ["section_id"] },
      { name: "side_menus_slug_idx", fields: ["slug"] }
    ]
  }
);

module.exports = SideMenu;
