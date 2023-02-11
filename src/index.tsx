import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "@state/Provider";
import App from "./app";
import "./globals.css";

const root = document.getElementById("root");
if (root)
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <Provider>
        <App />
      </Provider>
    </StrictMode>,
  );
