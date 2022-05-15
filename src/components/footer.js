import React from "react";
import SocialIcon from "./socialIcon";

// sm	640px	@media (min-width: 640px) { ... }
// md	768px	@media (min-width: 768px) { ... }
// lg	1024px	@media (min-width: 1024px) { ... }
// xl	1280px	@media (min-width: 1280px) { ... }
// 2xl	1536px	@media (min-width: 1536px) { ... }

// TODO: responsiveness here is a shit

const Footer = () => {
  return (
    <footer className="border-t-4">
      <div className="flex pt-6">
        <div className="w-full pl-10 py-6 text-black italic">
          That's me on the back of the bus
          <br /> That's me in the cell
          <br /> That's me inside your head
        </div>
        <div className="w-full flex flex-row-reverse pr-10 py-6">
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
        <div className="w-1/2 text-xs text-right py-4">
          Playing with a grin, singing gibberish in SP/Brazil © 2022
        </div>
      </div>
    </footer>
  );
};

export default Footer;
