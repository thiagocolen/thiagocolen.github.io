import React from "react";
import { Link } from "gatsby";
import Logo from "./logo";

const MainMenu = () => {
  console.log("### Menu Component");

  const randomBgClass = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    return `bg-texture-red-${randomNumber}`
  }

  return (
    <>
      <nav className={`${randomBgClass()} bg-texture-red-1 p-12 text-white text-2xl shadow-inner` } >
        <ul className="flex flex-row-reverse">
          <li className="w-72 mt-8">
            <Link to="/" className="no-underline hover:underline">
              ABOUT
            </Link>
          </li>
          <li className="w-72 mt-8">
            <Link to="/blog" className="underline">
              BLOG
            </Link>
          </li>
          <li className="w-72 mt-8">
            <Link to="/" className="no-underline hover:underline">
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
