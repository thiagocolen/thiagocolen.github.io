import axios from "axios";
import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { ArrowCircleRightIcon } from "@heroicons/react/solid";
import poster0 from "../assets/webm-posters/poster-0.webm";
import poster1 from "../assets/webm-posters/poster-1.webm";
import poster2 from "../assets/webm-posters/poster-2.webm";
import poster3 from "../assets/webm-posters/poster-3.webm";
import poster4 from "../assets/webm-posters/poster-4.webm";
import poster5 from "../assets/webm-posters/poster-5.webm";
import { songsSnippets } from "../utils/constants";

// TODO: let's create some new posters with more careful
// https://photomosh.com/

const HomePage = ({ pageContext }) => {
  // --------------------------------------------- zen message

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
        setGitHubZenErrorMessage(`Error: ${error.response.status} - ${error.response.data.message}`);
      }
    };
    fetchData();
  }, [gitHubZenMessage, gitHubZenErrorMessage]);

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

  // --------------------------------------------- song sentence

  const miniTextSize = {
    fontSize: "10px"
  }

  const getSongSentence = () => {
    const randomSelection = Math.floor(Math.random() * songsSnippets.length);
    return songsSnippets[randomSelection];
  }
  
  // --------------------------------------------- 
  
  const goToPage = () => {
    navigate("/blog");
  };

  // --------------------------------------------- 

  // TODO: apaguei os temas/color, vai ter que procurar todo os my-theme que tem na aplicação e refazer

  return (
    <React.Fragment>
      <ArrowCircleRightIcon
        className="
        fixed z-50 right-10 bottom-10
        h-14 w-14 
        text-white hover:text-black cursor-pointer"
        onClick={goToPage}
      />
      <div
        className="
        absolute z-40 left-5 top-3
        transform origin-top-left rotate-90
        text-center text-white italic opacity-60 
        whitespace-nowrap select-none tracking-widest"
        style={miniTextSize}
      >
        {getSongSentence()}
      </div>
      <div
        className="
        fixed z-40 left-1/2 top-1/2
        container text-center px-3
        transform -translate-x-1/2 -translate-y-1/2
        text-2xl font-bold text-white select-none uppercase"
      >
        {gitHubZenMessage}
        <div className="text-xs lowercase font-thin px-5">
          {gitHubZenErrorMessage}
        </div>
      </div>

      <div
        className="
        fixed top-0 left-0 z-30 
        w-screen h-screen object-cover
        bg-black opacity-70"
        onClick={changePoster}
      ></div>
      <div style={fullscreenBgContainer}>{selectedPoster}</div>
    </React.Fragment>
  );
};

export default HomePage;
