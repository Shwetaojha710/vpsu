const { Op } = require('sequelize');
const wrap = require('../helpers/wrap');
const json = require('../views/jsonView');
const pageTableCtrl = require('./pageTableController');
const {
  Menu,
  Slider,
  Gallery,
  Notice,
  QuickLink,
  Leader,
  Stat,
  Page,
  LmsCourse,
  LmsSubject,
  LmsContent,
  LmsTeacher
} = require('../models');

function langOf(req) {
  const raw = String(req.query.lang || req.headers.language || 'en').toLowerCase();
  return raw.startsWith('hi') ? 'hi' : 'en';
}

function pick(en, hi, lang) {
  return lang === 'hi' && hi ? hi : en;
}

function fileName(value, fallback) {
  const name = String(value || '').trim();
  return name || fallback;
}

function slugFromUrl(url) {
  const clean = String(url || '').trim();
  if (!clean || clean === '#' || clean === '/') return '';
  return clean.replace(/^\//, '').replace(/\//g, '-');
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function isNew(row) {
  if (row.is_pinned) return true;
  if (!row.created_at) return false;
  return Date.now() - new Date(row.created_at).getTime() < 14 * 24 * 60 * 60 * 1000;
}

function mapMenu(row, lang) {
  const rawUrl = row.url == null || row.url === '' ? null : String(row.url).trim();
  const url = rawUrl === '#' ? null : rawUrl;
  const enTitle = row.title || '';
  const hiTitle = row.title_hi || enTitle;
  const label = pick(enTitle, hiTitle, lang);
  const slug =
    (row.slug && String(row.slug).trim()) ||
    slugFromUrl(url) ||
    enTitle.toLowerCase().replace(/\s+/g, '-');

  let page_type = (row.page_type && String(row.page_type).trim()) || 'custom';
  if (!row.page_type && url && /^https?:\/\//i.test(url)) {
    page_type = 'link';
  }

  // For internal page types, expose slug as url/href so web nav builds /t_pages/:slug etc.
  const isExternal = page_type === 'link' || (url && /^https?:\/\//i.test(url));
  const navPath = isExternal ? url : (slug || url);

  return {
    id: row.id,
    parent_id: row.parent_id == null ? null : row.parent_id,
    page_type: page_type,
    slug: slug || null,
    href: navPath || null,
    url: navPath || null,
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
    label: label,
    children: (row.children || []).map(function (child) {
      return mapMenu(child, lang);
    })
  };
}

async function menuTree(parentId) {
  const rows = await Menu.findAll({
    where: { parent_id: parentId, is_active: true },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  const list = rows.map(function (row) {
    return row.toJSON();
  });
  for (let i = 0; i < list.length; i++) {
    list[i].children = await menuTree(list[i].id);
  }
  return list;
}

exports.menus = wrap(async function (req, res) {
  const tree = await menuTree(null);
  return json.ok(res, tree.map(function (item) {
    return mapMenu(item, langOf(req));
  }));
});

exports.banners = wrap(async function (req, res) {
  const rows = await Slider.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  const lang = langOf(req);
  return json.ok(res, rows.map(function (row) {
    const item = row.toJSON();
    const image = fileName(item.image, 'banner-1.svg');
    return {
      id: item.id,
      title: item.title,
      description: item.title,
      meta: item.title,
      img: image,
      image: image,
      link: item.link || '/',
      lang: lang
    };
  }));
});

exports.gallery = wrap(async function (req, res) {
  const rows = await Gallery.findAll({ order: [['created_at', 'DESC']] });
  return json.ok(res, rows.map(function (row) {
    const item = row.toJSON();
    const image = fileName(item.image, 'gallery-1.svg');
    return {
      id: item.id,
      title: item.title,
      name: item.title,
      image: image,
      thumbnail: image,
      img: image
    };
  }));
});

exports.notices = wrap(async function (req, res) {
  const lang = langOf(req);
  const rows = await Notice.findAll({
    where: { is_published: true },
    order: [['is_pinned', 'DESC'], ['created_at', 'DESC']]
  });
  return json.ok(res, rows.map(function (row) {
    const item = row.toJSON();
    return {
      id: item.id,
      title: pick(item.title, item.title_hi, lang),
      description: item.description || '',
      category: item.category,
      slug: item.pdf_file ? '/uploads/' + item.pdf_file : '/news-details/' + item.id,
      pdf_file: item.pdf_file,
      language: item.title_hi ? 'Hindi' : 'English',
      date: formatDate(item.created_at),
      isNew: isNew(item),
      is_new: isNew(item)
    };
  }));
});

exports.links = wrap(async function (req, res) {
  const rows = await QuickLink.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return json.ok(res, rows.map(function (row) {
    const item = row.toJSON();
    const name = fileName(item.icon, 'icon-link.svg');
    const img = name.indexOf('/uploads/') === 0 ? name :  name;
    return {
      id: item.id,
      title: item.title,
      img: img,
      icon: img,
      url: item.url,
      slug: { value: item.url || '#' }
    };
  }));
});

function mapLeader(row) {
  const item = row.toJSON ? row.toJSON() : row;
  const image = fileName(item.photo, 'leader.svg');
  return {
    id: item.id,
    name: item.name,
    designation: item.designation,
    title: item.designation,
    profile_text: item.profile_text || '',
    image: image,
    img: image,
    photo: image
  };
}

exports.dignitaries = wrap(async function (req, res) {
  const rows = await Leader.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] });
  return json.ok(res, rows.slice(0, 3).map(mapLeader));
});

exports.administrator = wrap(async function (req, res) {
  const rows = await Leader.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] });
  const list = rows.length > 2 ? rows.slice(2) : rows;
  return json.ok(res, list.map(mapLeader));
});

