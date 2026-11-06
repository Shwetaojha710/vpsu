const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { withSectionName } = require('../helpers/model');
const { uniqueSlug } = require('../slug');
const { Section, SideMenu } = require('../models');

const PAGE_TYPES = {
  static: true,
  dynamic: true,
  table: true,
  custom: true
};

async function makePageSlug(sectionId, title, ignoreId) {
  const section = await Section.findByPk(sectionId);
  const sectionName = section ? section.name : '';
  return uniqueSlug(SideMenu, title + ' ' + sectionName, ignoreId);
}

function listWhere(req) {
  const where = {};
  if (req.query.section_id) where.section_id = req.query.section_id;
  return where;
}

exports.list = wrap(async function (req, res) {
  const rows = await SideMenu.findAll({
    where: listWhere(req),
    include: [{ model: Section, attributes: ['name'] }],
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows.map(withSectionName));
});

exports.show = wrap(async function (req, res) {
  const row = await SideMenu.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Side menu not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  const sectionId = req.body.section_id;
  if (!title || !sectionId) {
    return json.fail(res, 400, 'Section and title are required');
  }

  const row = await SideMenu.create({
    section_id: sectionId,
    title: title,
    title_hi: req.body.title_hi || '',
    slug: await makePageSlug(sectionId, title),
    page_type: PAGE_TYPES[req.body.page_type] ? req.body.page_type : 'static',
    content: req.body.content || '',
    content_hi: req.body.content_hi || '',
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Side menu created');
});

exports.update = wrap(async function (req, res) {
  const row = await SideMenu.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Side menu not found');

  const title = (req.body.title || '').trim();
  const sectionId = req.body.section_id;
  if (!title || !sectionId) {
    return json.fail(res, 400, 'Section and title are required');
  }

  await row.update({
    section_id: sectionId,
    title: title,
    title_hi: req.body.title_hi || '',
    slug: await makePageSlug(sectionId, title, req.params.id),
    page_type: PAGE_TYPES[req.body.page_type] ? req.body.page_type : 'static',
    content: req.body.content || '',
    content_hi: req.body.content_hi || '',
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Side menu updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await SideMenu.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Side menu not found');
  await row.destroy();
  return json.ok(res, null, 'Side menu deleted');
});
