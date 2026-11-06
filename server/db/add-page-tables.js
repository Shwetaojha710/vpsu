// Create page_tables + page_table_rows for Flow 1 (menu page_type=table)
// command: node db/add-page-tables.js

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
    CREATE TABLE IF NOT EXISTS page_tables (
      id SERIAL PRIMARY KEY,
      menu_id INT NOT NULL UNIQUE REFERENCES menus(id) ON DELETE CASCADE,
      layout_type VARCHAR(20) DEFAULT 'table',
      description TEXT,
      tables_config JSONB DEFAULT '[]'::jsonb,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS page_table_rows (
      id SERIAL PRIMARY KEY,
      page_table_id INT NOT NULL REFERENCES page_tables(id) ON DELETE CASCADE,
      table_key VARCHAR(100) DEFAULT '',
      data JSONB DEFAULT '{}'::jsonb,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS page_table_rows_page_table_idx
    ON page_table_rows (page_table_id)
  `);

  await db.query(`
    CREATE INDEX IF NOT EXISTS page_table_rows_table_key_idx
    ON page_table_rows (page_table_id, table_key)
  `);

  await db.query(`
    ALTER TABLE pages
    ADD COLUMN IF NOT EXISTS menu_id INT REFERENCES menus(id) ON DELETE SET NULL
  `);

  console.log('page_tables and page_table_rows ready');
  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add page tables');
  console.error(err.message);
  process.exit(1);
});
