import React, { useState, createContext, useContext, useRef, useEffect } from "react";

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

const getCurrentPattern = (compiledPatterns, path) => {
  const params = {};
  for (const { pattern, entities, regex } of compiledPatterns) {
    const match = regex.exec(path);
    if (match) {
      for (let i = 1; i < match.length; i++) {
        params[entities[i - 1]] = match[i];
      }
      return [pattern, params];
    }
  }
  return [null, null];
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

const Router = ({ routes }) => {
  const compiledPatterns = useRef(null);
  const [CurrentElement, setCurrentElement] = useState(null);
  
  const updateRoute = (nextPath) => {
    const [pattern, nextParams] = getCurrentPattern(compiledPatterns.current, nextPath);
    contextValue.routeLocation = nextPath;
    contextValue.routeParams = nextParams;
    setCurrentElement(React.createElement(routes[pattern] || null, {}));
  }

  useEffect(() => {
    compiledPatterns.current = compilePathPatterns(Object.keys(routes));
    updateRoute(getCurrentPath());
    window.addEventListener("popstate", () => {
      updateRoute(getCurrentPath());
    });
  }, []);

  navigate.contents = (nextPath, shouldReplace = false) => {
    if (!isNaN(nextPath)) {
      window.history.go(nextPath);
    } else {
      window.history[shouldReplace ? "replaceState" : "pushState"]({}, document.title, nextPath);
      updateRoute(nextPath);
    }
  };

  return (
    <RouterContext.Provider value={contextValue}>
      {CurrentElement}
    </RouterContext.Provider>
  );
};

export default Router;