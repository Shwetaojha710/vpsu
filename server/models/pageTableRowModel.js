const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const PageTableRow = sequelize.define(
  "page_table_row",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    page_table_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    table_key: {
      type: DataTypes.STRING(100),
      defaultValue: ""
    },
    data: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "page_table_rows",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = PageTableRow;