exports.stats = wrap(async function (req, res) {
  const lang = langOf(req);
  const hi = {
    'Students in Affiliated Colleges': 'सम्बद्ध महाविद्यालयों में छात्र',
    'Students at University Campus': 'विश्वविद्यालय परिसर में छात्र',
    'Affiliated Colleges': 'सम्बद्ध महाविद्यालय',
    'Government / Aided Colleges': 'राजकीय / अनुदानित महाविद्यालय',
    'Faculties': 'संकाय'
  };
  const rows = await Stat.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] });
  return json.ok(res, rows.map(function (row) {
    const item = row.toJSON();
    return {
      id: item.id,
      count: Number(String(item.value).replace(/[^0-9]/g, '')) || 0,
      title: pick(item.label, hi[item.label], lang),
      value: item.value,
      icon: item.icon
    };
  }));
});

function mapNewsItem(item, lang) {
  return {
    id: item.id,
    title: pick(item.title, item.title_hi, lang),
    name: pick(item.title, item.title_hi, lang),
    date: formatDate(item.created_at),
    is_new: isNew(item),
    isNew: isNew(item),
    link: '/news-details/' + item.id,
    slug: String(item.id)
  };
}

exports.news = wrap(async function (req, res) {
  const lang = langOf(req);
  const rows = await Notice.findAll({
    where: { is_published: true },
    order: [['is_pinned', 'DESC'], ['created_at', 'DESC']]
  });
  const list = rows.map(function (row) {
    return row.toJSON();
  });
  const news = list.filter(function (item) {
    return ['exam', 'admission', 'recruitment', 'general'].indexOf(item.category) !== -1;
  });
  const events = list.filter(function (item) {
    return ['tender', 'event', 'seminar'].indexOf(item.category) !== -1;
  });
  return json.ok(res, {
    news: (news.length ? news : list).map(function (item) {
      return mapNewsItem(item, lang);
    }),
    events: (events.length ? events : list.slice(0, 4)).map(function (item) {
      return mapNewsItem(item, lang);
    })
  });
});

exports.events = wrap(async function (req, res) {
  const rows = await Gallery.findAll({ order: [['created_at', 'DESC']] });
  return json.ok(res, rows.map(function (row) {
    const item = row.toJSON();
    const image = fileName(item.image, 'gallery-1.svg');
    return {
      id: item.id,
      title: item.title,
      name: item.title,
      slug: 'gallery-' + item.id,
      image: image,
      img: image
    };
  }));
});

exports.alumni = wrap(async function (req, res) {
  const rows = await Leader.findAll({ order: [['sort_order', 'ASC'], ['id', 'ASC']] });
  return json.ok(res, rows.map(mapLeader));
});

