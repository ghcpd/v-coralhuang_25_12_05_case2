const path = require('path');
const fs = require('fs');
const knex = require('knex');

const dbFile = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'dev.sqlite3');

const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile
  },
  useNullAsDefault: true
});

module.exports = db;
