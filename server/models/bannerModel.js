const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Banner = sequelize.define(
  "banner",
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
      allowNull: true
    },
    title_hi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    image: {
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
    tableName: "banners",
    timestamps: false,
    indexes: [
      { name: "banners_section_idx", fields: ["section_id"] }
    ]
  }
);

module.exports = Banner;
