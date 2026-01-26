import { Navigate } from 'react-router-dom';

import {
  clearLocalSessionStorage,
  getDataFromSecureCookie,
} from './HelperFunctions';

const RedirectToDashboard = () => {
  const _data = getDataFromSecureCookie('organization-info');
  const tokenValue = getDataFromSecureCookie('authenticationToken');
  console.log(_data, tokenValue);
  try {
    if (_data && tokenValue) {
      return (
        <Navigate to={`${_data?.portal_slug}/dashboard`} replace />
      );
    } else {
      console.log("we don't have the cred??")
      clearLocalSessionStorage();
      return <Navigate to='/auth/sign-in' replace />;
    }
  } catch {
    clearLocalSessionStorage();
    return <Navigate to='/auth/sign-in' replace />;
  }
};

export default RedirectToDashboard;
