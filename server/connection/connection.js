const path = require("path");
const { Sequelize } = require("sequelize");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

function env(name, fallback) {
  const value = process.env[name];
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  return String(value).trim().replace(/^['"]|['"]$/g, "");
}

const sequelize = new Sequelize(
  env("DB_NAME", "vpsu"),
  env("DB_USER", "postgres"),
  env("DB_PASSWORD", "postgres"),
  {
    host: env("DB_HOST", "localhost"),
    port: Number(env("DB_PORT", "5432")),
    dialect: "postgres",
    logging: false,
    schema: env("DB_SCHEMA", "public")
  }
);

module.exports = sequelize;
