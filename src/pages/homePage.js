import React from "react";
import { Link } from "gatsby";

const HomePage = ({ pageContext }) => {
  console.log("### HomePage pageContext:", pageContext);

  const bgImageStyle = {
    backgroundImage: "url(" + pageContext.randomBgImage + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "fixed",
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    zIndex: "-1",
  };

  return (
    <div>
      <Link to="/blog/">blog</Link>
      <div style={bgImageStyle}></div>
    </div>
  );
};

export default HomePage;
