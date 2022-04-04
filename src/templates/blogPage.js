import React from "react";
import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";

const BlogPage = ({ pageContext: { articlesList } }) => {
  console.log("### BlogPage articlesList:", articlesList);

  const datePipe = (stringDate) => {
    const date = new Date(stringDate);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const randomBgClass = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    return `bg-texture-black-${randomNumber}`
  }

  return (
    <>
      <MainMenu />
      <div className={`${randomBgClass()} h-screen` }>
        <div className="container mx-auto px-16 pt-10">
          <h1 className="text-my-theme-3 text-3xl mb-6">Articles</h1>
          <ul>
            {articlesList.map((article) => {
              return (
                <li key={article.id}>
                  <Link to={`/blog/post/${article.slug}`}>
                    <article className="p-4 my-8 bg-my-theme-3 hover:bg-my-theme-2 shadow-md rounded-md">
                      <div className="relative float-left w-1/2">
                        <img
                          className="rounded-md"
                          src={article.cover_image}
                          alt="no important stuff"
                        />
                      </div>
                      <div className="relative float-left w-1/2 px-6">
                        <h2 className="text-xl">{article.title}</h2>
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
