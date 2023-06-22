import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer, { initialState } from "./reducer";
import { StateProvider } from "./StateProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
);

serviceWorker.unregister();
