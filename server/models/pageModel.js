const { DataTypes } = require("sequelize");
const sequelize = require("../connection/connection");

const Page = sequelize.define(
  "page",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title_hi: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content_hi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    tableName: "pages",
    timestamps: true,
    createdAt: false,
    updatedAt: "updated_at"
  }
);

module.exports = Page;
