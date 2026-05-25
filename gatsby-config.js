module.exports = {
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/, // See below to configure properly
        },
      },
    },
    {
      // Source: local SQLite database (source of true for posts)
      // Database lives at src/data/posts.db — excluded from git
      resolve: "gatsby-source-sqlite",
      options: {
        fileName: "./src/data/posts.db",
        queries: [
          {
            statement: `
              SELECT
                a.id,
                a.title,
                a.description,
                a.body_html,
                a.slug,
                a.published_at,
                a.cover_image,
                GROUP_CONCAT(t.name, ',') AS tags_raw
              FROM articles a
              LEFT JOIN tags t ON t.article_id = a.id
              GROUP BY a.id
            `,
            idCol: "id",
            fitType: "Article",
          },
        ],
      },
    },
  ],
};
