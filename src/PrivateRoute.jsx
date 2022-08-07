import { Navigate } from 'react-router-dom';

import { React } from 'react';

export default function PrivateRoute(props) {
  let auth = localStorage.getItem('user');
  return !auth ? <Navigate replace to="/login" /> : children;
}
