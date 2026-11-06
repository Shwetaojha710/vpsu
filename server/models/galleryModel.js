const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Gallery = sequelize.define(
  "gallery",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: "galleries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Gallery;
