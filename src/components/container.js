import React, { useState, useEffect } from "react";

const Container = (props) => {

  return (
    <div className={`pb-48 ${props.color}`}>
      <div className="container mx-auto pt-14 px-10 sm:px-16 md:px-16">
        {props.children}
      </div>
    </div>
  );
};

export default Container;
