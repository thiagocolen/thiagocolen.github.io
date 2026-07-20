import React from "react";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Footer from "../components/footer";
import Container from "../components/container";
import Poster from "../components/poster";
import { datePipe } from "../utils/datePipe";
import { assetUrl } from "../utils/assetUrl";

const PostPage = ({ pageContext: { article }, data }) => {
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fromPost", "true");
    }
  }, []);

  const TitleComponent = () => {
    return (
      <div className="bg-white border-2 border-black rounded shadow-lg max-w-2xl mx-auto mt-8 sm:mt-12 p-6 sm:p-8 z-10 relative select-none animate-float-instant">
        <h1
          className={`font-head text-2xl sm:text-3xl md:text-4xl text-center leading-tight text-black ${
            article.headline ? "mb-2" : "mb-4"
          }`}
        >
          {article.title}
        </h1>
        {/* text-opacity-*, not text-black/60: this project is Tailwind 2
            without JIT, where slash-opacity utilities generate no CSS. */}
        {article.headline && (
          <p className="font-sans text-base sm:text-lg text-center leading-snug mb-4 text-black text-opacity-60">
            {article.headline}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-black/60 font-sans">
          {article.status !== "published" && (
            <span className="bg-amber-400/70 border border-black/20 rounded px-2.5 py-0.5 text-black">
              DRAFT
            </span>
          )}
          {article.published_at && (
            <span className="bg-primary/20 border border-black/20 rounded px-2.5 py-0.5">
              Published: {datePipe(article.published_at)}
            </span>
          )}
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
            style={{ backgroundImage: `url(${assetUrl(article.cover_image)})` }}
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
          <div className="article-content">
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
