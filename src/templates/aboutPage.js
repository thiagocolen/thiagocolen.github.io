import React from "react";
// import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";
import Seo from "../components/seo";

// TODO: What are we going to put here?

const AboutPage = ({ pageContext }) => {
  return (
    <>
      {/* noindex until this page has actual content — an empty page in the
          index is a quality signal working against the rest of the site. */}
      <Seo
        title="About"
        description="About Thiago Colen."
        path="/about/"
        noindex
      />
      <MainMenu activePage="about" />
      <Container>
        <h1 className="text-red-500 text-3xl font-semibold mb-6">About</h1>
      </Container>
      <Footer />
    </>
  );
};

export default AboutPage;
