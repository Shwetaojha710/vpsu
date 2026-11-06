const express = require('express');
const ctrl = require('../controllers/publicController');
const pageTableCtrl = require('../controllers/pageTableController');

const router = express.Router();

router.get('/get-menus', ctrl.menus);
router.get('/get-banners', ctrl.banners);
router.get('/get-home-gallery', ctrl.gallery);
router.get('/get-notices', ctrl.notices);
router.get('/get-links', ctrl.links);
router.get('/get-dignitaries', ctrl.dignitaries);
router.get('/get-administrator', ctrl.administrator);
router.get('/get-college-statistics', ctrl.stats);
router.get('/get-news', ctrl.news);
router.get('/get-events', ctrl.events);
router.get('/get-alumni', ctrl.alumni);
router.get('/settings', ctrl.settings);
router.get('/page/:slug', ctrl.page);
router.get('/table/:slug', pageTableCtrl.publicTableBySlug);
router.get('/events/:id', ctrl.noticeDetails);
router.get('/track-visit', ctrl.trackVisit);
router.get('/get-archive', ctrl.archive);
router.get('/lms-department/:slug', ctrl.lmsDepartment);

module.exports = router;
