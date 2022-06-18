import React from "react";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";
import Logo from "../components/logo";
import ArticleList from "../components/articleList";

// TODO: design references
// https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/31dec0139215579.622b7213a3ce5.png
// https://www.codecademy.com/catalog

const BlogPage = ({ pageContext: { articlesList } }) => {

  return (
    <>
      <MainMenu activePage="blog" />
      <Container>
        <Logo />
        <ArticleList articles={articlesList} />
      </Container>
      <Footer />
    </>
  );
};

export default BlogPage;
