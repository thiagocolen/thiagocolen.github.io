import React, { useEffect, useState } from "react";
import axios from "axios";
import { navigate } from "gatsby";
import { ArrowCircleRightIcon } from "@heroicons/react/solid";
import { songsSnippets } from "../utils/constants";
import poster0 from "../assets/webm-posters/poster-0.webm";
import poster1 from "../assets/webm-posters/poster-1.webm";
import poster2 from "../assets/webm-posters/poster-2.webm";
import poster3 from "../assets/webm-posters/poster-3.webm";
import poster4 from "../assets/webm-posters/poster-4.webm";
import poster5 from "../assets/webm-posters/poster-5.webm";

const HomePage = ({ pageContext }) => {

  // TODO: a random image from unsplash is coming into pageContext,
  // what shall we do with it?
  console.log("@@@ pageContext", pageContext);

  // --------------------------------------------- zen message

  // TODO: reference to improve zen message -> https://freefrontend.com/css-3d-text-effects/
  // and take this of here and put in a exclusive new component

  // TODO: Shall we load another zenMessage on changePoster event?

  const [gitHubZenMessage, setGitHubZenMessage] = useState("loading...");
  const [gitHubZenErrorMessage, setGitHubZenErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: apiResponse } = await axios.get(
          "https://api.github.com/zen"
        );
        setGitHubZenMessage(apiResponse);
        setGitHubZenErrorMessage("");
      } catch (error) {
        setGitHubZenMessage("Always push your limits.");
        setGitHubZenErrorMessage(
          `[status error ${error.response.status}]: ${error.response.data.message}`
        );
      }
    };
    fetchData();
  }, [gitHubZenMessage, gitHubZenErrorMessage]);

  const textStyle = {
    textShadow:
      "0px 0px 0 rgb(-85,-85,-85)," +
      "0px 1px 0 rgb(-170,-170,-170)," +
      "0px 2px 0 rgb(-255,-255,-255)," +
      "0px 3px 0 rgb(-340,-340,-340)," +
      "0px 4px 3px rgba(0,0,0,0)," +
      "0px 4px 1px rgba(0,0,0,0.5)," +
      "0px 0px 3px rgba(0,0,0,.2)",
  };

  const ZenMessageComponent = () => {
    return (
      <div
        className="
        fixed z-40 left-1/2 top-1/2
        container text-center px-5
        transform -translate-x-1/2 -translate-y-1/2
        text-4xl font-bold text-white select-none uppercase"
        style={textStyle}
      >
        {gitHubZenMessage}
        <div className="text-xs lowercase font-thin px-5">
          {gitHubZenErrorMessage}
        </div>
      </div>
    );
  };

  // --------------------------------------------- poster

  const fullscreenBgContainer = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    zIndex: -100,
  };

  const fullscreenBgVideo = {
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  const getRandomPoster = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    switch (randomNumber) {
      case 1:
        return poster1;
      case 2:
        return poster2;
      case 3:
        return poster3;
      case 4:
        return poster4;
      case 5:
        return poster5;
      default:
        return poster0;
    }
  };

  const getVideoSourceTag = () => {
    return (
      <video
        key={Math.random()}
        style={fullscreenBgVideo}
        autoPlay
        loop
        muted
        playsinline
      >
        <source src={getRandomPoster()} type="video/webm" />
      </video>
    );
  };

  const [selectedPoster, setSelectedPoster] = useState(getVideoSourceTag());

  const changePoster = () => {
    setSelectedPoster(getVideoSourceTag());
  };

  const PosterComponent = () => {
    return <div style={fullscreenBgContainer}>{selectedPoster}</div>;
  };

  // --------------------------------------------- song sentence

  // TODO: we have a shadow problem with tailwindcss
  // let's go analise this
  
  const miniTextSize = {
    fontSize: "10px",
    textShadow: "2px 2px #000000",
  };

  const getSongSentence = () => {
    const randomSelection = Math.floor(Math.random() * songsSnippets.length);
    return songsSnippets[randomSelection];
  };

  const SentenceComponent = () => {
    return (
      <div
        className="
        absolute z-40 left-5 top-3
        transform origin-top-left rotate-90
        text-center text-white italic opacity-70 shadow 
        whitespace-nowrap select-none tracking-widest"
        style={miniTextSize}
      >
        {getSongSentence()}
      </div>
    );
  };

  // --------------------------------------------- filter component

  const getRandomColor = () => {
    const coolColor = [
      "bg-red-900",
      "bg-orange-900",
      "bg-amber-900",
      "bg-yellow-900",
      "bg-lime-900",
      "bg-green-900",
      "bg-emerald-900",
      "bg-teal-900",
      "bg-cyan-900",
      "bg-sky-900",
      "bg-blue-900",
      "bg-indigo-900",
      "bg-violet-900",
      "bg-purple-900",
      "bg-fuchsia-900",
      "bg-pink-900",
      "bg-rose-900",
    ];
    const randomNumber = Math.floor(Math.random() * coolColor.length);
    console.log("@@@ coolColor[randomNumber]", coolColor[randomNumber]);
    return coolColor[randomNumber];
  };

  const FilterComponent = () => {
    return (
      <div
        className={`fixed top-0 left-0 z-30 
          w-screen h-screen object-cover
          ${getRandomColor()} opacity-70 mix-blend-multiply`}
        onClick={changePoster}
      ></div>
    );
  };

  // --------------------------------------------- arrow component

  // TODO: shall we animate (bounce) this arrow?
  // https://tailwindcss.com/docs/animation

  const ArrowComponent = () => {
    return (
      <ArrowCircleRightIcon
        className="
        fixed z-50 right-10 bottom-10
        h-14 w-14 
        text-white hover:text-red-700 cursor-pointer"
        onClick={goToPage}
      />
    );
  };

  // ---------------------------------------------

  const goToPage = () => {
    navigate("/blog");
  };

  // ---------------------------------------------
 
  return (
    <React.Fragment>
      <ArrowComponent />
      <SentenceComponent />
      <ZenMessageComponent />
      <FilterComponent />
      <PosterComponent />
    </React.Fragment>
  );
};

export default HomePage;
