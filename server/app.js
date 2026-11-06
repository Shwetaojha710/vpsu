const path = require('path');
const express = require('express');
const cors = require('cors');

const auth = require('./middleware/auth');
const adminOnly = require('./middleware/adminOnly');
const json = require('./views/jsonView');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use('/uploads', require('./middleware/lmsDraftFiles'), express.static(path.join(__dirname, 'uploads')));

app.use('/api', require('./routes/public'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', auth, adminOnly, require('./routes/dashboard'));
app.use('/api/notices', auth, adminOnly, require('./routes/notices'));
app.use('/api/pages', auth, adminOnly, require('./routes/pages'));
app.use('/api/slider', auth, adminOnly, require('./routes/slider'));
app.use('/api/leaders', auth, adminOnly, require('./routes/leaders'));
app.use('/api/stats', auth, adminOnly, require('./routes/stats'));
app.use('/api/quick-links', auth, adminOnly, require('./routes/quickLinks'));
app.use('/api/galleries', auth, adminOnly, require('./routes/galleries'));
app.use('/api/colleges', auth, adminOnly, require('./routes/colleges'));
app.use('/api/menus', auth, adminOnly, require('./routes/menus'));
app.use('/api/sections', auth, adminOnly, require('./routes/sections'));
app.use('/api/side-menus', auth, adminOnly, require('./routes/sideMenus'));
app.use('/api/professors', auth, adminOnly, require('./routes/professors'));
app.use('/api/banners', auth, adminOnly, require('./routes/banners'));
app.use('/api/section-photos', auth, adminOnly, require('./routes/sectionPhotos'));
app.use('/api/side-menu-files', auth, adminOnly, require('./routes/sideMenuFiles'));

// Table page APIs (Flow 1)
app.use('/api/page-table', auth, adminOnly, require('./routes/pageTable'));
app.get('/api/page-table-cards', auth, adminOnly, require('./controllers/pageTableController').listCards);
app.use('/api/master/menus', auth, adminOnly, require('./routes/masterMenus'));

// Admin aliases used by TableTab / AddRowModal
app.post('/api/data-table', auth, adminOnly, require('./controllers/pageTableController').createRows);
app.put('/api/page-tabledataa/:id', auth, adminOnly, require('./controllers/pageTableController').updateRows);
app.put('/api/dataaaa-table/:id', auth, adminOnly, require('./controllers/pageTableController').updateRows);
app.delete('/api/data-table/:id', auth, adminOnly, async function (req, res) {
  const { PageTableRow } = require('./models');
  const json = require('./views/jsonView');
  const id = String(req.params.id || '').replace(/^:/, '');
  const row = await PageTableRow.findByPk(Number(id));
  if (!row) return json.fail(res, 404, 'Row not found');
  await row.destroy();
  return json.ok(res, null, 'Row deleted');
});

// LMS module (additive — does not change CMS routes above)
app.use('/api/lms/courses', auth, require('./routes/lmsCourses'));
app.use('/api/lms/subjects', auth, require('./routes/lmsSubjects'));
app.use('/api/lms/teachers', auth, require('./routes/lmsTeachers'));
app.use('/api/lms/students', auth, require('./routes/lmsStudents'));
app.use('/api/lms/contents', auth, require('./routes/lmsContents'));
app.use('/api/lms/teacher', require('./routes/lmsTeacherPortal'));
app.use('/api/lms/student', require('./routes/lmsStudentPortal'));
// LMS role scope + faculty / department logins
app.use('/api/lms', auth, require('./routes/lmsAccess'));

app.use('/api', function (req, res) {
  return json.fail(res, 404, 'API not found');
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  return json.fail(res, 400, err.message || 'Something went wrong');
});

module.exports = app;
