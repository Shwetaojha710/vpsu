// add is_faculty / is_department to menus and mark existing ones:
// - menus directly under the "Faculties" menu   -> is_faculty = true
// - menus directly under the "Departments" menu -> is_department = true
// Safe to run more than once. Only sets flags to true, never clears them.
// command: node db/add-menu-faculty-flags.js

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function markChildren(db, column, titles) {
  const parents = await db.query(
    `SELECT id, title FROM menus WHERE LOWER(TRIM(title)) = ANY($1::text[])`,
    [titles]
  );
  if (!parents.rows.length) {
    console.log('No parent menu found for ' + column + ' (looked for: ' + titles.join(', ') + ')');
    return;
  }
  const ids = parents.rows.map(function (r) { return r.id; });
  const res = await db.query(
    `UPDATE menus SET ${column} = true WHERE parent_id = ANY($1::int[]) RETURNING id, title`,
    [ids]
  );
  console.log(column + ' = true for ' + res.rowCount + ' menus under: ' +
    parents.rows.map(function (r) { return r.title; }).join(', '));
  res.rows.forEach(function (r) { console.log('  - ' + r.id + ' ' + r.title); });
}

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
    ALTER TABLE menus ADD COLUMN IF NOT EXISTS is_faculty BOOLEAN DEFAULT false;
    ALTER TABLE menus ADD COLUMN IF NOT EXISTS is_department BOOLEAN DEFAULT false;
  `);
  console.log('Menu columns ready: is_faculty, is_department');

  await markChildren(db, 'is_faculty', ['faculties', 'faculty']);
  await markChildren(db, 'is_department', ['departments', 'department']);

  await db.end();
}

run().catch(function (err) {
  console.error('Failed to add menu faculty / department flags');
  console.error(err.message);
  process.exit(1);
});
