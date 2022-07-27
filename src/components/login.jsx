import React, { useState } from 'react';
import { Grid, TextField, Paper, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import './login.css';

export default function Login() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [isLoginOtpSend, setIsLoginOtpSend] = useState(false);

  return (
    <Grid container>
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
        spacing={2}
        direction={'column'}
        justify={'center'}
        alignItems={'center'}
        textAlign={'center'}
      >
        <Paper style={{ padding: '24px', margin: '24px' }}>
          <Typography variant="h4">Login</Typography>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              disabled={isLoginOtpSend}
              required
              fullWidth
              label="Email"
              variant="filled"
            />
          </Grid>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              disabled={!isLoginOtpSend}
              required
              fullWidth
              label="OTP"
              variant="filled"
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={() => setIsLoginOtpSend(true)}>
              {isLoginOtpSend ? 'Verify OTP' : 'Send OTP'}
            </Button>
          </Grid>
        </Paper>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        spacing={2}
        justify={'center'}
        alignItems={'center'}
        textAlign={'center'}
      >
        <Paper style={{ padding: '24px', margin: '24px' }}>
          <Typography variant="h4">SignUp</Typography>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              fullWidth
              required
              label="Name"
              variant="filled"
            />
          </Grid>
          <Grid item style={{ margin: '12px' }}>
            <TextField
              required
              fullWidth
              label="Email"
              variant="filled"
            />
          </Grid>
          <Grid style={{ textAlign: 'start' }}>
            <Typography variant="body1" textAlign={'center'}>
              Remeber these points before continuing:
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
            <Button variant="contained">SignUp</Button>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
