import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import Logo from "./logo";

const MainMenu = (props) => {

  // --------------------------------------------------

  const activePageClass = (item) => {
    if (props.activePage === item) {
      return "underline";
    } else {
      return "";
    }
  };

  // --------------------------------------------------

  const [navClass, setNavClass] = useState("");

  const handleScroll = () => {
    if (window.pageYOffset === 0) {
      setNavClass("mainMenu");
    } else {
      setNavClass("mainMenuFilled");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // --------------------------------------------------

  // TODO: we need make a fucking ABOUT page, what we put in that?

  return (
    <>
      <nav className={`${navClass} fixed z-50 top-0 left-0 right-0 h-16 select-none`}>
        <ul className="
          flex flex-row-reverse container 
          px-10 sm:px-16 md:px-16
          mx-auto text-black font-bold">
          {/* <li className="w-72 mt-6 text-right">
            <Link to="/about" className={`${activePageClass("about")}`}>
              ABOUT
            </Link>
          </li> */}
          {/* <li className="w-52 mt-6 text-right">
            <Link to="/blog" className={`${activePageClass("blog")}`}>
              BLOG
            </Link>
          </li> */}
          <li className="w-52 mt-6 text-right">
            <Link to="/" className={`${activePageClass("home")}`}>
              HOME
            </Link>
          </li>
          <li className="shrink w-full"></li>
          <li>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MainMenu;
