const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const PageTable = sequelize.define(
  "page_table",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    layout_type: {
      type: DataTypes.STRING(20),
      defaultValue: "table"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tables_config: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "page_tables",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = PageTable;
