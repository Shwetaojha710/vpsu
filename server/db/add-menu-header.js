// add is_header to menus (top utility bar like RTI / University Ranking)
// command: node db/add-menu-header.js

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function run() {
  const db = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'vpsu'
  });
  await db.connect();

  await db.query(`
    ALTER TABLE menus
    ADD COLUMN IF NOT EXISTS is_header BOOLEAN DEFAULT false
  `);

  console.log('Menu column added: is_header');
  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add is_header column');
  console.error(err.message);
  process.exit(1);
});
