import { React, useState, useEffect, useContext } from 'react';
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
    responsive: true,
    scales: {
      y: {
        min: Math.min(...data.datasets[0].data) - 10,
        stepSize: 20,
      },
      x: {},
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Graph view of verses read per session (Showing last ${countFrom} sessions)`,
      },
    },
  };

  return (
    <div style={{ textAlign: '-webkit-center' }}>
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
            <td>
              Average verses read per session (Showing last {countFrom}{' '}
              sessions)
            </td>
            <td>{avgFormula ? avgFormula.toFixed(2) + ' Verses' : 'N/A'}</td>
          </tr>
          <tr>
            <td>Sessions to Complete (Based on Avg.)</td>
            <td>
              {avgFormula
                ? ((totalVerses - totalVersesRead) / avgFormula).toFixed(2)
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
                  {listHistoryVerse[index]}{' '}
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
  );
}
