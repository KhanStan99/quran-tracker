import React, { useEffect, useState } from 'react';
import { Grid, TextField, Paper, Typography } from '@mui/material';
import './login.css';
import loginService from '../services/login-service';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function Login() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState(null);
  const [loginEmail, setLoginEmail] = useState(null);
  const [otpData, setOtpData] = useState(null);
  const [isLoginOtpSend, setIsLoginOtpSend] = useState(false);
  const [snackBarOptions, setSnackBarOptions] = useState({
    open: false,
    severity: 'info',
    message: null,
  });
  const navigate = useNavigate();
  let auth = localStorage.getItem('user');

  useEffect(() => {
    if (auth) navigate('/home');
  });

  const handleClick = (open, severity, message) => {
    //severity = "error", "warning", "info", "success"
    setSnackBarOptions({ open, severity, message });
  };

  const handleClose = () => {
    setSnackBarOptions(false);
  };

  const handleSignup = () => {
    if (validateEmail(email) && name) {
      loginService
        .signUp({ name, email })
        .then(() => {
          alert('Signup Successful');
        })
        .catch((err) => {
          alert('Error in Signup: ' + err.response.data.message);
        });
    } else {
      handleClick(true, 'error', 'Please enter email address & Name!');
    }
  };

  const handleSendOTP = () => {
    if (validateEmail(loginEmail)) {
      loginService
        .sendOtp({ email: loginEmail })
        .then((response) => {
          setOtpData(response.data);
          alert('OTP sent Successful!');
          setIsLoginOtpSend(true);
        })
        .catch((err) => {
          alert('Error in Signup: ' + err.response.data.message);
        });
    } else {
      handleClick(true, 'error', 'Please enter email address!');
      setLoginEmail('xyz');
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 4) {
      let body = otpData;
      body.otp = otp;
      loginService
        .verifyOtp(otpData)
        .then((response) => {
          alert('LOGIN Successful!');
          localStorage.setItem('user', response.data.userId);
          navigate('/home');
        })
        .catch((err) => {
          alert('Error in Signup: ' + err.response.data.message);
        });
    } else {
      handleClick(true, 'error', 'Please enter 4 digit OTP!');
    }
  };

  function validateEmail(emailAdress) {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailAdress && emailAdress.match(regexEmail);
  }

  return (
    <Grid container>
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

      <Typography
        variant="h5"
        textAlign={'center'}
        color={'#FFF'}
        marginTop={'24px'}
      >
        Assalamualikum! Welcome to Quran Tracker App! Please login or signup and
        start your Quran Journey!
      </Typography>
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        justify={'center'}
        alignItems={'center'}
        textAlign={'center'}
      >
        <Grid
          style={{
            padding: '24px',
            margin: '24px',
            boxShadow:
              'inset -5px -5px 10px rgba(0,0,0,0.1), inset 5px 5px 20px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            border: '2px solid #edf1f4',
          }}
        >
          <Typography variant="h4">Login</Typography>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              disabled={isLoginOtpSend}
              required
              fullWidth
              label="Email"
              onChange={(e) => setLoginEmail(e.target.value)}
              error={loginEmail && !validateEmail(loginEmail)}
              variant="filled"
            />
            {loginEmail && !validateEmail(loginEmail) ? (
              <Typography variant="body1">Enter valid email address</Typography>
            ) : null}
          </Grid>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              disabled={!isLoginOtpSend}
              required
              fullWidth
              label="OTP"
              variant="filled"
              onChange={(e) => setOtp(e.target.value)}
              error={otp && otp.length < 4}
            />
            {otp && otp.length < 4 ? 'Minimum 4 digits required' : null}
          </Grid>

          <Grid item xs={12}>
            <button
              onClick={isLoginOtpSend ? handleVerifyOTP : handleSendOTP}
              class="raised_button"
            >
              {isLoginOtpSend ? 'Verify OTP' : 'Send OTP'}
            </button>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        justify={'center'}
        alignItems={'center'}
        textAlign={'center'}
      >
        <Grid
          style={{
            padding: '24px',
            margin: '24px',
            boxShadow:
              'inset -5px -5px 10px rgba(0,0,0,0.1), inset 5px 5px 20px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            border: '2px solid #edf1f4',
          }}
        >
          <Typography variant="h4">SignUp</Typography>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              fullWidth
              onChange={(e) => setName(e.target.value)}
              required
              error={name && name.length < 3}
              label="Name"
              variant="filled"
            />
            {name && name.length < 3 ? 'Minimum 3 characters required' : null}
          </Grid>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
              required
              error={email && !validateEmail(email)}
              label="Email"
              variant="filled"
            />
            {email && !validateEmail(email) ? (
              <Typography variant="body1">Enter valid email address</Typography>
            ) : null}
          </Grid>
          <Grid style={{ textAlign: 'start' }}>
            <Typography variant="body1" textAlign={'center'}>
              <b>Remeber these points before continuing:</b>
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  ✅ We save your email address to sync your data to database,
                  so you can use the app anywhere.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  ✅ We will send you login OTP to your email anytime on you
                  want to login.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  ✅ We may send you emails later related to your account or app
                  features later if required.
                </Typography>
              </li>
            </ul>
          </Grid>

          <Grid item xs={12}>
            <button onClick={handleSignup} class="raised_button">
              SignUp
            </button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
