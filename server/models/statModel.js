const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Stat = sequelize.define(
  "stat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "stats",
    timestamps: false
  }
);

module.exports = Stat;
