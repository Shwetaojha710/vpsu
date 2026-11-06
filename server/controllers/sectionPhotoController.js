const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { uploadedName } = require('../helpers/form');
const { withSectionName } = require('../helpers/model');
const { Section, SectionPhoto } = require('../models');

function listWhere(req) {
  const where = {};
  if (req.query.section_id) where.section_id = req.query.section_id;
  return where;
}

exports.list = wrap(async function (req, res) {
  const rows = await SectionPhoto.findAll({
    where: listWhere(req),
    include: [{ model: Section, attributes: ['name'] }],
    order: [['created_at', 'DESC']]
  });
  return json.ok(res, rows.map(withSectionName));
});

exports.show = wrap(async function (req, res) {
  const row = await SectionPhoto.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Photo not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const sectionId = req.body.section_id;
  const title = (req.body.title || '').trim();
  if (!sectionId || !title) {
    return json.fail(res, 400, 'Section and title are required');
  }

  const row = await SectionPhoto.create({
    section_id: sectionId,
    title: title,
    title_hi: req.body.title_hi || '',
    image: uploadedName(req.file)
  });
  return json.ok(res, row, 'Photo created');
});

exports.update = wrap(async function (req, res) {
  const row = await SectionPhoto.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Photo not found');

  const sectionId = req.body.section_id;
  const title = (req.body.title || '').trim();
  if (!sectionId || !title) {
    return json.fail(res, 400, 'Section and title are required');
  }

  await row.update({
    section_id: sectionId,
    title: title,
    title_hi: req.body.title_hi || '',
    image: req.file ? req.file.filename : row.image
  });
  return json.ok(res, row, 'Photo updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await SectionPhoto.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Photo not found');
  await row.destroy();
  return json.ok(res, null, 'Photo deleted');
});
