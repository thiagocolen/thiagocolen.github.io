// Deletes a post file and the images only it uses.
//
//   npm run delete-post -- <slug> [--dry-run] [--keep-assets]
//
// An image another post still references is kept and reported. Everything
// here is git-tracked, so a mistaken delete is a `git checkout` away — but
// --dry-run prints the exact file list without touching anything.
//
// Logic lives in posts.js, shared with the MCP server.

const path = require("path");
const { deletePost, ASSETS_SUBPATH } = require("./posts");

const POSTS_DIR = path.resolve(__dirname, "../content/posts");
const ASSETS_DIR = path.resolve(__dirname, "..", ASSETS_SUBPATH);

const args = process.argv.slice(2);
const slug = args.find((arg) => !arg.startsWith("-"));
const dryRun = args.includes("--dry-run");
const keepAssets = args.includes("--keep-assets");

if (!slug) {
  console.error("Usage: npm run delete-post -- <slug> [--dry-run] [--keep-assets]");
  process.exit(1);
}

try {
  const result = deletePost(POSTS_DIR, ASSETS_DIR, slug, { keepAssets, dryRun });
  const verb = dryRun ? "Would delete" : "Deleted";

  console.log(`${verb} ${result.path}`);
  for (const asset of result.assets) console.log(`${verb} ${asset}`);

  if (result.shared.length) {
    console.log(`Kept (still used by another post): ${result.shared.join(", ")}`);
  }

  if (dryRun) {
    console.log("Dry run — nothing was removed. Re-run without --dry-run to delete.");
  } else {
    console.log("Commit the removal and run `npm run deploy` to take it off the live site.");
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
