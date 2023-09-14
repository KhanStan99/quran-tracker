import { React, useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Statistics from './statistics';
import History from './history';
import Tracker from './tracker';
import { Button, Grid, Tab, Tabs } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import './styles.css';
import LinksComponent from './about-dev';
import { Navigate } from 'react-router-dom';
import quran from '../assets/quran.json';
import { getData, saveHistoryData } from '../services/data-service';

export default function App() {
  let auth = localStorage.getItem('user');
  const [mainList, setMainList] = useState([]);
  const [value, setValue] = useState(0);
  const [totalVersesRead, setTotalVersesRead] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [list] = useState(quran);
  const totalVerses = 6236;

  const [isRestartStats, setRestartStats] = useState(true);

  useEffect(() => {
    getDataForUser();
  }, []);

  useEffect(() => {}, [mainList]);

  useEffect(() => {
    setPercentage(parseFloat((totalVersesRead / totalVerses) * 100).toFixed(2));
  }, [totalVersesRead]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setRestartStats(!isRestartStats);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const getDataForUser = (shift = false) => {
    getData(JSON.parse(localStorage.getItem('user')).userId).then((res) => {
      if (res.data.length > 0) {
        const mainData = res.data;
        setMainList(mainData);
        let latestEntry = mainData[0];

        let total = 0;
        if (latestEntry.current_surah != 0) {
          for (let i = 0; i <= latestEntry.current_surah - 2; i++) {
            total = total + list[i].total_verses;
          }
          setTotalVersesRead(total + latestEntry.current_aayah);
        } else {
          setTotalVersesRead(latestEntry.current_aayah);
        }
        if (shift) {
          handleChangeIndex(1);
        }
      }
    });
  };

  const saveHistoryRestart = () => {
    saveHistoryData({
      user: JSON.parse(localStorage.getItem('user')).userId,
      startAt: mainList[0].time_stamp,
      endAt: mainList[mainList.length - 1].time_stamp,
    });
  };

  return !auth ? (
    <Navigate replace to="/login" />
  ) : (
    <Grid container direction="row">
      <Grid item xs={false} sm={false} md={3} lg={4} xl={4}></Grid>
      <Grid item xs={12} sm={12} md={6} lg={4} xl={4} className="App">
        <Grid
          style={{
            backgroundColor: '#1976d2',
            textAlign: 'start',
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingBottom: '24px',
            color: '#FFF',
          }}
        >
          <p style={{ fontSize: '28px' }} variant="h4">
            Assalamualikum, {JSON.parse(localStorage.getItem('user')).userName}!
          </p>
          <b>
            {percentage}% - {totalVersesRead} Verses Completed.
          </b>
          <br />
          <b style={{ color: '#ff9500' }}>
            {100 - percentage}% - {totalVerses - totalVersesRead} Verses left.
          </b>
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              flexDirection: 'row',
              borderStyle: 'solid',
              borderRadius: '8px',
              padding: '4px',
            }}
          >
            <div
              style={{
                borderRadius: '8px 0px 0px 8px',
                backgroundColor: '#fff',
                width: `${percentage}%`,
                height: '6px',
              }}
            ></div>
            <div
              style={{
                borderRadius: '0px 8px 8px 0px',
                backgroundColor: '#ff9500',
                width: `${100 - percentage}%`,
                height: '6px',
              }}
            ></div>
          </div>
          {percentage >= 100 ? (
            <div>
              <p>
                MashaAllah, Congratulation on completing Quran. Please click the
                below button and restart Quran again
              </p>
              <Button
                variant="contained"
                color="success"
                onClick={() => saveHistoryRestart()}
              >
                Save & Restart
              </Button>
            </div>
          ) : null}
        </Grid>
        <Item>
          <Tabs variant="fullWidth" value={value} onChange={handleChange}>
            <Tab label="Tracker" />
            <Tab label="Statistics" />
            <Tab label="History" />
            <Tab label="About Dev" />
          </Tabs>

          <SwipeableViews
            axis={'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0}>
              <Tracker
                handleChangeIndex={handleChangeIndex}
                list={mainList}
                getDataForUser={getDataForUser}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Statistics
                handleChangeIndex={handleChangeIndex}
                list={mainList}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <History
                handleChangeIndex={handleChangeIndex}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <LinksComponent />
            </TabPanel>
          </SwipeableViews>
        </Item>
      </Grid>
      <Grid item xs={false} sm={false} md={3} lg={4} xl={4}></Grid>
    </Grid>
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
