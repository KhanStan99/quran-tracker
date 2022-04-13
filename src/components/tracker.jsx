import { React, useState } from 'react';
import { Typography } from '@mui/material';
import quran from '../assets/quran.json';
import formatDate from '../date-formatter';
import Button from '@mui/material/Button';

export default function Tracker(props) {
  const oldData = JSON.parse(localStorage.getItem('oldData'));
  const oldGraphData = localStorage.getItem('oldGraphData')
    ? JSON.parse(localStorage.getItem('oldGraphData'))
    : [];
  const oldGraphTimeData = localStorage.getItem('oldGraphTimeData')
    ? JSON.parse(localStorage.getItem('oldGraphTimeData'))
    : [];

  const [list] = useState(quran);
  const [currentSurah, setCurrentSurah] = useState(
    oldData ? oldData.currentSurah : 0
  );
  const [currentAayahNo, setCurrentAayahNo] = useState(
    oldData ? oldData.currentAayahNo : 0
  );
  const [versesList, setVersesList] = useState(
    currentSurah ? list[currentSurah - 1].verses : []
  );
  const [aayah, setAayah] = useState('');
  const [totalAayahsRead, setTotalAayahs] = useState(
    oldData ? oldData.totalAayahsRead : 0
  );
  const totalAayaths = 6236;

  const surahSelected = (e) => {
    setCurrentSurah(e);
    if (e !== 0) {
      setVersesList(list[e - 1].verses);
      setCurrentAayahNo(0);
      setAayah('');
    } else {
      setCurrentSurah(0);
      setVersesList([]);
      setAayah('');
    }
  };

  const aayahSelected = (e) => {
    setCurrentAayahNo(e);
    if (e !== 0) {
      setAayah(versesList[e - 1].text);
    } else {
      setAayah('');
    }
  };

  const saveData = () => {
    let total = 0;
    if (currentSurah != 0) {
      for (let i = 0; i <= currentSurah - 2; i++) {
        total = total + list[i].total_verses;
      }
      total = total + currentAayahNo;
    } else {
      total = currentAayahNo;
    }
    setTotalAayahs(total);
    let data = {
      totalAayahsRead: total,
      currentSurah: currentSurah,
      currentAayahNo: currentAayahNo,
      currentAayah: aayah,
      percentage: parseFloat((totalAayahsRead / totalAayaths) * 100).toFixed(2),
    };

    if (oldData) {
      oldGraphData.push(total - oldData.totalAayahsRead);
    } else {
      oldGraphData.push(total);
    }
    oldGraphTimeData.push(formatDate(new Date(), 'dd-MMM | HH:mm aaa'));

    localStorage.setItem('oldGraphData', JSON.stringify(oldGraphData));
    localStorage.setItem('oldGraphTimeData', JSON.stringify(oldGraphTimeData));
    localStorage.setItem('oldData', JSON.stringify(data));

    window.location.reload(false);
  };

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <Typography variant="h6">
        Salam! Select your last read Surah and aayah and save your progress!
      </Typography>
      {currentSurah > 0 || currentAayahNo > 0 ? (
        <Typography variant="body1">
          <strong>Last Aayah: </strong>
          {currentSurah} : {currentAayahNo}{' '}
        </Typography>
      ) : null}

      <Typography variant="h6">Surah List</Typography>
      <div>
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

        <Typography variant="h6">Aayah List</Typography>

        <select
          className={props.classes.dropdown}
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
                {item.text.slice(0, 25)}... {index + 1}
              </option>
            );
          })}
        </select>
      </div>
      <h2>{aayah}</h2>
      {aayah != '' ? (
        <p>
          <b>Note:</b> Aayahs mentioned here is just for reference, We recommend
          you to read Quran from a physical book or from an authenticated e-book
          and then save your progress here. Above shown aayahs are fetched
          from":{' '}
          <strong>
            <a href="https://github.com/risan/quran-json" target="_blank">
              risan/quran-json
            </a>
          </strong>
        </p>
      ) : null}
      <Button variant="contained" onClick={() => saveData()}>
        Save
      </Button>
    </div>
  );
}
