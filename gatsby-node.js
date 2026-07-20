// Gatsby infers the GraphQL schema from the frontmatter that posts actually
// use, so an optional field no post has set yet does not exist on the type and
// querying it fails the build. `headline` is exactly that case: the MCP server
// can write it and postPage.js renders it, but no published post carries one.
// Declaring the frontmatter explicitly keeps the schema stable no matter which
// optional fields the current set of posts happens to use.
exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  createTypes(`
    type MdxFrontmatter {
      title: String
      headline: String
      description: String
      published_at: Date @dateformat
      cover_image: String
      status: String
      tags: [String]
    }
  `);
};

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  const isDevelopEnv = process.env.NODE_ENV === "development";

  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          frontmatter {
            title
            headline
            description
            published_at
            cover_image
            status
            tags
          }
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw result.errors;
  }

  // In `gatsby develop` (NODE_ENV=development), unpublished drafts are
  // included too, so they can be previewed locally. `gatsby build`
  // (production deploys and CI/PR previews both run this) keeps excluding
  // them.
  const articlesList = result.data.allMdx.nodes
    .map((node) => ({
      id: node.id,
      slug: node.parent.name,
      ...node.frontmatter,
    }))
    .filter((article) => isDevelopEnv || article.status === "published")
    // published_at DESC; drafts (no published_at) sort last.
    .sort((a, b) => {
      if (!a.published_at) return 1;
      if (!b.published_at) return -1;
      return new Date(b.published_at) - new Date(a.published_at);
    });

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
      context: { article, id: article.id },
    });
  });

  createPage({
    path: `/about/`,
    component: require.resolve("./src/templates/aboutPage.js"),
    context: {},
  });
};
