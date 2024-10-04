import React from 'react';
import { createRoot } from 'react-dom/client';
import * as serviceWorker from './serviceWorker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Main from './components/main';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const theme = createTheme({
  palette: {
    primary: {
      main: '#066163',
    },
    secondary: {
      main: '#CDBE78',
    },
  },
  typography: {
    fontFamily: 'Afacad Flux, sans-serif',
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  </React.StrictMode>
);

serviceWorker.register();
