-- sample data so the admin panel is not empty
-- password for admin is: admin123

INSERT INTO admins (name, email, password, role) VALUES
(
  'Super Admin',
  'admin@vpsu.ac.in',
  '$2a$10$SppQfn4trnSeHtSeNqSCV.66oo1DspDskgF2yJvBv0UWlxYnlLbX2',
  'superadmin'
);

INSERT INTO notices (title, title_hi, description, category, is_pinned, is_published) VALUES
('MBA, MBA Agri-Business and MBA E-Commerce admission notice 2026-27', 'एमबीए, एमबीए एग्री-बिजनेस एवं एमबीए ई-कॉमर्स प्रवेश सूचना 2026-27', 'Online applications are invited for MBA programmes for session 2026-27.', 'admission', true, true),
('Online exam form for session 2025-26 is now open', 'सत्र 2025-26 हेतु ऑनलाइन परीक्षा फॉर्म खुला है', 'Students can fill the exam form and pay the fee from the student portal.', 'exam', true, true),
('PUCAT Admission Notice 2026-27', 'पी.यू.कैट प्रवेश सूचना 2026-27', 'Apply online for campus courses. Last date will be updated on the website.', 'admission', true, true),
('Faculty recruitment for Professor and Assistant Professor', 'प्रोफेसर एवं सहायक आचार्य हेतु भर्ती', 'Online applications are invited for teaching posts in various departments.', 'recruitment', false, true),
('Tender for campus maintenance work', 'परिसर रखरखाव कार्य हेतु निविदा', 'Sealed tenders are invited from registered contractors.', 'tender', false, true),
('Holiday notice for national festival', 'राष्ट्रीय पर्व पर अवकाश सूचना', 'University and affiliated colleges will remain closed on the notified date.', 'general', false, true),
('UG semester result has been declared', 'स्नातक सेमेस्टर परिणाम घोषित', 'Students can check result using enrollment number.', 'exam', false, true);

INSERT INTO pages (slug, title, title_hi, content, content_hi, is_published) VALUES
('about', 'About the University', 'विश्वविद्यालय परिचय',
 'Veer Bahadur Singh Purvanchal University (VBSPU), Jaunpur is a state university of Uttar Pradesh. It is accredited A+ by NAAC and has hundreds of affiliated colleges.',
 'वीर बहादुर सिंह पूर्वांचल विश्वविद्यालय, जौनपुर उत्तर प्रदेश का एक राज्य विश्वविद्यालय है। यह NAAC द्वारा A+ ग्रेड प्राप्त है।',
 true),
('vice-chancellor', 'Vice Chancellor', 'कुलपति',
 'The Vice Chancellor is the academic and administrative head of the University.',
 'कुलपति विश्वविद्यालय के शैक्षणिक एवं प्रशासनिक प्रमुख हैं।',
 true),
('admission', 'Admission', 'प्रवेश',
 'Admissions to campus courses are done through PUCAT and as per university rules. Affiliated college admissions follow the university academic calendar.',
 'परिसर पाठ्यक्रमों में प्रवेश PUCAT तथा विश्वविद्यालय नियमों के अनुसार होता है।',
 true),
('research', 'Research', 'शोध',
 'The University supports PhD and research work in science, management, humanities and other faculties.',
 'विश्वविद्यालय विज्ञान, प्रबंधन, मानविकी एवं अन्य संकायों में शोध कार्य को बढ़ावा देता है।',
 true),
('examination', 'Examination', 'परीक्षा',
 'Examination forms, date sheets, admit cards and results are published through official notices.',
 'परीक्षा फॉर्म, डेट शीट, प्रवेश पत्र एवं परिणाम आधिकारिक सूचनाओं द्वारा जारी किए जाते हैं।',
 true),
('affiliation', 'Affiliation', 'सम्बद्धता',
 'Colleges in Jaunpur and nearby districts are affiliated to VPSU as per UGC and state rules.',
 'जौनपुर एवं आसपास के जनपदों के महाविद्यालय विश्वविद्यालय से सम्बद्ध हैं।',
 true);

