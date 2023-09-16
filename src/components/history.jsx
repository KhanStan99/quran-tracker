import { React, useState, useEffect } from 'react';
import { getHistoryData } from '../services/data-service';
import moment from 'moment';

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
    <div style={{ textAlign: '-webkit-center' }}>
      {data.length > 0 ? (
        <table className="progress">
          <thead>
            <tr>
              <th>Started At</th>
              <th>Finished At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{moment(item.startAt).format('DD/MM/YY - hh:mm a')}</td>
                  <td>{moment(item.endAt).format('DD/MM/YY - hh:mm a')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        'You dont have any history added'
      )}
    </div>
  );
}
