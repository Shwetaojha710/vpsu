const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { uploadedName } = require('../helpers/form');
const { SideMenuFile } = require('../models');

exports.list = wrap(async function (req, res) {
  const menuId = req.query.side_menu_id;
  if (!menuId) return json.fail(res, 400, 'side_menu_id is required');

  const rows = await SideMenuFile.findAll({
    where: { side_menu_id: menuId },
    order: [['created_at', 'DESC']]
  });
  return json.ok(res, rows);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  const menuId = req.body.side_menu_id;
  if (!title || !menuId) {
    return json.fail(res, 400, 'Title and side menu are required');
  }

  const row = await SideMenuFile.create({
    side_menu_id: menuId,
    title: title,
    title_hi: req.body.title_hi || '',
    file_name: uploadedName(req.file),
    language: req.body.language || 'English'
  });
  return json.ok(res, row, 'File added');
});

exports.remove = wrap(async function (req, res) {
  const row = await SideMenuFile.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'File not found');
  await row.destroy();
  return json.ok(res, null, 'File deleted');
});
