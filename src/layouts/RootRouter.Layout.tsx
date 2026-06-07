import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GlobalStateContentApiProvider } from '@/contexts/globalState/GlobalStateContectApi';
import { NotificationContextApiProvider } from '@/contexts/notification/NotificationContextApi';
import DashboardLayout from '@/layouts/Dashboard.Layout';
import MaintenanceMode from '@/modules/maintenanceMode/MaintenanceMode';
import Onboarding from '@/modules/onboarding/Onboarding';
import VerifyEmail from '@/modules/verifyEmail/VerifyEmail';
import AuthRoutes from '@/routes/AuthRoutes';

import ErrorFallback from '@/components/common/ErrorFallBack';
import Notification from '@/components/common/notification/Notification';
import ProtectedRoute from '@/utils/helpers/ProtectedRoute';
import RedirectToDashboard from '@/utils/helpers/RedirectToDashboard';

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
