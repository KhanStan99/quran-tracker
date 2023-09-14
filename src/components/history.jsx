import { React, useState, useEffect, useContext } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import dataService, { getHistoryData } from '../services/data-service';


export default function History(props) {
  const [data, setDate] = useState(null);
  useEffect(() => {
    getHistoryData(JSON.parse(localStorage.getItem('user')).userId).then((data) => {
      console.log("fddfsd", data);
    })
  }, []);

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      You dont have any history added
    </div>
  );
}
