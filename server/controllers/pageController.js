const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { toParentId } = require('../helpers/model');
const { Page, Menu } = require('../models');

function withMenuName(row) {
  const data = row.toJSON ? row.toJSON() : row;
  data.menu_name = data.menu ? data.menu.title : null;
  delete data.menu;
  return data;
}

function resolveMenuId(body) {
  if (body.menu_id !== undefined && body.menu_id !== null && body.menu_id !== '') {
    return toParentId(body.menu_id);
  }
  if (body.parent_id !== undefined && body.parent_id !== null && body.parent_id !== '') {
    return toParentId(body.parent_id);
  }
  return null;
}

const menuInclude = {
  model: Menu,
  as: 'menu',
  attributes: ['id', 'title'],
  required: false
};

exports.list = wrap(async function (req, res) {
  const rows = await Page.findAll({
    include: [menuInclude],
    order: [['id', 'ASC']]
  });
  return json.ok(res, rows.map(withMenuName));
});

exports.show = wrap(async function (req, res) {
  const row = await Page.findByPk(req.params.id, { include: [menuInclude] });
  if (!row) return json.fail(res, 404, 'Page not found');
  return json.ok(res, withMenuName(row));
});

exports.create = wrap(async function (req, res) {
  const slug = (req.body.slug || '').trim();
  const title = (req.body.title || '').trim();
  if (!slug || !title) return json.fail(res, 400, 'Slug and title are required');

  const created = await Page.create({
    menu_id: resolveMenuId(req.body),
    slug: slug,
    title: title,
    title_hi: req.body.title_hi || '',
    content: req.body.content || '',
    content_hi: req.body.content_hi || '',
    is_published: isNotFalse(req.body.is_published)
  });

  const row = await Page.findByPk(created.id, { include: [menuInclude] });
  return json.ok(res, withMenuName(row), 'Page created');
});

exports.update = wrap(async function (req, res) {
  const row = await Page.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Page not found');

  const slug = (req.body.slug || '').trim();
  const title = (req.body.title || '').trim();
  if (!slug || !title) return json.fail(res, 400, 'Slug and title are required');

  await row.update({
    menu_id: resolveMenuId(req.body),
    slug: slug,
    title: title,
    title_hi: req.body.title_hi || '',
    content: req.body.content || '',
    content_hi: req.body.content_hi || '',
    is_published: isNotFalse(req.body.is_published)
  });

  const updated = await Page.findByPk(row.id, { include: [menuInclude] });
  return json.ok(res, withMenuName(updated), 'Page updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Page.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Page not found');
  await row.destroy();
  return json.ok(res, null, 'Page deleted');
});
