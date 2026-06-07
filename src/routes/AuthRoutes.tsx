import { Route, Routes } from 'react-router-dom';

import { APP_AUTH_ROUTES_MODULE_ARRAY } from '@/utils/constants/authRoutesModuleArray.constants';
import RedirectToDashboard from '@/utils/helpers/RedirectToDashboard';

function AuthRoutes() {
  return (
    <Routes>
      {APP_AUTH_ROUTES_MODULE_ARRAY?.map((item) => (
        <Route key={item?.label} path={item?.path} element={item?.module} />
      ))}
      <Route path='*' element={<RedirectToDashboard />} />
    </Routes>
  );
}

export default AuthRoutes;
