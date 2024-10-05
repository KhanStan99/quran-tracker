import {
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
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
      let data = props.list[0];
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
      setCurrentVerseNo(null);
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
          props.handleRefetch(1);
        })
        .catch((err) => {
          showAlert(true, 'error', err);
        });
    } else {
      showAlert(true, 'warning', 'Please select current verse and surah!');
    }
  };

  return (
    <Grid2
      padding={1}
      justifyContent="center"
      container
      spacing={2}
      width={'100%'}
    >
      <Grid2
        padding={1}
        borderRadius={12}
        backgroundColor="#e4e4e4"
        width={'100%'}
      >
        <Typography variant="body1">
          Last Aayah Read ({lastSurah} : {lastVerseNo})
        </Typography>

        {currentSurah > 0 || currentVerseNo > 0 ? (
          <Typography variant="body1">
            Current Aayah Read: ({currentSurah} : {currentVerseNo})
          </Typography>
        ) : null}
      </Grid2>

      {verse && <Typography variant="h6">Selected Aayah:{verse}</Typography>}

      <Grid2
        container
        textAlign="center"
        spacing={3}
        display={'flex'}
        width={'100%'}
        flexDirection={'column'}
      >
        <Grid2 item>
          <FormControl fullWidth variant="filled">
            <InputLabel>Select a Surah</InputLabel>
            <Select
              value={currentSurah ? currentSurah : ''}
              label="Select an Surah"
              onChange={(event) => surahSelected(event.target.value)}
            >
              {list.map((item, index) => {
                return (
                  <MenuItem key={index} value={index}>
                    {index + 1}. {item.transliteration}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid2>

        <Grid2 item>
          {currentSurah && (
            <FormControl fullWidth variant="filled">
              <InputLabel>Select an Aayah</InputLabel>
              <Select
                value={currentVerseNo ? currentVerseNo : ''}
                label="Select an Aayah"
                onChange={(event) => verseSelected(event.target.value)}
              >
                {versesList.map((item, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {item.text.slice(0, 25)}... {index + 1}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          )}
        </Grid2>

        <Button variant="contained" onClick={() => saveData()}>
          Save
        </Button>
        {verse && (
          <Typography variant="h6">
            <b>Note:</b> Aayahs mentioned here are just for reference, We
            recommend you to read Quran from a physical book or from an
            authenticated e-book and then save your progress here. Above shown
            aayahs are fetched from:{' '}
            <strong>
              <a href="https://github.com/risan/quran-json" target="_blank">
                risan/quran-json
              </a>
            </strong>
          </Typography>
        )}
      </Grid2>
    </Grid2>
  );
}
