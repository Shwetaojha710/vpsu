// Fill website data: nested menus, banners, gallery, notices, important links
// command: node db/seed-frontend-data.js

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const {
  sequelize,
  Menu,
  Slider,
  Gallery,
  Notice,
  QuickLink,
  Leader,
  Stat,
  Page
} = require('../models');

const uploadsDir = path.join(__dirname, '..', 'uploads');

function svgBanner(title, subtitle, c1, c2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="620" viewBox="0 0 1600 620">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="620" fill="url(#g)"/>
  <rect x="48" y="48" width="1504" height="524" fill="none" stroke="#ffd54f" stroke-width="3" opacity="0.55"/>
  <text x="800" y="270" fill="#ffffff" font-size="42" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXml(title)}</text>
  <text x="800" y="340" fill="#ffd54f" font-size="26" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXml(subtitle)}</text>
</svg>`;
}

function svgCard(title, c1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
  <rect width="640" height="420" fill="${c1}"/>
  <circle cx="320" cy="160" r="54" fill="#ffd54f" opacity="0.9"/>
  <text x="320" y="300" fill="#ffffff" font-size="22" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXml(title)}</text>
</svg>`;
}

function svgIcon(letter, c1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${c1}"/>
  <text x="32" y="42" fill="#ffffff" font-size="28" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXml(letter)}</text>
</svg>`;
}

function svgPerson(name, c1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="280" viewBox="0 0 240 280">
  <rect width="240" height="280" fill="${c1}"/>
  <circle cx="120" cy="110" r="48" fill="#ffe082"/>
  <rect x="70" y="170" width="100" height="70" rx="40" fill="#ffe082"/>
  <text x="120" y="265" fill="#ffffff" font-size="12" text-anchor="middle" font-family="Segoe UI, Arial">${escapeXml(name)}</text>
</svg>`;
}

function svgNaac() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="56" fill="#1b5e20"/>
  <circle cx="60" cy="60" r="46" fill="#fff8e1"/>
  <text x="60" y="55" fill="#1b5e20" font-size="16" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="700">NAAC</text>
  <text x="60" y="78" fill="#c62828" font-size="22" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="700">A+</text>
</svg>`;
}

function svgLogo() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="496" height="93" viewBox="0 0 496 93">
  <rect width="496" height="93" rx="46" fill="#fff8e1"/>
  <circle cx="47" cy="46" r="28" fill="#4a148c"/>
  <text x="47" y="54" fill="#ffd54f" font-size="18" text-anchor="middle" font-family="Segoe UI, Arial" font-weight="700">VB</text>
  <text x="90" y="40" fill="#4a148c" font-size="18" font-family="Segoe UI, Arial" font-weight="700">Veer Bahadur Singh</text>
  <text x="90" y="64" fill="#4a148c" font-size="16" font-family="Segoe UI, Arial">Purvanchal University, Jaunpur</text>
</svg>`;
}

function escapeXml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function writeFile(name, contents) {
  fs.writeFileSync(path.join(uploadsDir, name), contents);
}

async function ensureMenu(parentId, title, titleHi, url, sortOrder) {
  const existing = await Menu.findOne({
    where: { title: title, parent_id: parentId }
  });
  if (existing) {
    await existing.update({
      title_hi: titleHi,
      url: url,
      sort_order: sortOrder,
      is_active: true
    });
    return existing;
  }
  return Menu.create({
    parent_id: parentId,
    title: title,
    title_hi: titleHi,
    url: url,
    sort_order: sortOrder,
    is_active: true
  });
}

async function ensurePage(slug, title, titleHi, content, contentHi) {
  const existing = await Page.findOne({ where: { slug: slug } });
  if (existing) return existing;
  return Page.create({
    slug: slug,
    title: title,
    title_hi: titleHi,
    content: content,
    content_hi: contentHi,
    is_published: true
  });
}

async function ensureNotice(title, titleHi, description, category, pinned) {
  const existing = await Notice.findOne({ where: { title: title } });
  if (existing) {
    await existing.update({
      title_hi: titleHi,
      description: description,
      category: category,
      is_pinned: pinned,
      is_published: true
    });
    return existing;
  }
  return Notice.create({
    title: title,
    title_hi: titleHi,
    description: description,
    category: category,
    is_pinned: pinned,
    is_published: true
  });
}

