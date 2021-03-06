import { React, useState } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import ResponsiveAppBar from './header';
import Statistics from './statistics';
import Tracker from './tracker';
import { Grid, Tab, Tabs } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import './styles.css';
import LinksComponent from './about-dev';

export default function App() {
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

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container direction="row">
        <ResponsiveAppBar />
        <Grid item xs={false} sm={false} md={3} lg={4} xl={4}></Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className="App">
          <Item>
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Tracker" />
              <Tab label="Statistics" />
              <Tab label="About Dev" />
            </Tabs>

            <SwipeableViews
              axis={'x'}
              index={value}
              onChangeIndex={handleChangeIndex}
            >
              <TabPanel value={value} index={0}>
                <Tracker handleChangeIndex={handleChangeIndex} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Statistics />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <LinksComponent />
              </TabPanel>
            </SwipeableViews>

            <footer>
              <p>
                If you have any feedback, bug report or want to contribute,{' '}
                <a href="mailto:soubankhan3@gmail.com" target="_blank">
                  then send me an email
                </a>
              </p>
            </footer>
          </Item>
        </Grid>
        <Grid item xs={false} sm={false} md={3} lg={4} xl={4}></Grid>
      </Grid>
    </ThemeProvider>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
  borderRadius: '0px',
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}
