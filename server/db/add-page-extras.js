// add page_type, banners, department photos, files
// command: node db/add-page-extras.js

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

  await db.query(`ALTER TABLE side_menus ADD COLUMN IF NOT EXISTS page_type VARCHAR(20) DEFAULT 'static'`);
  await db.query(`ALTER TABLE side_menus ALTER COLUMN slug TYPE VARCHAR(255)`);

  await db.query(`
    CREATE TABLE IF NOT EXISTS banners (
      id SERIAL PRIMARY KEY,
      section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      title VARCHAR(255),
      image VARCHAR(255),
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS section_photos (
      id SERIAL PRIMARY KEY,
      section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      title VARCHAR(255),
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS side_menu_files (
      id SERIAL PRIMARY KEY,
      side_menu_id INT NOT NULL REFERENCES side_menus(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      file_name VARCHAR(255),
      language VARCHAR(50) DEFAULT 'English',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log('Banners, department photos, page types and files ready');

  const cse = await db.query(
    "SELECT id FROM sections WHERE name ILIKE '%Computer Science%' LIMIT 1"
  );
  if (cse.rows.length === 0) {
    const added = await db.query(
      `INSERT INTO sections (name, name_hi, type, slug, sort_order, is_active)
       VALUES ('Department of Computer Science & Engineering', 'कंप्यूटर विज्ञान एवं अभियंत्रण विभाग', 'department', 'department-of-computer-science-engineering', 10, true)
       RETURNING id`
    );
    const id = added.rows[0].id;
    await db.query(
      `INSERT INTO side_menus (section_id, title, title_hi, slug, page_type, content, sort_order, is_active) VALUES
       ($1, 'Introduction', 'परिचय', 'introduction-department-of-computer-science-and-engineering', 'static', '<h2>Introduction Department Computer Science and Engineering</h2><p>Welcome to the department.</p>', 1, true),
       ($1, 'Faculty', 'संकाय सदस्य', 'faculty-department-of-computer-science-and-engineering', 'dynamic', '', 2, true),
       ($1, 'Fee Structure', 'शुल्क संरचना', 'fee-structure-computer-science-and-engineering', 'table', '<p>B.Tech and M.Tech fee details.</p>', 3, true),
       ($1, 'News & Notices', 'समाचार एवं सूचना', 'news-notices-computer-science-and-engineering', 'table', '', 4, true),
       ($1, 'Photo Gallery', 'फोटो गैलरी', 'photo-gallery-department-of-computer-science-and-engineering', 'custom', '', 5, true)`,
      [id]
    );
    console.log('Sample CSE department with page types added');
  }

  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add page extras');
  console.error(err.message);
  process.exit(1);
});
