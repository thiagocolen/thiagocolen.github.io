import React from "react";
import { Link } from "gatsby";

const BlogPage = ({ pageContext }) => {
  console.log("### BlogPage pageContext:", pageContext);

  return (
    <div>
      <Link to="/blog/post/this-is-not-a-post-3e8p/">harcoded post</Link>
      <span>BlogPage</span>
    </div>
  );
};

export default BlogPage;
