const { Pool, types } = require('pg');
types.setTypeParser(20, Number);    // bigint  -> number
types.setTypeParser(1700, Number);  // numeric -> number
module.exports = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgres://linhung:ChangeMe_Strong_Pass_123@localhost:5432/linhung_pagoda',
});
