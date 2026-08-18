# VPSU Admin Panel

Simple admin panel for **Veer Bahadur Singh Purvanchal University, Jaunpur**.

This project has two folders:

- `server` = Node.js + Express + PostgreSQL API
- `client` = React admin panel

Public website is not included yet.

## 1. Create the database

Make sure PostgreSQL is installed and running.

Open `server/.env` and put your PostgreSQL password in `DB_PASSWORD`.

Then from the `server` folder run:

```bash
cd server
npm install
node db/setup.js
```

This will:

- create database `vpsu`
- create all tables
- insert sample data (notices, pages, colleges, admin user)

If you prefer to do it yourself in pgAdmin / `psql`:

```sql
CREATE DATABASE vpsu;
```

```bash
psql -U postgres -d vpsu -f db/schema.sql
psql -U postgres -d vpsu -f db/seed.sql
```

## 2. Start the server

```bash
cd server
npm install
```

Copy `.env.example` to `.env` if `.env` is missing, then edit the password:

```
DB_PASSWORD=your_postgres_password
```

Start API:

```bash
node index.js
```

You should see:

```
PostgreSQL connected
Server running on http://localhost:5000
```

If connection fails, check database name, user and password in `server/.env`.

## 3. Start the admin panel

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

## 4. Login

Open: http://localhost:5173

- Email: `admin@vpsu.ac.in`
- Password: `admin123`

## What you can manage

- Notices (with PDF)
- Pages (Hindi + English)
- Slider images
- Leaders (Governor, CM, VC)
- Stats numbers
- Quick links
- Gallery photos
- Affiliated colleges
- Website menus with unlimited nested sub menus
- Change password

All data is saved in PostgreSQL. The admin panel reads and updates that data.
