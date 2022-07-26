import React from 'react';
import { Grid, TextField, Paper } from '@mui/material';
import Button from '@mui/material/Button';

export default function Login() {
  return (
    <div style={{ padding: 30 }}>
      <Paper>
        <Grid
          container
          spacing={3}
          direction={'column'}
          justify={'center'}
          alignItems={'center'}
        >
          <Grid item xs={12}>
            <TextField label="Username"></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password" type={'password'}></TextField>
          </Grid>

          <Grid item xs={12}>
            <Button variant="outlined">Login</Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
