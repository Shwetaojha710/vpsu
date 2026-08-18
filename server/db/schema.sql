-- VPSU Admin Panel - all tables
-- Run this file after: CREATE DATABASE vpsu;

-- delete old tables if we run this file again
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
  icon VARCHAR(50),
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
