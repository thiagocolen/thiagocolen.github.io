// -----------------------------------------------------
// TEMPORARY MIGRATION SCRIPT — Dev.to → local SQLite DB
// -----------------------------------------------------
// Run once to populate the local database:
//   node develop-tools/migrate-devto-to-sqlite.js
//
// After reviewing the database, this script will be deleted
// and Dev.to will be fully removed as a data source.
// -----------------------------------------------------

const axios = require("axios");
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env.development"),
});

// -----------------------------------------------------
// Config
// -----------------------------------------------------

const devToApiKey = process.env.DEV_TO_API_KEY;
const devToUsername = "thiagocolen";
const DB_PATH = path.resolve(__dirname, "../src/data/posts.db");

if (!devToApiKey) {
  console.error(
    "❌ DEV_TO_API_KEY is not set. Make sure .env.development is configured."
  );
  process.exit(1);
}

// -----------------------------------------------------
// Dev.to API helpers
// -----------------------------------------------------

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDevToArticlesMe = async () =>
  axios.get("https://dev.to/api/articles/me", {
    headers: { "api-key": devToApiKey },
  });

const getDevToArticleByPath = async (slug) =>
  axios.get(`https://dev.to/api/articles/${devToUsername}/${slug}`, {
    headers: { "api-key": devToApiKey },
  });

const getDevToData = async () => {
  console.log("📡 Fetching article list from Dev.to...");
  const { data: articlesList } = await getDevToArticlesMe();
  const articles = [];

  for (const articleItem of articlesList) {
    let retries = 3;
    let fetched = false;

    while (retries > 0 && !fetched) {
      try {
        console.log(`  → Fetching: ${articleItem.slug}`);
        const { data } = await getDevToArticleByPath(articleItem.slug);
        articles.push(data);
        fetched = true;
        await delay(300);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.warn(
            `  ⚠ Rate limit hit for "${articleItem.slug}". Waiting 2s... (${retries} retries left)`
          );
          await delay(2000);
          retries--;
        } else {
          console.error(
            `  ✗ Failed to fetch "${articleItem.slug}": ${error.message}`
          );
          break;
        }
      }
    }
  }

  return articles;
};

// -----------------------------------------------------
// Database setup
// -----------------------------------------------------

const setupDatabase = (dbPath) => {
  // Ensure the src/data directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }

  const db = new Database(dbPath);

  // Enable WAL mode for better performance
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id            INTEGER PRIMARY KEY,
      title         TEXT    NOT NULL,
      description   TEXT,
      body_html     TEXT,
      slug          TEXT    UNIQUE NOT NULL,
      published_at  TEXT,
      cover_image   TEXT
    );

    CREATE TABLE IF NOT EXISTS tags (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
      name        TEXT    NOT NULL
    );
  `);

  return db;
};

// -----------------------------------------------------
// Seed data
// -----------------------------------------------------

const seedDatabase = (db, articles) => {
  const insertArticle = db.prepare(`
    INSERT OR REPLACE INTO articles (id, title, description, body_html, slug, published_at, cover_image)
    VALUES (@id, @title, @description, @body_html, @slug, @published_at, @cover_image)
  `);

  const insertTag = db.prepare(`
    INSERT INTO tags (article_id, name) VALUES (@article_id, @name)
  `);

  const deleteTagsForArticle = db.prepare(
    `DELETE FROM tags WHERE article_id = @article_id`
  );

  const seedAll = db.transaction((articles) => {
    for (const article of articles) {
      insertArticle.run({
        id: article.id,
        title: article.title || null,
        description: article.description || null,
        body_html: article.body_html || null,
        slug: article.slug,
        published_at: article.published_at || null,
        cover_image: article.cover_image || null,
      });

      // Replace tags for this article
      deleteTagsForArticle.run({ article_id: article.id });
      const tagList = article.tags || [];
      for (const tagName of tagList) {
        insertTag.run({ article_id: article.id, name: tagName });
      }

      console.log(
        `  ✓ Saved: "${article.title}" (${tagList.length} tag${tagList.length !== 1 ? "s" : ""})`
      );
    }
  });

  seedAll(articles);
};

// -----------------------------------------------------
// Main
// -----------------------------------------------------

const run = async () => {
  console.log("\n🚀 Dev.to → SQLite Migration Tool\n");

  const articles = await getDevToData();

  if (articles.length === 0) {
    console.warn("⚠ No articles fetched. Aborting database write.");
    process.exit(1);
  }

  console.log(`\n💾 Setting up database at: ${DB_PATH}`);
  const db = setupDatabase(DB_PATH);

  console.log(`\n📝 Inserting ${articles.length} article(s)...\n`);
  seedDatabase(db, articles);

  db.close();

  console.log(`
✅ Migration complete!
   ${articles.length} articles saved to: ${DB_PATH}

Next steps:
  1. Review the database (e.g., with DB Browser for SQLite or a CLI tool)
  2. Run "npm run develop" to verify the site builds from local data
  3. Approve removal of Dev.to and this migration script
`);
};

run().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
