import React from "react";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { ShareIcon, CheckIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";
import Footer from "../components/footer";
import Container from "../components/container";
import Poster from "../components/poster";
import { datePipe } from "../utils/datePipe";
import { assetUrl } from "../utils/assetUrl";

// Reader preferences. Index 1 is the design default baked into fix.css; the
// other two step down and up from it. Class names are written out in full
// (never `article-size-${n}`) so Tailwind's plain-text purge scan can see them.
const FONT_SIZES = [
  { className: "article-size-s", label: "Small", glyph: "text-tiny" },
  { className: "article-size-m", label: "Medium", glyph: "text-xs" },
  { className: "article-size-l", label: "Large", glyph: "text-sm" },
];

const LINE_HEIGHTS = [
  { className: "article-leading-s", label: "Tight", gap: "1px" },
  { className: "article-leading-m", label: "Normal", gap: "2px" },
  { className: "article-leading-l", label: "Loose", gap: "3px" },
];

const STORAGE_KEYS = {
  fontSize: "articleFontSize",
  lineHeight: "articleLineHeight",
  theme: "articleTheme",
};

// Matches the poster/glitch buttons in Poster's fixed row so the whole strip
// reads as one control cluster.
const CONTROL_BUTTON =
  "border-2 border-black rounded w-control h-control flex items-center justify-center shadow-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-xs transition-all duration-150 cursor-pointer select-none";

// Three stacked bars whose spacing tracks the current setting — the control
// shows what it does, which no icon in the set manages.
const LineHeightGlyph = ({ gap }) => (
  <span className="flex flex-col w-3" style={{ rowGap: gap }}>
    <span className="block h-px w-full bg-current" />
    <span className="block h-px w-full bg-current" />
    <span className="block h-px w-full bg-current" />
  </span>
);

const ShareButton = () => {
  const [copied, setCopied] = React.useState(false);

  // navigator.clipboard is undefined on insecure origins (plain-http LAN
  // previews), so fall back to the old execCommand dance rather than
  // throwing and leaving the button looking dead.
  const copyUrl = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopied(true);
    } catch (error) {
      setCopied(false);
    }
  };

  React.useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={copyUrl}
      aria-label="Copy article link to clipboard"
      title={copied ? "Link copied to clipboard" : "Copy article link to clipboard"}
      className={`${CONTROL_BUTTON} ${copied ? "bg-accent text-black" : "bg-white text-black"}`}
    >
      {copied ? <CheckIcon className="w-3 h-3" /> : <ShareIcon className="w-3 h-3" />}
    </button>
  );
};

