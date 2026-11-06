const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const SectionPhoto = sequelize.define(
  "sectionPhoto",
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
    }
  },
  {
    tableName: "section_photos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { name: "section_photos_section_idx", fields: ["section_id"] }
    ]
  }
);

module.exports = SectionPhoto;
