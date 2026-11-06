const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const { Op } = require('sequelize');
const { Menu, PageTable, PageTableRow } = require('../models');

function stripColon(value) {
  const raw = String(value == null ? '' : value).trim();
  return raw.startsWith(':') ? raw.slice(1) : raw;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function normalizeColumns(columns) {
  return asArray(columns).map(function (col) {
    return {
      key: String(col.key || '').trim(),
      label_en: col.label_en || col.label || '',
      label_hn: col.label_hn || col.label_hi || col.label_en || col.label || '',
      type: col.type || 'text',
      required: col.required === true || col.required === 'true',
      sortable: col.sortable === true || col.sortable === 'true',
      maxFileSizeMb: col.maxFileSizeMb || '',
      multiple: !!col.multiple
    };
  }).filter(function (col) {
    return !!col.key;
  });
}

function normalizeTablesConfig(tablesConfig) {
  return asArray(tablesConfig).map(function (table, index) {
    const tableKey =
      String(table.table_key || table.tableKey || '').trim() ||
      ('table_' + (index + 1));
    return {
      accordion_id: table.accordion_id || table.accordionId || null,
      accordion_title: table.accordion_title || table.accordionTitle || '',
      accordion_title_hi:
        table.accordion_title_hi ||
        table.accordion_title_hn ||
        table.accordionTitle_hn ||
        '',
      table_key: tableKey,
      table_title: table.table_title || table.tableTitle || table.tableTitle_en || '',
      table_title_hi:
        table.table_title_hi ||
        table.table_title_hn ||
        table.tableTitle_hn ||
        '',
      columns: normalizeColumns(table.columns)
    };
  });
}

function menuTitle(menu) {
  if (!menu) return '';
  return menu.title || '';
}

function rowsForTable(allRows, tableKey) {
  return (allRows || [])
    .filter(function (row) {
      const key = row.table_key || '';
      return !tableKey || key === tableKey || (!key && !tableKey);
    })
    .sort(function (a, b) {
      return (a.sort_order || 0) - (b.sort_order || 0) || a.id - b.id;
    })
    .map(function (row) {
      const data = row.data && typeof row.data === 'object' ? row.data : {};
      return Object.assign({ id: row.id }, data);
    });
}

function toListItem(pageTable, menu, allRows) {
  const tablesConfig = normalizeTablesConfig(pageTable.tables_config);
  const first = tablesConfig[0] || {
    table_key: '',
    table_title: '',
    table_title_hi: '',
    columns: [],
    accordion_id: null,
    accordion_title: '',
    accordion_title_hi: ''
  };

  return {
    id: pageTable.id,
    menu_id: pageTable.menu_id,
    _menu_id: pageTable.menu_id,
    menu_name: menuTitle(menu),
    layout_type: pageTable.layout_type || 'table',
    description: pageTable.description || '',
    tables_config: tablesConfig,
    table_key: first.table_key,
    table_title: first.table_title,
    table_title_hi: first.table_title_hi,
    columns: first.columns,
    rows: rowsForTable(allRows, first.table_key),
    accordion_id: first.accordion_id,
    accordion_title: first.accordion_title,
    accordion_title_hi: first.accordion_title_hi,
    is_active: pageTable.is_active !== false,
    layout_config: {
      layout_type: pageTable.layout_type || 'table',
      accordions: groupAccordions(tablesConfig)
    }
  };
}

function groupAccordions(tablesConfig) {
  const map = new Map();
  tablesConfig.forEach(function (tc, index) {
    const key = tc.accordion_id || '__root__';
    if (!map.has(key)) {
      map.set(key, {
        accordionId: tc.accordion_id || 'acc_' + (index + 1),
        accordionTitle_en: tc.accordion_title || '',
        accordionTitle_hn: tc.accordion_title_hi || '',
        tables: []
      });
    }
    map.get(key).tables.push({
      tableKey: tc.table_key,
      tableTitle_en: tc.table_title,
      tableTitle_hn: tc.table_title_hi,
      columns: tc.columns
    });
  });
  return Array.from(map.values());
}

async function loadPageTableBundle(where) {
  const pageTables = await PageTable.findAll({
    where: where,
    include: [{ model: Menu, as: 'menu' }],
    order: [['id', 'ASC']]
  });

  const result = [];
  for (let i = 0; i < pageTables.length; i++) {
    const pt = pageTables[i];
    const rows = await PageTableRow.findAll({
      where: { page_table_id: pt.id },
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
    result.push(toListItem(pt.toJSON(), pt.menu ? pt.menu.toJSON() : null, rows.map(function (r) {
      return r.toJSON();
    })));
  }
  return result;
}

exports.list = wrap(async function (req, res) {
  const layoutType = stripColon(req.params.layoutType || req.query.layout_type || 'table');
  const where = {};
  if (layoutType && layoutType !== 'all') {
    where.layout_type = layoutType;
  }
  const data = await loadPageTableBundle(where);
  return json.ok(res, data);
});

exports.listCards = wrap(async function (req, res) {
  return json.ok(res, { cards: [] });
});

exports.create = wrap(async function (req, res) {
  const menuId = Number(req.body.menu_id);
  if (!menuId) return json.fail(res, 400, 'menu_id is required');

  const menu = await Menu.findByPk(menuId);
  if (!menu) return json.fail(res, 404, 'Menu not found');

  const existing = await PageTable.findOne({ where: { menu_id: menuId } });
  if (existing) {
    return json.fail(res, 400, 'Table config already exists for this menu. Please edit it.');
  }

  const layoutType = String(req.body.layout_type || 'table').trim() || 'table';
  const tablesConfig = normalizeTablesConfig(req.body.tables_config);

  const row = await PageTable.create({
    menu_id: menuId,
    layout_type: layoutType,
    description: req.body.description || '',
    tables_config: tablesConfig,
    is_active: true
  });

  if (menu.page_type !== 'table') {
    await menu.update({ page_type: 'table' });
  }

  const data = await loadPageTableBundle({ id: row.id });
  return json.ok(res, data[0] || row, 'Table configuration added successfully');
});

exports.update = wrap(async function (req, res) {
  const idOrMenu = stripColon(req.params.id);
  const numeric = Number(idOrMenu);

  let row = await PageTable.findByPk(numeric);
  if (!row) {
    row = await PageTable.findOne({ where: { menu_id: numeric } });
  }
  if (!row) return json.fail(res, 404, 'Table configuration not found');

  const menuId = Number(req.body.menu_id || row.menu_id);
  const layoutType = String(req.body.layout_type || row.layout_type || 'table').trim();
  const tablesConfig = normalizeTablesConfig(
    req.body.tables_config != null ? req.body.tables_config : row.tables_config
  );

  await row.update({
    menu_id: menuId,
    layout_type: layoutType,
    description: req.body.description != null ? req.body.description : row.description,
    tables_config: tablesConfig,
    updated_at: new Date()
  });

  const data = await loadPageTableBundle({ id: row.id });
  return json.ok(res, data[0] || row, 'Table configuration updated successfully');
});

exports.remove = wrap(async function (req, res) {
  const idOrMenu = stripColon(req.params.id);
  const numeric = Number(idOrMenu);

  let row = await PageTable.findByPk(numeric);
  if (!row) {
    row = await PageTable.findOne({ where: { menu_id: numeric } });
  }
  if (!row) return json.fail(res, 404, 'Table configuration not found');

  await PageTableRow.destroy({ where: { page_table_id: row.id } });
  await row.destroy();
  return json.ok(res, null, 'Table configuration deleted');
});

function parseIndexedForm(body, files) {
  const buckets = {};

  function ensure(index) {
    if (!buckets[index]) buckets[index] = {};
    return buckets[index];
  }

  Object.keys(body || {}).forEach(function (key) {
    const match = key.match(/^(\d+)\[(.+)\]$/);
    if (match) {
      const index = match[1];
      const field = match[2].replace(/\[\]$/, '');
      ensure(index)[field] = body[key];
      return;
    }

    if (
      /^\d+$/.test(key) &&
      body[key] &&
      typeof body[key] === 'object' &&
      !Array.isArray(body[key])
    ) {
      Object.assign(ensure(key), body[key]);
    }
  });

  (files || []).forEach(function (file) {
    const match = String(file.fieldname || '').match(/^(\d+)\[(.+?)\](?:\[\])?$/);
    if (!match) return;
    const index = match[1];
    const field = match[2];
    const path = '/uploads/' + file.filename;
    const bucket = ensure(index);
    if (bucket[field]) {
      const current = bucket[field];
      bucket[field] = Array.isArray(current)
        ? current.concat([path])
        : [current, path];
    } else {
      bucket[field] = path;
    }
  });

  return Object.keys(buckets)
    .sort(function (a, b) {
      return Number(a) - Number(b);
    })
    .map(function (key) {
      return buckets[key];
    });
}

async function resolvePageTableByMenuParam(param) {
  const idOrMenu = stripColon(param);
  const numeric = Number(idOrMenu);
  let pageTable = await PageTable.findOne({ where: { menu_id: numeric } });
  if (!pageTable) {
    pageTable = await PageTable.findByPk(numeric);
  }
  return pageTable;
}

exports.createRows = wrap(async function (req, res) {
  const pageTable = await resolvePageTableByMenuParam(req.params.id);
  if (!pageTable) return json.fail(res, 404, 'Table configuration not found');

  const entries = parseIndexedForm(req.body, req.files);
  if (!entries.length) return json.fail(res, 400, 'No row data provided');

  const tablesConfig = normalizeTablesConfig(pageTable.tables_config);
  const defaultKey = tablesConfig[0] ? tablesConfig[0].table_key : '';

  const created = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const tableKey = entry.table_key || entry.tableKey || defaultKey || '';
    delete entry.table_key;
    delete entry.tableKey;
    delete entry.id;

    const row = await PageTableRow.create({
      page_table_id: pageTable.id,
      table_key: tableKey,
      data: entry,
      sort_order: i
    });
    created.push(row);
  }

  return json.ok(res, created, 'Row(s) saved successfully');
});

exports.updateRows = wrap(async function (req, res) {
  const pageTable = await resolvePageTableByMenuParam(req.params.id);
  if (!pageTable) return json.fail(res, 404, 'Table configuration not found');

  const entries = parseIndexedForm(req.body, req.files);
  if (!entries.length) return json.fail(res, 400, 'No row data provided');

  const tablesConfig = normalizeTablesConfig(pageTable.tables_config);
  const defaultKey = tablesConfig[0] ? tablesConfig[0].table_key : '';
  const updated = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = Object.assign({}, entries[i]);
    const rowId = entry.id ? Number(entry.id) : null;
    const tableKey = entry.table_key || entry.tableKey || defaultKey || '';
    delete entry.table_key;
    delete entry.tableKey;
    delete entry.id;

    if (rowId) {
      const existing = await PageTableRow.findOne({
        where: { id: rowId, page_table_id: pageTable.id }
      });
      if (existing) {
        const prev =
          existing.data && typeof existing.data === 'object'
            ? existing.data
            : {};
        const merged = Object.assign({}, prev, entry);
        await existing.update({
          table_key: tableKey || existing.table_key,
          data: merged,
          sort_order: i
        });
        updated.push(existing);
        continue;
      }
    }

    const row = await PageTableRow.create({
      page_table_id: pageTable.id,
      table_key: tableKey,
      data: entry,
      sort_order: i
    });
    updated.push(row);
  }

  return json.ok(res, updated, 'Row(s) updated successfully');
});

exports.exportSheet = wrap(async function (req, res) {
  const pageTable = await resolvePageTableByMenuParam(req.params.id);
  if (!pageTable) return json.fail(res, 404, 'Table configuration not found');

  const data = await loadPageTableBundle({ id: pageTable.id });
  return json.ok(res, {
    download_url: null,
    rows: data[0] ? data[0].rows : [],
    columns: data[0] ? data[0].columns : []
  }, 'Export data ready');
});

exports.menusByPageType = wrap(async function (req, res) {
  const pageType = String(req.query.page_type || '').trim().toLowerCase();
  const where = {};
  if (pageType) where.page_type = pageType;

  const rows = await Menu.findAll({
    where: where,
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });

  const data = rows.map(function (row) {
    const item = row.toJSON();
    return {
      id: item.id,
      parent_id: item.parent_id,
      page_type: item.page_type,
      slug: item.slug,
      url: item.url,
      translations: [
        {
          language_code: 'en',
          title: item.title || ''
        },
        {
          language_code: 'hi',
          title: item.title_hi || item.title || ''
        }
      ]
    };
  });

  return json.ok(res, data);
});

exports.buildPublicPageLayout = async function (menu, lang) {
  const pageTable = await PageTable.findOne({
    where: { menu_id: menu.id, is_active: true }
  });
  if (!pageTable) {
    return {
      pageLayout: null,
      cards: [],
      description: ''
    };
  }

  const allRows = await PageTableRow.findAll({
    where: { page_table_id: pageTable.id },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  const rowJson = allRows.map(function (r) {
    return r.toJSON();
  });
  const tablesConfig = normalizeTablesConfig(pageTable.tables_config);
  const isHi = lang === 'hi';

  const accordionMap = new Map();
  tablesConfig.forEach(function (tc, index) {
    const key = tc.accordion_id || '__root__';
    if (!accordionMap.has(key)) {
      accordionMap.set(key, {
        accordionId: tc.accordion_id || 'acc_' + (index + 1),
        accordionTitle: isHi
          ? (tc.accordion_title_hi || tc.accordion_title || '')
          : (tc.accordion_title || tc.accordion_title_hi || ''),
        tables: []
      });
    }

    const columns = (tc.columns || []).map(function (col) {
      return {
        key: col.key,
        label: isHi
          ? (col.label_hn || col.label_en || col.key)
          : (col.label_en || col.label_hn || col.key),
        sortable: !!col.sortable,
        type: col.type || 'text'
      };
    });

    const rows = rowsForTable(rowJson, tc.table_key);
    accordionMap.get(key).tables.push({
      tableId: tc.table_key || ('table_' + (index + 1)),
      tableTitle: isHi
        ? (tc.table_title_hi || tc.table_title || '')
        : (tc.table_title || tc.table_title_hi || ''),
      tableData: {
        columns: columns,
        rows: rows,
        pagination: {
          currentPage: 1,
          pageSize: Math.max(rows.length, 10),
          totalPages: 1,
          total: rows.length
        }
      }
    });
  });

  const pageLayout = {
    layout_type: pageTable.layout_type || 'table',
    accordions: Array.from(accordionMap.values())
  };

  return {
    pageLayout: pageLayout,
    cards: [],
    description: pageTable.description || ''
  };
};

exports.publicTableBySlug = wrap(async function (req, res) {
  const slug = String(req.params.slug || '').replace(/^\/+|\/+$/g, '');
  const tableId = String(req.query.tableId || '').trim();
  const search = String(req.query.search || '').trim().toLowerCase();
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize) || 10));
  const lang = String(req.query.lang || 'en').toLowerCase().startsWith('hi') ? 'hi' : 'en';

  const menu = await Menu.findOne({
    where: {
      is_active: true,
      [Op.or]: [{ slug: slug }, { url: slug }, { url: '/' + slug }]
    }
  });
  if (!menu) return json.fail(res, 404, 'Page not found');

  const built = await exports.buildPublicPageLayout(menu.toJSON(), lang);
  if (!built.pageLayout) return json.fail(res, 404, 'Table not found');

  let tableConfig = null;
  (built.pageLayout.accordions || []).forEach(function (acc) {
    (acc.tables || []).forEach(function (table) {
      if (!tableConfig && (!tableId || table.tableId === tableId)) {
        tableConfig = table;
      }
    });
  });

  if (!tableConfig) return json.fail(res, 404, 'Table not found');

  let rows = (tableConfig.tableData && tableConfig.tableData.rows) || [];
  if (search) {
    rows = rows.filter(function (row) {
      return Object.keys(row).some(function (key) {
        if (key === 'id') return false;
        return String(row[key] == null ? '' : row[key]).toLowerCase().indexOf(search) >= 0;
      });
    });
  }

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = rows.slice(start, start + pageSize);

  return json.ok(res, {
    columns: (tableConfig.tableData && tableConfig.tableData.columns) || [],
    rows: pageRows,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      total: total
    }
  });
});
