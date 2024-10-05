import { React, useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';
import UserContext from './UserContext';
import moment from 'moment';
import {
  Button,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

ChartJS.register(...registerables);

export default function Statistics(props) {
  const [oldGraphData, setOldGraphData] = useState([]);
  const [graphHistory, setGraphHistory] = useState([]);
  const [listHistory, setListHistory] = useState([]);
  const [listHistoryVerse, setListHistoryVerse] = useState([]);

  const [totalVersesRead, setTotalVersesRead] = useState(0);
  const [avgFormula, setAvgFormula] = useState(0);
  const [list] = useState(quran);
  const totalVerses = 6236;
  const countFrom = 7;
  const showAlert = useContext(UserContext);

  useEffect(() => {
    if (props.list.length > 0) {
      let readingResponseItem = props.list;
      let latestReadingItem = readingResponseItem[0];
      let readVersusList = [];
      let graphHistory = [];
      let listHistory = [];
      readingResponseItem.forEach((bush) => {
        readVersusList.push(bush.aayah_total);
      });
      readingResponseItem.forEach((bush) => {
        graphHistory.push(moment(bush.time_stamp).format('DD/MM'));
        listHistory.push(moment(bush.time_stamp).format('DD/MM/YY - hh:mm a'));
      });

      setOldGraphData(readVersusList);
      setGraphHistory(graphHistory);

      setListHistory(listHistory);
      setListHistoryVerse(readVersusList);

      let total = 0;
      if (latestReadingItem.current_surah != 0) {
        for (let i = 0; i <= latestReadingItem.current_surah - 2; i++) {
          total = total + list[i].total_verses;
        }
        setTotalVersesRead(total + latestReadingItem.current_aayah);
      } else {
        setTotalVersesRead(latestReadingItem.current_aayah);
      }
    }
  }, [props.list]);

  useEffect(() => {
    let historyLength = oldGraphData.length;
    let latest5 = oldGraphData;

    if (historyLength > countFrom) {
      latest5 = oldGraphData.slice(0, countFrom);
    }

    let sum = latest5.reduce((sum, nextNum) => sum + nextNum, 0);
    setAvgFormula(
      sum / (historyLength > countFrom ? countFrom : historyLength)
    );
  }, [oldGraphData]);

  const deleteClicked = () => {
    dataService
      .deleteLatestEntry(JSON.parse(localStorage.getItem('user')).userId)
      .then(() => {
        props.handleChangeIndex(0);
      })
      .catch((err) => {
        showAlert(true, 'error', err);
      });
  };

  const data = {
    labels:
      graphHistory.length > countFrom
        ? graphHistory.slice(0, countFrom).reverse()
        : graphHistory.slice(0, oldGraphData.length).reverse(),
    datasets: [
      {
        label: '# of Versus',
        data:
          oldGraphData.length > countFrom
            ? oldGraphData.slice(0, countFrom).reverse()
            : oldGraphData.slice(0, oldGraphData.length).reverse(),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Graph view of verses read per session (Showing last ${countFrom} sessions)`,
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <Grid2
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={1}
      container
      spacing={2}
    >
      <Line options={options} data={data} />

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Statistics</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow
              key={1}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Average verses read per session (Showing last {countFrom}{' '}
                sessions)
              </TableCell>
              <TableCell align="right">
                {avgFormula ? avgFormula.toFixed(2) + ' Verses' : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow
              key={2}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Sessions to Complete (Based on Avg.)
              </TableCell>
              <TableCell align="right">
                {avgFormula
                  ? ((totalVerses - totalVersesRead) / avgFormula).toFixed(2)
                  : 'N/A'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Entry</TableCell>
              <TableCell align="right">No. of Aayahs</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {listHistory.map((item, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {item}
                  </TableCell>
                  <TableCell align="right">
                    <Grid2
                      container
                      display={'flex'}
                      justifyContent={'space-evenly'}
                      alignItems={'center'}
                    >
                      <Typography variant="body1">
                        {listHistoryVerse[index]}{' '}
                      </Typography>

                      {index === 0 && (
                        <Button
                          variant="contained"
                          onClick={deleteClicked}
                          startIcon={<DeleteForever />}
                        >
                          Delete
                        </Button>
                      )}
                    </Grid2>
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow
              key={1}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Sessions to Complete (Based on Avg.)
              </TableCell>
              <TableCell align="right">
                {avgFormula
                  ? ((totalVerses - totalVersesRead) / avgFormula).toFixed(2)
                  : 'N/A'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid2>
  );
}
