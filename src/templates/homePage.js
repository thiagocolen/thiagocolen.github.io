import React, { useEffect, useState } from "react";
import { navigate } from "gatsby";
import { ArrowCircleRightIcon } from "@heroicons/react/solid";
import { songsSnippets } from "../utils/constants";
import Poster from "../components/poster";

const HomePage = ({ pageContext }) => {

  // --------------------------------------------- song sentence

  // TODO: we have a shadow problem with tailwindcss
  // let's go analise this

  const miniTextSize = {
    fontSize: "14px",
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
        absolute z-40 left-6 top-3
        transform origin-top-left rotate-90
        text-center text-white italic opacity-70 shadow 
        whitespace-nowrap tracking-widest"
        style={miniTextSize}
      >
        {getSongSentence()}
      </div>
    );
  };

  // --------------------------------------------- arrow component

  const ArrowComponent = () => {
    return (
      <ArrowCircleRightIcon
        className="
        fixed z-50 right-10 bottom-10
        h-14 w-14 
        arrowAnimationRightBounce
        text-white hover:text-gray-700 cursor-pointer"
        onClick={goToPage}
      />
    );
  };

  const goToPage = () => {
    navigate("/blog");
  };

  // ---------------------------------------------

  return (
    <React.Fragment>
      <ArrowComponent />
      <SentenceComponent />
      <Poster posterType="full" />
    </React.Fragment>
  );
};

export default HomePage;
