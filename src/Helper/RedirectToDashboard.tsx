import { Navigate } from 'react-router-dom';

import {
  clearLocalSessionStorage,
  getDataFromLocalStorage,
} from './HelperFunctions';

const RedirectToDashboard = () => {
  const _data = getDataFromLocalStorage('organization-info');
  try {
    if (_data) {
      return (
        <Navigate
          to={`${JSON.parse(_data)?.portal_url_slug}/config/project-status`}
          replace
        />
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
