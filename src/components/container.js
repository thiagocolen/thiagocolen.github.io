import React from "react";

const Container = (props) => {

  const randomBgClass = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    return `bg-texture-black-${randomNumber}`;
  };

  return (
    <div className={`${randomBgClass()} pb-48`}>
      <div className="container mx-auto pt-10 px-4 md:px-16 lg:px-16 xl:px-16 ">{props.children}</div>
    </div>
  );
};

export default Container;
