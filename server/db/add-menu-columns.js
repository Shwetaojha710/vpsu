// add icon, slug, page_type to menus without deleting data
// command: node db/add-menu-columns.js

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

  await db.query(`ALTER TABLE menus ADD COLUMN IF NOT EXISTS icon VARCHAR(100)`);
  await db.query(`ALTER TABLE menus ADD COLUMN IF NOT EXISTS slug VARCHAR(150)`);
  await db.query(`ALTER TABLE menus ADD COLUMN IF NOT EXISTS page_type VARCHAR(20) DEFAULT 'custom'`);

  // backfill slug from url / title where empty
  await db.query(`
    UPDATE menus
    SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(COALESCE(NULLIF(TRIM(url), ''), title), '^/+', ''), '[/\\s]+', '-', 'g'))
    WHERE slug IS NULL OR TRIM(slug) = ''
  `);

  await db.query(`
    UPDATE menus
    SET page_type = CASE
      WHEN url ~* '^https?://' THEN 'link'
      ELSE COALESCE(NULLIF(TRIM(page_type), ''), 'custom')
    END
    WHERE page_type IS NULL OR TRIM(page_type) = ''
  `);

  console.log('Menu columns added: icon, slug, page_type');
  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add menu columns');
  console.error(err.message);
  process.exit(1);
});
