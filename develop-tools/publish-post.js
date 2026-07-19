// Flips a post's status from unpublished to published.
//
//   npm run publish-post -- <slug>
//
// No-op (not an error) if already published. Sets published_at to the
// current time only if it isn't already set, so republishing after an edit
// never clobbers the original publish date.

const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");

const POSTS_DIR = path.resolve(__dirname, "../content/posts");

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run publish-post -- <slug>");
  process.exit(1);
}

const filePath = path.join(POSTS_DIR, `${slug}.mdx`);

if (!fs.existsSync(filePath)) {
  console.error(`No post found at ${filePath}`);
  process.exit(1);
}

const file = matter.read(filePath);

if (file.data.status === "published") {
  console.log(`${slug} is already published.`);
  process.exit(0);
}

file.data.status = "published";
if (!file.data.published_at) {
  file.data.published_at = new Date().toISOString();
}

fs.writeFileSync(filePath, matter.stringify(file.content, file.data));

console.log(`Published ${slug} (published_at: ${file.data.published_at})`);
console.log("Commit content/posts/ and run `npm run deploy` to ship it.");
