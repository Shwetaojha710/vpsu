const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { Admin, LmsTeacher } = require('../models');

exports.login = wrap(async function (req, res) {
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';

  if (!email || !password) {
    return json.fail(res, 400, 'Email and password are required');
  }

  const admin = await Admin.findOne({ where: { email: email } });
  if (!admin) {
    // LMS teachers can also sign in to the admin panel (LMS menus only)
    return teacherLogin(res, email, password);
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return json.fail(res, 401, 'Wrong email or password');
  }

  const token = jwt.sign(
    { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return json.ok(res, {
    token: token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  }, 'Login successful');
});

async function teacherLogin(res, email, password) {
  const teacher = await LmsTeacher.findOne({ where: { email: email.toLowerCase() } });
  if (!teacher || !teacher.is_active) {
    return json.fail(res, 401, 'Wrong email or password');
  }
  const match = await bcrypt.compare(password, teacher.password);
  if (!match) {
    return json.fail(res, 401, 'Wrong email or password');
  }

  // same token shape as the LMS teacher portal login
  const token = jwt.sign(
    { id: teacher.id, name: teacher.name, email: teacher.email, role: 'teacher' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  return json.ok(res, {
    token: token,
    admin: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      role: 'teacher'
    }
  }, 'Login successful');
}

// teacher tokens point to lms_teachers, all others to admins
function accountModel(user) {
  return user.role === 'teacher' ? LmsTeacher : Admin;
}

exports.me = wrap(async function (req, res) {
  if (req.admin.role === 'student') return json.fail(res, 403, 'Access denied');
  if (req.admin.role === 'teacher') {
    const teacher = await LmsTeacher.findByPk(req.admin.id, {
      attributes: ['id', 'name', 'email', 'faculty_id', 'department_id', 'created_at']
    });
    if (!teacher) return json.fail(res, 404, 'Teacher not found');
    const data = teacher.toJSON();
    data.role = 'teacher';
    return json.ok(res, data);
  }

  const admin = await Admin.findByPk(req.admin.id, {
    attributes: ['id', 'name', 'email', 'role', 'created_at']
  });
  if (!admin) {
    return json.fail(res, 404, 'Admin not found');
  }
  return json.ok(res, admin);
});

exports.changePassword = wrap(async function (req, res) {
  const oldPassword = req.body.oldPassword || '';
  const newPassword = req.body.newPassword || '';

  if (!oldPassword || !newPassword) {
    return json.fail(res, 400, 'Old password and new password are required');
  }

  if (req.admin.role === 'student') return json.fail(res, 403, 'Access denied');
  const admin = await accountModel(req.admin).findByPk(req.admin.id);
  if (!admin) return json.fail(res, 404, 'Account not found');
  const match = await bcrypt.compare(oldPassword, admin.password);
  if (!match) {
    return json.fail(res, 400, 'Old password is wrong');
  }

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();
  return json.ok(res, null, 'Password changed');
});
