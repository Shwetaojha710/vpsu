const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const SideMenuFile = sequelize.define(
  "sideMenuFile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    side_menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "side_menus",
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
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(50),
      defaultValue: "English"
    }
  },
  {
    tableName: "side_menu_files",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { name: "side_menu_files_menu_idx", fields: ["side_menu_id"] }
    ]
  }
);

module.exports = SideMenuFile;
