# How to Manage Posts

This document explains the complete lifecycle of a post in the local SQLite database (`src/data/posts.db`) — the **local source of true** for this website.

---

## Post Lifecycle

```
[Created] ──► unpublished ──► published (read-only)
```

| Status | Editable | Deletable | Shown on website |
|---|---|---|---|
| `unpublished` | ✅ Yes | ✅ Yes | ❌ No |
| `published` | ❌ No | ❌ No | ✅ Yes |

> **Rule**: Once a post is published, it becomes **read-only**. It cannot be edited or deleted via any script or tool. This protects the integrity of live content.

---

## Prerequisites

Make sure you have the database set up. If `src/data/posts.db` does not exist, run:

```bash
npm run db:migrate
```

To verify the database is working:

```bash
node -e "const db = require('better-sqlite3')('./src/data/posts.db'); console.log(db.prepare('SELECT count(*) as total FROM articles').get()); db.close();"
```

---

## Adding a New Post

New posts are created with status `unpublished` by default (via the schema's `DEFAULT 'unpublished'`).

### Step 1 — Insert the article row

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db');
db.pragma('foreign_keys = ON');
db.prepare(\`
  INSERT INTO articles (id, title, description, body_html, slug, published_at, cover_image)
  VALUES (?, ?, ?, ?, ?, ?, ?)
\`).run(
  9999,                          // id (must be unique)
  'My New Post Title',           // title
  'A short description',         // description
  '<p>Post body in HTML</p>',    // body_html
  'my-new-post-title',           // slug (used in URL: /blog/post/<slug>/)
  '2025-01-15T10:00:00Z',        // published_at (ISO 8601)
  null                           // cover_image (URL or null)
);
db.close();
console.log('Post created with status: unpublished');
"
```

> The post now exists in the database but is **not visible on the website** because its status is `unpublished`.

### Step 2 — Add tags (optional)

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db');
const articleId = 9999; // same id used above
const tags = ['javascript', 'gatsby', 'tutorial'];
const insert = db.prepare('INSERT INTO tags (article_id, name) VALUES (?, ?)');
tags.forEach(tag => insert.run(articleId, tag));
db.close();
console.log('Tags added:', tags.join(', '));
"
```

---

## Editing an Unpublished Post

Only `unpublished` posts can be edited. Attempting to edit a `published` post is not allowed — you must enforce this rule manually or use the helper below.

### Edit fields of an unpublished post

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db');
const slug = 'my-new-post-title';

// Safety check: refuse to edit published posts
const post = db.prepare('SELECT status FROM articles WHERE slug = ?').get(slug);
if (!post) { console.error('Post not found'); process.exit(1); }
if (post.status === 'published') { console.error('Cannot edit a published post (read-only)'); process.exit(1); }

db.prepare(\`
  UPDATE articles
  SET title = ?, description = ?, body_html = ?, published_at = ?
  WHERE slug = ? AND status = 'unpublished'
\`).run(
  'Updated Title',
  'Updated description',
  '<p>Updated HTML body</p>',
  '2025-01-20T10:00:00Z',
  slug
);
db.close();
console.log('Post updated.');
"
```

### Edit tags of an unpublished post

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db');
const slug = 'my-new-post-title';

const post = db.prepare('SELECT id, status FROM articles WHERE slug = ?').get(slug);
if (!post) { console.error('Post not found'); process.exit(1); }
if (post.status === 'published') { console.error('Cannot edit a published post (read-only)'); process.exit(1); }

// Clear old tags and insert new ones
db.prepare('DELETE FROM tags WHERE article_id = ?').run(post.id);
const newTags = ['javascript', 'web'];
const insert = db.prepare('INSERT INTO tags (article_id, name) VALUES (?, ?)');
newTags.forEach(tag => insert.run(post.id, tag));
db.close();
console.log('Tags updated:', newTags.join(', '));
"
```

---

## Publishing a Post

Publishing makes a post **visible on the website** and **permanently read-only**.

> ⚠️ This action is **irreversible** — there is no "unpublish" operation.

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db');
const slug = 'my-new-post-title';

const result = db.prepare(\`
  UPDATE articles SET status = 'published'
  WHERE slug = ? AND status = 'unpublished'
\`).run(slug);

db.close();
if (result.changes === 0) {
  console.log('No post updated — it may already be published or the slug is wrong.');
} else {
  console.log('Post published! Rebuild the site to see it live:');
  console.log('  npm run build');
}
"
```

After publishing, **rebuild the site** so Gatsby picks up the new post:

```bash
npm run build
# or during development:
npm run develop
```

---

## Deleting a Post

Only `unpublished` posts can be deleted.

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db');
db.pragma('foreign_keys = ON');
const slug = 'my-new-post-title';

// Safety check: refuse to delete published posts
const post = db.prepare('SELECT status FROM articles WHERE slug = ?').get(slug);
if (!post) { console.error('Post not found'); process.exit(1); }
if (post.status === 'published') { console.error('Cannot delete a published post (read-only)'); process.exit(1); }

db.prepare('DELETE FROM articles WHERE slug = ? AND status = \"unpublished\"').run(slug);
db.close();
console.log('Post deleted.');
"
```

> Tags are automatically deleted via `ON DELETE CASCADE` in the schema.

---

## Listing Posts

### List all posts with their status

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db', {readonly: true});
const posts = db.prepare('SELECT id, slug, status, published_at FROM articles ORDER BY published_at DESC').all();
console.table(posts);
db.close();
"
```

### List only unpublished posts

```bash
node -e "
const db = require('better-sqlite3')('./src/data/posts.db', {readonly: true});
const posts = db.prepare('SELECT id, slug, title FROM articles WHERE status = \"unpublished\"').all();
console.table(posts);
db.close();
"
```

---

## Database Schema Reference

```sql
-- articles table
id            INTEGER  PRIMARY KEY
title         TEXT     NOT NULL
description   TEXT
body_html     TEXT
slug          TEXT     UNIQUE NOT NULL  ← used in URL /blog/post/<slug>/
published_at  TEXT                      ← ISO 8601 e.g. "2025-01-15T10:00:00Z"
cover_image   TEXT                      ← URL or null
status        TEXT     DEFAULT 'unpublished'
                       CHECK (status IN ('published', 'unpublished'))

-- tags table
id            INTEGER  PRIMARY KEY AUTOINCREMENT
article_id    INTEGER  REFERENCES articles(id) ON DELETE CASCADE
name          TEXT     NOT NULL
```

---

## Quick Reference

| Task | Command |
|---|---|
| Populate DB from Dev.to | `npm run db:migrate` |
| Add status column to existing DB | `npm run db:add-status` |
| Build site from local DB | `npm run build` |
| Dev server | `npm run develop` |
