import React from "react";
// import ReactHtmlParser from "react-html-parser";
import { Link } from "gatsby";

// TODO: remove old unused lybraries from package.json

const PostPage = ({ pageContext: { article } }) => {
  console.log("### PostPage article:", article);

  // const fixedHtml = article.body_html.replaceAll("viewbox", "viewBox");

  return (
    <div className="container mx-auto pt-20">
      <h1 className="text-white text-xs">Post Page</h1>
      <hr />
      <Link className="text-white text-xs" to="/blog/">
        back to blog page
      </Link>
      <hr />
      <div className="text-white text-lg">
        <br />
        <h2>{article.title}</h2>
        <br />
        <h6>{article.published_at}</h6>
        <br />
        <div dangerouslySetInnerHTML={{ __html: article.body_html }} />
      </div>
    </div>
  );
};

export default PostPage;
