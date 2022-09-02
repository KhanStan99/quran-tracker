import { React, useState, useEffect, useContext } from 'react';
import { Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';
import UserContext from './UserContext';

ChartJS.register(...registerables);

export default function Statistics(props) {
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
  const showAlert = useContext(UserContext);

  useEffect(() => {
    dataService
      .getData(JSON.parse(localStorage.getItem('user')).userId)
      .then((res) => {
        if (res.data.data.length > 0) {
          const mainData = res.data.data;
          let data = mainData[mainData.length - 1];
          console.log('🚀 ~ file: statistics.jsx ~ line 28 ~ data', data);

          let ff = [];
          let gg = [];
          mainData.forEach((bush) => {
            ff.push(bush.aayah_total);
          });
          mainData.forEach((bush) => {
            gg.push(bush.time_stamp);
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
      latest5 = oldGraphData.slice(
        oldGraphData.length - 5,
        oldGraphData.length
      );
    }
    let sum = latest5.reduce((sum, nextNum) => sum + nextNum, 0);
    setAvgFormula(sum / (historyLength > 5 ? 5 : historyLength));
  }, [oldGraphData]);

  const deleteClicked = () => {
    dataService
      .deleteLatestEntry(JSON.parse(localStorage.getItem('user')).userId)
      .then((res) => {
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
      oldGraphTimeData.length > 5
        ? oldGraphTimeData.slice(
            oldGraphTimeData.length - 5,
            oldGraphTimeData.length
          )
        : oldGraphTimeData,
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
            <td>Total Aayahs Read</td>
            <td>{totalAayahsRead}</td>
          </tr>
          <tr>
            <td>Percentage of Quran Completed:</td>
            <td>{percentage}%</td>
          </tr>
          <tr>
            <td>Quran Left</td>
            <td>
              {totalAayaths - totalAayahsRead} Aayahs |{'  '}
              {parseFloat(
                ((totalAayaths - totalAayahsRead) / totalAayaths) * 100
              ).toFixed(2)}
              %
            </td>
          </tr>

          <tr>
            <td>Last Aayah</td>
            <td>
              {currentSurah} : {currentAayahNo}
            </td>
          </tr>
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
          {oldGraphData.map((item, index) => {
            return (
              <tr key={index}>
                <td>{oldGraphTimeData[index]}</td>
                <td>
                  {item}{' '}
                  {index === oldGraphData.length - 1 ? (
                    <strong onClick={deleteClicked}>
                      <i>Delete Entry</i>
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
