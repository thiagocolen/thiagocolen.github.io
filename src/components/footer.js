import React from "react";
import SocialIcon from "./socialIcon";
import { songsSnippets } from "../utils/constants";

// TODO: responsiveness here is a shit

const Footer = () => {
  // ---------------------------------------------

  const getSongSentence = () => {
    const randomSelection = Math.floor(Math.random() * songsSnippets.length);
    return songsSnippets[randomSelection];
  };

  // ---------------------------------------------

  return (
    <footer className="bg-white border-t-1">
      <div className="flex">
        <div className="w-full pl-10 py-10 text-black italic">
          {getSongSentence()}
        </div>
        <div className="w-full flex flex-row-reverse pr-10 py-10">
          <SocialIcon link="https://dev.to/thiagocolen" socialMedia="dev.to" />
          <SocialIcon
            link="https://twitter.com/thiagocolen"
            socialMedia="Twitter"
          />
          <SocialIcon
            link="https://github.com/thiagocolen"
            socialMedia="Github"
          />
          <SocialIcon
            link="https://www.linkedin.com/in/thiagocolen/"
            socialMedia="LinkedIn"
          />
          <SocialIcon
            link="https://www.instagram.com/thiagocolen/"
            socialMedia="Instagram"
          />
          <SocialIcon
            link="mailto:thiago.souzacolen@gmail.com"
            socialMedia="Email"
          />
        </div>
      </div>
      <div className="flex flex-row-reverse mt-10 mx-10">
        <div className="w-full text-xs text-right py-6 border-t-1">
          Playing with a grin, singing gibberish in SP/Brazil © 2022 | thiagocolen.github.io
        </div>
      </div>
    </footer>
  );
};

export default Footer;
