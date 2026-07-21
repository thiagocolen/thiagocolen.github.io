// Flips a post's status from unpublished to published.
//
//   npm run publish-post -- <slug>
//
// No-op (not an error) if already published. Sets published_at to the
// current time only if it isn't already set, so republishing after an edit
// never clobbers the original publish date.
//
// Logic lives in posts.js, shared with the MCP server.

const path = require("path");
const { publishPost } = require("./posts");

const POSTS_DIR = path.resolve(__dirname, "../content/posts");

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run publish-post -- <slug>");
  process.exit(1);
}

try {
  const result = publishPost(POSTS_DIR, slug);

  if (result.alreadyPublished) {
    console.log(`${slug} is already published.`);
    process.exit(0);
  }

  console.log(`Published ${slug} (published_at: ${result.published_at})`);
  console.log("Commit content/posts/ and run `npm run deploy` to ship it.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
