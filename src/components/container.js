import React from "react";

const Container = (props) => {


  return (
    <div className="bg-amber-200 pb-48">
      <div className="container mx-auto pt-10 px-4 md:px-16 lg:px-16 xl:px-16 ">{props.children}</div>
    </div>
  );
};

export default Container;