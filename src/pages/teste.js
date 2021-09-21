import React from "react";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";

const ComponentName = ({ data }) => {
  return <MDXRenderer>{data.allMdx.nodes[0].body}</MDXRenderer>;
};

export const query = graphql`
  {
    allMdx(
      filter: {
        slug: { eq: "Gatsby-course-or-Next-ed9776efbd6142fab9baf3cec1e5c87e" }
      }
    ) {
      nodes {
        slug
        body
      }
    }
  }
`;

export default ComponentName;
