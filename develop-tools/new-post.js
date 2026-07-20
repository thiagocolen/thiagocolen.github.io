// Scaffolds a new draft post.
//
//   npm run new-post -- "My Post Title" tag1,tag2
//
// Logic lives in posts.js, shared with the MCP server.

const path = require("path");
const { createDraft } = require("./posts");

const POSTS_DIR = path.resolve(__dirname, "../content/posts");

const title = process.argv[2];
const tags = (process.argv[3] || "")
  .split(",")
  .map((tag) => tag.trim())
  .filter(Boolean);

if (!title) {
  console.error('Usage: npm run new-post -- "My Post Title" tag1,tag2');
  process.exit(1);
}

try {
  const { path: outPath } = createDraft(POSTS_DIR, { title, tags });

  console.log(`Created ${outPath}`);
  console.log(`Preview it with: npm run develop`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
