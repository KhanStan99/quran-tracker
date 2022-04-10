import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const oldData = JSON.parse(localStorage.getItem("oldData"));

  const [list, setList] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(
    oldData ? oldData.currentSurah : 0
  );
  const [currentAayahNo, setCurrentAayahNo] = useState(
    oldData ? oldData.currentAayahNo : 0
  );
  const [versesList, setVersesList] = useState([]);
  const [aayah, setAayah] = useState("");
  const [totalAayahsRead, setTotalAayahs] = useState(0);

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json")
      .then((response) => response.json())
      .then((data) => {
        setList(data);
      });
  }, []);

  useEffect(() => {
    setVersesList(
      currentSurah && list.length > 0 ? list[currentSurah - 1].verses : []
    );
    setTotalAayahs(oldData ? oldData.totalAayahsRead : 0);
  }, list);

  const surahSelected = (e) => {
    setCurrentSurah(e);
    if (e !== 0) {
      setVersesList(list[e - 1].verses);
      setCurrentAayahNo(0);
      setAayah("");
    } else {
      setCurrentSurah(0);
      setVersesList([]);
      setAayah("");
    }
  };

  const aayahSelected = (e) => {
    setCurrentAayahNo(e);
    if (e !== 0) {
      setAayah(versesList[e - 1].text);
    } else {
      setAayah("");
    }
  };

  const saveData = () => {
    let total = 0;
    for (let i = 0; i < currentSurah; i++) {
      total = total + list[i].total_verses;
    }
    setTotalAayahs(total);
    let data = {
      totalAayahsRead: total,
      currentSurah: currentSurah,
      currentAayahNo: currentAayahNo,
      currentAayah: aayah,
      percentage: parseFloat((totalAayahsRead / 6666) * 100).toFixed(2)
    };
    localStorage.setItem("oldData", JSON.stringify(data));
  };

  return (
    <div className="App">
      <h1>Quran Tracker</h1>
      <div>
        <h2>
          {totalAayahsRead > 0
            ? "Salam! Your progress so far:"
            : "Salam! Select your last read Surah and aayah and save your progress!"}
        </h2>
        <table id="progress">
          <tr>
            <th>Category</th>
            <th>Statistics</th>
          </tr>
          <tr>
            <td>Total Aayahs Read:</td>
            <td>{totalAayahsRead}</td>
          </tr>
          <tr>
            <td>Percentage of Quran Completed:</td>
            <td>{parseFloat((totalAayahsRead / 6666) * 100).toFixed(2)}%</td>
          </tr>
          <tr>
            <td>Quran Left:</td>
            <td>
              {6666 - totalAayahsRead} Aayahs |{"  "}
              {parseFloat(((6666 - totalAayahsRead) / 6666) * 100).toFixed(2)}%
            </td>
          </tr>
        </table>
      </div>
      <h2>Surah List</h2>
      <div class="box">
        <select
          onChange={(event) =>
            surahSelected(event.target.options.selectedIndex)
          }
        >
          <option key="0" value={null}>
            -- Select Current Surah --
          </option>
          {list.map((item, index) => {
            return (
              <option key={item.id} value={item.verses}>
                {index + 1}. {item.transliteration}
              </option>
            );
          })}
        </select>

        <h2>Aayah List</h2>
        <select
          onChange={(event) =>
            aayahSelected(event.target.options.selectedIndex)
          }
        >
          <option key="0" value={null}>
            -- Select Last Read Aayah--
          </option>
          {versesList.map((item, index) => {
            return (
              <option key={index}>
                {item.text.slice(0, 15)}... {index + 1}
              </option>
            );
          })}
        </select>
      </div>
      <h2>{aayah}</h2>
      <button className="button" onClick={() => saveData()}>
        Save
      </button>
    </div>
  );
}