const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { LmsCourse, Menu } = require('../models');
const { courseWhere, canSeeCourse, ownsRow, resolveOwner } = require('../helpers/lmsScope');

const COURSE_INCLUDE = [
  { model: Menu, as: 'faculty', attributes: ['id', ['title', 'name']] },
  { model: Menu, as: 'department', attributes: ['id', ['title', 'name']] }
];

exports.list = wrap(async function (req, res) {
  const where = {};
  if (req.query.faculty_id) where.faculty_id = Number(req.query.faculty_id);
  if (req.query.department_id) where.department_id = Number(req.query.department_id);
  // scope is applied last so query filters can never widen it
  Object.assign(where, courseWhere(req.lmsScope));

  const rows = await LmsCourse.findAll({
    where: where,
    include: COURSE_INCLUDE,
    order: [['id', 'ASC']]
  });
  return json.ok(res, rows);
});

exports.show = wrap(async function (req, res) {
  const row = await LmsCourse.findByPk(req.params.id, { include: COURSE_INCLUDE });
  if (!row) return json.fail(res, 404, 'Course not found');
  if (!canSeeCourse(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Course name is required');

  const owner = await resolveOwner(req.lmsScope, req.body);

  const row = await LmsCourse.create({
    name: name,
    name_hi: req.body.name_hi || '',
    code: req.body.code || '',
    faculty_id: owner.faculty_id,
    department_id: owner.department_id,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Course created');
});

exports.update = wrap(async function (req, res) {
  const row = await LmsCourse.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Course not found');
  if (!ownsRow(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');

  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Course name is required');

  const owner = await resolveOwner(req.lmsScope, req.body, row);

  await row.update({
    name: name,
    name_hi: req.body.name_hi || '',
    code: req.body.code || '',
    faculty_id: owner.faculty_id,
    department_id: owner.department_id,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Course updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await LmsCourse.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Course not found');
  if (!ownsRow(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');
  await row.destroy();
  return json.ok(res, null, 'Course deleted');
});
