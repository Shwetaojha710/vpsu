const bcrypt = require('bcryptjs');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { LmsStudent, LmsCourse } = require('../models');
const { allowedCourseIds, restrictTo, ownsRow } = require('../helpers/lmsScope');

async function canUseCourse(scope, courseId) {
  return ownsRow(scope, await LmsCourse.findByPk(courseId));
}

exports.list = wrap(async function (req, res) {
  const where = {};
  if (req.query.course_id) where.course_id = Number(req.query.course_id);
  restrictTo(where, 'course_id', await allowedCourseIds(req.lmsScope));

  const rows = await LmsStudent.findAll({
    where: where,
    attributes: { exclude: ['password'] },
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }],
    order: [['id', 'ASC']]
  });
  return json.ok(res, rows);
});

exports.show = wrap(async function (req, res) {
  const row = await LmsStudent.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }]
  });
  if (!row) return json.fail(res, 404, 'Student not found');
  if (!(await canUseCourse(req.lmsScope, row.course_id))) return json.fail(res, 403, 'Access denied');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const courseId = Number(req.body.course_id);
  if (!name || !email || !password) {
    return json.fail(res, 400, 'Name, email and password are required');
  }
  if (!courseId) return json.fail(res, 400, 'Course is required');

  const course = await LmsCourse.findByPk(courseId);
  if (!course) return json.fail(res, 400, 'Invalid course');
  if (!ownsRow(req.lmsScope, course)) return json.fail(res, 403, 'Access denied for this course');

  const exists = await LmsStudent.findOne({ where: { email: email } });
  if (exists) return json.fail(res, 400, 'Email already registered');

  const row = await LmsStudent.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
    roll_no: req.body.roll_no || '',
    course_id: courseId,
    semester: Number(req.body.semester) || 1,
    is_active: isNotFalse(req.body.is_active)
  });

  const full = await LmsStudent.findByPk(row.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }]
  });
  return json.ok(res, full, 'Student created');
});

exports.update = wrap(async function (req, res) {
  const row = await LmsStudent.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Student not found');
  if (!(await canUseCourse(req.lmsScope, row.course_id))) return json.fail(res, 403, 'Access denied');

  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const courseId = Number(req.body.course_id || row.course_id);
  if (!name || !email) return json.fail(res, 400, 'Name and email are required');

  const course = await LmsCourse.findByPk(courseId);
  if (!course) return json.fail(res, 400, 'Invalid course');
  if (!ownsRow(req.lmsScope, course)) return json.fail(res, 403, 'Access denied for this course');

  const exists = await LmsStudent.findOne({ where: { email: email } });
  if (exists && exists.id !== row.id) {
    return json.fail(res, 400, 'Email already registered');
  }

  const data = {
    name: name,
    email: email,
    roll_no: req.body.roll_no || '',
    course_id: courseId,
    semester: Number(req.body.semester) || row.semester,
    is_active: isNotFalse(req.body.is_active)
  };
  if (req.body.password) {
    data.password = await bcrypt.hash(req.body.password, 10);
  }
  await row.update(data);

  const full = await LmsStudent.findByPk(row.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code'] }]
  });
  return json.ok(res, full, 'Student updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await LmsStudent.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Student not found');
  if (!(await canUseCourse(req.lmsScope, row.course_id))) return json.fail(res, 403, 'Access denied');
  await row.destroy();
  return json.ok(res, null, 'Student deleted');
});
