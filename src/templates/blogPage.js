import React from "react";
import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";
import { datePipe } from "../utils/datePipe";

const BlogPage = ({ pageContext: { articlesList } }) => {
  console.log("@@@ articlesList", articlesList);
  return (
    <>
      <MainMenu activePage="blog" />
      <Container>
        {/* 
        TODO: Can we get a list of tags from DEV.TO?
        <aside className="w-full sm:w-full md:w-full lg:w-1/3 xl:w-1/3 float-left px-4">
          <h1 className="text-my-theme-3 text-3xl font-semibold mb-6">Tags</h1>
          <div className="bg-my-theme-3 shadow-md rounded-md p-6 mb-10">
            <p>asdasdads</p>
            <p>asdasdads</p>
            <p>asdasdads</p>
            <p>asdasdads</p>
          </div>
        </aside> */}

        <section className="md:w-full lg:w-2/3 float-left px-4">
          <h1 className="text-my-theme-3 text-3xl font-semibold mb-6">
            Articles
          </h1>

          <ul>
            {articlesList.map((article) => {
              return (
                <li key={article.id}>
                  <Link to={`/blog/post/${article.slug}`}>
                    <article className="p-4 mb-16 bg-my-theme-3 hover:bg-my-theme-2 shadow-md rounded-md">

                      <div className="relative float-left md:w-1/2 lg:w-full xl:w-1/2 mb-4">
                        <img
                          className="rounded-md"
                          src={article.cover_image}
                          alt="no important stuff"
                        />
                      </div>
                      <div className="relative float-left md:w-1/2 lg:w-full xl:w-1/2 px-6">
                        <h2 className="text-xl font-bold">{article.title}</h2>
                        <p className="text-xs text-my-theme-2">
                          {datePipe(article.created_at)}
                        </p>
                        <p className="text-sm mt-2">{article.description}</p>
                        <p className="float-right italic text-my-theme-5">
                          + read more
                        </p>
                      </div>

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
