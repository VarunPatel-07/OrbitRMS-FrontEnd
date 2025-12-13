import { Navigate } from 'react-router-dom';

import {
  clearLocalSessionStorage,
  getDataFromLocalStorage,
  getDataFromTheSessionStorage,
} from './HelperFunctions';

const RedirectToDashboard = () => {
  const _data = getDataFromLocalStorage('organization-info');
  const _localToken = getDataFromLocalStorage('authenticationToken');
  const _sessionToken = getDataFromTheSessionStorage('authenticationToken');

  const authToken = `Bearer ${_localToken || _sessionToken}`;
  const tokenValue = authToken.split('Bearer')[1]?.trim();
  try {
    if (_data && tokenValue) {
      return (
        <Navigate to={`${JSON.parse(_data)?.portal_slug}/dashboard`} replace />
      );
    } else {
      clearLocalSessionStorage();
      return <Navigate to='/auth/sign-in' replace />;
    }
  } catch {
    clearLocalSessionStorage();
    return <Navigate to='/auth/sign-in' replace />;
  }
};

export default RedirectToDashboard;
