import React from "react";
import Bug0 from "../assets/vector-bugs/bug-0.svg";
import Bug1 from "../assets/vector-bugs/bug-1.svg";
import Bug2 from "../assets/vector-bugs/bug-2.svg";
import Bug3 from "../assets/vector-bugs/bug-3.svg";
import Bug4 from "../assets/vector-bugs/bug-4.svg";
import Bug5 from "../assets/vector-bugs/bug-5.svg";
import Bug6 from "../assets/vector-bugs/bug-6.svg";
import Bug7 from "../assets/vector-bugs/bug-7.svg";

// TODO: this bug logo is a shit, let's make it again

const Logo = () => {
  const SelectedLogo = () => {
    const randomNumber = Math.floor(Math.random() * 8);

    const bugCollection = {
      0: Bug0,
      1: Bug1,
      2: Bug2,
      3: Bug3,
      4: Bug4,
      5: Bug5,
      6: Bug6,
      7: Bug7,
    };

    const Bug = bugCollection[randomNumber];

    return (
      <Bug className="w-20 h-20" />
    );
  };

  return <SelectedLogo />;
};

export default Logo;
