import React, { useEffect, useState, useContext } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import loginService from '../services/login-service';
import { useNavigate } from 'react-router-dom';
import './login.css';
import './styles.css';
import UserContext from './UserContext';

export default function Login() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState(null);
  const [loginEmail, setLoginEmail] = useState(null);
  const [otpData, setOtpData] = useState(null);
  const [isLoginOtpSend, setIsLoginOtpSend] = useState(false);
  const navigate = useNavigate();
  let auth = localStorage.getItem('user');
  const showAlert = useContext(UserContext);

  useEffect(() => {
    if (auth) navigate('/home');
  });

  const handleSignup = () => {
    if (validateEmail(email) && name) {
      loginService
        .signUp({ name, email })
        .then(() => {
          showAlert(true, 'success', 'Signup Successful');
        })
        .catch((err) => {
          showAlert(
            true,
            'error',
            'Error in Signup: ' + err.response.data.message
          );
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
          showAlert(true, 'success', 'OTP sent Successful!');
          setIsLoginOtpSend(true);
        })
        .catch((err) => {
          showAlert(
            true,
            'error',
            'Error in Signup: ' + err.response.data.message
          );
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
          showAlert(true, 'success', 'Login Successful!');
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/home');
        })
        .catch((err) => {
          showAlert(
            true,
            'error',
            'Error in Signup: ' + err.response.data.message
          );
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
    <Grid container direction="row">
      <Grid item xs={false} sm={false} md={3} lg={4} xl={4}></Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className="App">
        <p>
          Assalamualikum! Welcome to Quran Tracker App! Please login or signup
          and start your Quran Journey!
        </p>

        <Grid
          item
          justify={'center'}
          alignItems={'center'}
          textAlign={'center'}
        >
          <Grid
            style={{
              padding: '24px',
              margin: '0px 24px 24px 24px',
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
                <Typography variant="body1">
                  Enter valid email address
                </Typography>
              ) : null}
            </Grid>
            <Grid style={{ textAlign: 'start' }}>
              <p textAlign={'center'}>
                <b>Remeber these points before continuing:</b>
              </p>
              <ul style={{ paddingInlineStart: '0px' }}>
                <li>
                  <p>
                    ✅ We save your email address to sync your data to database,
                    so you can use the app anywhere.
                  </p>
                </li>
                <li>
                  <p>
                    ✅ We will send you login OTP to your email anytime on you
                    want to login.
                  </p>
                </li>
                <li>
                  <p>
                    ✅ We may send you emails later related to your account or
                    app features later if required.
                  </p>
                </li>
              </ul>
            </Grid>

            <Grid item xs={12}>
              <button onClick={handleSignup} className="raised_button">
                SignUp
              </button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          justify={'center'}
          alignItems={'center'}
          textAlign={'center'}
        >
          <Grid
            style={{
              padding: '24px',
              margin: '0px 24px 24px 24px',
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
                input="email"
                onChange={(e) => setLoginEmail(e.target.value)}
                error={loginEmail && !validateEmail(loginEmail)}
                variant="filled"
              />
              {loginEmail && !validateEmail(loginEmail) ? (
                <Typography variant="body1">
                  Enter valid email address
                </Typography>
              ) : null}
            </Grid>
            <Grid item style={{ margin: '12px' }}>
              <TextField
                disabled={!isLoginOtpSend}
                required
                fullWidth
                input="number"
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
                className="raised_button"
              >
                {isLoginOtpSend ? 'Verify OTP' : 'Send OTP'}
              </button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={false} sm={false} md={3} lg={4} xl={4}></Grid>
    </Grid>
  );
}
