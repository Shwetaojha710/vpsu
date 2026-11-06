const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { LmsSubject, LmsCourse } = require('../models');
const {
  allowedCourseIds,
  restrictTo,
  ownsRow,
  canSeeSubject
} = require('../helpers/lmsScope');

const TERM_TYPES = ['semester', 'year'];

function termType(value, fallback) {
  const type = String(value || '').trim().toLowerCase();
  return TERM_TYPES.indexOf(type) !== -1 ? type : (fallback || 'semester');
}

exports.list = wrap(async function (req, res) {
  const scope = req.lmsScope;
  const where = {};
  if (req.query.course_id) where.course_id = Number(req.query.course_id);
  restrictTo(where, 'course_id', await allowedCourseIds(scope));
  if (scope.role === 'teacher') where.id = scope.subjectIds;

  const rows = await LmsSubject.findAll({
    where: where,
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code', 'faculty_id', 'department_id'] }],
    order: [['course_id', 'ASC'], ['semester', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows);
});

exports.show = wrap(async function (req, res) {
  const row = await LmsSubject.findByPk(req.params.id, {
    include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code', 'faculty_id', 'department_id'] }]
  });
  if (!row) return json.fail(res, 404, 'Subject not found');
  if (!canSeeSubject(req.lmsScope, row, row.course)) return json.fail(res, 403, 'Access denied');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  const courseId = Number(req.body.course_id);
  if (!name) return json.fail(res, 400, 'Subject name is required');
  if (!courseId) return json.fail(res, 400, 'Course is required');

  const course = await LmsCourse.findByPk(courseId);
  if (!course) return json.fail(res, 400, 'Invalid course');
  if (!ownsRow(req.lmsScope, course)) return json.fail(res, 403, 'Access denied for this course');

  const row = await LmsSubject.create({
    course_id: courseId,
    name: name,
    name_hi: req.body.name_hi || '',
    code: req.body.code || '',
    term_type: termType(req.body.term_type),
    semester: Number(req.body.semester) || 1,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Subject created');
});

exports.update = wrap(async function (req, res) {
  const row = await LmsSubject.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Subject not found');
  if (!ownsRow(req.lmsScope, await LmsCourse.findByPk(row.course_id))) {
    return json.fail(res, 403, 'Access denied');
  }

  const name = (req.body.name || '').trim();
  const courseId = Number(req.body.course_id || row.course_id);
  if (!name) return json.fail(res, 400, 'Subject name is required');

  const course = await LmsCourse.findByPk(courseId);
  if (!course) return json.fail(res, 400, 'Invalid course');
  if (!ownsRow(req.lmsScope, course)) return json.fail(res, 403, 'Access denied for this course');

  await row.update({
    course_id: courseId,
    name: name,
    name_hi: req.body.name_hi || '',
    code: req.body.code || '',
    term_type: termType(req.body.term_type, row.term_type),
    semester: Number(req.body.semester) || row.semester,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Subject updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await LmsSubject.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Subject not found');
  if (!ownsRow(req.lmsScope, await LmsCourse.findByPk(row.course_id))) {
    return json.fail(res, 403, 'Access denied');
  }
  await row.destroy();
  return json.ok(res, null, 'Subject deleted');
});
