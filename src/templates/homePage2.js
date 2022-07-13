import React, { useEffect, useState } from "react";
import Poster from "../components/poster";
import ArticleList from "../components/articleList";
import Container from "../components/container";
import Footer from "../components/footer";

const HomePage2 = ({ pageContext: { articlesList } }) => {
  return (
    <>
      <Poster posterType="top" />
      <Container>
        <ArticleList articles={articlesList} />
      </Container>
      <Footer />
    </>
  );
};

export default HomePage2;
