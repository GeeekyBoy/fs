import 'react-app-polyfill/stable';
import React, { StrictMode } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./index.scss";
import "simplebar/dist/simplebar.min.css";
import App from "./components/App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import makeMatcher from "wouter/matcher";
import ModalManager from "./components/ModalManager";
import WindowSizeListener from "./components/WindowSizeListener";
import RouterUtils from "./components/RouterUtils";
import { Router } from "wouter";

const defaultMatcher = makeMatcher();
const multipathMatcher = (patterns, path) => {
  for (let pattern of [patterns].flat()) {
    const [match, params] = defaultMatcher(pattern, path);
    if (match) return [match, params];
  }
  return [false, null];
};

const firebaseConfig = {
  apiKey: "AIzaSyA5qtc5aQFVBclDwYalib-qXn7DdK-tLEk",
  authDomain: "forwardslash.firebaseapp.com",
  projectId: "forwardslash",
  storageBucket: "forwardslash.appspot.com",
  messagingSenderId: "637088123316",
  appId: "1:637088123316:web:60a68d05274be716828ae1",
  measurementId: "G-XJM3GQR6VP",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
  <StrictMode>
    <Router matcher={multipathMatcher}>
      <RouterUtils>
        <WindowSizeListener>
          <Provider store={store}>
            <ModalManager>
              <App />
            </ModalManager>
          </Provider>
        </WindowSizeListener>
      </RouterUtils>
    </Router>
  </StrictMode>,
  container
);
serviceWorkerRegistration.register();
