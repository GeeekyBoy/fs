import React, { useState, useEffect, createContext, useContext } from "react";
import { subscribe, isSupported } from 'on-screen-keyboard-detector';

const isSSR = typeof window !== "undefined";
const initalState = {
  width: isSSR ? 1200 : window.innerWidth,
  height: isSSR ? 800 : window.innerHeight,
  isMobile: false,
  isKeyboard: false
};

const WindowSizeContext = createContext(initalState);
export const useWindowSize = () => useContext(WindowSizeContext);

const WindowSizeListener = ({ children }) => {
  
  const [windowSize, setWindowSize] = useState(initalState);

  const changeWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      //isMobile: 'ontouchstart' in document.documentElement && window.innerWidth < 768,
      isKeyboard: windowSize.isKeyboard
    });
  }

  const changeKeyboardState = (newState) => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
      //isMobile: 'ontouchstart' in document.documentElement && window.innerWidth < 768,
      isKeyboard: 'ontouchstart' in document.documentElement && newState
    });
  }

  useEffect(() => {
    window.addEventListener("load", changeWindowSize);
    changeWindowSize();
    window.addEventListener("resize", changeWindowSize);
    if (isSupported()) {
        const unsubscribe = subscribe(visibility => {
            changeKeyboardState(visibility === "visible");
	});
    }
    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return (
    <WindowSizeContext.Provider value={windowSize}>
      {children}
    </WindowSizeContext.Provider>
  );
};

export default WindowSizeListener;
