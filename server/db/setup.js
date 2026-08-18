// run this file once to create database, tables and sample data
// command: node db/setup.js

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const common = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
};

async function run() {
  // first connect to default "postgres" database so we can create vpsu
  const admin = new Client(Object.assign({}, common, { database: 'postgres' }));
  await admin.connect();

  const check = await admin.query("SELECT 1 FROM pg_database WHERE datname = 'vpsu'");
  if (check.rowCount === 0) {
    await admin.query('CREATE DATABASE vpsu');
    console.log('Database vpsu created');
  } else {
    console.log('Database vpsu already exists');
  }
  await admin.end();

  // now connect to vpsu and create tables + sample rows
  const db = new Client(Object.assign({}, common, { database: 'vpsu' }));
  await db.connect();

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

  await db.query(schema);
  await db.query(seed);

  console.log('Tables and sample data ready');
  console.log('Login: admin@vpsu.ac.in / admin123');
  await db.end();
}

run().catch(function (err) {
  console.error('Database setup failed.');
  console.error('1. Install PostgreSQL if it is not installed');
  console.error('2. Make sure PostgreSQL service is running');
  console.error('3. Put the correct password in server/.env (DB_PASSWORD)');
  console.error('Error: ' + err.message);
  process.exit(1);
});
