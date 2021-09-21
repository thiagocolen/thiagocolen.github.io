import * as React from "react";
import { Link, graphql } from "gatsby";

const BlogPage = ({ data }) => {

  return (
    <React.Fragment>
      <h1>blog page</h1>
      <hr />
      <Link to="/">Home</Link>
      <hr />
      <ul>
        {data.allFile.nodes.map((item) => {
          return (
            <Link key={item.id} to={item.name}>
              <li>{item.name}</li>
            </Link>
          );
        })}
      </ul>
    </React.Fragment>
  );
};

export const query = graphql`
  {
    allFile {
      nodes {
        name
        id
      }
    }
  }
`;

export default BlogPage;
