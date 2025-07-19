import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import SignIn from './Auth/SignIn';
import SignUp from './Auth/SignUp';
import ErrorFallBack from './common/ErrorFallBack';

import './css/font.css';
import './css/rootColors.css';
import 'react-tooltip/dist/react-tooltip.css';
import './css/common.css';

import CreateResetPassword from './Auth/CreateResetPassword';
import ForgotPassword from './Auth/ForgotPassword';
import Notification from './common/Notification/Notification';
import { GlobalStateContentApiProvider } from './Context/globalState/GlobalStateContectApi';
import { NotificationContextApiProvider } from './Context/Notification/NotificationContextApi';
import ProtectedRoute from './Helper/ProtectedRoute';
import RedirectToDashboard from './Helper/RedirectToDashboard';
import Onboarding from './Pages/Onboarding/Onboarding';
import VerifyEmail from './Pages/VerifyEmail';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationContextApiProvider>
      <BrowserRouter>
        <Routes>
          {/* All The Routes That Are Not Protected */}
          <Route path='/auth/sign-in' element={<SignIn />} />
          <Route path='/auth/sign-up' element={<SignUp />} />
          <Route path='/auth/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/auth/create-password'
            element={<CreateResetPassword />}
          />
          <Route
            path='/auth/reset-password'
            element={<CreateResetPassword />}
          />
          <Route path='/verification/verify-email' element={<VerifyEmail />} />
          <Route path='/onboarding' element={<Onboarding />} />

          <Route path='*' element={<RedirectToDashboard />} />

          {/* all The Protected Routes are Defined Blow */}
          <Route
            path='/:organization/*'
            element={
              <ProtectedRoute
                element={
                  <GlobalStateContentApiProvider>
                    <App />
                  </GlobalStateContentApiProvider>
                }
              />
            }
          />

          {/* Error FallBack Rout */}

          <Route path='*' element={<ErrorFallBack />} />
        </Routes>
      </BrowserRouter>
      <Notification />
    </NotificationContextApiProvider>
  </StrictMode>
);
