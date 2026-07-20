import React from "react";
import { MDXProvider } from "@mdx-js/react";
import Callout from "./components/callout";
import { assetUrl } from "./utils/assetUrl";

// Post bodies reference local images root-relative ("/images/foo.png").
// Routing every <img> through assetUrl makes those survive a pathPrefix build
// (PR previews) while leaving the remote dev.to/Cloudinary URLs in the
// existing posts untouched.
const MdxImage = ({ src, alt, ...rest }) => (
  <img {...rest} src={assetUrl(src)} alt={alt || ""} />
);

// Anything listed here is usable in a post body with no import statement.
const components = {
  Callout,
  img: MdxImage,
};

// Lives in src/ rather than the repo root so it is unambiguously covered by
// Gatsby's babel pipeline (JSX + ESM). Referenced from both gatsby-browser.js
// and gatsby-ssr.js — a provider registered in only one of them renders
// correctly in the browser and wrongly in the SSR'd HTML.
//
// gatsby-plugin-mdx-embed already installs its own MdxEmbedProvider via
// wrapRootElement. @mdx-js/react v1 merges a nested provider's components with
// the parent's, so the embed shortcodes (CodePen, YouTube, Tweet) keep working
// alongside these.
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
);
