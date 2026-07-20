// Post lifecycle: the single source of truth for how an MDX post is shaped,
// created, and mutated.
//
// Every entry point takes `postsDir` rather than resolving it here — the CLI
// scripts and the MCP server both pass the repo's content/posts/; the server
// simply switches the working tree to the new-articles branch first.

const path = require("path");
const fs = require("fs");
const matter = require("gray-matter");

// The frontmatter contract. gatsby-node.js queries exactly these fields, so
// adding one here means adding it to that GraphQL query too.
const FRONTMATTER_FIELDS = [
  "title",
  // Subtitle shown under the title on the post page. Distinct from
  // `description`, which is the listing/SEO blurb and is not rendered there.
  "headline",
  "description",
  "published_at",
  "cover_image",
  "status",
  "tags",
];

const SLUG_PATTERN = /^[a-z0-9-]+$/;

// Local images live under static/, which Gatsby copies verbatim to the site
// root — so static/images/foo.png is served at /images/foo.png with no plugin
// involved. Deliberately not gatsby-plugin-image: sharp is in package.json but
// absent from gatsby-config.js, so there is no transform pipeline to hook into.
// The trade-off is no responsive/optimised variants for these files.
//
// These two must agree: ASSETS_SUBPATH is where bytes land, ASSET_URL_BASE is
// how a post references them.
const ASSETS_SUBPATH = path.join("static", "images");
const ASSET_URL_BASE = "/images";

// Filenames become URLs and paths, so they are never trusted. The pattern
// allows no separators and no leading dot, which already rules out traversal;
// the resolved-path check below is the belt-and-braces backstop, matching
// postPath's posture.
const ASSET_PATTERN = /^[a-z0-9][a-z0-9._-]*\.(png|jpe?g|gif|webp|svg|avif)$/i;

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// A slug becomes a filename, so it is never trusted. Reject anything outside
// the pattern, then confirm the resolved path really is inside postsDir —
// belt-and-braces against a pattern bug ever letting a traversal through.
const postPath = (postsDir, slug) => {
  if (typeof slug !== "string" || !SLUG_PATTERN.test(slug)) {
    throw new Error(
      `Invalid slug: ${JSON.stringify(slug)} (expected only a-z, 0-9 and hyphens)`
    );
  }

  const dir = path.resolve(postsDir);
  const file = path.resolve(dir, `${slug}.mdx`);

  if (path.dirname(file) !== dir) {
    throw new Error(`Refusing to resolve ${slug} outside ${dir}`);
  }

  return file;
};

const assetPath = (assetsDir, filename) => {
  if (typeof filename !== "string" || !ASSET_PATTERN.test(filename)) {
    throw new Error(
      `Invalid asset filename: ${JSON.stringify(filename)} (expected e.g. "diagram-1.png"; letters, digits, dot, dash and underscore only, with an image extension)`
    );
  }

  const dir = path.resolve(assetsDir);
  const file = path.resolve(dir, filename);

  if (path.dirname(file) !== dir) {
    throw new Error(`Refusing to resolve ${filename} outside ${dir}`);
  }

  return file;
};

// Writes a base64-encoded image into static/images/ and returns the URL a post
// body should reference. Refuses to overwrite by default, mirroring createDraft.
const addAsset = (assetsDir, { filename, content, overwrite = false }) => {
  const file = assetPath(assetsDir, filename);

  if (fs.existsSync(file) && !overwrite) {
    throw new Error(
      `Refusing to overwrite existing asset: ${file} (pass overwrite: true if that is intended)`
    );
  }

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Asset content is required (base64-encoded image bytes)");
  }

  // Agents commonly send a full data URI; accept it rather than writing the
  // header into the file and producing a silently corrupt image.
  const base64 = content.replace(/^data:[^;,]*;base64,/, "").trim();

  // Buffer.from(..., "base64") ignores invalid characters instead of throwing,
  // so a malformed payload would otherwise be written as a truncated image.
  if (!/^[A-Za-z0-9+/\r\n]+={0,2}$/.test(base64)) {
    throw new Error("Asset content is not valid base64");
  }

  const bytes = Buffer.from(base64, "base64");

  if (!bytes.length) {
    throw new Error("Asset content decoded to zero bytes");
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bytes);

  return {
    filename,
    path: file,
    // What goes in the post body / cover_image.
    url: `${ASSET_URL_BASE}/${filename}`,
    bytes: bytes.length,
  };
};

