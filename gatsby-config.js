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
      // Source: posts live as MDX files under content/posts/, one per post.
      // Filename (minus extension) is the slug.
      resolve: "gatsby-source-filesystem",
      options: {
        name: "posts",
        path: `${__dirname}/content/posts`,
      },
    },
    // Must precede gatsby-plugin-mdx so MdxEmbedProvider wraps every .mdx
    // file automatically, making mdx-embed components available with no
    // manual imports in post content.
    "gatsby-plugin-mdx-embed",
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        extensions: [".mdx"],
      },
    },
  ],
};
