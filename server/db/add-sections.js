// add sections, side menus and professors without deleting old data
// command: node db/add-sections.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
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
    CREATE TABLE IF NOT EXISTS sections (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_hi VARCHAR(255),
      type VARCHAR(50) DEFAULT 'faculty',
      slug VARCHAR(150) UNIQUE,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS side_menus (
      id SERIAL PRIMARY KEY,
      section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      title_hi VARCHAR(255),
      slug VARCHAR(150),
      content TEXT,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS professors (
      id SERIAL PRIMARY KEY,
      section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
      name VARCHAR(150) NOT NULL,
      designation VARCHAR(150),
      photo VARCHAR(255),
      email VARCHAR(150),
      phone VARCHAR(20),
      profile_text TEXT,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT true
    )
  `);

  const count = await db.query('SELECT COUNT(*)::int AS n FROM sections');
  if (count.rows[0].n === 0) {
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    const onlyNew = seed.slice(seed.indexOf('INSERT INTO sections'));
    await db.query(onlyNew);
    console.log('Sample sections, side menus and professors added');
  } else {
    console.log('Sections table already has data');
  }

  console.log('Section tables ready');
  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add section tables');
  console.error(err.message);
  process.exit(1);
});
