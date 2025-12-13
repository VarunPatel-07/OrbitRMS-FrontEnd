import React from 'react';
import { Navigate } from 'react-router-dom';

import {
  getDataFromLocalStorage,
  getDataFromTheSessionStorage,
} from './HelperFunctions';

function ProtectedRoute({ element }: { element: React.ReactElement }) {
  const isAuthenticated =
    getDataFromLocalStorage('authenticationToken') ||
    getDataFromTheSessionStorage('authenticationToken');

  return typeof isAuthenticated === 'string' &&
    isAuthenticated.trim() !== '' ? (
    element
  ) : (
    <Navigate to='/auth/sign-in' />
  );
}

export default ProtectedRoute;
