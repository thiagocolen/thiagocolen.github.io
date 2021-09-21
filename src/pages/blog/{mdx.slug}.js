import * as React from "react";
import { Link, graphql } from "gatsby";
import { MDXRenderer } from 'gatsby-plugin-mdx'

const BlogPost = ({ data }) => {
  console.log(data);
  return (
    <React.Fragment>
      <h1>mdx.slug</h1>
      <Link to="/blog">votlar</Link>
      <hr/>
      <h2>{data.allMdx.nodes[0].slug}</h2>
      <MDXRenderer>
        {data.allMdx.nodes[0].body}
      </MDXRenderer>
    </React.Fragment>
  );
};

export const query = graphql`
  query ($slug: String) {
    allMdx(filter: { slug: { eq: $slug } }) {
      nodes {
        id
        slug
        body
      }
    }
  }
`;

export default BlogPost;
