const axios = require("axios");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

// TODO: Is possible divide this file on multiple others?

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

const getDevToData = async () => {
  const { data: articlesList } = await getDevToArticlesMe();
  return await Promise.all(
    articlesList.map(async (articleItem) => {
      const { data } = await getDevToArticleByPath(articleItem.slug);
      return data;
    })
  );
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

  const articlesList = await getDevToData();

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
