import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import { songsSnippets } from "../utils/constants";

const Footer = ({ hideBio = false, hideConnect = false }) => {
  const [song, setSong] = useState({ title: "", content: "" });

  useEffect(() => {
    const randomSelection = Math.floor(Math.random() * songsSnippets.length);
    const fullSentence = songsSnippets[randomSelection];
    
    // Slicing logic to ensure "short title, long content"
    const regex = /[\.\!\?\,]/g;
    let match;
    let splitIndex = -1;
    
    while ((match = regex.exec(fullSentence)) !== null) {
      const tempTitle = fullSentence.slice(0, match.index + 1).trim();
      const wordCount = tempTitle.split(/\s+/).length;
      // Target a short title (2 to 8 words) using punctuation
      if (wordCount >= 2 && wordCount <= 8) {
        splitIndex = match.index;
        break;
      }
    }
    
    // If no punctuation splits it between 2 and 8 words, check if the first punctuation splits it at <= 10 words
    if (splitIndex === -1) {
      const firstPunct = fullSentence.search(/[\.\!\?\,]/);
      if (firstPunct !== -1) {
        const tempTitle = fullSentence.slice(0, firstPunct + 1).trim();
        const wordCount = tempTitle.split(/\s+/).length;
        if (wordCount <= 10) {
          splitIndex = firstPunct;
        }
      }
    }
    
    // If punctuation gives a title longer than 10 words, or if there is no punctuation, split at the 4th word
    if (splitIndex === -1) {
      const words = fullSentence.split(/\s+/);
      const titleWords = words.slice(0, 4);
      const contentWords = words.slice(4);
      setSong({
        title: titleWords.join(" ") + "...",
        content: `"...${contentWords.join(" ")}"`
      });
    } else {
      const title = fullSentence.slice(0, splitIndex + 1).trim();
      const content = fullSentence.slice(splitIndex + 1).trim();
      setSong({
        title,
        content: content ? `"${content}"` : ""
      });
    }
  }, []);

  return (
    <footer className="bg-primary border-t-4 border-black select-none text-black py-12 px-6 sm:px-16 md:px-16 relative overflow-hidden">
      {/* Decorative background grid pattern or stripes */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_10px,transparent_10px,transparent_20px)]" />

      <div className="container mx-auto relative z-10">
        {/* Bio block: the site has no dedicated About page, so this is where
            crawlable, real bio text about Thiago lives — on every page,
            since Footer is shared across post/blog/home templates. Hidden on
            the About page itself (hideBio) — that page already is the bio,
            so repeating it in the footer would be redundant. */}
        {!hideBio && (
          <div className="mb-10">
            <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-md rounded max-w-3xl">
              <h2 className="font-head text-sm uppercase tracking-widest font-extrabold mb-2">
                Thiago Colen
              </h2>
              <p className="font-domine text-xs sm:text-sm uppercase tracking-wide font-bold text-black text-opacity-70 mb-3">
                AI Engineering, Agentic Systems (LangGraph, RAG) &amp; Anthropic Claude · Software &amp; Front-End Architecture
              </p>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-black">
                Experienced in leading technical initiatives across the full stack, from
                cloud-native infrastructure to user-facing frameworks, with a current emphasis on
                agentic systems, prompt engineering, and applied AI architecture on AWS.
              </p>
              <Link
                to="/about/"
                className="inline-block mt-4 font-head text-xs uppercase tracking-widest font-extrabold underline decoration-2 underline-offset-2 hover:text-primary-hover"
              >
                Read the full bio &rarr;
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Now Playing Music Console Box (Slices lyric into Short Title and Long Content) */}
          <div className={`${hideConnect ? "lg:col-span-12" : "lg:col-span-7"} w-full`}>
            <div className="bg-white border-4 border-black p-6 shadow-md relative rounded transform -rotate-1 hover:rotate-0 transition-transform duration-200">
              {song.title && (
                <div className="absolute -top-3.5 left-4 max-w-[85%] bg-black text-white px-2.5 py-1 text-[9px] font-head uppercase border-2 border-black tracking-widest leading-snug break-words">
                  🔊 {song.title}
                </div>
              )}
              <p className="font-sans italic font-semibold text-base sm:text-lg text-black m-0 pt-6 sm:pt-4 leading-relaxed">
                {song.content}
              </p>
            </div>
          </div>

          {/* Column 2: Brutalist Connect Dashboard (Visual Social Icons) */}
          {!hideConnect && (
          <div className="lg:col-span-5 w-full flex flex-col space-y-4 lg:items-end">
            <div className="font-head text-xs uppercase tracking-wider text-black font-extrabold flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 bg-black rounded-full" />
              <span>CONNECT CHANNELS</span>
            </div>

            {/* Row of visual brutalist square buttons containing SVGs */}
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a
                href="https://dev.to/thiagocolen"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-3 border-black bg-white hover:bg-black hover:text-white text-black rounded shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                aria-label="Dev.to"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 512 512">
                  <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35s5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58z" />
                </svg>
              </a>

              <a
                href="https://github.com/thiagocolen"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-3 border-black bg-white hover:bg-black hover:text-white text-black rounded shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 496 512">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
              </a>

              <a 
                href="https://www.linkedin.com/in/thiagocolen/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border-3 border-black bg-white hover:bg-black hover:text-white text-black rounded shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 448 512">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                </svg>
              </a>

              <a 
                href="mailto:thiago.souzacolen@gmail.com" 
                className="w-12 h-12 flex items-center justify-center border-3 border-black bg-white hover:bg-black hover:text-white text-black rounded shadow-xs hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                aria-label="Email"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
          )}

        </div>

        {/* Bottom Banner Row: Ticker strip centering the exact, unmodified copyright song lyric */}
        <div className="bg-black text-white border-3 border-black rounded shadow-md mt-10 p-4 sm:p-5 text-right select-none">
          <span className="font-sans text-xs sm:text-sm text-white/85 font-medium tracking-wide">
            Playing with a grin, singing gibberish in SP/Brazil © 2022 | thiagocolen.github.io
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
