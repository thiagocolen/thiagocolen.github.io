import React from "react";
// import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";

const AboutPage = ({ pageContext }) => {
  console.log("### About pageContext:", pageContext);

  return (
    <>
      <MainMenu activePage="about" />
      <Container>
        <h1 className="text-my-theme-3 text-3xl mb-6">About</h1>
      </Container>
      <Footer />
    </>
  );
};

export default AboutPage;
