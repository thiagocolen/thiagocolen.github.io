import React from "react";
import SocialIcon from "./socialIcon";

const Footer = () => {
  return (
    <>
      <footer className="bg-my-theme-3 h-64 shadow-footer border-t-4 border-opacity-50 border-my-theme-1">
        <div className="flex pt-6">
          <div className="w-1/2 px-10 py-6 text-my-theme-2 italic">
            That's me on the back of the bus
            <br /> That's me in the cell
            <br /> That's me inside your head
          </div>
          <div className="w-1/2 flex flex-row-reverse px-10 py-6">
            <SocialIcon
              link="https://dev.to/thiagocolen"
              socialMedia="dev.to"
            />
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
        <div className="flex flex-row-reverse mt-10 mx-10 border-t-2 border-my-theme-2">
          <div className="w-1/2 text-xs text-right py-4">
            Playing with a grin, singing gibberish in SP/Brazil © 2022
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
