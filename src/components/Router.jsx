import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import AuthFlow from "./AuthFlow";
import Home from "./Home";

const supportedRoutes = [
  "/login/*",
  "/signup/*",
  "/forgot-password/*",
  "/local/:projectPermalink/*",
  "/:username/:projectPermalink/:taskPermalink/*",
  "/:username/:projectPermalink/*",
  "/"
]

const getCurrentPath = () => {
  let path = window.location.pathname;
  if (!path[0] === "/") path = "/" + path;
  if (path.includes("?")) path = path.split("?")[0];
  if (path.includes("#")) path = path.split("#")[0];
  return path;
}

const compilePathPatterns = (patterns) => {
  const result = [];
  for (const pattern of patterns) {
    const entities = [];
    const regex = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, name) => {
      entities.push(name);
      return "([^/]+)";
    }) + "$", "i");
    result.push({ pattern, entities, regex });
  }
  return result;
}

const compiledPatterns = compilePathPatterns(supportedRoutes);

const getCurrentPattern = (path) => {
  const params = {};
  for (const { pattern, entities, regex } of compiledPatterns) {
    const match = regex.exec(path);
    if (match) {
      for (let i = 1; i < match.length; i++) {
        params[entities[i - 1]] = match[i];
      }
      contextValue.routeLocation = path;
      contextValue.routeParams = params;
      return pattern;
    }
  }
  contextValue.routeLocation = path;
  contextValue.routeParams = null;
  return null;
}

const contextValue = {
  routeParams: {},
  routeLocation: getCurrentPath()
};

const RouterContext = createContext(contextValue);
export const useRouter = () => useContext(RouterContext);
export const useRouterNoUpdates = () => contextValue;
export const navigate = function f(...args) {
  return f.contents.call(this, ...args);
};

const Router = () => {
  const [currentPath, setCurrentPath] = useState(getCurrentPattern(getCurrentPath()));

  useEffect(() => {
    window.addEventListener("popstate", () => {
      setCurrentPath(getCurrentPattern(getCurrentPath()));
    });
  }, []);

  navigate.contents = (nextPath, shouldReplace = false) => {
    if (!isNaN(nextPath)) {
      window.history.go(nextPath);
    } else {
      window.history[shouldReplace ? "replaceState" : "pushState"]({}, document.title, nextPath);
      setCurrentPath(getCurrentPattern(nextPath));
    }
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {
        currentPath === "/login/*" ? <AuthFlow />
        : currentPath === "/signup/*" ? <AuthFlow />
        : currentPath === "/forgot-password/*" ? <AuthFlow />
        : currentPath === "/local/:projectPermalink/*" ? <Home />
        : currentPath === "/:username/:projectPermalink/:taskPermalink/*" ? <Home />
        : currentPath === "/:username/:projectPermalink/*" ? <Home />
        : currentPath === "/" ? <Home />
        : <></>
      }
    </RouterContext.Provider>
  );
};

export default Router;