const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Professor = sequelize.define(
  "professor",
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
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    name_hi: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    designation: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    designation_hi: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    profile_text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profile_text_hi: {
      type: DataTypes.TEXT,
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
    tableName: "professors",
    timestamps: false,
    indexes: [
      { name: "professors_section_idx", fields: ["section_id"] }
    ]
  }
);

module.exports = Professor;
