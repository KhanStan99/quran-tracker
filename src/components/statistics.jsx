import { React, useState } from "react";
import { Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

export default function Statistics(props) {
  const oldData = JSON.parse(localStorage.getItem("oldData"));
  const oldGraphData = localStorage.getItem("oldGraphData")
    ? JSON.parse(localStorage.getItem("oldGraphData"))
    : [];
  const oldGraphTimeData = localStorage.getItem("oldGraphTimeData")
    ? JSON.parse(localStorage.getItem("oldGraphTimeData"))
    : [];

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Graph View of Ayyahs Per Session (Showing last 5 sessions)",
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
        label: "Checkpoint",
        data:
          oldGraphData.length > 5
            ? oldGraphData.slice(oldGraphData.length - 5, oldGraphData.length)
            : oldGraphData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const [currentSurah] = useState(oldData ? oldData.currentSurah : 0);
  const [currentAayahNo] = useState(oldData ? oldData.currentAayahNo : 0);

  const [totalAayahsRead] = useState(oldData ? oldData.totalAayahsRead : 0);
  const totalAayaths = 6236;
  const avgFormula =
    (oldGraphData.length > 5
      ? oldGraphData.slice(oldGraphData.length - 5, oldGraphData.length)
      : oldGraphData
    ).reduce((partialSum, a) => partialSum + a, 0) / oldGraphData.length;

  return (
    <div style={{ textAlign: "-webkit-center" }}>
      <Typography style={{ margin: "15px" }}>
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
            <td>
              {parseFloat((totalAayahsRead / totalAayaths) * 100).toFixed(2)}%
            </td>
          </tr>
          <tr>
            <td>Quran Left</td>
            <td>
              {totalAayaths - totalAayahsRead} Aayahs |{"  "}
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
            <td>{avgFormula.toFixed(2)} Aayah's</td>
          </tr>
          <tr>
            <td>Sesssions to Complete (Based on Avg.)</td>

            <td>
              {((totalAayaths - totalAayahsRead) / avgFormula).toFixed(2)}{" "}
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
