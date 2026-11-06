const path = require('path');
const fs = require('fs');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isTrue } = require('../helpers/form');
const {
  LmsContent,
  LmsCourse,
  LmsSubject,
  LmsTeacher,
  LmsTeacherSubject
} = require('../models');
const { allowedCourseIds, restrictTo, ownsRow } = require('../helpers/lmsScope');
const lmsDraftFiles = require('../middleware/lmsDraftFiles');

const CONTENT_INCLUDE = [
  { model: LmsCourse, as: 'course', attributes: ['id', 'name', 'code', 'faculty_id', 'department_id'] },
  { model: LmsSubject, as: 'subject', attributes: ['id', 'name', 'code', 'term_type', 'semester'] },
  { model: LmsTeacher, as: 'teacher', attributes: ['id', 'name', 'email'] }
];

// teacher: own contents only; faculty / department: contents of own courses
async function canManage(scope, row) {
  if (scope.all) return true;
  if (scope.role === 'teacher') return row.teacher_id === scope.teacherId;
  return ownsRow(scope, await LmsCourse.findByPk(row.course_id));
}

// subject must be inside the user's scope; course always comes from the subject
async function checkSubject(scope, subjectId, bodyCourseId) {
  const subject = await LmsSubject.findByPk(subjectId);
  if (!subject) return { status: 400, message: 'Invalid subject' };
  if (bodyCourseId && Number(bodyCourseId) !== subject.course_id) {
    return { status: 400, message: 'Subject does not belong to selected course' };
  }

  if (scope.role === 'teacher') {
    const assigned = await LmsTeacherSubject.findOne({
      where: { teacher_id: scope.teacherId, subject_id: subjectId }
    });
    if (!assigned) return { status: 403, message: 'You are not assigned to this subject' };
  } else if (!ownsRow(scope, await LmsCourse.findByPk(subject.course_id))) {
    return { status: 403, message: 'Access denied for this subject' };
  }
  return { subject: subject };
}

// teacher_id chosen by admin / faculty / department must be inside their scope
async function pickTeacherId(scope, value, fallback) {
  if (scope.role === 'teacher') return scope.teacherId;
  if (value === undefined) return fallback;
  if (!value) return null;
  const teacher = await LmsTeacher.findByPk(Number(value));
  if (!teacher || !ownsRow(scope, teacher)) return undefined;
  return teacher.id;
}

exports.list = wrap(async function (req, res) {
  const where = {};
  if (req.query.course_id) where.course_id = Number(req.query.course_id);
  if (req.query.subject_id) where.subject_id = Number(req.query.subject_id);
  if (req.query.teacher_id) where.teacher_id = Number(req.query.teacher_id);
  if (req.query.is_published === 'true') where.is_published = true;
  if (req.query.is_published === 'false') where.is_published = false;

  // Teacher: only own contents; others: only contents of their courses
  const scope = req.lmsScope;
  if (scope.role === 'teacher') {
    where.teacher_id = scope.teacherId;
  } else {
    restrictTo(where, 'course_id', await allowedCourseIds(scope));
  }

  const rows = await LmsContent.findAll({
    where: where,
    include: CONTENT_INCLUDE,
    order: [['created_at', 'DESC']]
  });
  return json.ok(res, rows);
});

