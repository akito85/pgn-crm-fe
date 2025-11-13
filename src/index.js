import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "antd/dist/antd.min.css";
import "./app.less";
import "./tailwind.css";
import store from "./redux/stores/store";
import { Provider } from "react-redux";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
