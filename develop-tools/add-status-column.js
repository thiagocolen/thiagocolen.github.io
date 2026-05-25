// One-time migration: adds the 'status' column to an existing posts.db
// and marks all existing articles as 'published'.
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../src/data/posts.db');

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

// Check if column already exists
const cols = db.prepare("PRAGMA table_info(articles)").all();
const hasStatus = cols.some(c => c.name === 'status');

if (hasStatus) {
  console.log('✓ status column already exists — nothing to do.');
} else {
  db.exec(`
    ALTER TABLE articles
    ADD COLUMN status TEXT NOT NULL DEFAULT 'unpublished'
                     CHECK (status IN ('published', 'unpublished'));
  `);

  const result = db.prepare(`UPDATE articles SET status = 'published'`).run();
  console.log(`✓ Added 'status' column.`);
  console.log(`✓ Marked ${result.changes} existing articles as 'published'.`);
}

db.close();
console.log('Done.');
