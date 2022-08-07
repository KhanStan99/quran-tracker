import { Typography } from '@mui/material';
import { React, useState, useEffect } from 'react';
import formatDate from '../date-formatter';
import Button from '@mui/material/Button';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';

export default function Tracker(props) {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAayahNo, setCurrentAayahNo] = useState(0);
  const [totalAayahsRead, setTotalAayahsRead] = useState(0);
  const [list] = useState(quran);
  const [aayah, setAayah] = useState('');
  const [versesList, setVersesList] = useState([]);
  const totalAayaths = 6236;

  useEffect(() => {
    dataService
      .getData(localStorage.getItem('user'))
      .then((res) => {
        if (res.data.length > 0) {
          let data = res.data[0];

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
    setVersesList(currentSurah ? list[currentSurah - 1].verses : []);
  }, [currentSurah]);

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
    if (currentSurah != 1) {
      for (let i = 0; i <= currentSurah - 2; i++) {
        total = total + list[i].total_verses;
      }
      total = total + currentAayahNo;
    } else {
      total = currentAayahNo;
    }
    let data = {
      aayah_total: total,
      userId: localStorage.getItem('user'),
      current_surah: currentSurah,
      current_aayah: currentAayahNo,
      time_stamp: formatDate(new Date(), 'dd/MMM hh:mmaaa'),
    };

    dataService
      .updateData(data)
      .then(() => {
        alert('Bookmark Checkpoint Updated!');
        props.handleChangeIndex(1);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <Typography variant="h6" style={{ margin: '15px' }}>
        Salam! Select your last read Surah and aayah and save your progress!
      </Typography>
      {currentSurah > 0 || currentAayahNo > 0 ? (
        <Typography variant="body1">
          <strong>Last Aayah: </strong>
          {currentSurah} : {currentAayahNo}{' '}
        </Typography>
      ) : null}

      <div style={{ marginTop: '15px' }}>
        <Typography variant="h6">Surah List</Typography>
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
