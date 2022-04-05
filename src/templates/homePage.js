import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import poster0 from "../assets/webm-posters/poster-0.webm";
import poster1 from "../assets/webm-posters/poster-1.webm";
import poster2 from "../assets/webm-posters/poster-2.webm";
import poster3 from "../assets/webm-posters/poster-3.webm";
import poster4 from "../assets/webm-posters/poster-4.webm";

const HomePage = ({ pageContext }) => {
  const [gitHubZenMessage, setGitHubZenMessage] = useState("loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: gitHubZenMessage } = await axios.get(
          "https://api.github.com/zen"
        );
        setGitHubZenMessage(gitHubZenMessage);
      } catch (error) {
        setGitHubZenMessage("Always push your limits.");
      }
    };
    fetchData();
  }, [gitHubZenMessage]);

  const selectedPoster = () => {
    const randomNumber = Math.floor(Math.random() * 4);
    switch (randomNumber) {
      case 1:
        return poster1;
      case 2:
        return poster2;
      case 3:
        return poster3;
      case 4:
        return poster4;
      default:
        return poster0;
    }
  };

  const fullscreenBgContainer = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    zIndex: -100,
  };

  const fullscreenBgVideo = {
    width: "100vw",
    height: "100vh",
    objectFit: "cover",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return (
    <React.Fragment>
      <div className="w-full font-sans" style={fullscreenBgContainer}>
        <div className="container h-screen mx-auto text-center">
          <Link to={`/blog`}>
            <div className="my-40 text-4xl font-bold text-my-theme-5 mix-blend-color-dodge">
              {gitHubZenMessage}
            </div>
          </Link>
        </div>

        <video style={fullscreenBgVideo} autoPlay loop muted playsinline>
          <source src={selectedPoster()} type="video/webm" />
        </video>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
