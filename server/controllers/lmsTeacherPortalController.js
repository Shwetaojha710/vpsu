const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { LmsTeacher, LmsSubject, LmsCourse } = require('../models');

exports.login = wrap(async function (req, res) {
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  if (!email || !password) return json.fail(res, 400, 'Email and password are required');

  const teacher = await LmsTeacher.findOne({ where: { email: email } });
  if (!teacher || !teacher.is_active) {
    return json.fail(res, 401, 'Wrong email or password');
  }

  const match = await bcrypt.compare(password, teacher.password);
  if (!match) return json.fail(res, 401, 'Wrong email or password');

  const token = jwt.sign(
    { id: teacher.id, name: teacher.name, email: teacher.email, role: 'teacher' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return json.ok(res, {
    token: token,
    teacher: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher'
    }
  }, 'Login successful');
});

exports.me = wrap(async function (req, res) {
  const teacher = await LmsTeacher.findByPk(req.lmsUser.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: LmsSubject,
      as: 'subjects',
      include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }],
      through: { attributes: [] }
    }]
  });
  if (!teacher) return json.fail(res, 404, 'Teacher not found');
  return json.ok(res, teacher);
});

exports.mySubjects = wrap(async function (req, res) {
  const teacher = await LmsTeacher.findByPk(req.lmsUser.id, {
    include: [{
      model: LmsSubject,
      as: 'subjects',
      include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }],
      through: { attributes: [] }
    }]
  });
  if (!teacher) return json.fail(res, 404, 'Teacher not found');
  return json.ok(res, teacher.subjects || []);
});