const listPosts = (postsDir) => {
  const dir = path.resolve(postsDir);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => {
      const slug = path.basename(name, ".mdx");
      const { data } = matter.read(path.join(dir, name));

      return {
        slug,
        title: data.title || "",
        headline: data.headline || "",
        description: data.description || "",
        status: data.status || "unpublished",
        published_at: data.published_at || null,
        tags: data.tags || [],
      };
    })
    // published_at DESC; drafts (no published_at) sort last — same ordering
    // gatsby-node.js applies, so listings match what the site shows.
    .sort((a, b) => {
      if (!a.published_at) return 1;
      if (!b.published_at) return -1;
      return new Date(b.published_at) - new Date(a.published_at);
    });
};

const readPost = (postsDir, slug) => {
  const file = postPath(postsDir, slug);

  if (!fs.existsSync(file)) {
    throw new Error(`No post found at ${file}`);
  }

  const { data, content } = matter.read(file);
  return { slug, frontmatter: data, body: content };
};

const createDraft = (
  postsDir,
  { title, headline = "", description = "", cover_image = "", tags = [], body }
) => {
  if (!title || !title.trim()) {
    throw new Error("A title is required");
  }

  const slug = slugify(title);

  if (!slug) {
    throw new Error(
      `Title ${JSON.stringify(title)} produces an empty slug — it needs at least one letter or digit`
    );
  }

  const dir = path.resolve(postsDir);
  const file = postPath(dir, slug);

  if (fs.existsSync(file)) {
    throw new Error(`Refusing to overwrite existing post: ${file}`);
  }

  // Key order mirrors FRONTMATTER_FIELDS so every generated file looks the same.
  const frontmatter = {
    title,
    headline,
    description,
    published_at: null,
    cover_image,
    status: "unpublished",
    tags,
  };

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    file,
    matter.stringify(body || "\nWrite your post here.\n", frontmatter)
  );

  return { slug, path: file };
};

// Partial merge: only the keys you pass are touched. `status` and
// `published_at` are deliberately not updatable here — publishPost owns those,
// so publish-date semantics live in exactly one place.
const updatePost = (postsDir, slug, { body, ...fields }) => {
  const file = postPath(postsDir, slug);

  if (!fs.existsSync(file)) {
    throw new Error(`No post found at ${file}`);
  }

  const editable = ["title", "headline", "description", "cover_image", "tags"];
  const rejected = Object.keys(fields).filter((k) => !editable.includes(k));

  if (rejected.length) {
    throw new Error(
      `Cannot update ${rejected.join(", ")} — editable fields are ${editable.join(", ")} and body. Use publish_post to change status.`
    );
  }

  const supplied = Object.entries(fields).filter(([, v]) => v !== undefined);

  // A caller that asked for a change and got none must hear about it. MCP
  // clients validate against the tool schema and silently strip unknown keys,
  // so a request like {status: "unpublished"} arrives here empty — without
  // this, the agent would read "ok" and believe it had changed the status.
  if (!supplied.length && body === undefined) {
    throw new Error(
      `Nothing to update on ${slug}. Pass at least one of: ${editable.join(", ")}, body. To change status, use publishPost.`
    );
  }

  const post = matter.read(file);

  for (const [key, value] of supplied) {
    post.data[key] = value;
  }

  const content = body === undefined ? post.content : body;

  fs.writeFileSync(file, matter.stringify(content, post.data));

  return {
    slug,
    path: file,
    updated: supplied.map(([key]) => key).concat(body === undefined ? [] : ["body"]),
  };
};

// Sets published_at only if it isn't already set, so republishing after an
// edit never clobbers the original publish date.
const publishPost = (postsDir, slug) => {
  const file = postPath(postsDir, slug);

  if (!fs.existsSync(file)) {
    throw new Error(`No post found at ${file}`);
  }

  const post = matter.read(file);

  if (post.data.status === "published") {
    return { slug, path: file, alreadyPublished: true, published_at: post.data.published_at };
  }

  post.data.status = "published";
  if (!post.data.published_at) {
    post.data.published_at = new Date().toISOString();
  }

  fs.writeFileSync(file, matter.stringify(post.content, post.data));

  return { slug, path: file, alreadyPublished: false, published_at: post.data.published_at };
};

module.exports = {
  FRONTMATTER_FIELDS,
  SLUG_PATTERN,
  ASSETS_SUBPATH,
  ASSET_URL_BASE,
  ASSET_PATTERN,
  slugify,
  postPath,
  assetPath,
  addAsset,
  listPosts,
  readPost,
  createDraft,
  updatePost,
  publishPost,
};
