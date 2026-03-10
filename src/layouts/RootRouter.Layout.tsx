import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorFallback from '../common/ErrorFallBack';
import Notification from '../common/Notification/Notification';
import { GlobalStateContentApiProvider } from '../Context/globalState/GlobalStateContectApi';
import { NotificationContextApiProvider } from '../Context/Notification/NotificationContextApi';
import ProtectedRoute from '../Helper/ProtectedRoute';
import RedirectToDashboard from '../Helper/RedirectToDashboard';
import MaintenanceMode from '../Pages/MaintenanceMode/MaintenanceMode';
import Onboarding from '../Pages/Onboarding/Onboarding';
import VerifyEmail from '../Pages/VerifyEmail';
import AuthRoutes from '../routes/AuthRoutes';
import DashboardLayout from './Dashboard.Layout';

function RootRouterLayout() {
  return (
    <NotificationContextApiProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/auth/*' element={<AuthRoutes />} />

          <Route path='/verification/verify-email' element={<VerifyEmail />} />
          <Route path='/onboarding' element={<Onboarding />} />
          <Route path='/maintenance-mode' element={<MaintenanceMode />} />

          <Route path='*' element={<RedirectToDashboard />} />

          {/* all The Protected Routes are Defined Blow */}
          <Route
            path='/:organization/*'
            element={
              <ProtectedRoute
                element={
                  <GlobalStateContentApiProvider>
                    <DashboardLayout />
                  </GlobalStateContentApiProvider>
                }
              />
            }
          />

          <Route path='*' element={<ErrorFallback />} />
        </Routes>
      </BrowserRouter>
      <Notification />
    </NotificationContextApiProvider>
  );
}

export default RootRouterLayout;
