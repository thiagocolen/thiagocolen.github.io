import React from "react";
import { Link } from "gatsby";
import Footer from "../components/footer";
import Container from "../components/container";
import Poster from "../components/poster";
import { datePipe } from "../utils/datePipe";

const PostPage = ({ pageContext: { article } }) => {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fromPost", "true");
    }
  }, []);

  const TitleComponent = () => {
    return (
      <div className="bg-white border-2 border-black rounded shadow-lg max-w-2xl mx-auto mt-8 sm:mt-12 p-6 sm:p-8 z-10 relative select-none animate-float-instant">
        <h1 className="font-head text-2xl sm:text-3xl md:text-4xl text-center leading-tight mb-4 text-black">
          {article.title}
        </h1>
        <div className="flex items-center justify-center text-xs sm:text-sm font-semibold text-black/60 font-sans">
          <span className="bg-primary/20 border border-black/20 rounded px-2.5 py-0.5">
            Published: {datePipe(article.published_at || article.created_at)}
          </span>
        </div>
      </div>
    );
  };

  const BannerComponent = () => {
    return (
      <div className="relative w-full h-[30vh] sm:h-[40vh] border-b-2 border-black overflow-hidden bg-accent/10">
        {article.cover_image ? (
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${article.cover_image})` }}
          />
        ) : (
          <div className="w-full h-full retro-grid" />
        )}
      </div>
    );
  };

  const TagsComponent = () => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl mx-auto select-none">
        {article.tags && article.tags.map((tag) => (
          <span 
            key={tag} 
            className="border-2 border-black bg-accent text-black text-xs font-semibold px-2.5 py-1 rounded shadow-xs"
          >
            #{tag}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <Poster colorOpacity={0.8} />
      <BannerComponent />
      <Container className="bg-transparent">
        <TitleComponent />
        <TagsComponent />
        
        {/* Main Article Content Container */}
        <article className="max-w-3xl mx-auto px-6 sm:px-8 py-12 bg-white border-2 border-black rounded shadow-md mt-12">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.body_html }}
          />
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
