import React, { useEffect, useState } from "react";
import Poster from "../components/poster";
import ArticleList from "../components/articleList";
import Container from "../components/container";
import Footer from "../components/footer";
import { getRandomColor } from '../utils/getRandomColor';

const HomePage2 = ({ pageContext: { articlesList } }) => {

  const selectedColor = getRandomColor();
  
  return (
    <>
      <Poster posterType="top" color={selectedColor} />
      <Container color={selectedColor}>
        <ArticleList articles={articlesList} />
      </Container>
      <Footer />
    </>
  );
};

export default HomePage2;
