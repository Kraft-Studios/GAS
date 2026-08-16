import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css";

/* HashRouter so a plain `dist/` drop works on any static host without
   SPA rewrite rules. Swap to BrowserRouter once the host is configured
   to serve index.html for unknown paths. */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
