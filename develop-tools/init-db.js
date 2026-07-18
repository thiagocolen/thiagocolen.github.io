// -----------------------------------------------------
// Create the local SQLite database from src/data/schema.sql.
//
// Usage:
//   node develop-tools/init-db.js
//   npm run db:init
//
// Idempotent — schema.sql uses CREATE TABLE IF NOT EXISTS, so running
// this against an existing database leaves its data untouched.
//
// Mainly used by CI: the PR preview workflow has no access to the local
// database (it is never committed), so it builds one from this schema and
// then seeds it from src/data/published-posts.json.
// -----------------------------------------------------

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// POSTS_DB_PATH lets CI (and tests) target a database outside the default
// location without disturbing the local source-of-true database.
const DB_PATH = process.env.POSTS_DB_PATH
  ? path.resolve(process.cwd(), process.env.POSTS_DB_PATH)
  : path.resolve(__dirname, "../src/data/posts.db");
const SCHEMA_PATH = path.resolve(__dirname, "../src/data/schema.sql");

const run = () => {
  if (!fs.existsSync(SCHEMA_PATH)) {
    throw new Error(`Schema not found: ${SCHEMA_PATH}`);
  }

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");
  db.exec(fs.readFileSync(SCHEMA_PATH, "utf-8"));
  db.close();

  console.log(`\n✅ Database ready at:\n   ${DB_PATH}\n`);
};

try {
  run();
} catch (err) {
  console.error("❌ Failed to initialise database:", err.message);
  process.exit(1);
}
