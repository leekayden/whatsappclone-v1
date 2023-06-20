import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer, { initialState } from "./reducer";
import { StateProvider } from "./StateProvider";

ReactDOM.render(
  <StateProvider initialState={initialState} reducer={reducer}>
    <App />
  </StateProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
