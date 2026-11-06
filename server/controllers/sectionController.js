const sequelize = require('../connection/connection');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { uniqueSlug } = require('../slug');
const { Section, Menu } = require('../models');
const { toParentId } = require('../helpers/model');

exports.list = wrap(async function (req, res) {
  // optional filters: ?type=department&parent_id=1 -> departments of faculty 1
  const where = {};
  if (req.query.type) where.type = String(req.query.type);
  if (req.query.parent_id) where.parent_id = Number(req.query.parent_id);

  const rows = await Section.findAll({
    where: where,
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(*)::int FROM side_menus AS m WHERE m.section_id = "section"."id")'
          ),
          'side_menu_count'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*)::int FROM professors AS p WHERE p.section_id = "section"."id")'
          ),
          'professor_count'
        ]
      ]
    },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows);
});

// faculty / department section can be linked to its menu (is_faculty / is_department)
async function menuFor(type, menuId) {
  if (!menuId) return { menu_id: null };
  const menu = await Menu.findByPk(menuId);
  if (!menu) return { error: 'Linked menu not found' };
  if (type === 'faculty' && !menu.is_faculty) return { error: 'Linked menu is not a faculty menu' };
  if (type === 'department' && !menu.is_department) return { error: 'Linked menu is not a department menu' };
  return { menu_id: menu.id, menu: menu };
}

// a department must sit under a faculty; other types have no parent.
// If not picked, it comes from the menu tree (department menu -> faculty menu -> section).
async function parentFor(type, parentId, menu) {
  if (type !== 'department') return { parent_id: null };
  if (!parentId && menu && menu.parent_id) {
    const linked = await Section.findOne({ where: { menu_id: menu.parent_id, type: 'faculty' } });
    if (linked) parentId = linked.id;
  }
  if (!parentId) return { error: 'Please select parent faculty for the department' };
  const faculty = await Section.findByPk(parentId);
  if (!faculty || faculty.type !== 'faculty') return { error: 'Parent must be a faculty' };
  return { parent_id: faculty.id };
}

exports.show = wrap(async function (req, res) {
  const row = await Section.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Section not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Name is required');

  const type = req.body.type || 'faculty';
  const link = await menuFor(type, toParentId(req.body.menu_id));
  if (link.error) return json.fail(res, 400, link.error);
  const parent = await parentFor(type, toParentId(req.body.parent_id), link.menu);
  if (parent.error) return json.fail(res, 400, parent.error);

  const row = await Section.create({
    name: name,
    name_hi: req.body.name_hi || '',
    type: type,
    parent_id: parent.parent_id,
    menu_id: link.menu_id,
    slug: await uniqueSlug(Section, name),
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Section created');
});

exports.update = wrap(async function (req, res) {
  const row = await Section.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Section not found');

  const name = (req.body.name || '').trim();
  if (!name) return json.fail(res, 400, 'Name is required');

  const type = req.body.type || 'faculty';
  const link = await menuFor(
    type,
    req.body.menu_id === undefined ? row.menu_id : toParentId(req.body.menu_id)
  );
  if (link.error) return json.fail(res, 400, link.error);
  const parent = await parentFor(
    type,
    req.body.parent_id === undefined ? row.parent_id : toParentId(req.body.parent_id),
    link.menu
  );
  if (parent.error) return json.fail(res, 400, parent.error);

  await row.update({
    name: name,
    name_hi: req.body.name_hi || '',
    type: type,
    parent_id: parent.parent_id,
    menu_id: link.menu_id,
    slug: await uniqueSlug(Section, name, req.params.id),
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Section updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Section.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Section not found');
  await row.destroy();
  return json.ok(res, null, 'Section deleted');
});
