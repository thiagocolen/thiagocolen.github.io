// Scaffolds a new draft post.
//
//   npm run new-post -- "My Post Title" tag1,tag2

const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");

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

const slug = title
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const outPath = path.join(POSTS_DIR, `${slug}.mdx`);

if (fs.existsSync(outPath)) {
  console.error(`Refusing to overwrite existing post: ${outPath}`);
  process.exit(1);
}

const frontmatter = {
  title,
  description: "",
  published_at: null,
  cover_image: "",
  status: "unpublished",
  tags,
};

const file = matter.stringify("\nWrite your post here.\n", frontmatter);

fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.writeFileSync(outPath, file);

console.log(`Created ${outPath}`);
console.log(`Preview it with: npm run develop`);
