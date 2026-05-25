import { useState, useEffect } from "react";

const GlobalGlitcher = () => {
  const [isEnabled, setIsEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("glitchEnabled") !== "false";
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleToggle = (e) => {
      setIsEnabled(e.detail);
    };
    window.addEventListener("glitchToggle", handleToggle);
    return () => {
      window.removeEventListener("glitchToggle", handleToggle);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    if (!isEnabled) {
      // Clean up all active glitches immediately
      const glitchClasses = [
        "element-glitch-short",
        "element-glitch-medium",
        "element-glitch-long",
        "element-glitch-sticky"
      ];
      
      const selectors = glitchClasses.map(c => `.${c}`).join(", ");
      const glitchedElements = document.querySelectorAll(selectors);
      
      glitchedElements.forEach((el) => {
        glitchClasses.forEach((c) => el.classList.remove(c));
        if (el.__glitchClickHandler) {
          el.removeEventListener("click", el.__glitchClickHandler);
          delete el.__glitchClickHandler;
        }
      });
      return;
    }

    let timeoutId;

    const runGlitch = () => {
      // List of CSS selectors to target for random glitching
      const selectors = [
        "h1", 
        "h2", 
        "h3", 
        "p", 
        "button", 
        "a", 
        "img",
        ".shadow-md", 
        ".shadow-lg", 
        "li", 
        "span"
      ];
      
      // Query all matching elements on the page
      const elements = Array.from(document.querySelectorAll(selectors.join(", ")));
      
      if (elements.length > 0) {
        // Choose a random number of elements to glitch (between 1 and 3)
        const count = Math.min(Math.floor(Math.random() * 3) + 1, elements.length);
        const selected = [];
        
        // Randomly select elements
        for (let i = 0; i < count; i++) {
          const randomIndex = Math.floor(Math.random() * elements.length);
          const el = elements[randomIndex];
          if (el && !selected.includes(el)) {
            selected.push(el);
          }
        }
        
        // Randomly choose one of the 4 effects
        const fillEffects = ["short", "medium", "long", "sticky"];
        const randomEffect = fillEffects[Math.floor(Math.random() * fillEffects.length)];
        const effectClass = `element-glitch-${randomEffect}`;
        
        selected.forEach((el) => {
          // Avoid double glitching an element
          if (
            el.classList.contains("element-glitch-short") ||
            el.classList.contains("element-glitch-medium") ||
            el.classList.contains("element-glitch-long") ||
            el.classList.contains("element-glitch-sticky")
          ) {
            return;
          }
          
          el.classList.add(effectClass);
          
          if (randomEffect === "sticky") {
            const clickHandler = (e) => {
              e.preventDefault();
              e.stopPropagation();
              el.classList.remove("element-glitch-sticky");
              el.removeEventListener("click", clickHandler);
              delete el.__glitchClickHandler;
            };
            el.addEventListener("click", clickHandler);
            el.__glitchClickHandler = clickHandler;
          } else {
            const durations = { short: 150, medium: 400, long: 800 };
            setTimeout(() => {
              el.classList.remove(effectClass);
            }, durations[randomEffect]);
          }
        });
      }

      // Schedule the next glitch at a random time between 3s and 10s
      const nextTime = Math.random() * 7000 + 3000;
      timeoutId = setTimeout(runGlitch, nextTime);
    };

    // Initialize the first glitch event
    const initialTime = Math.random() * 7000 + 3000;
    timeoutId = setTimeout(runGlitch, initialTime);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isEnabled]);

  return null;
};

export default GlobalGlitcher;
