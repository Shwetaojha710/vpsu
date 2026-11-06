// Additive LMS tables + sample data. Does NOT touch existing CMS tables.
// command: node db/add-lms.js

const path = require('path');
const bcrypt = require('bcryptjs');
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
    CREATE TABLE IF NOT EXISTS lms_courses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_hi VARCHAR(255),
      code VARCHAR(50),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lms_subjects (
      id SERIAL PRIMARY KEY,
      course_id INT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      name_hi VARCHAR(255),
      code VARCHAR(50),
      semester INT DEFAULT 1,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lms_teachers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lms_teacher_subjects (
      id SERIAL PRIMARY KEY,
      teacher_id INT NOT NULL REFERENCES lms_teachers(id) ON DELETE CASCADE,
      subject_id INT NOT NULL REFERENCES lms_subjects(id) ON DELETE CASCADE,
      UNIQUE (teacher_id, subject_id)
    );

    CREATE TABLE IF NOT EXISTS lms_students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      roll_no VARCHAR(50),
      course_id INT NOT NULL REFERENCES lms_courses(id) ON DELETE RESTRICT,
      semester INT DEFAULT 1,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lms_contents (
      id SERIAL PRIMARY KEY,
      teacher_id INT REFERENCES lms_teachers(id) ON DELETE SET NULL,
      course_id INT NOT NULL REFERENCES lms_courses(id) ON DELETE CASCADE,
      subject_id INT NOT NULL REFERENCES lms_subjects(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      title_hi VARCHAR(255),
      description TEXT,
      type VARCHAR(20) DEFAULT 'video',
      file_path VARCHAR(255),
      link_url TEXT,
      is_published BOOLEAN DEFAULT false,
      published_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS lms_subjects_course_idx ON lms_subjects (course_id);
    CREATE INDEX IF NOT EXISTS lms_students_course_idx ON lms_students (course_id);
    CREATE INDEX IF NOT EXISTS lms_contents_subject_idx ON lms_contents (subject_id);
    CREATE INDEX IF NOT EXISTS lms_contents_published_idx ON lms_contents (subject_id, is_published);
  `);

  const courseCount = await db.query('SELECT COUNT(*)::int AS c FROM lms_courses');
  if (courseCount.rows[0].c === 0) {
    const course = await db.query(
      `INSERT INTO lms_courses (name, name_hi, code) VALUES ($1, $2, $3) RETURNING id`,
      ['B.Tech Computer Science', 'बी.टेक कंप्यूटर साइंस', 'CSE']
    );
    const courseId = course.rows[0].id;

    const sub1 = await db.query(
      `INSERT INTO lms_subjects (course_id, name, name_hi, code, semester)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [courseId, 'Data Structures', 'डेटा संरचना', 'CS201', 3]
    );
    const sub2 = await db.query(
      `INSERT INTO lms_subjects (course_id, name, name_hi, code, semester)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [courseId, 'Operating Systems', 'ऑपरेटिंग सिस्टम', 'CS301', 4]
    );

    const teacherHash = await bcrypt.hash('teacher123', 10);
    const teacher = await db.query(
      `INSERT INTO lms_teachers (name, email, password, phone)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Demo Teacher', 'teacher@vpsu.ac.in', teacherHash, '9999999999']
    );
    const teacherId = teacher.rows[0].id;

    await db.query(
      `INSERT INTO lms_teacher_subjects (teacher_id, subject_id) VALUES ($1, $2), ($1, $3)`,
      [teacherId, sub1.rows[0].id, sub2.rows[0].id]
    );

    const studentHash = await bcrypt.hash('student123', 10);
    await db.query(
      `INSERT INTO lms_students (name, email, password, roll_no, course_id, semester)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['Demo Student', 'student@vpsu.ac.in', studentHash, 'CSE2025001', courseId, 3]
    );

    await db.query(
      `INSERT INTO lms_contents
        (teacher_id, course_id, subject_id, title, title_hi, description, type, link_url, is_published, published_at)
       VALUES
        ($1, $2, $3, $4, $5, $6, 'link', $7, true, NOW()),
        ($1, $2, $3, $8, $9, $10, 'link', $11, false, NULL)`,
      [
        teacherId,
        courseId,
        sub1.rows[0].id,
        'Intro to Arrays (Published)',
        'एरे का परिचय',
        'Sample published lecture link',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'Draft Lecture (Hidden)',
        'ड्राफ्ट व्याख्यान',
        'This draft must NOT show to students',
        'https://example.com/draft'
      ]
    );

    console.log('LMS sample data inserted');
    console.log('Teacher login: teacher@vpsu.ac.in / teacher123');
    console.log('Student login: student@vpsu.ac.in / student123');
  } else {
    console.log('LMS tables ready (sample data already present)');
  }

  await db.end();
  console.log('LMS setup complete');
}

run().catch(function (err) {
  console.error('LMS setup failed:', err.message);
  process.exit(1);
});
