// update Important Links icons (PNG) without deleting other data
// command: node db/update-quick-link-icons.js

const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const icons = [
  { title: 'New College Login / Results', icon: 'icon-college.png' },
  { title: 'Online Services', icon: 'icon-link.png' },
  { title: 'University Blog', icon: 'icon-blog.png' },
  { title: 'Examination Form', icon: 'icon-exam.png' },
  { title: 'PhD Online Fee', icon: 'icon-phd.png' },
  { title: 'National Education Policy', icon: 'icon-nep.png' },
  { title: 'Training & Placement', icon: 'icon-place.png' },
  { title: 'Recruitment', icon: 'icon-recruit.png' },
  { title: 'Campus Online Fee', icon: 'icon-fee.png' },
  { title: 'IQAC', icon: 'icon-iqac.png' },
  { title: 'SWAYAM', icon: 'icon-swayam.png' },
  { title: 'Results', icon: 'icon-result.png' }
];

async function run() {
  const db = new Client({
    host: (process.env.DB_HOST || 'localhost').replace(/^['"]|['"]$/g, ''),
    port: Number(process.env.DB_PORT) || 5432,
    user: (process.env.DB_USER || 'postgres').replace(/^['"]|['"]$/g, ''),
    password: (process.env.DB_PASSWORD || 'postgres').replace(/^['"]|['"]$/g, ''),
    database: (process.env.DB_NAME || 'vpsu').replace(/^['"]|['"]$/g, '')
  });
  await db.connect();

  await db.query('ALTER TABLE quick_links ALTER COLUMN icon TYPE VARCHAR(255)');

  for (let i = 0; i < icons.length; i++) {
    const item = icons[i];
    const result = await db.query(
      'UPDATE quick_links SET icon = $1 WHERE title = $2 RETURNING id, title, icon',
      [item.icon, item.title]
    );
    if (result.rows[0]) {
      console.log('Updated:', result.rows[0].title, '->', result.rows[0].icon);
    } else {
      console.log('Not found (skipped):', item.title);
    }
  }

  console.log('Quick link icons updated');
  await db.end();
}

run().catch(function (err) {
  console.error(err.message);
  process.exit(1);
});
