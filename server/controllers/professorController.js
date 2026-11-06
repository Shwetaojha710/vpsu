const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse, uploadedName } = require('../helpers/form');
const { withSectionName } = require('../helpers/model');
const { Section, Professor } = require('../models');

function listWhere(req) {
  const where = {};
  if (req.query.section_id) where.section_id = req.query.section_id;
  return where;
}

// section_type = faculty / department / cell; faculty_name = parent faculty of a department
function withSectionInfo(row) {
  const section = row.section;
  const data = withSectionName(row);
  data.section_type = section ? section.type : null;
  data.faculty_name = section && section.parent ? section.parent.name : null;
  return data;
}

exports.list = wrap(async function (req, res) {
  const rows = await Professor.findAll({
    where: listWhere(req),
    include: [{
      model: Section,
      attributes: ['name', 'type', 'parent_id'],
      include: [{ model: Section, as: 'parent', attributes: ['name'] }]
    }],
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows.map(withSectionInfo));
});

exports.show = wrap(async function (req, res) {
  const row = await Professor.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Professor not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  const sectionId = req.body.section_id;
  if (!name || !sectionId) {
    return json.fail(res, 400, 'Section and name are required');
  }

  const row = await Professor.create({
    section_id: sectionId,
    name: name,
    name_hi: req.body.name_hi || '',
    designation: req.body.designation || '',
    designation_hi: req.body.designation_hi || '',
    photo: uploadedName(req.file),
    email: req.body.email || '',
    phone: req.body.phone || '',
    profile_text: req.body.profile_text || '',
    profile_text_hi: req.body.profile_text_hi || '',
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Professor created');
});

exports.update = wrap(async function (req, res) {
  const row = await Professor.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Professor not found');

  const name = (req.body.name || '').trim();
  const sectionId = req.body.section_id;
  if (!name || !sectionId) {
    return json.fail(res, 400, 'Section and name are required');
  }

  await row.update({
    section_id: sectionId,
    name: name,
    name_hi: req.body.name_hi || '',
    designation: req.body.designation || '',
    designation_hi: req.body.designation_hi || '',
    photo: req.file ? req.file.filename : row.photo,
    email: req.body.email || '',
    phone: req.body.phone || '',
    profile_text: req.body.profile_text || '',
    profile_text_hi: req.body.profile_text_hi || '',
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Professor updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Professor.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Professor not found');
  await row.destroy();
  return json.ok(res, null, 'Professor deleted');
});
