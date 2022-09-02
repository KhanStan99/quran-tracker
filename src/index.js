import React from 'react';
import { createRoot } from "react-dom/client";
import * as serviceWorker from "./serviceWorker";
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
import Main from "./components/main";
root.render(<Main />);

serviceWorker.register();
