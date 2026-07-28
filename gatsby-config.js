// gatsby-config.js runs before Gatsby's own webpack/dotenv step, so
// .env.<NODE_ENV> isn't in process.env yet at this point unless loaded here
// explicitly. (Vars are still picked up automatically later, inside actual
// page/component code, via Gatsby's built-in GATSBY_-prefixed client-bundle
// injection — this require only covers config files like this one.)
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

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

// The canonical origin. Every SEO tag is built from this, never from
// window.location, so the URL a crawler is told about is the same whether the
// page was server-rendered, hydrated, or built for a PR preview.
const siteUrl = "https://thiagocolen.github.io";

// Truthy only in PR preview builds, which share the production domain
// (thiagocolen.github.io/pr-preview/pr-N/) and would otherwise be indexed
// as duplicates of the real site (see isPreview below) or tracked as if
// they were real traffic (see the gtag plugin condition below).
const isPreview = Boolean(pathPrefix);

// See GA4-Guide.md for how to obtain this and where it's configured
// per environment. Unset locally/in CI (.env.production is gitignored and
// PR preview builds never receive it), so GA4 is opt-in: the site builds
// and deploys fine with no tracking until this is provided.
const gaMeasurementId = process.env.GA4_MEASUREMENT_ID;

module.exports = {
  pathPrefix,
  siteMetadata: {
    siteUrl,
    // pathPrefix is repeated here because siteMetadata is what reaches the
    // browser bundle (via GraphQL); process.env.PATH_PREFIX is build-time only
    // and would be undefined during hydration, desyncing the rendered tags.
    pathPrefix,
    isPreview,
    title: "Thiago Colen",
    titleTemplate: "%s — Thiago Colen",
    description:
      "Thiago Colen — AI Engineer building agentic systems (LangGraph, Retrieval-Augmented Generation, Anthropic Claude) and software/front-end architecture. Also writes essays on algorithms, system design, and cellular automata.",
    author: "Thiago Colen",
    // Fallback share image for pages that have no cover of their own (home,
    // about). Reuses an existing post cover rather than a dedicated OG asset.
    defaultImage: "/images/conway-s-game-of-life-explained.jpg",
    social: {
      github: "https://github.com/thiagocolen",
      linkedin: "https://www.linkedin.com/in/thiagocolen/",
      devto: "https://dev.to/thiagocolen",
    },
  },
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        // /homepage/ is a superseded splash variant of /, and the 404 is not a
        // real destination — listing either invites duplicate-content and
        // soft-404 warnings in Search Console. /about/ is a stub and carries a
        // matching noindex in aboutPage.js; submitting a URL you also tell
        // crawlers to ignore is a contradiction Search Console reports. Drop
        // it from both places once the page has real content.
        // `excludes`, not `exclude` — renamed in gatsby-plugin-sitemap v4.
        excludes: [
          "/homepage/",
          "/about/",
          "/404/",
          "/404.html",
          "/dev-404-page/",
        ],
      },
    },
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
    // Only registered when a real Measurement ID is present and this isn't a
    // PR preview build, so `gatsby develop`, CI preview builds, and a fresh
    // clone with no .env.production all run analytics-free with no extra
    // flag needed. See GA4-Guide.md.
    ...(gaMeasurementId && !isPreview
      ? [
          {
            resolve: "gatsby-plugin-google-gtag",
            options: {
              trackingIds: [gaMeasurementId],
              gtagConfig: {
                anonymize_ip: true,
              },
              pluginConfig: {
                head: true,
                respectDNT: true,
              },
            },
          },
        ]
      : []),
  ],
};
