// LMS role scope: who can see / change which faculty, department, course, subject.
// Faculty / department are menus flagged is_faculty / is_department
// (a department menu sits under its faculty menu via menus.parent_id).
// The scope is always loaded from the DB using the logged-in user id —
// faculty_id / department_id / teacher_id sent by the client are never trusted.

const { Op } = require('sequelize');
const {
  Admin,
  Menu,
  LmsCourse,
  LmsSubject,
  LmsTeacher,
  LmsTeacherSubject
} = require('../models');

// roles that are limited to part of the LMS; any other admin role has full access
const SCOPED_ROLES = ['faculty', 'department', 'teacher', 'student'];

function denied(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function isScopedRole(role) {
  return SCOPED_ROLES.indexOf(role) !== -1;
}

async function loadScope(tokenUser) {
  if (!tokenUser || !tokenUser.id) throw denied(401, 'Please login first');

  if (tokenUser.role === 'student') throw denied(403, 'Access denied');

  if (tokenUser.role === 'teacher') {
    const teacher = await LmsTeacher.findByPk(tokenUser.id);
    if (!teacher || !teacher.is_active) throw denied(401, 'Teacher account not active');

    const links = await LmsTeacherSubject.findAll({ where: { teacher_id: teacher.id } });
    const subjectIds = links.map(function (l) { return l.subject_id; });
    const subjects = subjectIds.length
      ? await LmsSubject.findAll({ where: { id: subjectIds }, attributes: ['id', 'course_id'] })
      : [];
    const courseIds = Array.from(new Set(subjects.map(function (s) { return s.course_id; })));

    return {
      role: 'teacher',
      userId: teacher.id,
      teacherId: teacher.id,
      facultyId: teacher.faculty_id || null,
      departmentId: teacher.department_id || null,
      departmentIds: teacher.department_id ? [teacher.department_id] : [],
      subjectIds: subjectIds,
      courseIds: courseIds
    };
  }

  // admin table users: role comes from DB, not from the token
  const admin = await Admin.findByPk(tokenUser.id);
  if (!admin) throw denied(401, 'Please login again');

  if (admin.role === 'faculty') {
    if (!admin.faculty_id) throw denied(403, 'No faculty assigned to this login');
    const depts = await Menu.findAll({
      where: { parent_id: admin.faculty_id, is_department: true },
      attributes: ['id']
    });
    return {
      role: 'faculty',
      userId: admin.id,
      facultyId: admin.faculty_id,
      departmentId: null,
      departmentIds: depts.map(function (d) { return d.id; })
    };
  }

  if (admin.role === 'department') {
    if (!admin.department_id) throw denied(403, 'No department assigned to this login');
    const dept = await Menu.findByPk(admin.department_id);
    if (!dept || !dept.is_department) throw denied(403, 'Assigned department not found');
    return {
      role: 'department',
      userId: admin.id,
      facultyId: dept.parent_id || admin.faculty_id || null,
      departmentId: dept.id,
      departmentIds: [dept.id]
    };
  }

  if (isScopedRole(admin.role)) throw denied(403, 'Access denied');

  return { role: 'admin', userId: admin.id, all: true };
}

// ---------- read filters ----------

function courseWhere(scope) {
  if (scope.all) return {};
  if (scope.role === 'faculty') return { faculty_id: scope.facultyId };
  if (scope.role === 'department') return { department_id: scope.departmentId };
  if (scope.role === 'teacher') return { id: scope.courseIds };
  return { id: [] };
}

// null = no restriction (admin)
async function allowedCourseIds(scope) {
  if (scope.all) return null;
  if (scope.role === 'teacher') return scope.courseIds;
  const rows = await LmsCourse.findAll({ where: courseWhere(scope), attributes: ['id'] });
  return rows.map(function (r) { return r.id; });
}

function teacherWhere(scope) {
  if (scope.all) return {};
  if (scope.role === 'faculty') return { faculty_id: scope.facultyId };
  if (scope.role === 'department') return { department_id: scope.departmentId };
  if (scope.role === 'teacher') return { id: scope.teacherId };
  return { id: [] };
}

// adds "column IN allowed ids" to a where object
function restrictTo(where, column, ids) {
  if (ids === null) return where;
  if (where[column] !== undefined) {
    const wanted = Number(where[column]);
    where[column] = ids.indexOf(wanted) !== -1 ? wanted : { [Op.in]: [] };
  } else {
    where[column] = { [Op.in]: ids };
  }
  return where;
}

// ---------- row checks ----------

// course / teacher rows carry faculty_id + department_id
function ownsRow(scope, row) {
  if (!row) return false;
  if (scope.all) return true;
  if (scope.role === 'faculty') return row.faculty_id === scope.facultyId;
  if (scope.role === 'department') return row.department_id === scope.departmentId;
  return false;
}

function canSeeCourse(scope, course) {
  if (!course) return false;
  if (scope.role === 'teacher') return scope.courseIds.indexOf(course.id) !== -1;
  return ownsRow(scope, course);
}

function canSeeSubject(scope, subject, course) {
  if (!subject) return false;
  if (scope.role === 'teacher') return scope.subjectIds.indexOf(subject.id) !== -1;
  return canSeeCourse(scope, course);
}

// ---------- owner (faculty / department) for new or edited rows ----------

// Returns { faculty_id, department_id } the user is allowed to save.
// Admin may pick any faculty/department (or none); faculty is locked to its
// faculty; department is locked to its department.
async function resolveOwner(scope, body, current) {
  current = current || {};
  const pick = function (key) {
    if (body[key] === undefined) return current[key] || null;
    return body[key] === '' || body[key] === null || body[key] === 'null' ? null : Number(body[key]);
  };

  if (scope.role === 'department') {
    return { faculty_id: scope.facultyId, department_id: scope.departmentId };
  }
  if (scope.role === 'teacher' || scope.role === 'student') {
    throw denied(403, 'Access denied');
  }

  let facultyId = scope.role === 'faculty' ? scope.facultyId : pick('faculty_id');
  const departmentId = pick('department_id');

  if (departmentId) {
    const dept = await Menu.findByPk(departmentId);
    if (!dept || !dept.is_department) throw denied(400, 'Invalid department');
    if (scope.role === 'faculty' && scope.departmentIds.indexOf(dept.id) === -1) {
      throw denied(403, 'Department does not belong to your faculty');
    }
    // department must belong to the selected faculty
    if (facultyId && facultyId !== dept.parent_id) {
      throw denied(400, 'Department does not belong to selected faculty');
    }
    if (dept.parent_id) facultyId = dept.parent_id;
  }

  if (facultyId && scope.all) {
    const fac = await Menu.findByPk(facultyId);
    if (!fac || !fac.is_faculty) throw denied(400, 'Invalid faculty');
  }

  return { faculty_id: facultyId || null, department_id: departmentId || null };
}

module.exports = {
  SCOPED_ROLES,
  denied,
  isScopedRole,
  loadScope,
  courseWhere,
  allowedCourseIds,
  teacherWhere,
  restrictTo,
  ownsRow,
  canSeeCourse,
  canSeeSubject,
  resolveOwner
};