exports.settings = wrap(async function (req, res) {
  const lang = langOf(req);
  const hi = lang === 'hi';
  return json.ok(res, [
    { key: 'logo', value: 'logo.svg' },
    { key: 'top_logo', value: 'naac.svg' },
    { key: 'background_logo', value: '' },
    { key: 'notice_heading', value: hi ? 'सूचनाएँ' : 'Important Notices' },
    { key: 'current_adminstrator', value: hi ? 'वर्तमान प्रशासन' : 'Current Administrator' },
    { key: 'news_announcement', value: hi ? 'समाचार / घोषणा' : 'News / Announcement' },
    { key: 'events_seminar', value: hi ? 'कार्यक्रम / संगोष्ठी' : 'Events / Seminar' },
    { key: 'our_dignitaries', value: hi ? 'हमारे गणमान्य' : 'Our Dignitaries' },
    { key: 'academics_title', value: hi ? 'शैक्षणिक कार्यक्रम' : 'Academic Events' },
    { key: 'academics_view_all', value: hi ? 'सभी देखें' : 'View All' },
    { key: 'important_links', value: hi ? 'महत्वपूर्ण लिंक' : 'Important Links' },
    { key: 'alumni_title', value: hi ? 'गौरवशाली पूर्व छात्र' : 'Noble Alumni' },
    { key: 'home-gallery', value: hi ? 'गैलरी / एल्बम' : 'Gallery / Album' }
  ]);
});

async function siblingMenus(menu, lang) {
  const parentId = menu.parent_id == null ? null : menu.parent_id;
  const rows = await Menu.findAll({
    where: {
      parent_id: parentId,
      is_active: true
    },
    order: [['sort_order', 'ASC'], ['id', 'ASC']]
  });
  return rows.map(function (row) {
    return mapMenu(row.toJSON(), lang);
  });
}

exports.page = wrap(async function (req, res) {
  const lang = langOf(req);
  const slug = String(req.params.slug || '').replace(/^\/+|\/+$/g, '');

  // 1) Menu-driven pages (table / static / custom / dynamic)
  const menu = await Menu.findOne({
    where: {
      is_active: true,
      [Op.or]: [
        { slug: slug },
        { url: slug },
        { url: '/' + slug }
      ]
    }
  });

  if (menu) {
    const item = menu.toJSON();
    const pageType = (item.page_type || 'custom').toLowerCase();
    const title = pick(item.title, item.title_hi, lang);
    const sideMenus = await siblingMenus(item, lang);

    if (pageType === 'table') {
      const tableBundle = await pageTableCtrl.buildPublicPageLayout(item, lang);
      return json.ok(res, {
        id: item.id,
        slug: item.slug || slug,
        menu_title: title,
        title: title,
        page_type: 'table',
        is_active: !!item.is_active,
        body: tableBundle.description || '',
        description: tableBundle.description || '',
        page_data: {
          page_type: 'table',
          title: title,
          menu_title: title,
          body: tableBundle.description || '',
          table_data: {
            pageLayout: tableBundle.pageLayout,
            cards: tableBundle.cards || []
          },
          sections: {
            menus: sideMenus
          }
        },
        pageLayout: tableBundle.pageLayout,
        cards: tableBundle.cards || [],
        sections: {
          menus: sideMenus
        }
      });
    }

    // Non-table menu: try linked CMS page, else return menu shell + sidebar
    const linkedPage = item.id
      ? await Page.findOne({ where: { menu_id: item.id, is_published: true } })
      : null;
    const cms =
      linkedPage ||
      (await Page.findOne({ where: { slug: slug, is_published: true } }));

    if (cms) {
      const pageItem = cms.toJSON();
      return json.ok(res, {
        id: pageItem.id,
        slug: pageItem.slug,
        menu_title: title,
        title: pick(pageItem.title, pageItem.title_hi, lang) || title,
        page_type: pageType,
        is_active: !!item.is_active,
        body: pick(pageItem.content, pageItem.content_hi, lang) || pageItem.content || '',
        page_data: {
          page_type: pageType,
          title: pick(pageItem.title, pageItem.title_hi, lang) || title,
          menu_title: title,
          body: pick(pageItem.content, pageItem.content_hi, lang) || pageItem.content || '',
          sections: { menus: sideMenus }
        },
        sections: { menus: sideMenus }
      });
    }

    return json.ok(res, {
      id: item.id,
      slug: item.slug || slug,
      menu_title: title,
      title: title,
      page_type: pageType,
      is_active: !!item.is_active,
      body: '',
      page_data: {
        page_type: pageType,
        title: title,
        menu_title: title,
        body: '',
        sections: { menus: sideMenus }
      },
      sections: { menus: sideMenus }
    });
  }

  // 2) Legacy pages table
  const row = await Page.findOne({ where: { slug: slug, is_published: true } });
  if (!row) return json.fail(res, 404, 'Page not found');
  const item = row.toJSON();
  return json.ok(res, {
    id: item.id,
    slug: item.slug,
    title: pick(item.title, item.title_hi, lang),
    menu_title: pick(item.title, item.title_hi, lang),
    body: pick(item.content, item.content_hi, lang) || item.content || '',
    page_data: {
      title: pick(item.title, item.title_hi, lang),
      body: pick(item.content, item.content_hi, lang) || item.content || '',
      sections: {}
    },
    sections: {}
  });
});

