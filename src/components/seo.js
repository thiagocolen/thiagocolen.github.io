import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

// Every page's <head> metadata, in one place.
//
// This project is on Gatsby 3, which predates the built-in Head API (added in
// 4.19), so react-helmet is the mechanism. gatsby-plugin-react-helmet flushes
// whatever Helmet collects into the static HTML at build time, which is what
// crawlers and social scrapers actually read — they do not run the hydration
// bundle, so a tag that only appears client-side is a tag that does not exist
// as far as SEO is concerned.
//
// Callers pass `path`, the page's canonical route ("/blog/post/foo/"), rather
// than letting the component read window.location. Under a PR preview build
// the real location carries a /pr-preview/pr-N prefix, and deriving canonical
// from it would point every preview at itself instead of at production.

const IS_ABSOLUTE = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

const Seo = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  publishedAt,
  tags,
  noindex = false,
  schema,
}) => {
  const { site } = useStaticQuery(graphql`
    query SeoMetadataQuery {
      site {
        siteMetadata {
          siteUrl
          pathPrefix
          isPreview
          title
          titleTemplate
          description
          author
          defaultImage
          social {
            github
            linkedin
            devto
          }
        }
      }
    }
  `);

  const meta = site.siteMetadata;

  // Trailing slash matters: Gatsby emits /blog/post/foo/ and a canonical of
  // /blog/post/foo would name a URL that redirects, splitting the signal.
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  const canonical = `${meta.siteUrl}${normalizedPath}`;

  // Canonical always points at production, but og:image has to resolve where
  // the page is actually being served, or preview cards break. Hence the
  // prefix here and not above.
  const assetBase = meta.pathPrefix
    ? `${meta.siteUrl}/${meta.pathPrefix}`
    : meta.siteUrl;

  const toAbsolute = (src) =>
    !src ? null : IS_ABSOLUTE.test(src) ? src : `${assetBase}${src}`;

  const pageTitle = title || meta.title;
  // The template would render "Thiago Colen — Thiago Colen" on the home page.
  const fullTitle =
    title && meta.titleTemplate
      ? meta.titleTemplate.replace("%s", title)
      : pageTitle;

  const pageDescription = description || meta.description;
  const socialImage = toAbsolute(image || meta.defaultImage);
  const isNoindex = noindex || meta.isPreview;

  // A post is a BlogPosting; anything else falls back to whatever the caller
  // supplied. `schema` accepts one object or an array of them.
  const structuredData =
    schema ||
    (type === "article"
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: pageTitle,
          description: pageDescription,
          ...(socialImage ? { image: socialImage } : {}),
          ...(publishedAt ? { datePublished: publishedAt } : {}),
          ...(tags && tags.length ? { keywords: tags.join(", ") } : {}),
          author: { "@type": "Person", name: meta.author },
          publisher: { "@type": "Person", name: meta.author },
          mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
          url: canonical,
        }
      : null);

  // BreadcrumbList: replaces the raw URL in the SERP with a trail. Skipped on
  // the home page (it IS the root, nothing to trail from) and on noindexed
  // pages (drafts, /about/) — Google won't act on it there, so emitting it
  // would just be dead weight in the HTML.
  const breadcrumbs = (() => {
    if (normalizedPath === "/" || isNoindex) return null;

    const segments = normalizedPath.split("/").filter(Boolean);
    const crumbs = [{ name: "Home", path: "/" }];

    if (segments[0] === "blog") {
      crumbs.push({ name: "Blog", path: "/blog/" });
      // segments[1] === "post": the slug segment isn't a real breadcrumb
      // level, so the post's own title stands in for it.
      if (segments[1] === "post") {
        crumbs.push({ name: pageTitle, path: normalizedPath });
      }
    }

    return crumbs.length > 1 ? crumbs : null;
  })();

  const breadcrumbSchema = breadcrumbs && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${meta.siteUrl}${crumb.path}`,
    })),
  };

  const schemaList = [
    ...(!structuredData ? [] : Array.isArray(structuredData) ? structuredData : [structuredData]),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      <meta name="author" content={meta.author} />

      {/* Preview builds live on the production domain, so without this Google
          would index /pr-preview/pr-N/ copies of every page. */}
      {isNoindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      {/* Open Graph — Facebook, LinkedIn, Slack, WhatsApp */}
      <meta property="og:site_name" content={meta.title} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      {socialImage && <meta property="og:image" content={socialImage} />}
      {socialImage && <meta property="og:image:alt" content={pageTitle} />}

      {type === "article" && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === "article" && <meta property="article:author" content={meta.author} />}
      {type === "article" &&
        tags &&
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

      {/* Twitter/X. No handle to claim, so summary_large_image plus the shared
          OG values is all that resolves — twitter:site would need an account. */}
      <meta
        name="twitter:card"
        content={socialImage ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={pageDescription} />
      {socialImage && <meta name="twitter:image" content={socialImage} />}

      {schemaList.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
