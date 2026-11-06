-- VPSU Admin Panel - all tables
-- Run this file after: CREATE DATABASE vpsu;

-- delete old tables if we run this file again
DROP TABLE IF EXISTS page_table_rows;
DROP TABLE IF EXISTS page_tables;
DROP TABLE IF EXISTS professors;
DROP TABLE IF EXISTS side_menu_files;
DROP TABLE IF EXISTS side_menus;
DROP TABLE IF EXISTS section_photos;
DROP TABLE IF EXISTS banners;
DROP TABLE IF EXISTS sections;
DROP TABLE IF EXISTS sub_menus;
DROP TABLE IF EXISTS menus;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS slider;
DROP TABLE IF EXISTS leaders;
DROP TABLE IF EXISTS stats;
DROP TABLE IF EXISTS quick_links;
DROP TABLE IF EXISTS galleries;
DROP TABLE IF EXISTS colleges;
DROP TABLE IF EXISTS admins;

-- 1) admins: people who can log in to the admin panel
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2) notices: news, circulars, exam / admission updates
CREATE TABLE notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255),
  description TEXT,
  category VARCHAR(50) DEFAULT 'general',
  pdf_file VARCHAR(255),
  is_pinned BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3) pages: About, VC, Admission etc. (Hindi + English)
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255),
  content TEXT,
  content_hi TEXT,
  is_published BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4) slider: home page banner images
CREATE TABLE slider (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  link VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 5) leaders: Governor, CM, Vice Chancellor
CREATE TABLE leaders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  designation VARCHAR(150),
  photo VARCHAR(255),
  profile_text TEXT,
  sort_order INT DEFAULT 0
);

-- 6) stats: numbers shown on home page
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  label VARCHAR(150) NOT NULL,
  value VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0
);

-- 7) quick_links: exam form, result, fee links
CREATE TABLE quick_links (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  icon VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 8) galleries: photo gallery
CREATE TABLE galleries (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 9) colleges: affiliated / government / aided colleges
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  district VARCHAR(100),
  type VARCHAR(50) DEFAULT 'affiliated',
  email VARCHAR(150),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true
);

-- 10) menus: unlimited nested website menus (parent_id NULL = top menu)
CREATE TABLE menus (
  id SERIAL PRIMARY KEY,
  parent_id INT REFERENCES menus(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  title_hi VARCHAR(150),
  url VARCHAR(255) DEFAULT '#',
  icon VARCHAR(100),
  slug VARCHAR(150),
  page_type VARCHAR(20) DEFAULT 'custom',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_header BOOLEAN DEFAULT false,
  is_faculty BOOLEAN DEFAULT false,
  is_department BOOLEAN DEFAULT false
);

-- 11) sections: Faculty, Cell, Institute... (Dean/Professors belong to one section)
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_hi VARCHAR(255),
  type VARCHAR(50) DEFAULT 'faculty',
  slug VARCHAR(150) UNIQUE,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 12) side_menus: left sidebar pages under a section
CREATE TABLE side_menus (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255),
  slug VARCHAR(255),
  page_type VARCHAR(20) DEFAULT 'static',
  content TEXT,
  content_hi TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 13) professors: teachers linked to a section
CREATE TABLE professors (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  name_hi VARCHAR(150),
  designation VARCHAR(150),
  designation_hi VARCHAR(150),
  photo VARCHAR(255),
  email VARCHAR(150),
  phone VARCHAR(20),
  profile_text TEXT,
  profile_text_hi TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 14) banners: department page top banner
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255),
  title_hi VARCHAR(255),
  image VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- 15) section_photos: department photo gallery
CREATE TABLE section_photos (
  id SERIAL PRIMARY KEY,
  section_id INT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title VARCHAR(255),
  title_hi VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 16) side_menu_files: PDFs for table-type pages (notices, ordinances)
CREATE TABLE side_menu_files (
  id SERIAL PRIMARY KEY,
  side_menu_id INT NOT NULL REFERENCES side_menus(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255),
  file_name VARCHAR(255),
  language VARCHAR(50) DEFAULT 'English',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 17) page_tables: header/column config for menu page_type=table
CREATE TABLE page_tables (
  id SERIAL PRIMARY KEY,
  menu_id INT NOT NULL UNIQUE REFERENCES menus(id) ON DELETE CASCADE,
  layout_type VARCHAR(20) DEFAULT 'table',
  description TEXT,
  tables_config JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 18) page_table_rows: row data for page tables
CREATE TABLE page_table_rows (
  id SERIAL PRIMARY KEY,
  page_table_id INT NOT NULL REFERENCES page_tables(id) ON DELETE CASCADE,
  table_key VARCHAR(100) DEFAULT '',
  data JSONB DEFAULT '{}'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Link CMS pages to menus (added after menus exists)
ALTER TABLE pages
  ADD COLUMN IF NOT EXISTS menu_id INT REFERENCES menus(id) ON DELETE SET NULL;
