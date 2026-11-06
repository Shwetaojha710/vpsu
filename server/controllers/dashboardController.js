const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { Notice, Page, College, Gallery } = require('../models');

exports.index = wrap(async function (req, res) {
  const notices = await Notice.count();
  const publishedNotices = await Notice.count({ where: { is_published: true } });
  const pages = await Page.count();
  const colleges = await College.count();
  const galleries = await Gallery.count();

  return json.ok(res, {
    notices: notices,
    publishedNotices: publishedNotices,
    pages: pages,
    colleges: colleges,
    galleries: galleries
  });
});
