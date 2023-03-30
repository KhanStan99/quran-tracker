import { Typography } from '@mui/material';
import { React, useState, useEffect, useContext } from 'react';
import dataService from '../services/data-service';
import quran from '../assets/quran.json';
import UserContext from './UserContext';
import './styles.css';

export default function Tracker(props) {
  const [lastSurah, setLastSurah] = useState(0);
  const [lastVerseNo, setLastVerseNo] = useState(0);

  const [currentVerseNo, setCurrentVerseNo] = useState(null);
  const [currentSurah, setCurrentSurah] = useState(null);

  const [list] = useState(quran);
  const [verse, setVerse] = useState('');
  const [versesList, setVersesList] = useState([]);
  const showAlert = useContext(UserContext);

  useEffect(() => {
    if (props.list.length > 0) {
      let data = props.list[props.list.length - 1];
      setLastSurah(data.current_surah);
      setLastVerseNo(data.current_aayah);
    }
  }, [props.list]);

  useEffect(() => {
    setVersesList(lastSurah ? list[lastSurah - 1].verses : []);
  }, [lastSurah]);

  const surahSelected = (e) => {
    setCurrentSurah(e);
    if (e !== 0) {
      setVersesList(list[e - 1].verses);
      setCurrentVerseNo(0);
      setVerse('');
    } else {
      setCurrentSurah(0);
      setVersesList([]);
      setVerse('');
    }
  };

  const verseSelected = (e) => {
    setCurrentVerseNo(e);
    if (e !== 0) {
      setVerse(versesList[e - 1].text);
    } else {
      setVerse('');
    }
  };

  const saveData = () => {
    if (currentSurah && currentVerseNo) {
      let total = 0;
      let lastTotal = 0;

      if (lastSurah != 0) {
        for (let i = 0; i <= lastSurah - 2; i++) {
          lastTotal = lastTotal + list[i].total_verses;
        }
        lastTotal = lastTotal + lastVerseNo;
      } else {
        lastTotal = lastVerseNo;
      }

      if (currentSurah != 0) {
        for (let i = 0; i <= currentSurah - 2; i++) {
          total = total + list[i].total_verses;
        }
        total = total + currentVerseNo;
      } else {
        total = currentVerseNo;
      }
      let data = {
        data: {
          aayah_total: total - lastTotal,
          current_surah: currentSurah,
          current_aayah: currentVerseNo,
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
      showAlert(true, 'warning', 'Please select current verse and surah!');
    }
  };

  return props.list.length > 0 ? (
    <div
      className="font-family"
      style={{ padding: '0px 24px 24px 24px', textAlign: 'start' }}
    >
      <div
        style={{
          backgroundColor: '#e4e4e4',
          marginTop: '10px',
          padding: '12px',
          borderRadius: '12px',
        }}
      >
        {lastSurah > 0 || lastVerseNo > 0 ? (
          <p
            className="font-family"
            style={{ fontSize: '22px', marginTop: '0px', marginBottom: '-5px' }}
          >
            <strong className="font-family">Last Aayah Read:</strong>{' '}
            {lastSurah} : {lastVerseNo}
          </p>
        ) : null}

        {currentSurah > 0 || currentVerseNo > 0 ? (
          <p
            className="font-family"
            style={{ fontSize: '22px', marginTop: '0px', marginBottom: '-5px' }}
          >
            <strong className="font-family">Current Aayah Read:</strong>{' '}
            {currentSurah} : {currentVerseNo}
          </p>
        ) : null}
      </div>
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <p>
          <strong>Surah List</strong>
        </p>
        <select
          value={lastSurah - 1}
          onChange={(event) =>
            surahSelected(event.target.options.selectedIndex)
          }
        >
          <option key="0" value={0}>
            -- Select Current Surah --
          </option>
          {list.map((item, index) => {
            return (
              <option key={item.id} value={index}>
                {index + 1}. {item.transliteration}
              </option>
            );
          })}
        </select>

        <p>
          <strong className="font-family">Aayah List</strong>
        </p>

        <select
          value={lastVerseNo - 1}
          onChange={(event) =>
            verseSelected(event.target.options.selectedIndex)
          }
        >
          <option key="0" value={null}>
            -- Select Last Read Aayah--
          </option>
          {versesList.map((item, index) => {
            return (
              <option key={index} value={index}>
                {item.text.slice(0, 25)}... {index + 1}
              </option>
            );
          })}
        </select>
        <h2>{verse}</h2>
        {verse != '' ? (
          <p>
            <b>Note:</b> Aayahs mentioned here is just for reference, We
            recommend you to read Quran from a physical book or from an
            authenticated e-book and then save your progress here. Above shown
            aayahs are fetched from":{' '}
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
    </div>
  ) : (
    <p>Loading</p>
  );
}
