const axios = require("axios");
const path = require("path");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// TODO: Is possible divide this file on multiple others?

// -----------------------------------------------------
// [LEGACY — Dev.to] Will be removed after local DB is verified
// -----------------------------------------------------

const devToApiKey = process.env.DEV_TO_API_KEY;
const devToUsername = "thiagocolen";

const getDevToArticlesMe = async () =>
  await axios.get("https://dev.to/api/articles/me", {
    headers: { "api-key": devToApiKey },
  });

const getDevToArticleByPath = async (slug) => {
  return await axios.get(
    `https://dev.to/api/articles/${devToUsername}/${slug}`,
    {
      headers: { "api-key": devToApiKey },
    }
  );
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getDevToData = async () => {
  const { data: articlesList } = await getDevToArticlesMe();
  const articles = [];

  for (const articleItem of articlesList) {
    let retries = 3;
    let fetched = false;

    while (retries > 0 && !fetched) {
      try {
        console.log(`Fetching article: ${articleItem.slug}`);
        const { data } = await getDevToArticleByPath(articleItem.slug);
        articles.push(data);
        fetched = true;
        // Add a small delay between requests to respect rate limits
        await delay(300);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.error(
            `Rate limit hit while fetching ${articleItem.slug}. Waiting 2s before retry... (${retries} retries left)`
          );
          await delay(2000);
          retries--;
        } else {
          console.error(
            `Failed to fetch article: ${articleItem.slug}`,
            error.message
          );
          break; // Don't retry for other errors
        }
      }
    }
  }
  return articles;
};

// -----------------------------------------------------
// [LOCAL SOURCE OF TRUE] SQLite database
// -----------------------------------------------------

const DB_PATH = path.resolve(__dirname, "./src/data/posts.db");

/**
 * Reads all articles (with their tags) from the local SQLite database.
 * Tags are stored in a separate table and joined as a comma-separated string;
 * this function normalises them back to an array to match the shape that all
 * templates expect from the previous Dev.to data source.
 *
 * @returns {Array} articles — same shape as Dev.to API response
 */
const getLocalData = () => {
  // Lazy-require so the build doesn't fail if better-sqlite3 isn't installed
  const Database = require("better-sqlite3");
  const db = new Database(DB_PATH, { readonly: true });

  const rows = db
    .prepare(
      `
      SELECT
        a.id,
        a.title,
        a.description,
        a.body_html,
        a.slug,
        a.published_at,
        a.cover_image,
        a.status,
        GROUP_CONCAT(t.name, ',') AS tags_raw
      FROM articles a
      LEFT JOIN tags t ON t.article_id = a.id
      -- Only serve published posts; unpublished are local drafts
      WHERE a.status = 'published'
      GROUP BY a.id
      ORDER BY a.published_at DESC
    `
    )
    .all();

  db.close();

  // Normalise: split tags_raw back to an array (or empty array if no tags)
  return rows.map((row) => ({
    ...row,
    tags: row.tags_raw ? row.tags_raw.split(",") : [],
    tags_raw: undefined,
  }));
};

// -----------------------------------------------------

// TODO: we don't using this, shall we remove?
const unsplayAccessKey = process.env.UNSPLASH_ACCESS_KEY;

const getUnsplashRandomImage = async () =>
  await axios.get(
    `https://api.unsplash.com/photos/random/?client_id=${unsplayAccessKey}`
  );

// -----------------------------------------------------

exports.createPages = async ({ actions: { createPage } }) => {

  // TODO: a random image from unsplash is coming into pageContext,
  // what shall we do with it?

  // const {
  //   data: {
  //     urls: { regular: randomBgImage },
  //   },
  // } = await getUnsplashRandomImage();

  // [LOCAL SOURCE OF TRUE] Read articles from local SQLite database
  const articlesList = getLocalData();

  createPage({
    path: `/`,
    component: require.resolve("./src/templates/homePage2.js"),
    context: { articlesList },
  });

  createPage({
    path: `/homepage/`,
    component: require.resolve("./src/templates/homePage.js"),
    context: {},
  });

  createPage({
    path: `/blog/`,
    component: require.resolve("./src/templates/blogPage.js"),
    context: { articlesList },
  });

  articlesList.forEach((article) => {
    createPage({
      path: `/blog/post/${article.slug}/`,
      component: require.resolve("./src/templates/postPage.js"),
      context: { article },
    });
  });

  createPage({
    path: `/about/`,
    component: require.resolve("./src/templates/aboutPage.js"),
    context: {},
  });
};
