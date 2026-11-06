// Additive columns for role-based LMS (faculty / department / teacher scoping).
// faculty_id / department_id hold ids of menus flagged is_faculty / is_department.
// Safe to run more than once. Does not change or delete existing data.
// command: node db/add-lms-roles.js

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
    -- department section -> parent faculty section
    ALTER TABLE sections ADD COLUMN IF NOT EXISTS parent_id INT
      REFERENCES sections(id) ON DELETE SET NULL;

    -- admin logins can be scoped to one faculty or one department
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS faculty_id INT;
    ALTER TABLE admins ADD COLUMN IF NOT EXISTS department_id INT;

    -- LMS ownership
    ALTER TABLE lms_courses ADD COLUMN IF NOT EXISTS faculty_id INT;
    ALTER TABLE lms_courses ADD COLUMN IF NOT EXISTS department_id INT;
    ALTER TABLE lms_teachers ADD COLUMN IF NOT EXISTS faculty_id INT;
    ALTER TABLE lms_teachers ADD COLUMN IF NOT EXISTS department_id INT;

    -- subjects can be semester-wise or yearly
    ALTER TABLE lms_subjects ADD COLUMN IF NOT EXISTS term_type VARCHAR(10) DEFAULT 'semester';

    -- earlier version pointed these at sections; they now hold menu ids
    ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_faculty_id_fkey;
    ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_department_id_fkey;
    ALTER TABLE lms_courses DROP CONSTRAINT IF EXISTS lms_courses_faculty_id_fkey;
    ALTER TABLE lms_courses DROP CONSTRAINT IF EXISTS lms_courses_department_id_fkey;
    ALTER TABLE lms_teachers DROP CONSTRAINT IF EXISTS lms_teachers_faculty_id_fkey;
    ALTER TABLE lms_teachers DROP CONSTRAINT IF EXISTS lms_teachers_department_id_fkey;

    CREATE INDEX IF NOT EXISTS sections_parent_idx ON sections (parent_id);
    CREATE INDEX IF NOT EXISTS lms_courses_faculty_idx ON lms_courses (faculty_id);
    CREATE INDEX IF NOT EXISTS lms_courses_department_idx ON lms_courses (department_id);
    CREATE INDEX IF NOT EXISTS lms_teachers_department_idx ON lms_teachers (department_id);
    CREATE INDEX IF NOT EXISTS lms_contents_course_idx ON lms_contents (course_id);
  `);

  await db.end();
  console.log('LMS role columns ready');
}

run().catch(function (err) {
  console.error('LMS role setup failed:', err.message);
  process.exit(1);
});
