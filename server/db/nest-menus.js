// migrate old 2-level menus into unlimited nested menus
// command: node db/nest-menus.js

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
    ADD COLUMN IF NOT EXISTS parent_id INT REFERENCES menus(id) ON DELETE CASCADE
  `);

  const oldTable = await db.query("SELECT to_regclass('public.sub_menus') AS name");
  if (oldTable.rows[0].name) {
    await db.query(`
      INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
      SELECT menu_id, title, title_hi, url, sort_order, is_active FROM sub_menus
    `);
    await db.query('DROP TABLE sub_menus');
    console.log('Old sub_menus moved into nested menus');
  } else {
    console.log('sub_menus table already removed');
  }

  const about = await db.query(
    "SELECT id FROM menus WHERE title = 'About University' LIMIT 1"
  );
  if (about.rows[0]) {
    const kids = await db.query(
      'SELECT COUNT(*)::int AS n FROM menus WHERE parent_id = $1',
      [about.rows[0].id]
    );
    if (kids.rows[0].n === 0) {
      await db.query(
        `INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active) VALUES
         ($1, 'History', 'इतिहास', '/about/history', 1, true),
         ($1, 'NAAC Accreditation', 'NAAC मान्यता', '/about/naac', 2, true)`,
        [about.rows[0].id]
      );
      console.log('Sample 3rd level menus added under About University');
    }
  }

  console.log('Nested menus ready. Any menu can have more sub menus.');
  await db.end();
}

run().catch(function (err) {
  console.error('Nested menus setup failed');
  console.error(err.message);
  process.exit(1);
});
