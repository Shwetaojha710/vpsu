const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { College } = require('../models');

exports.list = wrap(async function (req, res) {
  return json.ok(res, await College.findAll({ order: [['id', 'ASC']] }));
});

exports.show = wrap(async function (req, res) {
  const row = await College.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'College not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Name is required');

  const row = await College.create({
    name: name,
    code: req.body.code || '',
    district: req.body.district || '',
    type: req.body.type || 'affiliated',
    email: req.body.email || '',
    phone: req.body.phone || '',
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'College created');
});

exports.update = wrap(async function (req, res) {
  const row = await College.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'College not found');

  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Name is required');

  await row.update({
    name: name,
    code: req.body.code || '',
    district: req.body.district || '',
    type: req.body.type || 'affiliated',
    email: req.body.email || '',
    phone: req.body.phone || '',
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'College updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await College.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'College not found');
  await row.destroy();
  return json.ok(res, null, 'College deleted');
});
