const bcrypt = require('bcryptjs');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { LmsTeacher, LmsSubject, LmsTeacherSubject, LmsCourse, Menu } = require('../models');
const {
  denied,
  teacherWhere,
  ownsRow,
  allowedCourseIds,
  resolveOwner
} = require('../helpers/lmsScope');

const OWNER_INCLUDE = [
  { model: Menu, as: 'faculty', attributes: ['id', ['title', 'name']] },
  { model: Menu, as: 'department', attributes: ['id', ['title', 'name']] }
];

exports.list = wrap(async function (req, res) {
  const rows = await LmsTeacher.findAll({
    where: teacherWhere(req.lmsScope),
    attributes: { exclude: ['password'] },
    include: [{
      model: LmsSubject,
      as: 'subjects',
      attributes: ['id', 'name', 'code', 'course_id', 'term_type', 'semester'],
      through: { attributes: [] }
    }].concat(OWNER_INCLUDE),
    order: [['id', 'ASC']]
  });
  return json.ok(res, rows);
});

exports.show = wrap(async function (req, res) {
  const row = await LmsTeacher.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: LmsSubject,
      as: 'subjects',
      attributes: ['id', 'name', 'code', 'course_id', 'term_type', 'semester'],
      through: { attributes: [] }
    }].concat(OWNER_INCLUDE)
  });
  if (!row) return json.fail(res, 404, 'Teacher not found');
  if (!ownsRow(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  if (!name || !email || !password) {
    return json.fail(res, 400, 'Name, email and password are required');
  }

  const exists = await LmsTeacher.findOne({ where: { email: email } });
  if (exists) return json.fail(res, 400, 'Email already registered');

  const owner = await resolveOwner(req.lmsScope, req.body);
  const subjectIds = parseSubjectIds(req.body.subject_ids);
  await checkSubjects(req.lmsScope, subjectIds);

  const row = await LmsTeacher.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10),
    phone: req.body.phone || '',
    faculty_id: owner.faculty_id,
    department_id: owner.department_id,
    is_active: isNotFalse(req.body.is_active)
  });

  if (subjectIds.length) {
    await setTeacherSubjects(row.id, subjectIds);
  }

  const full = await LmsTeacher.findByPk(row.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: LmsSubject, as: 'subjects', through: { attributes: [] } }]
  });
  return json.ok(res, full, 'Teacher created');
});

exports.update = wrap(async function (req, res) {
  const row = await LmsTeacher.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Teacher not found');
  if (!ownsRow(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');

  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  if (!name || !email) return json.fail(res, 400, 'Name and email are required');

  const exists = await LmsTeacher.findOne({ where: { email: email } });
  if (exists && exists.id !== row.id) {
    return json.fail(res, 400, 'Email already registered');
  }

  const owner = await resolveOwner(req.lmsScope, req.body, row);
  if (req.body.subject_ids !== undefined) {
    await checkSubjects(req.lmsScope, parseSubjectIds(req.body.subject_ids));
  }

  const data = {
    name: name,
    email: email,
    phone: req.body.phone || '',
    faculty_id: owner.faculty_id,
    department_id: owner.department_id,
    is_active: isNotFalse(req.body.is_active)
  };
  if (req.body.password) {
    data.password = await bcrypt.hash(req.body.password, 10);
  }
  await row.update(data);

  if (req.body.subject_ids !== undefined) {
    await setTeacherSubjects(row.id, parseSubjectIds(req.body.subject_ids));
  }

  const full = await LmsTeacher.findByPk(row.id, {
    attributes: { exclude: ['password'] },
    include: [{ model: LmsSubject, as: 'subjects', through: { attributes: [] } }]
  });
  return json.ok(res, full, 'Teacher updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await LmsTeacher.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Teacher not found');
  if (!ownsRow(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');
  await row.destroy();
  return json.ok(res, null, 'Teacher deleted');
});

exports.assignSubjects = wrap(async function (req, res) {
  const row = await LmsTeacher.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Teacher not found');
  if (!ownsRow(req.lmsScope, row)) return json.fail(res, 403, 'Access denied');
  const subjectIds = parseSubjectIds(req.body.subject_ids);
  await checkSubjects(req.lmsScope, subjectIds);
  await setTeacherSubjects(row.id, subjectIds);
  const full = await LmsTeacher.findByPk(row.id, {
    attributes: { exclude: ['password'] },
    include: [{
      model: LmsSubject,
      as: 'subjects',
      include: [{ model: LmsCourse, as: 'course', attributes: ['id', 'name'] }],
      through: { attributes: [] }
    }]
  });
  return json.ok(res, full, 'Subjects assigned');
});

function parseSubjectIds(value) {
  if (Array.isArray(value)) return value.map(Number).filter(Boolean);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(Number).filter(Boolean);
    } catch (e) {
      return value.split(',').map(Number).filter(Boolean);
    }
  }
  return [];
}

// faculty / department can only assign subjects of their own courses
async function checkSubjects(scope, subjectIds) {
  const courseIds = await allowedCourseIds(scope);
  if (courseIds === null || !subjectIds.length) return;
  const subjects = await LmsSubject.findAll({ where: { id: subjectIds }, attributes: ['id', 'course_id'] });
  const outside = subjects.some(function (s) { return courseIds.indexOf(s.course_id) === -1; });
  if (outside) throw denied(403, 'You can only assign subjects of your own courses');
}

async function setTeacherSubjects(teacherId, subjectIds) {
  await LmsTeacherSubject.destroy({ where: { teacher_id: teacherId } });
  for (const sid of subjectIds) {
    const subject = await LmsSubject.findByPk(sid);
    if (subject) {
      await LmsTeacherSubject.create({ teacher_id: teacherId, subject_id: sid });
    }
  }
}
