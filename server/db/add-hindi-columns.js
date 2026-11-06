// add Hindi columns without deleting data
// command: node db/add-hindi-columns.js

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

  await db.query(`ALTER TABLE side_menus ADD COLUMN IF NOT EXISTS content_hi TEXT`);
  await db.query(`ALTER TABLE banners ADD COLUMN IF NOT EXISTS title_hi VARCHAR(255)`);
  await db.query(`ALTER TABLE section_photos ADD COLUMN IF NOT EXISTS title_hi VARCHAR(255)`);
  await db.query(`ALTER TABLE side_menu_files ADD COLUMN IF NOT EXISTS title_hi VARCHAR(255)`);
  await db.query(`ALTER TABLE professors ADD COLUMN IF NOT EXISTS name_hi VARCHAR(150)`);
  await db.query(`ALTER TABLE professors ADD COLUMN IF NOT EXISTS designation_hi VARCHAR(150)`);
  await db.query(`ALTER TABLE professors ADD COLUMN IF NOT EXISTS profile_text_hi TEXT`);

  console.log('Hindi columns added');
  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add Hindi columns');
  console.error(err.message);
  process.exit(1);
});