INSERT INTO slider (title, image, link, sort_order, is_active) VALUES
('30th Convocation – 27 July 2026', 'banner-1.svg', '/', 1, true),
('NAAC A+ Accredited State University', 'banner-2.svg', '/about', 2, true),
('Admissions Open 2026-27', 'banner-3.svg', '/admission', 3, true);

INSERT INTO leaders (name, designation, photo, profile_text, sort_order) VALUES
('Smt. Anandiben Patel', 'Governor & Chancellor', '', 'Honble Governor of Uttar Pradesh and Chancellor of the University.', 1),
('Shri Yogi Adityanath', 'Chief Minister, Uttar Pradesh', '', 'Honble Chief Minister of Uttar Pradesh.', 2),
('Prof. Vandana Singh', 'Vice Chancellor', '', 'Vice Chancellor, Veer Bahadur Singh Purvanchal University, Jaunpur.', 3),
('Registrar, VPSU', 'Registrar', '', 'Registrar office handles academic records, affiliation and official correspondence.', 4);

INSERT INTO stats (label, value, icon, sort_order) VALUES
('Students in Affiliated Colleges', '300476', 'students', 1),
('Students at University Campus', '3454', 'campus', 2),
('Affiliated Colleges', '589', 'colleges', 3),
('Government / Aided Colleges', '27', 'govt', 4),
('Faculties', '8', 'faculty', 5);

INSERT INTO quick_links (title, url, icon, sort_order, is_active) VALUES
('New College Login / Results', 'https://vbspu.ac.in', 'icon-college.png', 1, true),
('Online Services', 'https://vbspu.ac.in', 'icon-link.png', 2, true),
('University Blog', 'https://vbspu.ac.in', 'icon-blog.png', 3, true),
('Examination Form', 'https://vbspu.ac.in', 'icon-exam.png', 4, true),
('PhD Online Fee', 'https://vbspu.ac.in', 'icon-phd.png', 5, true),
('National Education Policy', '/nep', 'icon-nep.png', 6, true),
('Training & Placement', '/placement', 'icon-place.png', 7, true),
('Recruitment', '/recruitment', 'icon-recruit.png', 8, true),
('Campus Online Fee', 'https://vbspu.ac.in', 'icon-fee.png', 9, true),
('IQAC', '/iqac', 'icon-iqac.png', 10, true),
('SWAYAM', '/swayam', 'icon-swayam.png', 11, true),
('Results', 'https://vbspu.ac.in', 'icon-result.png', 12, true);

INSERT INTO galleries (title, image) VALUES
('Campus Main Building', 'gallery-1.svg'),
('Convocation Ceremony', 'gallery-2.svg'),
('Independence Day Celebration', 'gallery-3.svg'),
('Sports Meet', 'gallery-4.svg'),
('Library Building', 'gallery-5.svg'),
('Science Block', 'gallery-6.svg');

INSERT INTO colleges (name, code, district, type, email, phone, is_active) VALUES
('Tilak Dhari Post Graduate College', 'TDPG01', 'Jaunpur', 'government', 'tdpg@example.com', '05452220001', true),
('Raja Harpal Singh Mahavidyalaya', 'RHS02', 'Jaunpur', 'aided', 'rhs@example.com', '05452220002', true),
('Sri Agrasen Kanya Mahavidyalaya', 'SAKM03', 'Azamgarh', 'affiliated', 'sakm@example.com', '05462220003', true),
('PG College Ghazipur', 'PGG04', 'Ghazipur', 'government', 'pgg@example.com', '05482220004', true),
('Baba Barua Das PG College', 'BBD05', 'Ambedkar Nagar', 'affiliated', 'bbd@example.com', '05271220005', true),
('Sant Kabir Mahavidyalaya', 'SKM06', 'Mau', 'affiliated', 'skm@example.com', '05472220006', true);

