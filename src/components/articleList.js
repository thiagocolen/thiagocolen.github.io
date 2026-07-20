import React, { useState } from "react";
import { Link } from "gatsby";
import { datePipe } from "../utils/datePipe";
import { assetUrl } from "../utils/assetUrl";

const ArticleComponent = ({ article, index }) => {
  return (
    <li 
      className="flex flex-col bg-white border-2 border-black rounded shadow-md hover:shadow-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-sm transition-all duration-200 overflow-hidden animate-fade-in-up opacity-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <Link to={`/blog/post/${article.slug}`} className="flex flex-col h-full">
        {/* Cover Image */}
        {article.cover_image && (
          <div 
            className="w-full h-44 bg-cover bg-center border-b-2 border-black"
            style={{ backgroundImage: `url(${assetUrl(article.cover_image)})` }}
          />
        )}
        
        {/* Card Body */}
        <div className="p-5 flex-grow flex flex-col justify-between text-black">
          <div>
            {/* Metadata (Draft badge + Date) */}
            <div className="flex items-center gap-2 mb-3">
              {article.status !== "published" && (
                <span className="inline-block border border-black bg-amber-400 text-black text-xs font-semibold px-2 py-0.5 rounded">
                  DRAFT
                </span>
              )}
              {article.published_at && (
                <div className="inline-block border border-black bg-accent text-black text-xs font-semibold px-2 py-0.5 rounded">
                  {datePipe(article.published_at)}
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="font-head text-lg sm:text-xl leading-tight mb-2 hover:underline">
              {article.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-black/70 font-sans leading-relaxed line-clamp-3 mb-4">
              {article.description}
            </p>
          </div>

          {/* Button Link */}
          <div className="flex justify-end">
            <span className="font-head text-xs bg-primary text-black border-2 border-black rounded px-3 py-1.5 shadow-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
              READ ARTICLE →
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
};

const ArticleList = ({ articles }) => {
  const [selectedTag, setSelectedTag] = useState(null);

  // Extract unique tags from articles
  const allTags = articles.reduce((acc, article) => {
    if (article.tags) {
      article.tags.forEach((tag) => {
        const normalizedTag = tag.trim().toLowerCase();
        if (normalizedTag && !acc.includes(normalizedTag)) {
          acc.push(normalizedTag);
        }
      });
    }
    return acc;
  }, []);

  // Filter articles based on selected tag
  const filteredArticles = selectedTag
    ? articles.filter(
        (article) =>
          article.tags &&
          article.tags.some((t) => t.trim().toLowerCase() === selectedTag)
      )
    : articles;

  return (
    <section className="mt-12 select-none">
      <h2 
        className="font-head text-3xl sm:text-4xl text-white mb-6 border-b-4 border-white pb-2 inline-block"
        style={{ filter: "drop-shadow(2px 2px 0px #000000)" }}
      >
        LATEST ARTICLES
      </h2>

      {/* Tag Filtering System */}
      {allTags.length > 0 && (
        <div className="mb-10 bg-white border-2 border-black rounded shadow-md p-4 sm:p-5">
          <div className="font-head text-xs tracking-wider text-black/60 mb-3 uppercase">
            🏷️ Filter Articles By Tag:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* "ALL" Button */}
            <button
              onClick={() => setSelectedTag(null)}
              className={`font-head text-xs border-2 border-black rounded px-3.5 py-1.5 transition-all duration-100 shadow-xs cursor-pointer select-none ${
                selectedTag === null
                  ? "bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]"
                  : "bg-white text-black hover:bg-primary hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
              }`}
            >
              ALL POSTS ({articles.length})
            </button>

            {/* Individual Tag Buttons */}
            {allTags.map((tag) => {
              const count = articles.filter(
                (a) => a.tags && a.tags.some((t) => t.trim().toLowerCase() === tag)
              ).length;

              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`font-head text-xs border-2 border-black rounded px-3.5 py-1.5 transition-all duration-100 shadow-xs cursor-pointer select-none uppercase ${
                    selectedTag === tag
                      ? "bg-black text-white shadow-none translate-x-[1px] translate-y-[1px]"
                      : "bg-white text-black hover:bg-primary hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                  }`}
                >
                  #{tag} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid container with standard auto-fill layouts for responsiveness */}
      {filteredArticles.length > 0 ? (
        <ul key={selectedTag || 'all'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => (
            <ArticleComponent key={article.id} article={article} index={index} />
          ))}
        </ul>
      ) : (
        <div key="empty" className="bg-white border-2 border-black rounded shadow-md p-10 text-center font-head text-lg text-black/60 animate-fade-in-up opacity-0">
          No articles found for tag #{selectedTag}
        </div>
      )}
    </section>
  );
};

export default ArticleList;
