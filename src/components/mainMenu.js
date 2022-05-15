import React from "react";
import { Link } from "gatsby";
import Logo from "./logo";

const MainMenu = (props) => {

  const activePageClass = (item) => {
    if (props.activePage === item) {
      return "text-black";
    } else {
      return "text-white hover:text-black";
    }
  };

  return (
    <>
      <nav
        className="bg-white border-b-2 border-black"
      >
        <ul className="flex flex-row-reverse">
          <li className="w-72 mt-6">
            <Link to="/about" className={activePageClass("about")}>
              ABOUT
            </Link>
          </li>
          <li className="w-72 mt-6">
            <Link to="/blog" className={activePageClass("blog")}>
              BLOG
            </Link>
          </li>
          <li className="w-72 mt-6">
            <Link to="/" className={activePageClass("home")}>
              HOME
            </Link>
          </li>
          <li className="shrink w-full"></li>
          <li>
            <Logo />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MainMenu;
