import { React, useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Statistics from './statistics';
import History from './history';
import Tracker from './tracker';
import { Box, Button, Grid2, Tab, Tabs, Typography } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import './styles.css';
import LinksComponent from './about-dev';
import { Navigate } from 'react-router-dom';
import quran from '../assets/quran.json';
import { getData, saveHistoryData } from '../services/data-service';
import { formatNumber } from '../utils/text-utils';

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

  const saveHistoryRestart = async () => {
    await saveHistoryData({
      user: JSON.parse(localStorage.getItem('user')).userId,
      startAt: mainList[mainList.length - 1].time_stamp,
      endAt: mainList[0].time_stamp,
    });
    window.location.reload();
  };

  return !auth ? (
    <Navigate replace to="/login" />
  ) : (
    <Grid2 flexDirection="column">
      <Grid2
        container
        spacing={1}
        display={'flex'}
        flexDirection={'column'}
        sx={{
          backgroundColor: 'primary.main',
          textAlign: 'center',
          color: 'white',
        }}
        padding={2}
      >
        <Typography variant="h4">
          Assalamualikum, {JSON.parse(localStorage.getItem('user')).userName}!
        </Typography>

        <Box>
          <Typography variant="subtitle1">
            {formatNumber(percentage)}% ({formatNumber(totalVersesRead)}){' '}
            Completed.
          </Typography>

          <Typography variant="subtitle1">
            {formatNumber(totalVerses - totalVersesRead)}{' '}
            {formatNumber(100 - percentage)}% left.
          </Typography>
        </Box>

        <Grid2
          display="flex"
          flexDirection="row"
          borderRadius="8px"
          padding="4px"
        >
          <Grid2
            sx={{
              borderRadius: '8px 0px 0px 8px',
              backgroundColor: 'secondary.main',
              width: `${percentage}%`,
              height: '6px',
            }}
          />
          <Grid2
            width={`${100 - percentage}%`}
            borderRadius={'0px 8px 8px 0px'}
            backgroundColor="white"
            height="6px"
          />
        </Grid2>

        {percentage >= 100 ? (
          <Grid2>
            <Typography variant="subtitle1">
              MashaAllah, Congratulation on completing Quran. Please click the
              below button and restart Quran again
            </Typography>
            <Button variant="contained" onClick={() => saveHistoryRestart()}>
              Save & Restart
            </Button>
          </Grid2>
        ) : null}
      </Grid2>
      <Item>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
        >
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
            <Statistics handleChangeIndex={handleChangeIndex} list={mainList} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <History handleChangeIndex={handleChangeIndex} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <LinksComponent />
          </TabPanel>
        </SwipeableViews>
      </Item>
    </Grid2>
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
    <Grid2
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </Grid2>
  );
}
