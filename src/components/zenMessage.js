import React, { useEffect, useState } from "react";
import axios from "axios";

// TODO: reference to improve zen message -> https://freefrontend.com/css-3d-text-effects/
// and take this of here and put in a exclusive new component

// TODO: Shall we load another zenMessage on changePoster event?

const ZenMessage = () => {
  const [gitHubZenMessage, setGitHubZenMessage] = useState("loading...");
  const [gitHubZenErrorMessage, setGitHubZenErrorMessage] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: apiResponse } = await axios.get(
          "https://api.github.com/zen"
        );
        setGitHubZenMessage(apiResponse);
        setGitHubZenErrorMessage("");
      } catch (error) {
        setGitHubZenMessage("Always push your limits.");
        setGitHubZenErrorMessage(
          `[status error ${error.response.status}]: ${error.response.data.message}`
        );
      }
    };
    fetchData();
  }, [gitHubZenMessage, gitHubZenErrorMessage]);

  const textStyle = {
    textShadow:
      "0px 0px 0 rgb(-85,-85,-85)," +
      "0px 1px 0 rgb(-170,-170,-170)," +
      "0px 2px 0 rgb(-255,-255,-255)," +
      "0px 3px 0 rgb(-340,-340,-340)," +
      "0px 4px 3px rgba(0,0,0,0)," +
      "0px 4px 1px rgba(0,0,0,0.5)," +
      "0px 0px 3px rgba(0,0,0,.2)",
  };

  return (
    <div
      className="absolute z-10 
        top-1/2 left-1/4 mr-10
        p-4 sm:p-8
        bg-white border-2 border-black 
        select-none"
    >
      <div class="font-bold text-3xl sm:text-5xl md:text-6xl">
        {gitHubZenMessage}
      </div>
      <div className="lowercase select-none text-xs">
        {gitHubZenErrorMessage}
      </div>
    </div>
  );
};

export default ZenMessage;