async function run() {
  fs.mkdirSync(uploadsDir, { recursive: true });

  writeFile('logo.svg', svgLogo());
  writeFile('naac.svg', svgNaac());
  writeFile('banner-1.svg', svgBanner('Veer Bahadur Singh Purvanchal University', '30th Convocation – 27 July 2026', '#4a148c', '#7b1fa2'));
  writeFile('banner-2.svg', svgBanner('NAAC A+ Accredited State University', 'Jaunpur, Uttar Pradesh, India', '#311b92', '#5e35b1'));
  writeFile('banner-3.svg', svgBanner('Admissions Open 2026-27', 'Apply online for campus and affiliated college courses', '#00695c', '#26a69a'));
  writeFile('gallery-1.svg', svgCard('Campus Main Building', '#4a148c'));
  writeFile('gallery-2.svg', svgCard('Convocation Ceremony', '#6a1b9a'));
  writeFile('gallery-3.svg', svgCard('Independence Day', '#c62828'));
  writeFile('gallery-4.svg', svgCard('Sports Meet', '#1565c0'));
  writeFile('gallery-5.svg', svgCard('Central Library', '#2e7d32'));
  writeFile('gallery-6.svg', svgCard('Science Block', '#00838f'));
  writeFile('icon-exam.svg', svgIcon('E', '#6a1b9a'));
  writeFile('icon-result.svg', svgIcon('R', '#1565c0'));
  writeFile('icon-college.svg', svgIcon('C', '#2e7d32'));
  writeFile('icon-fee.svg', svgIcon('F', '#ef6c00'));
  writeFile('icon-phd.svg', svgIcon('P', '#00838f'));
  writeFile('icon-place.svg', svgIcon('T', '#c62828'));
  writeFile('icon-blog.svg', svgIcon('B', '#3949ab'));
  writeFile('icon-nep.svg', svgIcon('N', '#5d4037'));
  writeFile('icon-iqac.svg', svgIcon('Q', '#4527a0'));
  writeFile('icon-swayam.svg', svgIcon('S', '#00695c'));
  writeFile('icon-recruit.svg', svgIcon('J', '#ad1457'));
  writeFile('icon-link.svg', svgIcon('L', '#4a148c'));
  writeFile('leader-1.svg', svgPerson('Governor', '#4a148c'));
  writeFile('leader-2.svg', svgPerson('Chief Minister', '#c62828'));
  writeFile('leader-3.svg', svgPerson('Vice Chancellor', '#1565c0'));
  writeFile('leader-4.svg', svgPerson('Registrar', '#00695c'));
  writeFile('leader.svg', svgPerson('Official', '#37474f'));

  const home = await ensureMenu(null, 'Home', 'होम', '/', 1);
  const university = await ensureMenu(null, 'University', 'विश्वविद्यालय', '#', 2);
  const faculties = await ensureMenu(null, 'Faculties', 'संकाय', '#', 3);
  const admission = await ensureMenu(null, 'Admission', 'प्रवेश', '/admission', 4);
  const research = await ensureMenu(null, 'Research', 'शोध', '/research', 5);
  const examination = await ensureMenu(null, 'Examination', 'परीक्षा', '/examination', 6);
  const facilities = await ensureMenu(null, 'Facilities', 'सुविधाएँ', '#', 7);
  const affiliation = await ensureMenu(null, 'Affiliation', 'सम्बद्धता', '/affiliation', 8);
  const staff = await ensureMenu(null, 'University Staff Corner', 'विश्वविद्यालय स्टाफ कॉर्नर', '#', 9);
  const cell = await ensureMenu(null, 'Cell', 'प्रकोष्ठ', '#', 10);
  const alumni = await ensureMenu(null, 'Alumni', 'पूर्व छात्र', '/alumni', 11);
  const grievance = await ensureMenu(null, 'Grievance', 'शिकायत', '/grievance', 12);
  const econtent = await ensureMenu(null, 'E-content', 'ई-कंटेंट', '#', 13);
  await ensureMenu(null, 'ERP', 'ईआरपी', 'https://vbspu.ac.in', 14);

  const about = await ensureMenu(university.id, 'About University', 'विश्वविद्यालय परिचय', '/about', 1);
  await ensureMenu(university.id, 'Vice Chancellor', 'कुलपति', '/vice-chancellor', 2);
  await ensureMenu(university.id, 'Vision and Mission', 'दृष्टि एवं लक्ष्य', '/vision', 3);
  await ensureMenu(university.id, 'Acts and Statutes', 'अधिनियम', '/acts', 4);
  await ensureMenu(about.id, 'History', 'इतिहास', '/history', 1);
  await ensureMenu(about.id, 'NAAC Accreditation', 'NAAC मान्यता', '/naac', 2);

  const science = await ensureMenu(faculties.id, 'Faculty of Science', 'विज्ञान संकाय', '/faculty-science', 1);
  await ensureMenu(faculties.id, 'Faculty of Arts', 'कला संकाय', '/faculty-arts', 2);
  await ensureMenu(faculties.id, 'Faculty of Commerce', 'वाणिज्य संकाय', '/faculty-commerce', 3);
  await ensureMenu(faculties.id, 'Faculty of Law', 'विधि संकाय', '/faculty-law', 4);
  await ensureMenu(faculties.id, 'Faculty of Engineering & Technology', 'अभियांत्रिकी संकाय', '/faculty-engineering', 5);
  await ensureMenu(faculties.id, 'Faculty of Management Studies', 'प्रबंधन अध्ययन संकाय', '/faculty-management', 6);
  await ensureMenu(science.id, 'B.Sc', 'बी.एससी', '/bsc', 1);
  await ensureMenu(science.id, 'M.Sc', 'एम.एससी', '/msc', 2);

  await ensureMenu(admission.id, 'PUCAT', 'पी.यू.कैट', '/pucat', 1);
  await ensureMenu(admission.id, 'Campus Courses', 'परिसर पाठ्यक्रम', '/campus-courses', 2);
  await ensureMenu(admission.id, 'Fee Structure', 'शुल्क संरचना', '/fee-structure', 3);

  await ensureMenu(research.id, 'PhD', 'पीएचडी', '/phd', 1);
  await ensureMenu(research.id, 'Research Centres', 'शोध केंद्र', '/research-centres', 2);

  await ensureMenu(examination.id, 'Exam Form', 'परीक्षा फॉर्म', '/exam-form', 1);
  await ensureMenu(examination.id, 'Date Sheet', 'डेट शीट', '/date-sheet', 2);
  await ensureMenu(examination.id, 'Result', 'परिणाम', '/result', 3);
  await ensureMenu(examination.id, 'Admit Card', 'प्रवेश पत्र', '/admit-card', 4);

  await ensureMenu(facilities.id, 'Library', 'पुस्तकालय', '/library', 1);
  await ensureMenu(facilities.id, 'Hostel', 'छात्रावास', '/hostel', 2);
  await ensureMenu(facilities.id, 'Sports', 'खेल', '/sports', 3);

  await ensureMenu(affiliation.id, 'Affiliated Colleges', 'सम्बद्ध महाविद्यालय', '/colleges', 1);
  await ensureMenu(affiliation.id, 'New Affiliation', 'नई सम्बद्धता', '/new-affiliation', 2);

  await ensureMenu(staff.id, 'Teaching Staff', 'शैक्षणिक स्टाफ', '/teaching-staff', 1);
  await ensureMenu(staff.id, 'Non-Teaching Staff', 'अशैक्षणिक स्टाफ', '/non-teaching-staff', 2);
  await ensureMenu(staff.id, 'Recruitment', 'भर्ती', '/recruitment', 3);

  await ensureMenu(cell.id, 'IQAC', 'आईक्यूएसी', '/iqac', 1);
  await ensureMenu(cell.id, 'NSS', 'एनएसएस', '/nss', 2);
  await ensureMenu(cell.id, 'Training & Placement', 'प्रशिक्षण एवं स्थापना', '/placement', 3);
  await ensureMenu(cell.id, 'Anti Ragging Cell', 'रैगिंग विरोधी प्रकोष्ठ', '/anti-ragging', 4);
  await ensureMenu(cell.id, "Women's Cell", 'महिला प्रकोष्ठ', '/womens-cell', 5);

  await ensureMenu(econtent.id, 'SWAYAM', 'स्वयं', '/swayam', 1);
  await ensureMenu(econtent.id, 'e-Library', 'ई-पुस्तकालय', '/e-library', 2);
  await ensureMenu(econtent.id, 'Video Lectures', 'वीडियो व्याख्यान', '/video-lectures', 3);

  await Slider.destroy({ where: {} });
  await Slider.bulkCreate([
    { title: '30th Convocation – 27 July 2026', image: 'banner-1.svg', link: '/', sort_order: 1, is_active: true },
    { title: 'NAAC A+ Accredited State University', image: 'banner-2.svg', link: '/about', sort_order: 2, is_active: true },
    { title: 'Admissions Open 2026-27', image: 'banner-3.svg', link: '/admission', sort_order: 3, is_active: true }
  ]);

  const galleries = [
    { title: 'Campus Main Building', image: 'gallery-1.svg' },
    { title: 'Convocation Ceremony', image: 'gallery-2.svg' },
    { title: 'Independence Day Celebration', image: 'gallery-3.svg' },
    { title: 'Sports Meet', image: 'gallery-4.svg' },
    { title: 'Library Building', image: 'gallery-5.svg' },
    { title: 'Science Block', image: 'gallery-6.svg' }
  ];
  for (let i = 0; i < galleries.length; i++) {
    const row = await Gallery.findOne({ where: { title: galleries[i].title } });
    if (row) await row.update({ image: galleries[i].image });
    else await Gallery.create(galleries[i]);
  }

  await QuickLink.destroy({ where: {} });
  await QuickLink.bulkCreate([
    { title: 'New College Login / Results', url: 'https://vbspu.ac.in', icon: 'icon-college.svg', sort_order: 1, is_active: true },
    { title: 'Online Services', url: 'https://vbspu.ac.in', icon: 'icon-link.svg', sort_order: 2, is_active: true },
    { title: 'University Blog', url: 'https://vbspu.ac.in', icon: 'icon-blog.svg', sort_order: 3, is_active: true },
    { title: 'Examination Form', url: 'https://vbspu.ac.in', icon: 'icon-exam.svg', sort_order: 4, is_active: true },
    { title: 'PhD Online Fee', url: 'https://vbspu.ac.in', icon: 'icon-phd.svg', sort_order: 5, is_active: true },
    { title: 'National Education Policy', url: '/nep', icon: 'icon-nep.svg', sort_order: 6, is_active: true },
    { title: 'Training & Placement', url: '/placement', icon: 'icon-place.svg', sort_order: 7, is_active: true },
    { title: 'Recruitment', url: '/recruitment', icon: 'icon-recruit.svg', sort_order: 8, is_active: true },
    { title: 'Campus Online Fee', url: 'https://vbspu.ac.in', icon: 'icon-fee.svg', sort_order: 9, is_active: true },
    { title: 'IQAC', url: '/iqac', icon: 'icon-iqac.svg', sort_order: 10, is_active: true },
    { title: 'SWAYAM', url: '/swayam', icon: 'icon-swayam.svg', sort_order: 11, is_active: true },
    { title: 'Results', url: 'https://vbspu.ac.in', icon: 'icon-result.svg', sort_order: 12, is_active: true }
  ]);

  const leaders = [
    { name: 'Smt. Anandiben Patel', photo: 'leader-1.svg' },
    { name: 'Shri Yogi Adityanath', photo: 'leader-2.svg' },
    { name: 'Prof. Vandana Singh', photo: 'leader-3.svg' },
    { name: 'Registrar, VPSU', photo: 'leader-4.svg' }
  ];
  for (let i = 0; i < leaders.length; i++) {
    const row = await Leader.findOne({ where: { name: leaders[i].name } });
    if (row) await row.update({ photo: leaders[i].photo });
  }

  await ensureNotice(
    'MBA, MBA Agri-Business and MBA E-Commerce admission notice 2026-27',
    'एमबीए, एमबीए एग्री-बिजनेस एवं एमबीए ई-कॉमर्स प्रवेश सूचना 2026-27',
    'Online applications are invited for MBA, MBA Agri-Business and MBA E-Commerce programmes for session 2026-27.',
    'admission',
    true
  );
  await ensureNotice(
    'Online exam form for session 2025-26 is now open',
    'सत्र 2025-26 हेतु ऑनलाइन परीक्षा फॉर्म खुला है',
    'Students can fill the exam form and pay the fee from the student portal.',
    'exam',
    true
  );
  await ensureNotice(
    'PUCAT Admission Notice 2026-27',
    'पी.यू.कैट प्रवेश सूचना 2026-27',
    'Apply online for campus courses. Last date will be updated on the website.',
    'admission',
    true
  );
  await ensureNotice(
    'Faculty recruitment for Professor and Assistant Professor',
    'प्रोफेसर एवं सहायक आचार्य हेतु भर्ती',
    'Online applications are invited for teaching posts in various departments.',
    'recruitment',
    false
  );
  await ensureNotice(
    'Tender for campus maintenance work',
    'परिसर रखरखाव कार्य हेतु निविदा',
    'Sealed tenders are invited from registered contractors.',
    'tender',
    false
  );
  await ensureNotice(
    'UG semester result has been declared',
    'स्नातक सेमेस्टर परिणाम घोषित',
    'Students can check result using enrollment number.',
    'exam',
    false
  );
  await ensureNotice(
    'National Education Policy orientation programme',
    'राष्ट्रीय शिक्षा नीति अभिविन्यास कार्यक्रम',
    'Eight days NEP orientation and sensitization programme for faculty members.',
    'event',
    false
  );

  const pageHtml = function (title, body) {
    return '<h2>' + title + '</h2><p>' + body + '</p>';
  };
  const extraPages = [
    ['vision', 'Vision and Mission', 'दृष्टि एवं लक्ष्य', 'The University aims to provide quality higher education and research opportunities in eastern Uttar Pradesh.', 'विश्वविद्यालय पूर्वी उत्तर प्रदेश में गुणवत्तापूर्ण उच्च शिक्षा एवं शोध अवसर प्रदान करता है।'],
    ['acts', 'Acts and Statutes', 'अधिनियम', 'The University functions under the Uttar Pradesh State Universities Act, 1973.', 'विश्वविद्यालय उत्तर प्रदेश राज्य विश्वविद्यालय अधिनियम, 1973 के अंतर्गत कार्य करता है।'],
    ['history', 'History', 'इतिहास', 'The University was established on 2 October 1987 as Purvanchal University and later renamed Veer Bahadur Singh Purvanchal University.', 'विश्वविद्यालय की स्थापना 2 अक्टूबर 1987 को पूर्वांचल विश्वविद्यालय के रूप में हुई।'],
    ['naac', 'NAAC Accreditation', 'NAAC मान्यता', 'The University is accredited A+ by NAAC.', 'विश्वविद्यालय NAAC द्वारा A+ ग्रेड से मान्यता प्राप्त है।'],
    ['alumni', 'Alumni', 'पूर्व छात्र', 'The alumni network of VBSPU includes teachers, officers, researchers and professionals across India.', 'वीबीएसपीयू के पूर्व छात्र देशभर में शिक्षक, अधिकारी एवं पेशेवर के रूप में कार्यरत हैं।'],
    ['grievance', 'Grievance', 'शिकायत', 'Students and staff may submit grievances through the university grievance cell.', 'छात्र एवं कर्मचारी शिकायत प्रकोष्ठ के माध्यम से अपनी शिकायत दर्ज करा सकते हैं।'],
    ['faculty-science', 'Faculty of Science', 'विज्ञान संकाय', 'The Faculty of Science offers undergraduate and postgraduate programmes.', 'विज्ञान संकाय स्नातक एवं स्नातकोत्तर पाठ्यक्रम संचालित करता है।'],
    ['iqac', 'IQAC', 'आईक्यूएसी', 'Internal Quality Assurance Cell works for academic and administrative quality.', 'आंतरिक गुणवत्ता आश्वासन प्रकोष्ठ शैक्षणिक एवं प्रशासनिक गुणवत्ता हेतु कार्य करता है।']
  ];
  for (let i = 0; i < extraPages.length; i++) {
    const p = extraPages[i];
    await ensurePage(p[0], p[1], p[2], pageHtml(p[1], p[3]), pageHtml(p[2], p[4]));
  }

  const menuCount = await Menu.count();
  const noticeCount = await Notice.count({ where: { is_published: true } });
  console.log('Website data ready');
  console.log('Menus:', menuCount);
  console.log('Notices:', noticeCount);
  console.log('Banners, gallery images and icons saved in /uploads');
  await sequelize.close();
}

run().catch(function (err) {
  console.error('Frontend data seed failed');
  console.error(err.message);
  process.exit(1);
});
