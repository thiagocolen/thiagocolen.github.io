import * as React from "react";
import { StaticImage } from "gatsby-plugin-image";
import { Link, graphql } from "gatsby";

const IndexPage = ({data}) => {

  console.log('data', data);

  return (
    <React.Fragment>
      <h2>thiagocolen.github.io</h2>
      <p>site meta data - title: {data.site.siteMetadata.title}</p>

      <Link to="/blog">blog</Link>

      <StaticImage
        alt="just a some image"
        src="../images/marek-okon-3dE500L6jmc-unsplash.jpg"
      />
    </React.Fragment>
  );
};

export const query = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default IndexPage;
