import { React, useState, useEffect, useContext } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Statistics from './statistics';
import Tracker from './tracker';
import { Grid, Tab, Tabs, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import './styles.css';
import LinksComponent from './about-dev';
import { Navigate } from 'react-router-dom';
import quran from '../assets/quran.json';
import dataService from '../services/data-service';
import moment from 'moment';

export default function App() {
  let auth = localStorage.getItem('user');
  const [value, setValue] = useState(0);
  const [oldGraphData, setOldGraphData] = useState([]);
  const [oldGraphTimeData, setOldGraphTimeData] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(0);
  const [currentAayahNo, setCurrentAayahNo] = useState(0);
  const [totalAayahsRead, setTotalAayahsRead] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [avgFormula, setAvgFormula] = useState(0);
  const [list] = useState(quran);
  const totalAayaths = 6236;
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    dataService
      .getData(JSON.parse(localStorage.getItem('user')).userId)
      .then((res) => {
        if (res.data.data.length > 0) {
          const mainData = res.data.data;
          let data = mainData[mainData.length - 1];
          let ff = [];
          let gg = [];
          mainData.forEach((bush) => {
            ff.push(bush.aayah_total);
            gg.push(moment(bush.time_stamp).format('DD-MM-YY HH:MM'));
          });

          setOldGraphData(ff);
          setOldGraphTimeData(gg);
          setCurrentSurah(data.current_surah);
          setCurrentAayahNo(data.current_aayah);
          let total = 0;
          if (data.current_surah != 0) {
            for (let i = 0; i <= data.current_surah - 2; i++) {
              total = total + list[i].total_verses;
            }
            setTotalAayahsRead(total + data.current_aayah);
          } else {
            setTotalAayahsRead(data.current_aayah);
          }
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setPercentage(
      parseFloat((totalAayahsRead / totalAayaths) * 100).toFixed(2)
    );
  }, [totalAayahsRead]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return !auth ? (
    <Navigate replace to="/login" />
  ) : (
    <Grid container direction="row">
      <Grid
        item
        xs={false}
        sm={false}
        md={3}
        lg={4}
        xl={4}
      ></Grid>
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
          <p>You have completed {percentage}% of Quran.</p>
          <p style={{ color: '#ff9500' }}>
            {100 - percentage}% - {totalAayaths - totalAayahsRead} Aayahs left.
          </p>
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
        </Grid>
        <Item>
          <Tabs variant="fullWidth" value={value} onChange={handleChange}>
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
              <Statistics handleChangeIndex={handleChangeIndex} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <LinksComponent />
            </TabPanel>
          </SwipeableViews>
        </Item>
      </Grid>
      <Grid
        item
        xs={false}
        sm={false}
        md={3}
        lg={4}
        xl={4}
      ></Grid>
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
