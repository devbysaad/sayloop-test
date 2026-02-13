// config/database.js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function callToDB() {
  pool.connect()
    .then(() => console.log("Connected to Neon PostgreSQL"))
    .catch((err) => console.error("DB Error:", err));
}

module.exports = { callToDB, pool };
