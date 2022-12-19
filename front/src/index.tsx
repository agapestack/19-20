import React from "react";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { store } from "./app/store";
import { WebsocketContextProvider } from "./context/WebsocketContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WebsocketContextProvider>
        <App />
      </WebsocketContextProvider>
    </Provider>
  </React.StrictMode>
);
