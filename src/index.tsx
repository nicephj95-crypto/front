import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProviderContext } from "./context/ThemeContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProviderContext>
      <App />
    </ThemeProviderContext>
  </React.StrictMode>
);