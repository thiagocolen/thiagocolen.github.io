const axios = require("axios");

// TODO: put apiKeys in environment variables
// TODO: Is possible divide this file on multiple others?

// -----------------------------------------------------

const devToApiKey = "f6H6umciRnCNzuYUSRcE4eQY";
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

const unsplayAccessKey =
  "7bb44829ebfb671742ab6f123c6581e0eca237754773b58d64940a82c82065f9";

const getUnsplashRandomImage = async () =>
  await axios.get(
    `https://api.unsplash.com/photos/random/?client_id=${unsplayAccessKey}`
  );

// -----------------------------------------------------

exports.createPages = async ({ actions: { createPage } }) => {
  const {
    data: {
      urls: { regular: randomBgImage },
    },
  } = await getUnsplashRandomImage();
  
  createPage({
    path: `/`,
    component: require.resolve("./src/templates/homePage.js"),
    context: { randomBgImage },
  });

  const articlesList = await getDevToData();

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
};
