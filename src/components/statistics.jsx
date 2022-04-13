import { React, useState } from 'react';
import { Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

export default function Statistics(props) {
  const oldData = JSON.parse(localStorage.getItem('oldData'));
  const oldGraphData = localStorage.getItem('oldGraphData')
    ? JSON.parse(localStorage.getItem('oldGraphData'))
    : [];
  const oldGraphTimeData = localStorage.getItem('oldGraphTimeData')
    ? JSON.parse(localStorage.getItem('oldGraphTimeData'))
    : [];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Graph View of Ayyahs Per Session',
      },
    },
  };
  const data = {
    labels: oldGraphTimeData,
    datasets: [
      {
        label: 'Checkpoint',
        data: oldGraphData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const [currentSurah] = useState(oldData ? oldData.currentSurah : 0);
  const [currentAayahNo] = useState(oldData ? oldData.currentAayahNo : 0);

  const [totalAayahsRead] = useState(oldData ? oldData.totalAayahsRead : 0);
  const totalAayaths = 6236;

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <Typography>Salam! Your progress so far</Typography>
      <table className="progress">
        <thead>
          <tr>
            <th>Category</th>
            <th>Statistics</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Total Aayahs Read:</td>
            <td>{totalAayahsRead}</td>
          </tr>
          <tr>
            <td>Percentage of Quran Completed:</td>
            <td>
              {parseFloat((totalAayahsRead / totalAayaths) * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td>Quran Left:</td>
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
        </tbody>
      </table>
      <Line options={options} data={data} />
    </div>
  );
}
