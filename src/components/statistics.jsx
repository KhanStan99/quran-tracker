import { React, useState, useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';
import UserContext from './UserContext';
import moment from 'moment';

ChartJS.register(...registerables);

export default function Statistics(props) {
  const [oldGraphData, setOldGraphData] = useState([]);
  const [graphHistory, setGraphHistory] = useState([]);
  const [listHistory, setListHistory] = useState([]);
  const [listHistoryAayah, setListHistoryAayah] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(0);
  const [currentAayahNo, setCurrentAayahNo] = useState(0);
  const [totalAayahsRead, setTotalAayahsRead] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [avgFormula, setAvgFormula] = useState(0);
  const [list] = useState(quran);
  const totalAayaths = 6236;
  const [isLoading, setLoading] = useState(true);
  const showAlert = useContext(UserContext);

  useEffect(() => {
    dataService
      .getData(JSON.parse(localStorage.getItem('user')).userId)
      .then((res) => {
        if (res.data.data.length > 0) {
          const readingResponseItem = res.data.data;
          let latestReadingItem =
            readingResponseItem[readingResponseItem.length - 1];
          let readAayashList = [];
          let graphHistory = [];
          let listHistory = [];
          readingResponseItem.forEach((bush) => {
            readAayashList.push(bush.aayah_total);
          });
          readingResponseItem.forEach((bush) => {
            graphHistory.push(moment(bush.time_stamp).format('DD/MM'));
            listHistory.push(moment(bush.time_stamp).format('DD/MM - hh:mm a'));
          });

          setOldGraphData(readAayashList);
          setGraphHistory(graphHistory);

          setListHistory(listHistory.reverse());
          setListHistoryAayah(readAayashList.reverse());

          setCurrentSurah(latestReadingItem.current_surah);
          setCurrentAayahNo(latestReadingItem.current_aayah);

          let total = 0;
          if (latestReadingItem.current_surah != 0) {
            for (let i = 0; i <= latestReadingItem.current_surah - 2; i++) {
              total = total + list[i].total_verses;
            }
            setTotalAayahsRead(total + latestReadingItem.current_aayah);
          } else {
            setTotalAayahsRead(latestReadingItem.current_aayah);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        showAlert(true, 'error', err);
      });
  }, []);

  useEffect(() => {
    setPercentage(
      parseFloat((totalAayahsRead / totalAayaths) * 100).toFixed(2)
    );
  }, [totalAayahsRead]);

  useEffect(() => {
    let historyLength = oldGraphData.length;
    let latest5 = oldGraphData;

    if (historyLength > 5) {
      latest5 = oldGraphData.slice(0, 5);
    }
    let sum = latest5.reduce((sum, nextNum) => sum + nextNum, 0);
    setAvgFormula(sum / (historyLength > 5 ? 5 : historyLength));
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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Graph View of Ayyahs Per Session (Showing last 5 sessions)',
      },
    },
  };
  const data = {
    labels:
      graphHistory.length > 5
        ? graphHistory.slice(graphHistory.length - 5, graphHistory.length)
        : graphHistory,
    datasets: [
      {
        label: 'Checkpoint',
        data:
          oldGraphData.length > 5
            ? oldGraphData.slice(oldGraphData.length - 5, oldGraphData.length)
            : oldGraphData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return !isLoading ? (
    <div style={{ textAlign: '-webkit-center' }}>
      <Typography style={{ margin: '15px' }}>
        <strong>Salam!</strong> Your progress so far:
      </Typography>
      <Line options={options} data={data} />
      <table className="progress">
        <thead>
          <tr>
            <th>Category</th>
            <th>Statistics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Average Aayah(s) read per session (Avg. of last 5 sessions)</td>
            <td>{avgFormula ? avgFormula.toFixed(2) + " Aayah's" : 'N/A'}</td>
          </tr>
          <tr>
            <td>Sesssions to Complete (Based on Avg.)</td>
            <td>
              {avgFormula
                ? ((totalAayaths - totalAayahsRead) / avgFormula).toFixed(2)
                : 'N/A'}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="progress">
        <thead>
          <tr>
            <th>Entry</th>
            <th>No. of Aayahs</th>
          </tr>
        </thead>
        <tbody>
          {listHistory.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item}</td>
                <td>
                  {listHistoryAayah[index]}{' '}
                  {index === 0 ? (
                    <strong
                      style={{ cursor: 'pointer' }}
                      onClick={deleteClicked}
                    >
                      <i> - Delete Entry</i>
                    </strong>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <p>Loading</p>
  );
}
