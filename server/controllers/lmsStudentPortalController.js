const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const {
  LmsStudent,
  LmsCourse,
  LmsSubject,
  LmsContent,
  LmsTeacher
} = require('../models');

exports.login = wrap(async function (req, res) {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  if (!email || !password) return json.fail(res, 400, 'Email and password are required');

  const student = await LmsStudent.findOne({ where: { email: email } });
  if (!student || !student.is_active) {
    return json.fail(res, 401, 'Wrong email or password');
  }

  const match = await bcrypt.compare(password, student.password);
  if (!match) return json.fail(res, 401, 'Wrong email or password');

  const token = jwt.sign(
    {
      id: student.id,
      name: student.name,
      email: student.email,
      course_id: student.course_id,
      semester: student.semester,
      role: 'student'
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return json.ok(res, {
    token: token,
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      roll_no: student.roll_no,
      course_id: student.course_id,
      semester: student.semester,
      role: 'student'
    }
  }, 'Login successful');
});

exports.me = wrap(async function (req, res) {
  const student = await LmsStudent.findByPk(req.lmsUser.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'name_hi', 'code'] }]
  });
  if (!student) return json.fail(res, 404, 'Student not found');
  return json.ok(res, student);
});

// Subjects of student's course (optionally filter by semester)
exports.mySubjects = wrap(async function (req, res) {
  const student = await LmsStudent.findByPk(req.lmsUser.id);
  if (!student) return json.fail(res, 404, 'Student not found');

  const where = {
    course_id: student.course_id,
    is_active: true
  };
  const semester = req.query.semester ? Number(req.query.semester) : student.semester;
  if (semester) {
    // yearly subjects: semester 1-2 -> year 1, 3-4 -> year 2 ...
    where[Op.or] = [
      { term_type: { [Op.ne]: 'year' }, semester: semester },
      { term_type: 'year', semester: Math.ceil(semester / 2) }
    ];
  }

  const rows = await LmsSubject.findAll({
    where: where,
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }],
    order: [['semester', 'ASC'], ['name', 'ASC']]
  });
  return json.ok(res, rows);
});

// ONLY published content for student's course + chosen subject
exports.subjectContents = wrap(async function (req, res) {
  const student = await LmsStudent.findByPk(req.lmsUser.id);
  if (!student) return json.fail(res, 404, 'Student not found');

  const subjectId = Number(req.params.subjectId || req.query.subject_id);
  if (!subjectId) return json.fail(res, 400, 'Subject is required');

  const subject = await LmsSubject.findByPk(subjectId);
  if (!subject || subject.course_id !== student.course_id) {
    return json.fail(res, 403, 'Subject not available for your course');
  }

  const rows = await LmsContent.findAll({
    where: {
      subject_id: subjectId,
      course_id: student.course_id,
      is_published: true
    },
    include: [
      { model: LmsTeacher, as: 'teacher', attributes: ['id', 'name'] },
      { model: LmsSubject, as: 'subject', attributes: ['id', 'name', 'code'] }
    ],
    order: [['published_at', 'DESC'], ['id', 'DESC']]
  });

  return json.ok(res, {
    subject: subject,
    contents: rows
  });
});