exports.show = wrap(async function (req, res) {
  const row = await LmsContent.findByPk(req.params.id, { include: CONTENT_INCLUDE });
  if (!row) return json.fail(res, 404, 'Content not found');
  if (!(await canManage(req.lmsScope, row))) return json.fail(res, 403, 'Access denied');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  const subjectId = Number(req.body.subject_id);
  const type = (req.body.type || 'video').trim().toLowerCase();
  if (!title) return json.fail(res, 400, 'Title is required');
  if (!subjectId) return json.fail(res, 400, 'Subject is required');

  const check = await checkSubject(req.lmsScope, subjectId, req.body.course_id);
  if (!check.subject) return json.fail(res, check.status, check.message);
  const subject = check.subject;

  const teacherId = await pickTeacherId(req.lmsScope, req.body.teacher_id || null, null);
  if (teacherId === undefined) return json.fail(res, 403, 'Invalid teacher for your scope');

  const courseId = subject.course_id;
  const publish = isTrue(req.body.is_published);

  const row = await LmsContent.create({
    teacher_id: teacherId,
    course_id: courseId,
    subject_id: subjectId,
    title: title,
    title_hi: req.body.title_hi || '',
    description: req.body.description || '',
    type: type,
    file_path: req.file ? req.file.filename : null,
    link_url: req.body.link_url || null,
    is_published: publish,
    published_at: publish ? new Date() : null
  });

  const full = await LmsContent.findByPk(row.id, { include: CONTENT_INCLUDE });
  lmsDraftFiles.invalidate();
  return json.ok(res, full, 'Content created');
});

exports.update = wrap(async function (req, res) {
  const row = await LmsContent.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Content not found');

  if (!(await canManage(req.lmsScope, row))) return json.fail(res, 403, 'Access denied');

  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  const subjectId = Number(req.body.subject_id || row.subject_id);
  const check = await checkSubject(req.lmsScope, subjectId, req.body.course_id);
  if (!check.subject) return json.fail(res, check.status, check.message);
  const subject = check.subject;

  const teacherId = await pickTeacherId(
    req.lmsScope,
    req.body.teacher_id === undefined ? undefined : (req.body.teacher_id || null),
    row.teacher_id
  );
  if (teacherId === undefined) return json.fail(res, 403, 'Invalid teacher for your scope');

  let publish = row.is_published;
  if (req.body.is_published !== undefined) {
    publish = isTrue(req.body.is_published);
  }

  await row.update({
    teacher_id: teacherId,
    course_id: subject.course_id,
    subject_id: subjectId,
    title: title,
    title_hi: req.body.title_hi || '',
    description: req.body.description || '',
    type: (req.body.type || row.type).trim().toLowerCase(),
    file_path: req.file ? req.file.filename : row.file_path,
    link_url: req.body.link_url !== undefined ? req.body.link_url : row.link_url,
    is_published: publish,
    published_at: publish ? (row.published_at || new Date()) : null
  });

  const full = await LmsContent.findByPk(row.id, { include: CONTENT_INCLUDE });
  lmsDraftFiles.invalidate();
  return json.ok(res, full, 'Content updated');
});

exports.publish = wrap(async function (req, res) {
  const row = await LmsContent.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Content not found');

  if (!(await canManage(req.lmsScope, row))) return json.fail(res, 403, 'Access denied');

  const publish = req.body.is_published !== undefined
    ? isTrue(req.body.is_published)
    : !row.is_published;

  await row.update({
    is_published: publish,
    published_at: publish ? new Date() : null
  });

  const full = await LmsContent.findByPk(row.id, { include: CONTENT_INCLUDE });
  lmsDraftFiles.invalidate();
  return json.ok(res, full, publish ? 'Content published' : 'Content unpublished');
});

exports.remove = wrap(async function (req, res) {
  const row = await LmsContent.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Content not found');

  if (!(await canManage(req.lmsScope, row))) return json.fail(res, 403, 'Access denied');

  await row.destroy();
  return json.ok(res, null, 'Content deleted');
});

// file download with the same permission check as edit
exports.download = wrap(async function (req, res) {
  const row = await LmsContent.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Content not found');
  if (!(await canManage(req.lmsScope, row))) return json.fail(res, 403, 'Access denied');
  if (!row.file_path) return json.fail(res, 404, 'No file for this content');

  const filePath = path.join(__dirname, '..', 'uploads', path.basename(row.file_path));
  if (!fs.existsSync(filePath)) return json.fail(res, 404, 'File not found');
  return res.download(filePath);
});
