const fs = require('fs');
const path = require('path');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isNotFalse } = require('../helpers/form');
const { QuickLink } = require('../models');

const uploadsDir = path.join(__dirname, '..', 'uploads');

function deleteUpload(fileName) {
  if (!fileName) return;
  const full = path.join(uploadsDir, fileName);
  if (fs.existsSync(full)) {
    try {
      fs.unlinkSync(full);
    } catch (err) {
      console.error('Could not delete file:', fileName, err.message);
    }
  }
}

exports.list = wrap(async function (req, res) {
  return json.ok(res, await QuickLink.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] }));
});

exports.show = wrap(async function (req, res) {
  const row = await QuickLink.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Link not found');
  return json.ok(res, row);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  const url = (req.body.url || '').trim();
  if (!title || !url) return json.fail(res, 400, 'Title and URL are required');

  const icon = req.file ? req.file.filename : (req.body.icon || '');
  const row = await QuickLink.create({
    title: title,
    url: url,
    icon: icon,
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Link created');
});

exports.update = wrap(async function (req, res) {
  const row = await QuickLink.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Link not found');

  const title = (req.body.title || '').trim();
  const url = (req.body.url || '').trim();
  if (!title || !url) return json.fail(res, 400, 'Title and URL are required');

  let icon = row.icon || '';
  if (req.file) {
    deleteUpload(row.icon);
    icon = req.file.filename;
  } else if (req.body.icon !== undefined && req.body.icon !== '') {
    icon = req.body.icon;
  }

  await row.update({
    title: title,
    url: url,
    icon: icon,
    sort_order: Number(req.body.sort_order) || 0,
    is_active: isNotFalse(req.body.is_active)
  });
  return json.ok(res, row, 'Link updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await QuickLink.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Link not found');
  deleteUpload(row.icon);
  await row.destroy();
  return json.ok(res, null, 'Link deleted');
});
