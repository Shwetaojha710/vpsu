const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse, uploadedName } = require('../helpers/form');
const { Slider } = require('../models');

exports.list = wrap(async function (req, res) {
  return json.ok(res, await Slider.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] }));
});

exports.show = wrap(async function (req, res) {
  const row = await Slider.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Slide not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  const row = await Slider.create({
    title: title,
    image: uploadedName(req.file),
    link: req.body.link || '',
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Slide created');
});

exports.update = wrap(async function (req, res) {
  const row = await Slider.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Slide not found');

  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  await row.update({
    title: title,
    image: req.file ? req.file.filename : row.image,
    link: req.body.link || '',
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Slide updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Slider.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Slide not found');
  await row.destroy();
  return json.ok(res, null, 'Slide deleted');
});
