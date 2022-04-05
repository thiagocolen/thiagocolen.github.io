import React from "react";
import { Link } from "gatsby";
import Logo from "./logo";

const MainMenu = (props) => {
  console.log("### Menu Component props:", props);

  const randomBgClass = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    return `bg-texture-red-${randomNumber}`;
  };

  const activePageClass = (item) => {
    if (props.activePage === item) {
      return "underline hover:underline";
    } else {
      return "no-underline hover:underline";
    }
  };

  return (
    <>
      <nav
        className={`${randomBgClass()} bg-texture-red-1 p-12 text-white text-2xl shadow-inner border-b-4 border-my-theme-2 border-opacity-50`}
      >
        <ul className="flex flex-row-reverse">
          <li className="w-72 mt-8">
            <Link to="/about" className={activePageClass("about")}>
              ABOUT
            </Link>
          </li>
          <li className="w-72 mt-8">
            <Link to="/blog" className={activePageClass("blog")}>
              BLOG
            </Link>
          </li>
          <li className="w-72 mt-8">
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
