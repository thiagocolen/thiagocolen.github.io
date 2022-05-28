import React from "react";
import { VariableIcon } from "@heroicons/react/solid";
import { QrcodeIcon } from "@heroicons/react/outline";
import { PuzzleIcon } from "@heroicons/react/outline";

const Logo = () => {
  const SelectedLogo = () => {
    const randomNumber = Math.floor(Math.random() * 3);

    if (randomNumber === 0) {
      return (
        <VariableIcon className="relative h-8 w-8 mt-4 text-black" />
      );
    } else if (randomNumber === 1) {
      return (
        <QrcodeIcon className="relative h-8 w-8 mt-4 text-black" />
      );
    } else {
      return (
        <PuzzleIcon className="relative h-8 w-8 mt-4 text-black" />
      );
    }
  };

  return <SelectedLogo></SelectedLogo>;
};

export default Logo;
