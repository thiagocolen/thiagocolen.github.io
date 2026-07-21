// Flips a post's status from published back to unpublished.
//
//   npm run unpublish-post -- <slug>
//
// No-op (not an error) if it isn't published. `published_at` is left in
// place, so republishing later keeps the original publish date.
//
// Logic lives in posts.js, shared with the MCP server.

const path = require("path");
const { unpublishPost } = require("./posts");

const POSTS_DIR = path.resolve(__dirname, "../content/posts");

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run unpublish-post -- <slug>");
  process.exit(1);
}

try {
  const result = unpublishPost(POSTS_DIR, slug);

  if (result.alreadyUnpublished) {
    console.log(`${slug} is not published.`);
    process.exit(0);
  }

  console.log(`Unpublished ${slug} (published_at kept: ${result.published_at})`);
  console.log("It still builds in `npm run develop`, but is dropped from production builds.");
  console.log("Commit content/posts/ and run `npm run deploy` to take it off the live site.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
