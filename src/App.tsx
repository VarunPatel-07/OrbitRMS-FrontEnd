import { useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import ComingSoon from './Components/ComingSoon';
import MainSuspenseLoader from './Components/Loader/MainSuspenseLoader';
import Navbar from './Components/Navbar/Navbar';
import PageNotFound from './Components/PageNotFound';
import SideBar from './Components/SideBar/SideBar';
import {
  NotificationContext,
  NotificationContextApiProps,
} from './Context/Notification/NotificationContextApi';
import { verifyUsersLoginStatus } from './Helper/api/api';
import { clearLocalSessionStorage } from './Helper/HelperFunctions';
import ProtectedRoute from './Helper/ProtectedRoute';
import ClientInquiry from './Pages/ClientInquiry/ClientInquiry';
import Config from './Pages/config/Config';

function App() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    (async () => {
      const response = await verifyUsersLoginStatus();
      if (!response?.success) {
        handelNotification(response, 'top-right');
        setShowGlobalLoader(false);
        clearLocalSessionStorage();
      } else {
        setShowGlobalLoader(false);
      }
    })();
  }, []);
  return (
    <>
      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='w-full h-screen bg-white'>
          <div className='w-full flex flex-col h-full'>
            <Navbar />
            <div className='w-full h-full flex justify-stretch'>
              <div className='w-fit'>
                <SideBar />
              </div>
              <div className='w-[calc(100%-60px)] ml-auto bg-[var(--main-white-color)]'>
                <Routes>
                  <Route
                    path='/client-inquiry'
                    element={<ProtectedRoute element={<ClientInquiry />} />}
                  />
                  <Route
                    path='/dashboard'
                    element={<ProtectedRoute element={<ComingSoon />} />}
                  />

                  <Route
                    path='/config/*'
                    element={<ProtectedRoute element={<Config />} />}
                  />
                  <Route path='*' element={<PageNotFound />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
