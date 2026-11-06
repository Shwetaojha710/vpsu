// link each faculty / department section to its menu (sections.menu_id)
// and set department parent_id from the menu tree.
// - faculty section    -> menu flagged is_faculty with the same name
// - department section -> menu flagged is_department with the same name
//   ("Department of X" and "Dept. of X" are treated as the same)
// Safe to run more than once. Only fills empty menu_id / parent_id values.
// command: node db/add-section-menu-link.js

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function key(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/^\s*(department|dept\.?)\s+of\s+/, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');
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
    ALTER TABLE sections ADD COLUMN IF NOT EXISTS menu_id INT
      REFERENCES menus(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS sections_menu_idx ON sections (menu_id);
  `);
  console.log('Section column ready: menu_id');

  const menus = (await db.query(
    `SELECT id, title, parent_id, is_faculty, is_department FROM menus
     WHERE is_faculty = true OR is_department = true`
  )).rows;
  const sections = (await db.query(
    `SELECT id, name, type, menu_id, parent_id FROM sections ORDER BY id`
  )).rows;

  for (const s of sections) {
    if (s.menu_id || (s.type !== 'faculty' && s.type !== 'department')) continue;
    const flag = s.type === 'faculty' ? 'is_faculty' : 'is_department';
    const found = menus.filter(function (m) { return m[flag] && key(m.title) === key(s.name); });
    if (found.length === 1) {
      await db.query('UPDATE sections SET menu_id = $1 WHERE id = $2', [found[0].id, s.id]);
      s.menu_id = found[0].id;
      console.log('linked  section ' + s.id + ' "' + s.name + '" -> menu ' + found[0].id + ' "' + found[0].title + '"');
    } else {
      console.log('NOT linked section ' + s.id + ' "' + s.name + '" (' +
        (found.length ? found.length + ' matching menus' : 'no ' + flag + ' menu with this name') +
        ') - pick it in Sections > Linked Menu');
    }
  }

  // department parent = section linked to the department menu's parent menu
  for (const s of sections) {
    if (s.type !== 'department' || s.parent_id || !s.menu_id) continue;
    const menu = menus.find(function (m) { return m.id === s.menu_id; });
    const faculty = menu && sections.find(function (f) {
      return f.type === 'faculty' && f.menu_id && f.menu_id === menu.parent_id;
    });
    if (faculty) {
      await db.query('UPDATE sections SET parent_id = $1 WHERE id = $2', [faculty.id, s.id]);
      console.log('parent  section ' + s.id + ' "' + s.name + '" -> faculty section ' + faculty.id + ' "' + faculty.name + '"');
    } else {
      console.log('NO parent for section ' + s.id + ' "' + s.name + '" - its faculty menu is not linked to a section');
    }
  }

  await db.end();
}

run().catch(function (err) {
  console.error('Failed to link sections to menus');
  console.error(err.message);
  process.exit(1);
});
