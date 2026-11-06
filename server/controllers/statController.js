const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { Stat } = require('../models');

exports.list = wrap(async function (req, res) {
  return json.ok(res, await Stat.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] }));
});

exports.show = wrap(async function (req, res) {
  const row = await Stat.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Stat not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const label = (req.body.label || '').trim();
  const value = (req.body.value || '').trim();
  if (!label || !value) return json.fail(res, 400, 'Label and value are required');

  const row = await Stat.create({
    label: label,
    value: value,
    icon: req.body.icon || '',
    sort_order: Number(req.body.sort_order) || 0
  });
  return json.ok(res, row, 'Stat created');
});

exports.update = wrap(async function (req, res) {
  const row = await Stat.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Stat not found');

  const label = (req.body.label || '').trim();
  const value = (req.body.value || '').trim();
  if (!label || !value) return json.fail(res, 400, 'Label and value are required');

  await row.update({
    label: label,
    value: value,
    icon: req.body.icon || '',
    sort_order: Number(req.body.sort_order) || 0
  });
  return json.ok(res, row, 'Stat updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Stat.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Stat not found');
  await row.destroy();
  return json.ok(res, null, 'Stat deleted');
});
