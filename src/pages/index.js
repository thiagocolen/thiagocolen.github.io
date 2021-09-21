import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link, useStaticQuery, graphql } from "gatsby";

const IndexPage = () => {
  const siteTitle = useStaticQuery(graphql`
    query siteTitle {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <React.Fragment>
      <h2>thiagocolen.github.io</h2>
      <p>site meta data - title: {siteTitle.site.siteMetadata.title}</p>

      <Link to="/blog">blog</Link>

      <StaticImage
        alt="just a some image"
        src="../images/marek-okon-3dE500L6jmc-unsplash.jpg"
      />
    </React.Fragment>
  );
};

export default IndexPage;