exports.noticeDetails = wrap(async function (req, res) {
  const lang = langOf(req);
  const row = await Notice.findByPk(req.params.id);
  if (!row) return json.fail(res, 404, 'Notice not found');
  const item = row.toJSON();
  return json.ok(res, {
    id: item.id,
    title: pick(item.title, item.title_hi, lang),
    body: item.description || '',
    date: formatDate(item.created_at),
    category: item.category,
    sections: {}
  });
});

exports.trackVisit = wrap(async function (req, res) {
  return json.ok(res, { count: 1 });
});

exports.archive = wrap(async function (req, res) {
  return json.ok(res, []);
});

// GET /api/lms-department/:slug  (slug or id of a department menu)
// active LMS courses of the department with only published content
exports.lmsDepartment = wrap(async function (req, res) {
  const lang = langOf(req);
  const key = String(req.params.slug || '').trim();
  const or = [{ slug: key }];
  if (/^\d+$/.test(key)) or.push({ id: Number(key) });

  const dept = await Menu.findOne({
    where: { [Op.or]: or, is_department: true, is_active: true }
  });
  if (!dept) return json.fail(res, 404, 'Department not found');

  const courses = await LmsCourse.findAll({
    where: { department_id: dept.id, is_active: true },
    include: [{
      model: LmsSubject,
      as: 'subjects',
      where: { is_active: true },
      required: false,
      attributes: ['id', 'name', 'name_hi', 'code', 'term_type', 'semester']
    }],
    order: [['name', 'ASC'], [{ model: LmsSubject, as: 'subjects' }, 'semester', 'ASC']]
  });

  const courseIds = courses.map(function (c) { return c.id; });
  const contents = courseIds.length
    ? await LmsContent.findAll({
      where: { course_id: courseIds, is_published: true },
      attributes: ['id', 'course_id', 'subject_id', 'title', 'title_hi', 'description', 'type', 'file_path', 'link_url', 'published_at'],
      include: [{ model: LmsTeacher, as: 'teacher', attributes: ['id', 'name'] }],
      order: [['published_at', 'DESC'], ['id', 'DESC']]
    })
    : [];

  return json.ok(res, {
    department: {
      id: dept.id,
      name: pick(dept.title, dept.title_hi, lang),
      slug: dept.slug
    },
    courses: courses.map(function (c) {
      const subjectIds = (c.subjects || []).map(function (s) { return s.id; });
      return {
        id: c.id,
        name: pick(c.name, c.name_hi, lang),
        code: c.code,
        subjects: (c.subjects || []).map(function (s) {
          return { id: s.id, name: pick(s.name, s.name_hi, lang), code: s.code, term_type: s.term_type || 'semester', semester: s.semester };
        }),
        contents: contents
          .filter(function (x) { return x.course_id === c.id && subjectIds.indexOf(x.subject_id) !== -1; })
          .map(function (x) {
            return {
              id: x.id,
              subject_id: x.subject_id,
              title: pick(x.title, x.title_hi, lang),
              description: x.description,
              type: x.type,
              file: x.file_path ? '/uploads/' + x.file_path : null,
              link_url: x.link_url,
              teacher: x.teacher ? x.teacher.name : null,
              published_at: x.published_at
            };
          })
      };
    })
  });
});
