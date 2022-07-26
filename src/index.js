import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './components/app.jsx';
import * as serviceWorker from "./serviceWorker";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { createTheme } from '@mui/material/styles';
import ResponsiveAppBar from './components/header';
import Login from './components/login';
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);


const theme = createTheme({
  palette: {
    primary: {
      main: '#CDBE78',
    },
    secondary: {
      main: '#066163',
    },
  },
});

root.render(
  
  <StrictMode>
    <BrowserRouter>
    <ThemeProvider theme={theme}>
    <ResponsiveAppBar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="login" element={<Login />} />
    </Routes>
    </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
serviceWorker.register();
