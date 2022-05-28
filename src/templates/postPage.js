import React from "react";
import { Link } from "gatsby";
import MainMenu from "../components/mainMenu";
import Footer from "../components/footer";
import Container from "../components/container";
import { datePipe } from "../utils/datePipe";
import { ArrowCircleLeftIcon } from "@heroicons/react/solid";
import { CalendarIcon } from "@heroicons/react/solid";

// TODO: remove old unused lybraries from package.json

// TODO: make padding of this page more responsive, on mobile this is suck

// TODO: let's find a better imagens to this articles

const PostPage = ({ pageContext: { article } }) => {
  const ArrowComponent = () => {
    return (
      <Link to={`/blog/`}>
        <ArrowCircleLeftIcon
          className="arrowAnimationLeftBounce h-12 w-12 
        hover:text-red-600"
        />
      </Link>
    );
  };

  const TitleComponent = () => {
    const style = {
      border: "solid 1px black",
      transform: "translate(4px, -4px)",
      boxShadow: "15px 15px 0px black",
    };

    return (
      <div className="bg-white w-96 mx-auto -mt-40 p-4" style={style}>
        <h1 className="text-3xl font-semibold mb-6 mt-6 text-center">
          {article.title}
        </h1>
        <div className="text-sm float-right mx-auto">
          <CalendarIcon className="float-left h-5 w-5 mr-2"></CalendarIcon>
          {datePipe(article.published_at)}
        </div>
        <div className="clear-both"></div>
      </div>
    );
  };

  const BannerComponent = () => {
    const style = {
      backgroundImage: `url(${article.cover_image})`,
      backgroundPosition: "center",
      backgroundSize: "100%",
    };
    return (
      <>
        <div className="h-16 border-b-1"></div>
        <div className="h-72" style={style}></div>
      </>
    );
  };

  const TagsComponent = () => {
    const tags = [];
    article.tags.forEach((item) => {
      tags.push(
        <div className="p-2 bg-white border-1 float-right mr-2">{item}</div>
      );
    });

    return (
      <>
        <div className="mt-20">{tags}</div>
        <div className="clear-both"></div>
      </>
    );
  };

  return (
    <>
      <MainMenu activePage="blog" />
      <BannerComponent />
      <Container>
        <TitleComponent />
        <TagsComponent />
        <div
          className="text-justify my-10"
          dangerouslySetInnerHTML={{ __html: article.body_html }}
        />
        <div className="clear-both"></div>
        <ArrowComponent />
      </Container>
      <Footer />
    </>
  );
};

export default PostPage;
