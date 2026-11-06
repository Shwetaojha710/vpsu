const bcrypt = require('bcryptjs');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { Admin, Menu } = require('../models');

// GET /api/lms/scope
// role + faculties / departments this user may pick in LMS dropdowns
exports.scope = wrap(async function (req, res) {
  const scope = req.lmsScope;
  // faculty / department = menus flagged is_faculty / is_department
  const attrs = ['id', ['title', 'name'], ['title_hi', 'name_hi'], 'parent_id', 'slug'];
  const order = [['sort_order', 'ASC'], ['title', 'ASC']];

  let faculties;
  let departments;
  if (scope.all) {
    faculties = await Menu.findAll({ where: { is_faculty: true }, attributes: attrs, order: order });
    departments = await Menu.findAll({ where: { is_department: true }, attributes: attrs, order: order });
  } else {
    faculties = scope.facultyId
      ? await Menu.findAll({ where: { id: scope.facultyId }, attributes: attrs })
      : [];
    departments = scope.departmentIds.length
      ? await Menu.findAll({ where: { id: scope.departmentIds }, attributes: attrs, order: order })
      : [];
  }

  return json.ok(res, {
    role: scope.role,
    faculty_id: scope.facultyId || null,
    department_id: scope.departmentId || null,
    teacher_id: scope.teacherId || null,
    subject_ids: scope.subjectIds || [],
    course_ids: scope.courseIds || [],
    faculties: faculties,
    departments: departments
  });
});

// GET /api/lms/departments?faculty_id=ID
// department menus under one faculty menu (menus.parent_id = faculty id)
exports.departments = wrap(async function (req, res) {
  const scope = req.lmsScope;
  const facultyId = Number(req.query.faculty_id);
  if (!facultyId) return json.fail(res, 400, 'faculty_id is required');
  if (!scope.all && facultyId !== scope.facultyId) {
    return json.fail(res, 403, 'Access denied for this faculty');
  }

  const where = { parent_id: facultyId, is_department: true };
  if (!scope.all && scope.role !== 'faculty') where.id = scope.departmentIds;

  const rows = await Menu.findAll({
    where: where,
    attributes: ['id', ['title', 'name'], ['title_hi', 'name_hi'], 'parent_id', 'slug'],
    order: [['sort_order', 'ASC'], ['title', 'ASC']]
  });
  return json.ok(res, rows);
});

// ---------- faculty / department logins (admin only) ----------

const USER_ATTRS = ['id', 'name', 'email', 'role', 'faculty_id', 'department_id', 'created_at'];
const USER_ROLES = ['faculty', 'department'];

async function ownerFor(role, body) {
  if (role === 'faculty') {
    const fac = await Menu.findByPk(Number(body.faculty_id));
    if (!fac || !fac.is_faculty) return { error: 'Please select a valid faculty' };
    return { faculty_id: fac.id, department_id: null };
  }
  const dept = await Menu.findByPk(Number(body.department_id));
  if (!dept || !dept.is_department) return { error: 'Please select a valid department' };
  return { faculty_id: dept.parent_id || null, department_id: dept.id };
}

exports.listUsers = wrap(async function (req, res) {
  const rows = await Admin.findAll({
    where: { role: USER_ROLES },
    attributes: USER_ATTRS,
    order: [['id', 'ASC']]
  });
  return json.ok(res, rows);
});

exports.createUser = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const role = req.body.role;
  if (!name || !email || !password) return json.fail(res, 400, 'Name, email and password are required');
  if (USER_ROLES.indexOf(role) === -1) return json.fail(res, 400, 'Role must be faculty or department');

  const exists = await Admin.findOne({ where: { email: email } });
  if (exists) return json.fail(res, 400, 'Email already registered');

  const owner = await ownerFor(role, req.body);
  if (owner.error) return json.fail(res, 400, owner.error);

  const row = await Admin.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
    role: role,
    faculty_id: owner.faculty_id,
    department_id: owner.department_id
  });
  return json.ok(res, await Admin.findByPk(row.id, { attributes: USER_ATTRS }), 'Login created');
});

exports.updateUser = wrap(async function (req, res) {
  const row = await Admin.findByPk(req.params.id);
  if (!row || USER_ROLES.indexOf(row.role) === -1) return json.fail(res, 404, 'Login not found');

  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const role = req.body.role || row.role;
  if (!name || !email) return json.fail(res, 400, 'Name and email are required');
  if (USER_ROLES.indexOf(role) === -1) return json.fail(res, 400, 'Role must be faculty or department');

  const exists = await Admin.findOne({ where: { email: email } });
  if (exists && exists.id !== row.id) return json.fail(res, 400, 'Email already registered');

  const owner = await ownerFor(role, req.body);
  if (owner.error) return json.fail(res, 400, owner.error);

  const data = {
    name: name,
    email: email,
    role: role,
    faculty_id: owner.faculty_id,
    department_id: owner.department_id
  };
  if (req.body.password) data.password = await bcrypt.hash(req.body.password, 10);
  await row.update(data);
  return json.ok(res, await Admin.findByPk(row.id, { attributes: USER_ATTRS }), 'Login updated');
});

exports.removeUser = wrap(async function (req, res) {
  const row = await Admin.findByPk(req.params.id);
  if (!row || USER_ROLES.indexOf(row.role) === -1) return json.fail(res, 404, 'Login not found');
  await row.destroy();
  return json.ok(res, null, 'Login deleted');
});
