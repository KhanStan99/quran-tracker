import { React } from 'react';
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
  Typography,
} from '@mui/material';
import { useGetUserHistoryDataByIdQuery } from '../services/dataService';

export default function History() {
  const { data, isLoading } = useGetUserHistoryDataByIdQuery(
    JSON.parse(localStorage.getItem('user')).userId,
    { refetchOnMount: false, refetchOnReconnect: false, refetchOnFocus: false }
  );

  return (
    <Grid2>
      {isLoading && <Typography variant="h6">Loading history...</Typography>}
      {!isLoading && data.length > 0 ? (
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
