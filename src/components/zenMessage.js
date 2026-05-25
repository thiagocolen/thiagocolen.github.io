import React, { useEffect, useState } from "react";
import axios from "axios";

const ZenMessage = ({ animationClass = "animate-brutalist-pop" }) => {
  const [gitHubZenMessage, setGitHubZenMessage] = useState("Always push your limits.");
  const [gitHubZenErrorMessage, setGitHubZenErrorMessage] = useState("");
  const [typedText, setTypedText] = useState("");

  const handleZenBoxClick = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: window.innerHeight * 0.75, // Scroll down 75% of viewport height to center the articles
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const { data: apiResponse } = await axios.get(
          "https://api.github.com/zen"
        );
        if (isMounted) {
          setGitHubZenMessage(apiResponse);
          setGitHubZenErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setGitHubZenMessage("Always push your limits.");
          setGitHubZenErrorMessage(
            error.response 
              ? `[status error ${error.response.status}]: ${error.response.data?.message || 'Failed to connect'}`
              : "Failed to connect to GitHub API."
          );
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Snappy typing animation effect
  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;
    setTypedText("");

    if (!gitHubZenMessage) return;

    const interval = setInterval(() => {
      if (currentIndex < gitHubZenMessage.length) {
        currentText += gitHubZenMessage[currentIndex];
        setTypedText(currentText);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [gitHubZenMessage]);

  return (
    <div className={`relative w-full max-w-2xl mx-auto group select-none text-black cursor-pointer ${animationClass}`} onClick={handleZenBoxClick}>
      {/* Neo-brutalist Underlay Shadow Box (Offset border shadow that matches user hover and active actions) */}
      <div className="absolute inset-0 bg-black border-4 border-black rounded translate-x-2.5 translate-y-2.5 group-hover:translate-x-3.5 group-hover:translate-y-3.5 group-active:translate-x-1 group-active:translate-y-1 transition-transform duration-200" />

      {/* Main Complex Brutalist Panel Box with tactile click and hover transitions */}
      <div className="relative bg-white border-4 border-black rounded p-5 sm:p-6 md:p-8 text-left transition-all duration-200 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5 group-hover:bg-amber-50 group-active:translate-x-2 group-active:translate-y-2 group-active:bg-primary/10 overflow-hidden">

        {/* Top Header Row (Online stream indicator) */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3.5 mb-5">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500 border border-black/20"></span>
            </span>
            <span className="font-head text-tiny sm:text-xs tracking-wider text-black font-extrabold uppercase">
              api.github.com/zen
            </span>
          </div>
          <div className="font-head text-tiny sm:text-xxs bg-accent border-2 border-black rounded px-2 py-0.5 sm:px-2.5 shadow-xs">
            REV. 1.1.0
          </div>
        </div>

        {/* Main Content Area: Typed Zen Message inside Brutalist Font wrapper */}
        <div className="py-2 sm:py-4 flex items-center">
          <p className="font-head text-base sm:text-xl md:text-3xl text-black uppercase tracking-tight leading-tight m-0">
            "{typedText}
            <span className="animate-pulse bg-black inline-block w-2 sm:w-2.5 h-4 sm:h-5 md:h-6 ml-1 align-middle" />"
          </p>
        </div>

        {/* Bottom Status Panel Widgets */}
        <div className="border-t-2 border-black pt-4 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-xs">
          {/* Mock Buffer progress bar loading loader */}
          <div className="flex items-center space-x-2.5">
            <span className="font-head text-tiny sm:text-xxs uppercase tracking-wider text-black/60 font-bold">BUFFER:</span>
            <div className="w-32 sm:w-40 h-4 bg-gray-100 border-2 border-black relative overflow-hidden rounded-sm shadow-xs">
              <div className="h-full bg-primary border-r-2 border-black transition-all duration-500" style={{ width: "85%" }} />
            </div>
            <span className="font-sans text-tiny sm:text-xs font-extrabold">85%</span>
          </div>
          
          <div className="font-head text-tiny sm:text-xxs font-extrabold text-black/50 uppercase tracking-widest">
            SYS_STATUS: OPTIMAL
          </div>
        </div>

        {/* Output Error console log if connection fails */}
        {gitHubZenErrorMessage && (
          <div className="mt-3 p-2 bg-destructive/10 border-2 border-destructive text-[9px] text-destructive font-mono rounded">
            {gitHubZenErrorMessage}
          </div>
        )}

      </div>

      {/* Downside Scroll Indicator Arrow */}
      <div className="flex justify-center mt-6 pointer-events-none">
        <div className="animate-bounce bg-primary text-black border-2 border-black rounded-full w-10 h-10 flex items-center justify-center shadow-sm font-head text-lg select-none">
          ↓
        </div>
      </div>
    </div>
  );
};

export default ZenMessage;