INSERT INTO menus (title, title_hi, url, sort_order, is_active) VALUES
('Home', 'होम', '/', 1, true),
('University', 'विश्वविद्यालय', '#', 2, true),
('Faculties', 'संकाय', '#', 3, true),
('Admission', 'प्रवेश', '/admission', 4, true),
('Research', 'शोध', '/research', 5, true),
('Examination', 'परीक्षा', '/examination', 6, true),
('Facilities', 'सुविधाएँ', '#', 7, true),
('Affiliation', 'सम्बद्धता', '/affiliation', 8, true),
('University Staff Corner', 'विश्वविद्यालय स्टाफ कॉर्नर', '#', 9, true),
('Cell', 'प्रकोष्ठ', '#', 10, true),
('Alumni', 'पूर्व छात्र', '/alumni', 11, true),
('Grievance', 'शिकायत', '/grievance', 12, true),
('E-content', 'ई-कंटेंट', '#', 13, true),
('ERP', 'ईआरपी', 'https://vbspu.ac.in', 14, true);

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'About University', 'विश्वविद्यालय परिचय', '/about', 1, true FROM menus WHERE title = 'University' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Vice Chancellor', 'कुलपति', '/vice-chancellor', 2, true FROM menus WHERE title = 'University' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Vision and Mission', 'दृष्टि एवं लक्ष्य', '/vision', 3, true FROM menus WHERE title = 'University' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Acts and Statutes', 'अधिनियम', '/acts', 4, true FROM menus WHERE title = 'University' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'History', 'इतिहास', '/about/history', 1, true FROM menus WHERE title = 'About University';
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'NAAC Accreditation', 'NAAC मान्यता', '/about/naac', 2, true FROM menus WHERE title = 'About University';

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Faculty of Science', 'विज्ञान संकाय', '/faculties/science', 1, true FROM menus WHERE title = 'Faculties' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Faculty of Arts', 'कला संकाय', '/faculties/arts', 2, true FROM menus WHERE title = 'Faculties' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Faculty of Commerce', 'वाणिज्य संकाय', '/faculties/commerce', 3, true FROM menus WHERE title = 'Faculties' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Faculty of Law', 'विधि संकाय', '/faculties/law', 4, true FROM menus WHERE title = 'Faculties' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'B.Sc', 'बी.एससी', '/faculties/science/bsc', 1, true FROM menus WHERE title = 'Faculty of Science';
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'M.Sc', 'एम.एससी', '/faculties/science/msc', 2, true FROM menus WHERE title = 'Faculty of Science';

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'PUCAT', 'पी.यू.कैट', '/admission/pucat', 1, true FROM menus WHERE title = 'Admission' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Campus Courses', 'परिसर पाठ्यक्रम', '/admission/campus', 2, true FROM menus WHERE title = 'Admission' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Fee Structure', 'शुल्क संरचना', '/admission/fee', 3, true FROM menus WHERE title = 'Admission' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'PhD', 'पीएचडी', '/research/phd', 1, true FROM menus WHERE title = 'Research' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Research Centres', 'शोध केंद्र', '/research/centres', 2, true FROM menus WHERE title = 'Research' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Exam Form', 'परीक्षा फॉर्म', '/examination/form', 1, true FROM menus WHERE title = 'Examination' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Date Sheet', 'डेट शीट', '/examination/datesheet', 2, true FROM menus WHERE title = 'Examination' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Result', 'परिणाम', '/examination/result', 3, true FROM menus WHERE title = 'Examination' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Admit Card', 'प्रवेश पत्र', '/examination/admit-card', 4, true FROM menus WHERE title = 'Examination' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Library', 'पुस्तकालय', '/facilities/library', 1, true FROM menus WHERE title = 'Facilities' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Hostel', 'छात्रावास', '/facilities/hostel', 2, true FROM menus WHERE title = 'Facilities' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Sports', 'खेल', '/facilities/sports', 3, true FROM menus WHERE title = 'Facilities' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Affiliated Colleges', 'सम्बद्ध महाविद्यालय', '/colleges', 1, true FROM menus WHERE title = 'Affiliation' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'New Affiliation', 'नई सम्बद्धता', '/affiliation/new', 2, true FROM menus WHERE title = 'Affiliation' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Teaching Staff', 'शैक्षणिक स्टाफ', '/teaching-staff', 1, true FROM menus WHERE title = 'University Staff Corner' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Non-Teaching Staff', 'अशैक्षणिक स्टाफ', '/non-teaching-staff', 2, true FROM menus WHERE title = 'University Staff Corner' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Recruitment', 'भर्ती', '/recruitment', 3, true FROM menus WHERE title = 'University Staff Corner' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'IQAC', 'आईक्यूएसी', '/iqac', 1, true FROM menus WHERE title = 'Cell' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'NSS', 'एनएसएस', '/nss', 2, true FROM menus WHERE title = 'Cell' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'Training & Placement', 'प्रशिक्षण एवं स्थापना', '/placement', 3, true FROM menus WHERE title = 'Cell' AND parent_id IS NULL;

INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'SWAYAM', 'स्वयं', '/swayam', 1, true FROM menus WHERE title = 'E-content' AND parent_id IS NULL;
INSERT INTO menus (parent_id, title, title_hi, url, sort_order, is_active)
SELECT id, 'e-Library', 'ई-पुस्तकालय', '/e-library', 2, true FROM menus WHERE title = 'E-content' AND parent_id IS NULL;

INSERT INTO sections (name, name_hi, type, slug, sort_order, is_active) VALUES
('Faculty of Engineering & Technology', 'अभियांत्रिकी एवं प्रौद्योगिकी संकाय', 'faculty', 'engineering', 1, true),
('Faculty of Science', 'विज्ञान संकाय', 'faculty', 'science', 2, true),
('Faculty of Management Studies', 'प्रबंधन अध्ययन संकाय', 'faculty', 'management', 3, true),
('IQAC', 'आईक्यूएसी', 'cell', 'iqac', 4, true);

INSERT INTO side_menus (section_id, title, title_hi, slug, content, sort_order, is_active)
SELECT id, 'Dean of Faculty (FET)', 'संकाय अध्यक्ष', 'dean',
'<h2>Legacy of Excellence in Technical Education</h2><p>The Faculty of Engineering and Technology provides quality technical education and research opportunities for students.</p>',
1, true FROM sections WHERE slug = 'engineering';
INSERT INTO side_menus (section_id, title, title_hi, slug, content, sort_order, is_active)
SELECT id, 'Dept. of Computer Science & Engineering', 'कंप्यूटर विज्ञान एवं अभियंत्रण', 'cse',
'<p>Department of Computer Science and Engineering.</p>',
2, true FROM sections WHERE slug = 'engineering';
INSERT INTO side_menus (section_id, title, title_hi, slug, content, sort_order, is_active)
SELECT id, 'Dept. of Information Technology', 'सूचना प्रौद्योगिकी', 'it',
'<p>Department of Information Technology.</p>',
3, true FROM sections WHERE slug = 'engineering';
INSERT INTO side_menus (section_id, title, title_hi, slug, content, sort_order, is_active)
SELECT id, 'About the Faculty', 'संकाय परिचय', 'about',
'<p>Welcome to the Faculty of Science.</p>',
1, true FROM sections WHERE slug = 'science';

INSERT INTO professors (section_id, name, name_hi, designation, designation_hi, email, profile_text, profile_text_hi, sort_order, is_active)
SELECT id, 'Prof. A. K. Sharma', 'प्रो. ए. के. शर्मा', 'Dean & Professor', 'संकाय अध्यक्ष एवं आचार्य', 'dean.fet@example.com', 'Dean, Faculty of Engineering and Technology.', 'संकाय अध्यक्ष, अभियंत्रण एवं प्रौद्योगिकी संकाय।', 1, true
FROM sections WHERE slug = 'engineering';
INSERT INTO professors (section_id, name, name_hi, designation, designation_hi, email, profile_text, profile_text_hi, sort_order, is_active)
SELECT id, 'Dr. Neha Verma', 'डॉ. नेहा वर्मा', 'Associate Professor, CSE', 'सह आचार्य, सीएसई', 'neha.cse@example.com', 'Department of Computer Science and Engineering.', 'कंप्यूटर विज्ञान एवं अभियंत्रण विभाग।', 2, true
FROM sections WHERE slug = 'engineering';
INSERT INTO professors (section_id, name, name_hi, designation, designation_hi, email, profile_text, profile_text_hi, sort_order, is_active)
SELECT id, 'Dr. Rakesh Singh', 'डॉ. राकेश सिंह', 'Professor', 'आचार्य', 'rakesh.sci@example.com', 'Faculty of Science.', 'विज्ञान संकाय।', 1, true
FROM sections WHERE slug = 'science';
