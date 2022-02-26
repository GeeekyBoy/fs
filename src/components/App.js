import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as appActions from "../actions/app";
import * as appSettingsActions from "../actions/appSettings";
import store from "../store";
import isOnline from "../utils/isOnline";
import Home from "./Home";
import AuthFlow from "./AuthFlow";
import Router from "./Router";

const routes = {
  "/login": AuthFlow,
  "/signup": AuthFlow,
  "/forgot-password": AuthFlow,
  "/local/:projectPermalink": Home,
  "/:username/:projectPermalink/:taskPermalink": Home,
  "/:username/:projectPermalink": Home,
  "/": Home,
}

const App = () => {
  const dispatch = useDispatch();

  const fetchAppSettings = () => {
    const fetchedSettings = window.localStorage.getItem("appSettings");
    if (fetchedSettings) {
      dispatch(
        appSettingsActions.importAppSettings(JSON.parse(fetchedSettings))
      );
    }
  };

  const checkReloadAbility = (e) => {
    e.preventDefault();
    if (store.getState().mutations.length > 0) {
      e.returnValue =
        "Dude, are you sure you want to leave? Think of the kittens!";
    } else {
      delete e["returnValue"];
    }
  };

  useEffect(() => {
    window.addEventListener("storage", fetchAppSettings);
    window.addEventListener("beforeunload", checkReloadAbility);
    const checkConnectionInterval = setInterval(async () => {
      const result = await isOnline();
      const {
        app: { isOffline },
      } = store.getState();
      if (result && isOffline) {
        store.dispatch(appActions.setOffline(false));
      } else if (!result && !isOffline) {
        store.dispatch(appActions.setOffline(true));
      }
    }, 3000);
    return () => {
      clearInterval(checkConnectionInterval);
      window.removeEventListener("storage", fetchAppSettings);
      window.removeEventListener("beforeunload", checkReloadAbility);
    };
  }, []);

  // useEffect(() => {
  //   const availColors = {
  //     "red": "#D20E1E",
  //     "gold": "#E19D00",
  //     "orange": "#E05307",
  //     "green": "#0E6D0E",
  //     "turquoise": "#009FAA",
  //     "blue": "#0067C0",
  //     "pink": "#CD007B",
  //     "purple": "#4F4DCE",
  //     "grey": "#586579",
  //     "black": "#000000",
  //   }
  //   document.documentElement.className = appSettings.theme + " " + (appSettings.isDarkMode ? "dark" : "light");
  //   document.querySelector('meta[name="theme-color"]').setAttribute('content', appSettings.isDarkMode ? "#272727" : availColors[appSettings.theme])
  // }, [appSettings.theme, appSettings.isDarkMode]);
  return <Router routes={routes} />;
};

export default App;
