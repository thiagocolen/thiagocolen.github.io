import React, { useState, useEffect } from "react";
import poster0 from "../assets/webm-posters/poster-0.webm";
import poster1 from "../assets/webm-posters/poster-1.webm";
import poster2 from "../assets/webm-posters/poster-2.webm";
import poster3 from "../assets/webm-posters/poster-3.webm";
import poster4 from "../assets/webm-posters/poster-4.webm";
import poster5 from "../assets/webm-posters/poster-5.webm";

const posters = [poster0, poster1, poster2, poster3, poster4, poster5];

const neonColors = [
  "#FF0055", // Neon Red
  "#00F0FF", // Electric Cyan
  "#AAFC3D", // Acid Lime
  "#FF30CD", // Hot Magenta
  "#FF7A00", // Bright Orange
  "#7000FF", // Electric Purple
  "#FFD600", // Electric Yellow
];

const posterIcons    = ["📺", "📡", "🎬", "🎞️", "📼", "🎮", "🔀", "🎲"];
const glitchOnIcons  = ["⚡", "👾", "🔮", "💥", "🌀", "✨", "🎯", "🛸"];
const glitchOffIcons = ["❌", "🔕", "🚫", "💤", "⛔", "🔇", "🙈", "😶"];
const loadingIcons   = ["⏳", "⌛", "🔄", "💫"];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// `extraControls` lets a page drop a page-specific button into the fixed
// bottom-left control row (postPage passes its share button), so those buttons
// line up with the poster/glitch pair instead of needing their own fixed box.
const Poster = ({ colorOpacity = 0.7, extraControls = null }) => {
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionEffect, setTransitionEffect] = useState(null);
  const [glitchEnabled, setGlitchEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("glitchEnabled") !== "false";
    }
    return true;
  });
  const [icons] = useState(() => ({
    poster:   pick(posterIcons),
    loading:  pick(loadingIcons),
    glitchOn: pick(glitchOnIcons),
    glitchOff: pick(glitchOffIcons),
  }));

  const toggleGlitch = () => {
    const nextVal = !glitchEnabled;
    setGlitchEnabled(nextVal);
    if (typeof window !== "undefined") {
      localStorage.setItem("glitchEnabled", String(nextVal));
      window.dispatchEvent(new CustomEvent("glitchToggle", { detail: nextVal }));
    }
  };

  useEffect(() => {
    // Select random poster and random color on mount
    const randomPoster = Math.floor(Math.random() * posters.length);
    const randomColor = Math.floor(Math.random() * neonColors.length);
    setCurrentPosterIndex(randomPoster);
    setCurrentColorIndex(randomColor);
  }, []);

  const changePoster = () => {
    if (isTransitioning) return;

    const effects = ["static", "glitch", "flash", "shutter"];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
    setIsTransitioning(true);
    setTransitionEffect(randomEffect);

    // Swap index and color mid-transition (at 200ms)
    setTimeout(() => {
      setCurrentPosterIndex((prevIndex) => {
        let nextIndex = Math.floor(Math.random() * posters.length);
        while (nextIndex === prevIndex) {
          nextIndex = Math.floor(Math.random() * posters.length);
        }
        return nextIndex;
      });

      setCurrentColorIndex((prevIndex) => {
        let nextIndex = Math.floor(Math.random() * neonColors.length);
        while (nextIndex === prevIndex) {
          nextIndex = Math.floor(Math.random() * neonColors.length);
        }
        return nextIndex;
      });
    }, 200);

    // Complete transition (at 400ms)
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionEffect(null);
    }, 400);
  };

  const getEffectVideoClass = (effect) => {
    switch (effect) {
      case "static": return "animate-trans-static-video";
      case "glitch": return "animate-trans-glitch-video";
      case "flash": return "animate-trans-flash-video";
      default: return "";
    }
  };

  const getEffectOverlayClass = (effect) => {
    switch (effect) {
      case "static": return "animate-trans-static-overlay";
      case "glitch": return "animate-trans-glitch-overlay";
      case "flash": return "animate-trans-flash-overlay";
      case "shutter": return "animate-trans-shutter-overlay";
      default: return "";
    }
  };

  return (
    <>
      {/* Floating Retro Controls (Change Poster + Glitch Toggle Buttons) */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center space-x-2 animate-brutalist-wiggle">
        <button 
          onClick={changePoster}
          disabled={isTransitioning}
          className="font-head text-xs bg-primary text-black border-2 border-black rounded w-control h-control flex items-center justify-center shadow-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-xs transition-all duration-150 cursor-pointer select-none disabled:opacity-75 disabled:cursor-not-allowed"
          title="Switch background video and color theme"
        >
          {isTransitioning ? icons.loading : icons.poster}
        </button>

        <button 
          onClick={toggleGlitch}
          className={`font-head text-xs border-2 border-black rounded w-control h-control flex items-center justify-center shadow-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all duration-150 cursor-pointer select-none ${
            glitchEnabled 
              ? "bg-accent text-black" 
              : "bg-red-500 text-white"
          }`}
          title={glitchEnabled ? "Glitch effects ON — click to disable" : "Glitch effects OFF — click to enable"}
        >
          {glitchEnabled ? icons.glitchOn : icons.glitchOff}
        </button>

        {extraControls}
      </div>

      {/* Fullscreen Video Background & Dual Overlay (Color + Dark) */}
      <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-background pointer-events-none">
        {/* Layer 1: Solid black overlay at 60% opacity to darken the video for readability */}
        <div className="absolute inset-0 w-full h-full z-20 bg-black opacity-60" />

        {/* Layer 2: Neo-brutalist color overlay blending with the video underneath */}
        <div 
          className="absolute inset-0 w-full h-full z-10 mix-blend-multiply"
          style={{ 
            backgroundColor: neonColors[currentColorIndex],
            opacity: colorOpacity
          }}
        />
        
        {/* Layer 3: The looping poster video (Grayscale filter creates a duotone effect with color layer on top) */}
        <video
          key={currentPosterIndex}
          className={`w-full h-full object-cover filter grayscale transition-all duration-300 ${isTransitioning ? getEffectVideoClass(transitionEffect) : ""}`}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={posters[currentPosterIndex]} type="video/webm" />
        </video>

        {/* Layer 4: Transition Visual Effect Overlay */}
        {isTransitioning && (
          <div className={`absolute inset-0 z-30 pointer-events-none ${getEffectOverlayClass(transitionEffect)}`} />
        )}
      </div>
    </>
  );
};

export default Poster;
