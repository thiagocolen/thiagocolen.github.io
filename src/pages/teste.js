import React from "react";
import { graphql } from "gatsby";

const ComponentName = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 4)}</pre>;
};

export const query = graphql`
  {
    allMdx(sort: { order: DESC, fields: frontmatter___date }) {
      nodes {
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
        }
        body
      }
    }
  }
`;

export default ComponentName;
