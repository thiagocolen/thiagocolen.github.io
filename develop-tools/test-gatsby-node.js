// -----------------------------------------------------
// This is a place to test the logic of gatsby-node file 
// without run gatsby develop command
// -----------------------------------------------------

const axios = require("axios");
require("dotenv").config();

// -----------------------------------------------------

const getGitHubZenMessage = async () => {
  return await axios.get("https://api.github.com/zen");
};

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

const unsplayAccessKey = process.env.UNSPLASH_ACCESS_KEY;

const getUnsplashRandomImage = async () =>
  await axios.get(
    `https://api.unsplash.com/photos/random/?client_id=${unsplayAccessKey}`
  );

// -----------------------------------------------------

const init = async () => {
  const {
    data: {
      urls: { regular: randomBgImage },
    },
  } = await getUnsplashRandomImage();
  const allDevToData = await getDevToData();
  const gitHubZenMessage = await getGitHubZenMessage();
  debugger;
};

init();
