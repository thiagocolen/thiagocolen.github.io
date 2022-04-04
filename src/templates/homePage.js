import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import myVideo from "../images/thiagocolen-1.webm";

const HomePage = ({ pageContext }) => {
  console.log("### HomePage pageContext:", pageContext);

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

  // const bgImageStyle = {
  //   backgroundImage: "url(" + pageContext.randomBgImage + ")",
  //   backgroundRepeat: "no-repeat",
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  //   position: "fixed",
  //   left: "0",
  //   right: "0",
  //   top: "0",
  //   bottom: "0",
  //   zIndex: "-1",
  // };

  const fullscreenBgContainer = {
    // backgrounColor: "green",
    // position: "relative",
    // width: "100%",
    // height: "100%",
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    zIndex: -100,
  };

  const fullscreenBgVideo = {
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: -1,
  };

  // https://www.magicpattern.design/tools/css-backgrounds
  // const bgPattern = {
  //   backgroundColor: "#e5e5f7",
  //   opacity: 0.3,
  //   background:
  //     "linear-gradient(135deg, #80040455 25%, transparent 25%) -36px 0/ 72px 72px, linear-gradient(225deg, #800404 25%, transparent 25%) -36px 0/ 72px 72px, linear-gradient(315deg, #80040455 25%, transparent 25%) 0px 0/ 72px 72px, linear-gradient(45deg, #800404 25%, #e5e5f7 25%) 0px 0/ 72px 72px",
  // };

  // const fullscreenBgContainer = {
  //   position: "fixed",
  //   top: 0,
  //   right: 0,
  //   bottom: 0,
  //   left: 0,
  //   overflow: "hidden",
  //   zIndex: -100,
  // };

  // const fullscreenBgVideo = {
  //   position: "absolute",
  //   width: "100%",
  //   heigth: "100%",
  //   top: 0,
  //   left: 0,
  // };

  return (
    <React.Fragment>
      <div className="w-full font-sans" style={fullscreenBgContainer}>
        <div className="container mx-auto text-center">
          <Link to={`/blog`}>
            <h1 className="text-6xl my-72 text-white font-black">
              {gitHubZenMessage}
            </h1>
          </Link>
        </div>

        <video style={fullscreenBgVideo} autoPlay loop muted>
          <source src={myVideo} type="video/webm" />
        </video>
      </div>
      {/* <div className="w-full font-mono text-black" style={bgPattern}>
        <div className="container mx-auto">
          <Link to="/blog/">blog</Link>
          <br />
          Now our video element has the width and height of the viewport (our
          browser window). This is a problem because in most cases our video
          element aspect ratio will be different than our video source aspect
          ratio (in this case 16:9). Now our video element has the width and
          height of the viewport (our browser window). This is a problem because
          in most cases our video element aspect ratio will be different than
          our video source aspect ratio (in this case 16:9). Now our video
          element has the width and height of the viewport (our browser window).
          This is a problem because in most cases our video element aspect ratio
          will be different than our video source aspect ratio (in this case
          16:9). Now our video element has the width and height of the viewport
          (our browser window). This is a problem because in most cases our
          video element aspect ratio will be different than our video source
          aspect ratio (in this case 16:9). Now our video element has the width
          and height of the viewport (our browser window). This is a problem
          because in most cases our video element aspect ratio will be different
          than our video source aspect ratio (in this case 16:9). Now our video
          element has the width and height of the viewport (our browser window).
          This is a problem because in most cases our video element aspect ratio
          will be different than our video source aspect ratio (in this case
          16:9). Now our video element has the width and height of the viewport
          (our browser window). This is a problem because in most cases our
          video element aspect ratio will be different than our video source
          aspect ratio (in this case 16:9). Now our video element has the width
          and height of the viewport (our browser window). This is a problem
          because in most cases our video element aspect ratio will be different
          than our video source aspect ratio (in this case 16:9). Now our video
          element has the width and height of the viewport (our browser window).
          This is a problem because in most cases our video element aspect ratio
          will be different than our video source aspect ratio (in this case
          16:9). Now our video element has the width and height of the viewport
          (our browser window). This is a problem because in most cases our
          video element aspect ratio will be different than our video source
          aspect ratio (in this case 16:9). Now our video element has the width
          and height of the viewport (our browser window). This is a problem
          because in most cases our video element aspect ratio will be different
          than our video source aspect ratio (in this case 16:9). Now our video
          element has the width and height of the viewport (our browser window).
          This is a problem because in most cases our video element aspect ratio
          will be different than our video source aspect ratio (in this case
          16:9). Now our video element has the width and height of the viewport
          (our browser window). This is a problem because in most cases our
          video element aspect ratio will be different than our video source
          aspect ratio (in this case 16:9).
        </div>
      </div> */}
    </React.Fragment>
  );
};

export default HomePage;
