import React from "react";
import { Link } from "gatsby";

const MainMenu = (props) => {
  const activePageClass = (item) => {
    if (props.activePage === item) {
      return "bg-black text-white shadow-none translate-y-0.5 translate-x-0.5";
    }
    return "bg-white text-black hover:bg-primary hover:shadow-xs active:shadow-none active:translate-y-0.5 active:translate-x-0.5";
  };

  return (
    <nav className="fixed z-50 top-0 left-0 right-0 h-16 bg-white border-b-2 border-black select-none">
      <div className="container mx-auto h-full px-6 sm:px-16 md:px-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link 
          to="/" 
          className="font-head text-lg sm:text-xl tracking-tight border-2 border-black bg-primary px-3 py-1 shadow-sm hover:shadow-none active:shadow-none active:translate-y-0.5 active:translate-x-0.5 transition-all"
        >
          THIAGO COLEN
        </Link>

        {/* Menu Links */}
        <ul className="flex items-center space-x-4 font-head text-sm">
          <li>
            <Link 
              to="/" 
              className={`inline-block border-2 border-black rounded px-3 py-1 shadow-sm transition-all ${activePageClass("home")}`}
            >
              HOME
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default MainMenu;
