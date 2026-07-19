// -----------------------------------------------------
// Publish a single draft post by slug.
//
// Usage:
//   node develop-tools/publish-post.js <slug>
//   npm run db:publish -- <slug>
//
// Flips status: 'unpublished' -> 'published'. Sets published_at to the
// current timestamp only if it is currently NULL/empty (never clobbers
// an existing published_at, e.g. on republish-after-edit workflows).
// Already-published posts are a no-op (not an error).
// -----------------------------------------------------

const Database = require("better-sqlite3");
const path = require("path");

// POSTS_DB_PATH lets CI (and tests) target a database outside the default
// location without disturbing the local source-of-true database.
const DB_PATH = process.env.POSTS_DB_PATH
  ? path.resolve(process.cwd(), process.env.POSTS_DB_PATH)
  : path.resolve(__dirname, "../src/data/posts.db");

const run = () => {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Usage: node develop-tools/publish-post.js <slug>");
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  const article = db
    .prepare(`SELECT id, title, status, published_at FROM articles WHERE slug = @slug`)
    .get({ slug });

  if (!article) {
    console.error(`❌ No article found with slug "${slug}"`);
    db.close();
    process.exit(1);
  }

  if (article.status === "published") {
    console.log(`⚠ "${article.title}" (${slug}) is already published. Nothing to do.`);
    db.close();
    return;
  }

  const publishedAt = article.published_at || new Date().toISOString();
  db.prepare(
    `UPDATE articles SET status = 'published', published_at = @published_at WHERE id = @id`
  ).run({ id: article.id, published_at: publishedAt });

  db.close();

  console.log(`
✅ Published: "${article.title}" (${slug})
   published_at: ${publishedAt}${article.published_at ? " (unchanged)" : " (set now)"}

Next steps:
  1. Run "npm run db:export" to refresh src/data/published-posts.json for CI/PR previews
  2. Run "npm run deploy" to build and push the change live
`);
};

try {
  run();
} catch (err) {
  console.error("❌ Failed to publish post:", err.message);
  process.exit(1);
}
