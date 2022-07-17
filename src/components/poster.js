import React, { useState, useEffect } from "react";
import ZenMessage from "./zenMessage";
import { ArrowCircleDownIcon } from "@heroicons/react/solid";
import poster0 from "../assets/webm-posters/poster-0.webm";
import poster1 from "../assets/webm-posters/poster-1.webm";
import poster2 from "../assets/webm-posters/poster-2.webm";
import poster3 from "../assets/webm-posters/poster-3.webm";
import poster4 from "../assets/webm-posters/poster-4.webm";
import poster5 from "../assets/webm-posters/poster-5.webm";

const Poster = ({ posterType, color }) => {
  // --------------------------------------------- filter

  const FilterComponent = () => {
    return (
      <div
        className={`absolute top-0 left-0 z-30 
            object-cover w-full
            ${color} opacity-70 mix-blend-multiply`}
        style={{ height: "90vh" }}
        onClick={changePoster}
      ></div>
    );
  };

  // ---------------------------------------------

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

  const topBgVideo = {
    width: "100vw",
    height: "90vh",
    objectFit: "cover",
    position: "relative",
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
    const selectedStyle = () => {
      if (posterType === "full") {
        return fullscreenBgVideo;
      }

      if (posterType === "top") {
        return topBgVideo;
      }
    };

    return (
      <video
        key={Math.random()}
        style={selectedStyle()}
        autoPlay
        loop
        muted
        playsinline
      >
        <source src={getRandomPoster()} type="video/webm" />
      </video>
    );
  };

  // ---------------------------------------------

  const [selectedPoster, setSelectedPoster] = useState(getVideoSourceTag());

  const changePoster = () => {
    setSelectedPoster(getVideoSourceTag());
  };

  // ---------------------------------------------

  const SelectPosterType = () => {
    if (posterType === "full") {
      return (
        <>
          <FilterComponent />
          <div style={fullscreenBgContainer}>{selectedPoster}</div>;
        </>
      );
    }
    if (posterType === "top") {
      return (
        <>
          <ZenMessage />
          <FilterComponent />
          <div className="border-b-2 border-black">{selectedPoster}</div>
          {/* <ArrowCircleDownIcon
            className="animate-bounce
            w-20 h-20 -mt-36 mx-auto
            text-white"
          ></ArrowCircleDownIcon> */}
        </>
      );
    }
  };

  return <SelectPosterType />;
};

export default Poster;
