// PR preview builds are served from a subdirectory of the site
// (https://thiagocolen.github.io/pr-preview/pr-N/), so asset and link URLs
// need that prefix. The PR preview workflow sets PATH_PREFIX and builds with
// `gatsby build --prefix-paths`; production builds leave it empty and serve
// from the domain root, where Gatsby ignores pathPrefix entirely.
//
// PATH_PREFIX must NOT start with a slash. Gatsby validates pathPrefix as a
// relative-only URI and then prepends the leading slash itself, so a value
// like "/pr-preview/pr-1" fails with 'must be a valid relative uri'. Pass
// "pr-preview/pr-1" and Gatsby resolves it to "/pr-preview/pr-1".
const pathPrefix = process.env.PATH_PREFIX || "";

module.exports = {
  pathPrefix,
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
                a.status,
                GROUP_CONCAT(t.name, ',') AS tags_raw
              FROM articles a
              LEFT JOIN tags t ON t.article_id = a.id
              WHERE a.status = 'published'
              GROUP BY a.id
              ORDER BY a.published_at DESC
            `,
            idCol: "id",
            fitType: "Article",
          },
        ],
      },
    },
  ],
};
