import React, { useState, useEffect } from "react";

const Container = (props) => {

  return (
    <div className="pb-48">
      <div className="container mx-auto pt-14 px-16">{props.children}</div>
    </div>
  );
};

export default Container;
