import React from "react";
import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";
import { datePipe } from "../utils/datePipe";
import { ArrowCircleLeftIcon } from "@heroicons/react/solid";
import { CalendarIcon } from "@heroicons/react/solid";

// TODO: remove old unused lybraries from package.json

const PostPage = ({ pageContext: { article } }) => {
  console.log("@@@ article:", article);
  return (
    <>
      <MainMenu activePage="blog" />
      <Container>
        <Link
          className="text-black hover:text-white text-xl font-semibold"
          to={`/blog/`}
        >
          <ArrowCircleLeftIcon className="float-left h-8 w-8 mr-2" />
          <div className="float-left italic">voltar</div>
        </Link>
        <div className="clear-both"></div>
        <h1 className="text-black text-3xl font-semibold mb-6 mt-6 cursor-default">
          {article.title}
        </h1>
        <div className="text-black cursor-default">
          <h2 className="text-black text-sm text-right">
            <CalendarIcon className="float-right h-5 w-5 text-black ml-2"></CalendarIcon>
            {datePipe(article.published_at)}
          </h2>
          <div
            className="text-black text-base font-thin text-justify my-20"
            dangerouslySetInnerHTML={{ __html: article.body_html }}
          />
          <Link
            className="text-black hover:text-white text-xl font-semibold"
            to={`/blog/`}
          >
            <ArrowCircleLeftIcon className="float-left h-8 w-8 mr-2" />
            <div className="float-left italic">voltar</div>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default PostPage;
