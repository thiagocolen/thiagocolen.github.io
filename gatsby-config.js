module.exports = {
  siteMetadata: {
    siteUrl: "https://thiagocolen.github.io",
    title: "Thiago Colen",
  },
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    `gatsby-plugin-mdx`,
    `gatsby-plugin-mdx-embed`
  ],
};
