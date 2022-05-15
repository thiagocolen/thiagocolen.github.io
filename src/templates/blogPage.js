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
  console.log("@@@ articlesList", articlesList);

  return (
    <>
      <MainMenu activePage="blog" />
      <Container>
        {/* 
        TODO: Can we get a list of tags from DEV.TO?
        <aside className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 float-left px-4">
          <h1 className="text-black text-3xl font-semibold mb-6">Tags</h1>
          <div className="bg-black shadow-md rounded-md p-6 mb-10">
            <p>asdasdads</p>
            <p>asdasdads</p>
            <p>asdasdads</p>
            <p>asdasdads</p>
          </div>
        </aside> */}

        <section className="md:w-full lg:w-2/3 float-left px-4">
          <h1 className="text-black text-2xl font-semibold mb-6">Articles</h1>

          <ul>
            {articlesList.map((article) => {
              return (
                <li key={article.id}>
                  <Link to={`/blog/post/${article.slug}`}>
                    <article className="articleDropShadow border-2 border-black mb-8 p-3">
                      <div className="relative float-left md:w-1/2 lg:w-full xl:w-1/2">
                        <div className="text-xs text-black">
                          {datePipe(article.created_at)}
                        </div>
                        <h2 className="text-lg font-bold">{article.title}</h2>
                        <p className="text-xs my-2">{article.description}</p>
                      </div>

                      <div className="relative float-left my-2 md:w-1/2 lg:w-full xl:w-1/2">
                        <img
                          src={article.cover_image}
                          alt="no important stuff"
                        />
                      </div>
                      <p className="float-right text-black text-xs font-bold">
                        + read more
                      </p>

                      <div className="clear-both"></div>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <div className="clear-both"></div>
      </Container>
      <Footer />
    </>
  );
};

export default BlogPage;
