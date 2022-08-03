import 'react-app-polyfill/stable';
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "./scss/index.scss";
import "simplebar/dist/simplebar.min.css";
import App from "./components/App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import ModalManager from "./components/ModalManager";
import WindowSizeListener from "./components/WindowSizeListener";
import TabViewManager from './components/TabViewManager';

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
getAnalytics(app);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <WindowSizeListener>
    <Provider store={store}>
      <ModalManager>
        <TabViewManager>
          <App />
        </TabViewManager>
      </ModalManager>
    </Provider>
  </WindowSizeListener>
);
serviceWorkerRegistration.register();
