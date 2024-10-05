import { React, useState, useEffect } from 'react';
import { getHistoryData } from '../services/data-service';
import moment from 'moment';
import {
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function History(props) {
  const [data, setDate] = useState([]);
  useEffect(() => {
    getHistoryData(JSON.parse(localStorage.getItem('user')).userId).then(
      (response) => {
        if (response.data && response.data.length > 0) {
          setDate(response.data);
        }
      }
    );
  }, []);

  return (
    <Grid2>
      {data.length > 0 ? (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Started At</TableCell>
                <TableCell align="right">Finished At</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {moment(item.startAt).format('DD/MM/YY - hh:mm a')}
                    </TableCell>
                    <TableCell align="right">
                      {moment(item.endAt).format('DD/MM/YY - hh:mm a')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        'You dont have any history added'
      )}
    </Grid2>
  );
}
