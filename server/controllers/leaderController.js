const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { uploadedName } = require('../helpers/form');
const { Leader } = require('../models');

exports.list = wrap(async function (req, res) {
  return json.ok(res, await Leader.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] }));
});

exports.show = wrap(async function (req, res) {
  const row = await Leader.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Leader not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Name is required');

  const row = await Leader.create({
    name: name,
    designation: req.body.designation || '',
    photo: uploadedName(req.file),
    profile_text: req.body.profile_text || '',
    sort_order: Number(req.body.sort_order) || 0
  });
  return json.ok(res, row, 'Leader created');
});

exports.update = wrap(async function (req, res) {
  const row = await Leader.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Leader not found');

  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Name is required');

  await row.update({
    name: name,
    designation: req.body.designation || '',
    photo: req.file ? req.file.filename : row.photo,
    profile_text: req.body.profile_text || '',
    sort_order: Number(req.body.sort_order) || 0
  });
  return json.ok(res, row, 'Leader updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Leader.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Leader not found');
  await row.destroy();
  return json.ok(res, null, 'Leader deleted');
});
