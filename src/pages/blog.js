import * as React from "react";
import { Link, graphql } from "gatsby";
// import { MDXRenderer } from 'gatsby-plugin-mdx'

const BlogPage = ({ data }) => {
  console.log("data", data);

  // const nodesBodies = useStaticQuery(graphql`
  //   query nodesBodies {
  //     allMdx(sort: { order: DESC, fields: frontmatter___date }) {
  //       nodes {
  //         frontmatter {
  //           title
  //           date(formatString: "MMMM D, YYYY")
  //         }
  //         body
  //       }
  //     }
  //   }
  // `);

  // console.log("nodesBodies", nodesBodies);

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
