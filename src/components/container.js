import React from "react";

const Container = (props) => {

  const randomBgClass = () => {
    const randomNumber = Math.floor(Math.random() * 5);
    return `bg-texture-black-${randomNumber}`;
  };

  return (
    <div className={`${randomBgClass()} pb-48`}>
      <div className="container mx-auto px-16 pt-10">{props.children}</div>
    </div>
  );
};

export default Container;
