-- Schema for the local posts database (source of true)
-- This file is for reference only; the migration script creates the DB programmatically.

CREATE TABLE IF NOT EXISTS articles (
  id            INTEGER PRIMARY KEY,
  title         TEXT    NOT NULL,
  description   TEXT,
  body_html     TEXT,
  slug          TEXT    UNIQUE NOT NULL,
  published_at  TEXT,
  cover_image   TEXT
);

-- A post can have N tags (one row per article-tag pair)
CREATE TABLE IF NOT EXISTS tags (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id  INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL
);
