const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { uploadedName } = require('../helpers/form');
const { Gallery } = require('../models');

exports.list = wrap(async function (req, res) {
  return json.ok(res, await Gallery.findAll({ order: [['created_at', 'DESC']] }));
});

exports.show = wrap(async function (req, res) {
  const row = await Gallery.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Photo not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  const row = await Gallery.create({
    title: title,
    image: uploadedName(req.file)
  });
  return json.ok(res, row, 'Photo created');
});

exports.update = wrap(async function (req, res) {
  const row = await Gallery.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Photo not found');

  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  await row.update({
    title: title,
    image: req.file ? req.file.filename : row.image
  });
  return json.ok(res, row, 'Photo updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Gallery.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Photo not found');
  await row.destroy();
  return json.ok(res, null, 'Photo deleted');
});
