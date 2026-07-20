import "./src/styles/global.css"
import "./src/styles/fix.css"

// Makes <Callout> and the pathPrefix-aware <img> available in MDX post bodies.
// Must stay in sync with the same export in gatsby-ssr.js.
export { wrapRootElement } from "./src/wrapRootElement";

// Smoothly animate scroll to the top on every page navigation
export const onRouteUpdate = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
};

// Prevent Gatsby's own scroll handling so it doesn't fight the smooth animation
export const shouldUpdateScroll = () => false;