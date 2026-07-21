import { withPrefix } from "gatsby";

// Absolute URL (https:, data:, mailto:) or protocol-relative (//cdn...).
const IS_ABSOLUTE = /^([a-z][a-z0-9+.-]*:|\/\/)/i;

// Resolves an image reference that may be either remote or local.
//
// Local assets are committed under static/ and referenced root-relative
// ("/images/foo.png"). PR previews build with a pathPrefix
// ("/pr-preview/pr-N/", see gatsby-config.js), so a root-relative path 404s
// there unless it goes through withPrefix — and that is precisely where a post
// gets reviewed before merge. Production has an empty prefix, so the bug is
// invisible everywhere except the one place it matters.
//
// Remote URLs must NOT be prefixed, and most existing posts use them
// (dev.to/Cloudinary), so the passthrough is the common case.
export const assetUrl = (src) => {
  if (!src) return src;

  return IS_ABSOLUTE.test(src) ? src : withPrefix(src);
};
