import "smap/smap-shim"
import "core-js";
import 'regenerator-runtime/runtime';
import './utils/nanoidIE'
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from "react-redux"
import store from "./store"
import './index.scss';
import 'simplebar/dist/simplebar.min.css';
import App from './components/App';
import { API } from "@aws-amplify/api";
import { Auth } from "@aws-amplify/auth";
import awsconfig from './aws-exports';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import ModalManager from "./components/ModalManager";
import WindowSizeListener from "./components/WindowSizeListener";
import RouterUtils from "./components/RouterUtils";

const firebaseConfig = {
  apiKey: "AIzaSyA5qtc5aQFVBclDwYalib-qXn7DdK-tLEk",
  authDomain: "forwardslash.firebaseapp.com",
  projectId: "forwardslash",
  storageBucket: "forwardslash.appspot.com",
  messagingSenderId: "637088123316",
  appId: "1:637088123316:web:60a68d05274be716828ae1",
  measurementId: "G-XJM3GQR6VP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

API.configure(awsconfig);
Auth.configure(awsconfig);
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container)
root.render(
(
  <StrictMode>
    <WindowSizeListener>
      <RouterUtils>
        <Provider store={store}>
          <ModalManager>
            <App />
          </ModalManager>
        </Provider>
      </RouterUtils>
    </WindowSizeListener>
  </StrictMode>
), container);
serviceWorkerRegistration.register();
