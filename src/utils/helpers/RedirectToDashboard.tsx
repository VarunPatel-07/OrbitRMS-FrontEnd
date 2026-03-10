import { Navigate } from 'react-router-dom';

import {
  clearLocalSessionStorage,
  getDataFromSecureCookie,
} from '@/utils/helpers/commonHelpers';

const RedirectToDashboard = () => {
  const _data = getDataFromSecureCookie('organization-info');
  const tokenValue = getDataFromSecureCookie('authenticationToken');
  const data = typeof _data === 'string' ? JSON.parse(_data) : _data;
  try {
    if (data && tokenValue) {
      return <Navigate to={`${data?.portal_slug}/dashboard`} replace />;
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
