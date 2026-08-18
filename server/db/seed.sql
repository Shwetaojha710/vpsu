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
('Welcome to VPSU Jaunpur', '', '/about', 1, true),
('NAAC A+ Accredited State University', '', '/about', 2, true),
('Admissions Open 2026-27', '', '/admission', 3, true),
('Examination Notices and Results', '', '/examination', 4, true),
('Research and PhD Programmes', '', '/research', 5, true);

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
('Examination Form', 'https://vbspu.ac.in', 'exam', 1, true),
('Results', 'https://vbspu.ac.in', 'result', 2, true),
('College Login', 'https://vbspu.ac.in', 'college', 3, true),
('Campus Online Fee', 'https://vbspu.ac.in', 'fee', 4, true),
('PhD Online Fee', 'https://vbspu.ac.in', 'phd', 5, true),
('Training & Placement', 'https://vbspu.ac.in', 'placement', 6, true);

INSERT INTO galleries (title, image) VALUES
('Campus Main Building', ''),
('Convocation Ceremony', ''),
('Independence Day Celebration', ''),
('Sports Meet', ''),
('Library Building', ''),
('Science Block', '');

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
('Alumni', 'पूर्व छात्र', '/alumni', 9, true),
('Grievance', 'शिकायत', '/grievance', 10, true);

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
