import React from "react";
import GlobalGlitcher from "./globalGlitcher";

const Container = ({ children, className = "bg-background" }) => {
  return (
    <div className={`pb-48 min-h-screen relative z-20 ${className}`}>
      <GlobalGlitcher />
      <div className="container mx-auto pt-14 px-6 sm:px-16 md:px-16">
        {children}
      </div>
    </div>
  );
};

export default Container;
