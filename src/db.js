const { Pool } = require("pg");

const pool = new Pool({
  user: "miguel",
  host: "localhost",
  database: "techstore",
  password: "cincopassaigualadez",
  port: 5434,
});

module.exports = pool;
