import React from "react";
import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";
import { datePipe } from "../utils/datePipe";

// TODO: design references
// https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/31dec0139215579.622b7213a3ce5.png
// https://www.codecademy.com/catalog

const BlogPage = ({ pageContext: { articlesList } }) => {

  const articlesList2 = [];
  articlesList.forEach((item) => {
    articlesList2.push(item);
  });

  // --------------------------------------------- article

  const ArticleComponent = ({ index, article }) => {
    const isBigBox = () => {
      if (index === 0) return;
      return index % 4 === 0 ? true : false;
    };

    const gridStyle = () => {
      return isBigBox() ? { gridRowEnd: "span 2" } : {};
    };

    const articleImageStyle = () => {
      const style = {
        backgroundImage: `url(${article.cover_image})`,
        backgroundPosition: "center",
      };
      const smallBox = { height: "85px", backgroundSize: "120%" };
      const bigBox = { height: "370px", backgroundSize: "370%" };

      return isBigBox() ? { ...style, ...bigBox } : { ...style, ...smallBox };
    };

    return (
      <li
        key={article.id}
        style={gridStyle()}
        className="overflow-hidden border-1 articleDropShadow articleGridItem p-3"
      >
        <Link to={`/blog/post/${article.slug}`}>
          <article>
            <div className="relative float-left">
              <div className="text-xs text-black">
                {datePipe(article.created_at)}
              </div>
              <h2 className="text-lg font-bold">{article.title}</h2>
              <div className={`text-xs my-2 overflow-hidden`}>
                {article.description}
              </div>
            </div>
            <div
              className="relative float-left my-2 w-full"
              style={articleImageStyle()}
            ></div>
            <p className="float-right text-black text-xs font-bold">
              + read more
            </p>
            <div className="clear-both"></div>
          </article>
        </Link>
      </li>
    );
  };

  // ---------------------------------------------

  return (
    <>
      <MainMenu activePage="blog" />
      <Container>
        <section>
          <h1 className="text-black text-2xl font-semibold mb-6 mt-16">Articles</h1>

          <ul className="articleGridContainer">
            {articlesList2.map((article, index) => {
              return <ArticleComponent index={index} article={article} />;
            })}
          </ul>
        </section>
      </Container>
      <Footer />
    </>
  );
};

export default BlogPage;
