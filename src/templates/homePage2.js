import React, { useState } from "react";
import Poster from "../components/poster";
import ZenMessage from "../components/zenMessage";
import ArticleList from "../components/articleList";
import Container from "../components/container";
import Footer from "../components/footer";
import LoadingScreen from "../components/loadingScreen";

const useSafeLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const HomePage2 = ({ location, pageContext: { articlesList } }) => {
  const [isShortAnimation, setIsShortAnimation] = useState(false);
  const [loadState, setLoadState] = useState("loading"); // 'loading', 'active'

  useSafeLayoutEffect(() => {
    const fromPost = location?.state?.fromPost || (typeof window !== "undefined" && sessionStorage.getItem("fromPost") === "true");
    if (fromPost) {
      setIsShortAnimation(true);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("fromPost");
        if (window.history) {
          window.history.replaceState({}, document.title);
        }
      }
    }
  }, [location]);

  const handleInitialize = () => {
    setLoadState("active");
  };

  return (
    <>
      {loadState === "loading" && (
        <LoadingScreen onDismiss={handleInitialize} isShort={isShortAnimation} />
      )}

      {/* Fullscreen Video Background */}
      <Poster />

      <Container className="bg-transparent">
        {/* Spacer of browser height to see the face in the background poster video */}
        <div className="w-full pointer-events-none h-40vh sm:h-60vh" />

        {/* Typographic Hero Section holding only the Zen Message card */}
        <section className="flex flex-col items-center justify-center pb-12 text-center select-none max-w-3xl mx-auto w-full">
          <div className={`w-full ${loadState === "active" ? "animate-brutalist-pop-slow" : "opacity-0"}`}>
            <div className={loadState === "active" ? "animate-brutalist-float" : ""}>
              <ZenMessage animationClass="" />
            </div>
          </div>
        </section>

        {/* Article Grid Section */}
        <div className={loadState === "active" ? "animate-grid-fade-in" : "opacity-0"}>
          <ArticleList articles={articlesList} />
        </div>
      </Container>
      
      {/* Footer is part of the final details of the intro */}
      <div className={loadState === "active" ? "animate-grid-fade-in" : "opacity-0"}>
        <Footer />
      </div>
    </>
  );
};

export default HomePage2;
