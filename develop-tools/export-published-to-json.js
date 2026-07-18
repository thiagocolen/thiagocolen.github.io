// -----------------------------------------------------
// Export published posts from the local SQLite database to JSON.
//
// Usage:
//   node develop-tools/export-published-to-json.js [output-path]
//   npm run db:export
//
// The local database (src/data/posts.db) is the source of true and is
// never committed. CI has no access to it, so PR preview builds are
// seeded from the JSON file this script produces.
//
// Only 'published' posts are exported — the same filter the website
// applies at build time (see gatsby-config.js). Unpublished drafts stay
// local and out of git history.
//
// The output matches develop-tools/schema/posts.schema.json, so it can be
// fed straight back into add-posts-from-json.js.
// -----------------------------------------------------

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = path.resolve(__dirname, "../src/data/posts.db");
const DEFAULT_OUT = path.resolve(__dirname, "../src/data/published-posts.json");

const run = () => {
  const outPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : DEFAULT_OUT;

  if (!fs.existsSync(DB_PATH)) {
    throw new Error(
      `Database not found: ${DB_PATH}\n` +
        `   Run "npm run db:init" and import posts before exporting.`
    );
  }

  const db = new Database(DB_PATH, { readonly: true });

  const articles = db
    .prepare(
      `SELECT title, description, body_html, slug, published_at, cover_image, status
       FROM articles
       WHERE status = 'published'
       ORDER BY published_at DESC`
    )
    .all();

  const tagsFor = db.prepare(
    `SELECT t.name
     FROM tags t
     JOIN articles a ON a.id = t.article_id
     WHERE a.slug = @slug
     ORDER BY t.name`
  );

  const posts = articles.map((article) => ({
    ...article,
    tags: tagsFor.all({ slug: article.slug }).map((row) => row.name),
  }));

  db.close();

  fs.writeFileSync(outPath, `${JSON.stringify(posts, null, 2)}\n`, "utf-8");

  console.log(`\n✅ Exported ${posts.length} published post(s) to:\n   ${outPath}\n`);
};

try {
  run();
} catch (err) {
  console.error("❌ Failed to export posts:", err.message);
  process.exit(1);
}
