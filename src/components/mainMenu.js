import React from "react";
import { Link } from "gatsby";
import Logo from "./logo";

const MainMenu = (props) => {
  const randomBgClass = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    return `bg-texture-red-${randomNumber}`;
  };

  const activePageClass = (item) => {
    if (props.activePage === item) {
      return "text-my-theme-1";
    } else {
      return "text-my-theme-3 hover:text-my-theme-1";
    }
  };

  return (
    <>
      <nav
        className={`${randomBgClass()} bg-texture-red-1 p-6 text-white text-xl font-bold shadow-inner border-b-2 border-my-theme-2 border-opacity-50`}
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
