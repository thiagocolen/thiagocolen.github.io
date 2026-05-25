import React, { useState, useEffect } from "react";

const LoadingScreen = ({ onDismiss, isShort = false }) => {
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [isDismissing, setIsDismissing] = useState(false);

  const logsList = isShort
    ? [
        "> SYSTEM RESUMING...",
        "> DETECTING REFERRER: BLOG_POST",
        "> RESTORING CACHED LAYERS...",
        "> RETRO_UI ACTIVE"
      ]
    : [
        "> SYSTEM CONFIG: OK",
        "> RETRIEVING DEVELOPER PROFILE...",
        "> CONNECTING TO DEV.TO HOST...",
        "> PARSING ARTICLE DATA NODES...",
        "> GRAYSCALING POSTER ARRAYS...",
        "> LOADED WEBM COMPONENT LAYERS...",
        "> COMPILING NEUTRAL THEME...",
        "> LIVE THOUGHT STREAM: ONLINE",
        "> RETRO_UI v1.1.0 INITIALIZED"
      ];

  useEffect(() => {
    if (isShort) return;
    // Increment progress bar over ~2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment by varying amounts for a realistic loading feel
        const increment = Math.floor(Math.random() * 8) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isShort]);

  useEffect(() => {
    if (isShort) return;
    // Show logs sequentially based on progress
    const logIndexToShow = Math.floor((progress / 100) * logsList.length);
    const shownLogs = logsList.slice(0, Math.min(logIndexToShow + 1, logsList.length));
    setVisibleLogs(shownLogs);
  }, [progress, logsList, isShort]);

  const handleDismiss = () => {
    if ((!isShort && progress < 100) || isDismissing) return;
    setIsDismissing(true);
    // Wait for the slide-out shutter animation to finish (1s) before calling onDismiss
    setTimeout(() => {
      onDismiss();
    }, 1000);
  };

  useEffect(() => {
    if (isShort) {
      // Trigger the slide-out shutter animation after a tiny delay
      const timeout = setTimeout(() => {
        setIsDismissing(true);
        setTimeout(() => {
          onDismiss();
        }, 1000); // 1s shutter animation duration
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isShort, onDismiss]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none cursor-pointer"
      onClick={handleDismiss}
    >
      {/* Vault Shutter Left Door */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[50vw] bg-black border-r-4 border-black z-20 transition-transform duration-1000 ease-in-out"
        style={{
          transform: isDismissing ? "translateX(-100%)" : "translateX(0)"
        }}
      />

      {/* Vault Shutter Right Door */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[50vw] bg-black border-l-4 border-black z-20 transition-transform duration-1000 ease-in-out"
        style={{
          transform: isDismissing ? "translateX(100%)" : "translateX(0)"
        }}
      />

      {/* CRT Scanline Filter overlay covering the entire screen */}
      <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]" />

      {/* CRT Screen Flicker overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none bg-white/5 animate-pulse opacity-10" />

      {/* Centered Computer Loading Terminal Window */}
      {!isShort && (
        <div 
          className="relative z-40 w-full max-w-lg mx-4 transition-all duration-700 ease-in-out"
          style={{
            transform: isDismissing ? "scale(0.3) rotate(-15deg) translateY(-100px)" : "scale(1) rotate(0deg)",
            opacity: isDismissing ? 0 : 1
          }}
        >
          {/* Shadow Box */}
          <div className="absolute inset-0 bg-black border-4 border-black rounded translate-x-3 translate-y-3" />

          {/* Main Panel Body */}
          <div className="relative bg-white border-4 border-black rounded p-6 text-left text-black overflow-hidden">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-5">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 bg-primary border-2 border-black rounded-full" />
                <span className="font-head text-xs tracking-wider uppercase font-extrabold">
                  BOOT_LOADER // RETRO_OS_v1
                </span>
              </div>
              <div className="flex space-x-1.5">
                <span className="w-2.5 h-2.5 bg-black rounded-full" />
                <span className="w-2.5 h-2.5 bg-black rounded-full" />
              </div>
            </div>

            {/* Log Window */}
            <div className="bg-black text-lime-400 font-mono text-[10px] p-4 rounded border-2 border-black h-40 overflow-y-auto mb-5 space-y-1 select-none">
              {visibleLogs.map((log, index) => (
                <div key={index} className="leading-snug">
                  {log}
                </div>
              ))}
              {progress < 100 && (
                <div className="animate-pulse text-lime-400 inline-block w-2 h-3.5 bg-lime-400 align-middle ml-0.5" />
              )}
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between font-head text-xs font-bold uppercase">
                <span>INITIALIZATION:</span>
                <span>{progress}%</span>
              </div>

              {/* Neo-brutalist Progress Bar Container */}
              <div className="w-full h-7 bg-gray-100 border-3 border-black relative overflow-hidden rounded shadow-xs">
                <div 
                  className="h-full bg-primary border-r-3 border-black transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Bottom Interactive Command Bar */}
            <div className="mt-6 border-t-4 border-black pt-4 flex justify-center">
              {progress < 100 ? (
                <div className="font-head text-xs bg-gray-200 text-black border-2 border-black px-4 py-2 uppercase font-extrabold opacity-60 tracking-wider">
                  ⏳ System Booting...
                </div>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid double click triggers
                    handleDismiss();
                  }}
                  className="font-head text-xs bg-primary text-black border-2 border-black px-6 py-2.5 uppercase font-extrabold tracking-wider hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 animate-bounce"
                >
                  🖱️ WELLCOME
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
