const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isTrue, isNotFalse } = require('../helpers/form');
const { Notice } = require('../models');

exports.list = wrap(async function (req, res) {
  const rows = await Notice.findAll({
    order: [['is_pinned', 'DESC'], ['created_at', 'DESC']]
  });
  return json.ok(res, rows);
});

exports.show = wrap(async function (req, res) {
  const row = await Notice.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Notice not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  const row = await Notice.create({
    title: title,
    title_hi: req.body.title_hi || '',
    description: req.body.description || '',
    category: req.body.category || 'general',
    pdf_file: req.file ? req.file.filename : null,
    is_pinned: isTrue(req.body.is_pinned),
    is_published: isNotFalse(req.body.is_published)
  });
  return json.ok(res, row, 'Notice created');
});

exports.update = wrap(async function (req, res) {
  const row = await Notice.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Notice not found');

  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  await row.update({
    title: title,
    title_hi: req.body.title_hi || '',
    description: req.body.description || '',
    category: req.body.category || 'general',
    pdf_file: req.file ? req.file.filename : row.pdf_file,
    is_pinned: isTrue(req.body.is_pinned),
    is_published: isNotFalse(req.body.is_published)
  });
  return json.ok(res, row, 'Notice updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Notice.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Notice not found');
  await row.destroy();
  return json.ok(res, null, 'Notice deleted');
});
