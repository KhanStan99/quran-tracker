import { Typography } from '@mui/material';
import { React, useState, useEffect, useContext } from 'react';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';
import UserContext from './UserContext';
import './styles.css';

export default function Tracker(props) {
  const [lastSurah, setLastSurah] = useState(0);
  const [lastAayahNo, setLastAayahNo] = useState(0);

  const [currentAayahNo, setCurrentAayahNo] = useState(null);
  const [currentSurah, setCurrentSurah] = useState(null);

  const [totalAayahsRead, setTotalAayahsRead] = useState(0);
  const [list] = useState(quran);
  const [aayah, setAayah] = useState('');
  const [versesList, setVersesList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const showAlert = useContext(UserContext);

  useEffect(() => {
    dataService
      .getData(JSON.parse(localStorage.getItem('user')).userId)
      .then((res) => {
        if (res.data.data.length > 0) {
          const mainData = res.data.data;
          let data = mainData[mainData.length - 1];

          setLastSurah(data.current_surah);
          setLastAayahNo(data.current_aayah);
          setTotalAayahsRead(data.total_read);
        }
        setLoading(false);
      })
      .catch((err) => {
        showAlert(true, 'error', err);
      });
  }, []);

  useEffect(() => {
    setVersesList(lastSurah ? list[lastSurah - 1].verses : []);
  }, [lastSurah]);

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
    if (currentSurah && currentAayahNo) {
      let total = 0;
      let lastTotal = 0;

      if (lastSurah != 0) {
        for (let i = 0; i <= lastSurah - 2; i++) {
          lastTotal = lastTotal + list[i].total_verses;
        }
        lastTotal = lastTotal + lastAayahNo;
      } else {
        lastTotal = lastAayahNo;
      }

      if (currentSurah != 0) {
        for (let i = 0; i <= currentSurah - 2; i++) {
          total = total + list[i].total_verses;
        }
        total = total + currentAayahNo;
      } else {
        total = currentAayahNo;
      }
      let data = {
        data: {
          aayah_total: total - lastTotal,
          current_surah: currentSurah,
          current_aayah: currentAayahNo,
          time_stamp: new Date(),
        },
        userId: JSON.parse(localStorage.getItem('user')).userId,
      };

      dataService
        .updateData(data)
        .then(() => {
          showAlert(true, 'success', 'Bookmark Checkpoint Updated!');
          props.handleChangeIndex(1);
        })
        .catch((err) => {
          showAlert(true, 'error', err);
        });
    } else {
      showAlert(true, 'warning', 'Please select current aayah and surah!');
    }
  };

  return !isLoading ? (
    <div
      className="font-family"
      style={{ padding: '0px 24px 24px 24px', textAlign: 'start' }}
    >
      {lastSurah > 0 || lastAayahNo > 0 ? (
        <p
          className="font-family"
          style={{ fontSize: '22px', marginTop: '0px', marginBottom: '-5px' }}
        >
          <strong className="font-family">
            Last Aayah: {lastSurah} : {lastAayahNo}
          </strong>
        </p>
      ) : null}

      {currentSurah > 0 || currentAayahNo > 0 ? (
        <p
          className="font-family"
          style={{ fontSize: '22px', marginTop: '0px', marginBottom: '-5px' }}
        >
          <strong className="font-family">
            Current Aayah: {currentSurah} : {currentAayahNo}
          </strong>
        </p>
      ) : null}

      <div style={{ marginTop: '15px' }}>
        <p>
          <strong>Surah List</strong>
        </p>
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

        <p>
          <strong className="font-family">Aayah List</strong>
        </p>

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
      <button className="raised_button" onClick={() => saveData()}>
        Save
      </button>
    </div>
  ) : (
    <p>Loading</p>
  );
}
