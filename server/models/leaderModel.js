const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Leader = sequelize.define(
  "leader",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    designation: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profile_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: "leaders",
    timestamps: false
  }
);

module.exports = Leader;
