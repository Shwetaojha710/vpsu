const sequelize = require('../connection/connection');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { isTrue, isNotFalse } = require('../helpers/form');
const { toParentId } = require('../helpers/model');
const { Menu } = require('../models');

const PAGE_TYPES = ['static', 'dynamic', 'table', 'custom', 'link', 'page'];

function normalizePageType(value, fallback) {
  const raw = String(value || '').trim().toLowerCase();
  if (PAGE_TYPES.indexOf(raw) >= 0) return raw;
  return fallback || 'custom';
}

function normalizeSlug(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  return raw
    .toLowerCase()
    .replace(/^\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugFromUrl(url) {
  const clean = String(url || '').trim();
  if (!clean || clean === '#' || clean === '/') return '';
  return clean.replace(/^\//, '').replace(/\//g, '-');
}

function detectPageType(row) {
  if (row.page_type) return normalizePageType(row.page_type, 'custom');
  const url = String(row.url || '').trim();
  if (/^https?:\/\//i.test(url)) return 'link';
  return 'custom';
}

function resolveSlug(row) {
  if (row.slug) return normalizeSlug(row.slug) || row.slug;
  const fromUrl = slugFromUrl(row.url);
  if (fromUrl) return fromUrl;
  return (row.title || '').toLowerCase().replace(/\s+/g, '-') || null;
}

async function getPath(id) {
  const path = [];
  let currentId = id;
  let step = 0;
  while (currentId && step < 20) {
    const row = await Menu.findByPk(currentId, {
      attributes: ['id', 'title', 'parent_id']
    });
    if (!row) break;
    path.unshift(row.toJSON());
    currentId = row.parent_id;
    step += 1;
  }
  return path;
}

function toMgkvpMenu(row) {
  const url = row.url == null || row.url === '' ? null : String(row.url).trim();
  const enTitle = row.title || '';
  const hiTitle = row.title_hi || enTitle;

  return {
    id: row.id,
    parent_id: row.parent_id == null ? null : row.parent_id,
    page_type: detectPageType(row),
    slug: resolveSlug(row),
    url: url === '#' ? null : url,
    icon: row.icon || null,
    order_no: row.sort_order == null ? 0 : row.sort_order,
    is_active: !!row.is_active,
    is_header: !!row.is_header,
    is_faculty: !!row.is_faculty,
    is_department: !!row.is_department,
    faculty_id: null,
    createdAt: null,
    updatedAt: null,
    department_id: null,
    coordinator_id: null,
    translations: [
      {
        id: row.id * 2,
        menu_id: row.id,
        language_code: 'en',
        title: enTitle,
        description: null,
        createdAt: null,
        updatedAt: null
      },
      {
        id: row.id * 2 + 1,
        menu_id: row.id,
        language_code: 'hi',
        title: hiTitle,
        description: null,
        createdAt: null,
        updatedAt: null
      }
    ],
    label: enTitle,
    children: (row.children || []).map(toMgkvpMenu)
  };
}

async function getChildrenTree(parentId) {
  const rows = await Menu.findAll({
    where: { parent_id: parentId },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  const list = rows.map(function (row) {
    return row.toJSON();
  });
  for (let i = 0; i < list.length; i++) {
    list[i].children = await getChildrenTree(list[i].id);
  }
  return list;
}

function menuPayload(body, existing) {
  const title = (body.title || '').trim();
  // Admin may send slug in `url` and external link in `eurl`
  const rawUrl =
    body.url != null
      ? String(body.url).trim()
      : existing
        ? existing.url
        : '#';
  const external =
    body.eurl != null
      ? String(body.eurl).trim()
      : body.menu_url != null
        ? String(body.menu_url).trim()
        : '';

  let pageType = normalizePageType(
    body.page_type,
    existing ? existing.page_type : 'custom'
  );
  if (!body.page_type && /^https?:\/\//i.test(external || rawUrl || '')) {
    pageType = 'link';
  }

  let slug = normalizeSlug(body.slug);
  if (!slug) {
    slug = normalizeSlug(slugFromUrl(rawUrl)) || normalizeSlug(title);
  }

  let url = rawUrl || '#';
  if (pageType === 'link' && external) {
    url = external;
  } else if (pageType !== 'link' && slug && (!rawUrl || rawUrl === '#' || rawUrl === slug)) {
    // Keep a navigable path token for frontend builders
    url = slug;
  }

  return {
    title: title,
    title_hi: body.title_hi || '',
    url: url || '#',
    icon: body.icon != null ? String(body.icon).trim() || null : (existing ? existing.icon : null),
    slug: slug || null,
    page_type: pageType,
    sort_order: Number(body.sort_order) || 0,
    is_active: isNotFalse(body.is_active),
    is_header: isTrue(body.is_header),
    // keep old value when the form does not send the flag
    is_faculty: body.is_faculty !== undefined ? isTrue(body.is_faculty) : !!(existing && existing.is_faculty),
    is_department: body.is_department !== undefined ? isTrue(body.is_department) : !!(existing && existing.is_department)
  };
}

exports.list = wrap(async function (req, res) {
  const parentId = toParentId(req.query.parent_id);
  const rows = await Menu.findAll({
    where: { parent_id: parentId },
    attributes: {
      include: [
        [
          sequelize.literal(
            '(SELECT COUNT(*)::int FROM menus AS c WHERE c.parent_id = "menu"."id")'
          ),
          'child_count'
        ]
      ]
    },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows);
});

exports.tree = wrap(async function (req, res) {
  const tree = await getChildrenTree(null);
  return json.ok(res, tree.map(toMgkvpMenu));
});

exports.show = wrap(async function (req, res) {
  const row = await Menu.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Menu not found');
  const data = row.toJSON();
  data.path = await getPath(row.id);
  return json.ok(res, data);
});

exports.create = wrap(async function (req, res) {
  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  const data = menuPayload(req.body, null);
  const row = await Menu.create({
    parent_id: toParentId(req.body.parent_id),
    title: data.title,
    title_hi: data.title_hi,
    url: data.url,
    icon: data.icon,
    slug: data.slug,
    page_type: data.page_type,
    sort_order: data.sort_order,
    is_active: data.is_active,
    is_header: data.is_header,
    is_faculty: data.is_faculty,
    is_department: data.is_department
  });
  return json.ok(res, row, 'Menu created');
});

exports.update = wrap(async function (req, res) {
  const row = await Menu.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Menu not found');

  const title = (req.body.title || '').trim();
  if (!title) return json.fail(res, 400, 'Title is required');

  const data = menuPayload(req.body, row.toJSON());
  await row.update({
    title: data.title,
    title_hi: data.title_hi,
    url: data.url,
    icon: data.icon,
    slug: data.slug,
    page_type: data.page_type,
    sort_order: data.sort_order,
    is_active: data.is_active,
    is_header: data.is_header,
    is_faculty: data.is_faculty,
    is_department: data.is_department
  });
  return json.ok(res, row, 'Menu updated');
});

exports.remove = wrap(async function (req, res) {
  const row = await Menu.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Menu not found');
  await row.destroy();
  return json.ok(res, null, 'Menu deleted');
});
