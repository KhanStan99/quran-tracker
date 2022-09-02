import React, { StrictMode } from 'react';
import { useState } from 'react';
import App from './app';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createTheme } from '@mui/material/styles';
import ResponsiveAppBar from './header';
import Login from './login';
import UserContext from './UserContext';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function Main() {
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

  const [snackBarOptions, setSnackBarOptions] = useState({
    open: false,
    severity: 'info',
    message: null,
  });

  const [drawer, setDrawer] = useState(false);

  const handleClick = (open, severity, message) => {
    //severity = "error", "warning", "info", "success"
    setSnackBarOptions({ open, severity, message });
  };

  const handleClose = () => {
    setSnackBarOptions(false);
  };

  const toggleDrawer = (open) => (event) => {
    console.log("open  -> ", open);
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawer(open);
  };

  return (
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SwipeableDrawer
            anchor={'top'}
            open={drawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          />
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={snackBarOptions.open}
              onClose={handleClose}
              key={'top' + 'right'}
            >
              <Alert severity={snackBarOptions.severity} sx={{ width: '100%' }}>
                {snackBarOptions.message}
              </Alert>
            </Snackbar>
            <UserContext.Provider value={handleClick}>
              <div>
                <ResponsiveAppBar toggleDrawer={toggleDrawer}/>
                <Routes>
                  <Route path="*" element={<Login />} />
                  <Route index path="/login" element={<Login />} />
                  <Route path="/home" element={<App />} />
                </Routes>
              </div>
              <footer style={{ textAlign: 'center' }}>
                <p>
                  If you have any feedback, bug report or want to contribute,{' '}
                  <a href="mailto:soubankhan3@gmail.com" target="_blank">
                    then send me an email
                  </a>
                </p>
              </footer>
            </UserContext.Provider>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
