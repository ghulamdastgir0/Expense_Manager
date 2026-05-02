// ============================================================
// Config/db.js — PostgreSQL Connection Pool
// ============================================================

import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "expense_manager",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  max: 20,                // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log pool errors (don't crash on idle client error)
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

export default pool;
