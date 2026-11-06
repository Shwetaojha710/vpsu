const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const College = sequelize.define(
  "college",
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
    code: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    district: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      defaultValue: "affiliated"
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "colleges",
    timestamps: false
  }
);

module.exports = College;
