const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse, uploadedName } = require('../helpers/form');
const { withSectionName } = require('../helpers/model');
const { Section, Banner } = require('../models');

function listWhere(req) {
  const where = {};
  if (req.query.section_id) where.section_id = req.query.section_id;
  return where;
}

exports.list = wrap(async function (req, res) {
  const rows = await Banner.findAll({
    where: listWhere(req),
    include: [{ model: Section, attributes: ['name'] }],
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows.map(withSectionName));
});

exports.show = wrap(async function (req, res) {
  const row = await Banner.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Banner not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const sectionId = req.body.section_id;
  const title = (req.body.title || '').trim();
  if (!sectionId || !title) {
    return json.fail(res, 400, 'Section and title are required');
  }

  const row = await Banner.create({
    section_id: sectionId,
    title: title,
    title_hi: req.body.title_hi || '',
    image: uploadedName(req.file),
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Banner created');
});

exports.update = wrap(async function (req, res) {
  const row = await Banner.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Banner not found');

  const sectionId = req.body.section_id;
  const title = (req.body.title || '').trim();
  if (!sectionId || !title) {
    return json.fail(res, 400, 'Section and title are required');
  }

  await row.update({
    section_id: sectionId,
    title: title,
    title_hi: req.body.title_hi || '',
    image: req.file ? req.file.filename : row.image,
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Banner updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Banner.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Banner not found');
  await row.destroy();
  return json.ok(res, null, 'Banner deleted');
});
