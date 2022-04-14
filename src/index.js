import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as serviceWorker from './serviceWorker';
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
serviceWorker.register();
