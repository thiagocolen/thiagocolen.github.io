// -----------------------------------------------------
// Add posts to the local SQLite database from a JSON file.
//
// Usage:
//   node develop-tools/add-posts-from-json.js <path-to-json>
//   npm run db:add-posts -- <path-to-json>
//
// The JSON file may contain a single post object or an array of
// post objects — see develop-tools/schema/posts.schema.json and
// develop-tools/schema/post.example.json.
//
// Rules (mirrors src/data/schema.sql's lifecycle comment):
//   - Matching is done by "slug".
//   - Existing posts already marked 'published' are read-only
//     and are skipped rather than overwritten.
//   - Existing 'unpublished' posts are updated in place.
//   - New slugs are inserted (default status: 'unpublished').
// -----------------------------------------------------

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// POSTS_DB_PATH lets CI (and tests) target a database outside the default
// location without disturbing the local source-of-true database.
const DB_PATH = process.env.POSTS_DB_PATH
  ? path.resolve(process.cwd(), process.env.POSTS_DB_PATH)
  : path.resolve(__dirname, "../src/data/posts.db");
const VALID_STATUSES = ["published", "unpublished"];
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const loadPostsFromFile = (filePath) => {
  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  const parsed = JSON.parse(fs.readFileSync(resolved, "utf-8"));
  return Array.isArray(parsed) ? parsed : [parsed];
};

const validatePost = (post, index) => {
  const errors = [];

  if (!post.title || typeof post.title !== "string") {
    errors.push('missing or invalid "title"');
  }
  if (!post.slug || typeof post.slug !== "string" || !SLUG_PATTERN.test(post.slug)) {
    errors.push('missing or invalid "slug" (expected lowercase, hyphen-separated)');
  }
  if (post.status !== undefined && !VALID_STATUSES.includes(post.status)) {
    errors.push(`invalid "status" (must be one of: ${VALID_STATUSES.join(", ")})`);
  }
  if (post.tags !== undefined && !Array.isArray(post.tags)) {
    errors.push('"tags" must be an array of strings');
  }

  if (errors.length > 0) {
    const label = post.slug || post.title || `#${index + 1}`;
    throw new Error(`Post "${label}" is invalid: ${errors.join("; ")}`);
  }
};

const prepareStatements = (db) => ({
  findBySlug: db.prepare(`SELECT id, status FROM articles WHERE slug = @slug`),
  insertArticle: db.prepare(`
    INSERT INTO articles (title, description, body_html, slug, published_at, cover_image, status)
    VALUES (@title, @description, @body_html, @slug, @published_at, @cover_image, @status)
  `),
  updateArticle: db.prepare(`
    UPDATE articles
    SET title = @title, description = @description, body_html = @body_html,
        published_at = @published_at, cover_image = @cover_image, status = @status
    WHERE id = @id
  `),
  deleteTagsForArticle: db.prepare(`DELETE FROM tags WHERE article_id = @article_id`),
  insertTag: db.prepare(`INSERT INTO tags (article_id, name) VALUES (@article_id, @name)`),
});

const upsertPost = (statements, post) => {
  const existing = statements.findBySlug.get({ slug: post.slug });

  if (existing && existing.status === "published") {
    console.log(`  ⊘ Skipped (published/read-only): "${post.title}"`);
    return "skipped";
  }

  const values = {
    title: post.title,
    description: post.description ?? null,
    body_html: post.body_html ?? null,
    slug: post.slug,
    published_at: post.published_at ?? null,
    cover_image: post.cover_image ?? null,
    status: post.status ?? "unpublished",
  };

  let articleId;
  if (existing) {
    statements.updateArticle.run({ ...values, id: existing.id });
    articleId = existing.id;
    console.log(`  ✓ Updated: "${post.title}"`);
  } else {
    const info = statements.insertArticle.run(values);
    articleId = info.lastInsertRowid;
    console.log(`  ✓ Added: "${post.title}"`);
  }

  statements.deleteTagsForArticle.run({ article_id: articleId });
  for (const tag of post.tags ?? []) {
    statements.insertTag.run({ article_id: articleId, name: tag });
  }

  return existing ? "updated" : "added";
};

const run = () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: node develop-tools/add-posts-from-json.js <path-to-json>");
    process.exit(1);
  }

  console.log(`\n📖 Reading posts from: ${filePath}\n`);
  const posts = loadPostsFromFile(filePath);
  posts.forEach(validatePost);

  const db = new Database(DB_PATH);
  db.pragma("foreign_keys = ON");
  const statements = prepareStatements(db);

  const summary = { added: 0, updated: 0, skipped: 0 };
  const runAll = db.transaction((allPosts) => {
    for (const post of allPosts) {
      summary[upsertPost(statements, post)] += 1;
    }
  });
  runAll(posts);

  db.close();

  console.log(
    `\n✅ Done. Added: ${summary.added}, Updated: ${summary.updated}, Skipped: ${summary.skipped}\n`
  );
};

try {
  run();
} catch (err) {
  console.error("❌ Failed to add posts:", err.message);
  process.exit(1);
}
