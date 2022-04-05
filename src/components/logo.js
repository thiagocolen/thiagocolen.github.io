import React from "react";
import { VariableIcon } from "@heroicons/react/solid";
import { QrcodeIcon } from "@heroicons/react/outline";
import { PuzzleIcon } from "@heroicons/react/outline";

const Logo = () => {
  const SelectedLogo = () => {
    const randomNumber = Math.floor(Math.random() * 3);

    if (randomNumber === 0) {
      return (
        <VariableIcon className="absolute h-8 w-8 left-4 top-4 text-my-theme-1" />
      );
    } else if (randomNumber === 1) {
      return (
        <QrcodeIcon className="absolute h-8 w-8 left-4 top-4 text-my-theme-1" />
      );
    } else {
      return (
        <PuzzleIcon className="absolute h-8 w-8 left-4 top-4 text-my-theme-1" />
      );
    }
  };

  return (
    <div className="relative w-16 h-16 shadow-xl rounded-full bg-my-theme-3">
      <SelectedLogo></SelectedLogo>
    </div>
  );
};

export default Logo;
