const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Slider = sequelize.define(
  "slider",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    link: {
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
    tableName: "slider",
    timestamps: false
  }
);

module.exports = Slider;