// The reading controls live in Poster's fixed row but drive classes on the
// article boxes, so the state sits in PostPage and arrives here as props.
const ReaderControls = ({
  fontSize,
  onCycleFontSize,
  lineHeight,
  onCycleLineHeight,
  isDark,
  onToggleTheme,
}) => (
  <>
    <ShareButton />

    <button
      type="button"
      onClick={onCycleFontSize}
      aria-label={`Text size: ${FONT_SIZES[fontSize].label}. Click to cycle.`}
      title={`Text size: ${FONT_SIZES[fontSize].label}`}
      className={`${CONTROL_BUTTON} bg-white text-black font-head leading-none`}
    >
      <span className={FONT_SIZES[fontSize].glyph}>A</span>
    </button>

    <button
      type="button"
      onClick={onCycleLineHeight}
      aria-label={`Line spacing: ${LINE_HEIGHTS[lineHeight].label}. Click to cycle.`}
      title={`Line spacing: ${LINE_HEIGHTS[lineHeight].label}`}
      className={`${CONTROL_BUTTON} bg-white text-black`}
    >
      <LineHeightGlyph gap={LINE_HEIGHTS[lineHeight].gap} />
    </button>

    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={isDark ? "Switch article to light theme" : "Switch article to dark theme"}
      title={isDark ? "Article theme: dark" : "Article theme: light"}
      className={`${CONTROL_BUTTON} ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {isDark ? <SunIcon className="w-3 h-3" /> : <MoonIcon className="w-3 h-3" />}
    </button>
  </>
);

// Declared at module scope rather than inside PostPage: PostPage now re-renders
// on every reader-control click, and a component type re-created each render is
// a different type to React — the whole box would unmount and remount,
// re-fetching the cover image on every click.
const ArticleTitle = ({ article, boxClass }) => (
  <div
    className={`article-box ${boxClass} border-2 border-black rounded shadow-lg max-w-2xl mx-auto mt-8 sm:mt-12 p-6 sm:p-8 z-10 relative select-none animate-float-instant`}
  >
    <h1
      className={`font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-center leading-tight ${
        article.headline ? "mb-3" : "mb-4"
      }`}
    >
      {article.title}
    </h1>
    {/* text-opacity-*, not text-black/60: this project is Tailwind 2
        without JIT, where slash-opacity utilities generate no CSS. */}
    {article.headline && (
      <p className="article-headline font-domine font-bold text-base sm:text-lg text-center leading-snug mb-4 text-black text-opacity-60">
        {article.headline}
      </p>
    )}
    {article.cover_image && (
      <img
        src={assetUrl(article.cover_image)}
        alt={article.title}
        className="w-full border-2 border-black rounded mb-4"
      />
    )}
    <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-domine font-bold">
      {article.status !== "published" && (
        <span className="bg-amber-400 bg-opacity-70 border border-black border-opacity-20 rounded px-2.5 py-0.5 text-black">
          DRAFT
        </span>
      )}
      {article.published_at && (
        <span className="bg-primary bg-opacity-20 border border-black border-opacity-20 rounded px-2.5 py-0.5">
          Published: {datePipe(article.published_at)}
        </span>
      )}
    </div>
  </div>
);

const ArticleTags = ({ article }) => (
  <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl mx-auto select-none">
    {article.tags &&
      article.tags.map((tag) => (
        <span
          key={tag}
          className="border-2 border-black bg-accent text-black text-xs font-domine font-bold px-2.5 py-1 rounded shadow-xs"
        >
          #{tag}
        </span>
      ))}
  </div>
);

const PostPage = ({ pageContext: { article }, data }) => {
  const [fontSize, setFontSize] = React.useState(1);
  const [lineHeight, setLineHeight] = React.useState(1);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fromPost", "true");
    }
  }, []);

  // Stored preferences are read after mount, not in the useState initializer:
  // the server renders the defaults, so seeding state from localStorage would
  // make the first client render disagree with the SSR'd HTML.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // Read as a string and index-check before converting: `Number(null)` is 0,
    // so a missing key would otherwise look like a stored "Small".
    const readIndex = (key, options) => {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      const index = Number(raw);
      return options[index] ? index : null;
    };

    const storedFontSize = readIndex(STORAGE_KEYS.fontSize, FONT_SIZES);
    const storedLineHeight = readIndex(STORAGE_KEYS.lineHeight, LINE_HEIGHTS);
    if (storedFontSize !== null) setFontSize(storedFontSize);
    if (storedLineHeight !== null) setLineHeight(storedLineHeight);
    setIsDark(localStorage.getItem(STORAGE_KEYS.theme) === "dark");
  }, []);

  const persist = (key, value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, String(value));
    }
  };

  const cycleFontSize = () => {
    const next = (fontSize + 1) % FONT_SIZES.length;
    setFontSize(next);
    persist(STORAGE_KEYS.fontSize, next);
  };

  const cycleLineHeight = () => {
    const next = (lineHeight + 1) % LINE_HEIGHTS.length;
    setLineHeight(next);
    persist(STORAGE_KEYS.lineHeight, next);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    persist(STORAGE_KEYS.theme, next ? "dark" : "light");
  };

  const boxClass = isDark ? "article-dark" : "bg-white text-black";

  return (
    <>
      <Poster
        colorOpacity={0.8}
        extraControls={
          <ReaderControls
            fontSize={fontSize}
            onCycleFontSize={cycleFontSize}
            lineHeight={lineHeight}
            onCycleLineHeight={cycleLineHeight}
            isDark={isDark}
            onToggleTheme={toggleTheme}
          />
        }
      />
      <Container className="bg-transparent">
        <ArticleTitle article={article} boxClass={boxClass} />
        <ArticleTags article={article} />

        {/* Main Article Content Container */}
        {/* Full-bleed on mobile: -mx-6 cancels the px-6 that Container puts on
            its inner wrapper, so the box meets both screen edges and no page
            background shows beside it. The side borders, rounding and the hard
            shadow come off with it — a 4px offset shadow at the viewport edge
            would also push a horizontal scrollbar. sm: restores all of it. */}
        <article
          className={`article-box ${boxClass} max-w-3xl -mx-6 sm:mx-auto px-10 sm:px-20 md:px-28 py-12 border-2 border-l-0 border-r-0 sm:border-l-2 sm:border-r-2 border-black rounded-none sm:rounded shadow-none sm:shadow-md mt-12`}
        >
          <div
            className={`article-content ${FONT_SIZES[fontSize].className} ${LINE_HEIGHTS[lineHeight].className}`}
          >
            <MDXRenderer>{data.mdx.body}</MDXRenderer>
          </div>
        </article>

        {/* Back Link Component */}
        <div className="max-w-3xl mx-auto px-4 mt-8 flex justify-start select-none">
          <Link
            to="/"
            state={{ fromPost: true }}
            className="font-head text-sm bg-white text-black border-2 border-black rounded px-4 py-2 shadow-md hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all inline-flex items-center space-x-2"
          >
            <span>← BACK TO ARTICLES</span>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default PostPage;

export const query = graphql`
  query PostPageQuery($id: String!) {
    mdx(id: { eq: $id }) {
      body
    }
  }
`;
