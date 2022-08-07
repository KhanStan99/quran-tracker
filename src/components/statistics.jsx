import { React, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';
ChartJS.register(...registerables);

export default function Statistics() {
  const [oldGraphData, setOldGraphData] = useState([]);
  const [oldGraphTimeData, setOldGraphTimeData] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(0);
  const [currentAayahNo, setCurrentAayahNo] = useState(0);
  const [totalAayahsRead, setTotalAayahsRead] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [avgFormula, setAvgFormula] = useState(0);
  const [list] = useState(quran);
  const totalAayaths = 6236;

  useEffect(() => {
    dataService
      .getData(localStorage.getItem('user'))
      .then((res) => {
        if (res.data.length > 0) {
          let data = res.data[0];

          setOldGraphTimeData(data.time_stamp);
          setOldGraphData(data.aayah_total);
          setCurrentSurah(data.current_surah);
          setCurrentAayahNo(data.current_aayah);
          let total = 0;
          if (data.current_surah != 1) {
            for (let i = 0; i <= data.current_surah - 2; i++) {
              total = total + list[i].total_verses;
            }

            setTotalAayahsRead(total + data.current_aayah);
          } else {
            setTotalAayahsRead(data.current_aayah);
          }
        }
      })
      .catch((err) => {
        alert(err);
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

  return (
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
            <td>{avgFormula ? avgFormula.toFixed(2) + " Aayah's" : null}</td>
          </tr>
          <tr>
            <td>Sesssions to Complete (Based on Avg.)</td>
            <td>
              {avgFormula
                ? ((totalAayaths - totalAayahsRead) / avgFormula).toFixed(2)
                : null}
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
                <td>{item}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
