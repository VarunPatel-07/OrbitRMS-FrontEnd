import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ComingSoon from './Components/ComingSoon';
import MainSuspenseLoader from './Components/Loader/MainSuspenseLoader';
import Navbar from './Components/Navbar/Navbar';
import PageNotFound from './Components/PageNotFound';
import SideBar from './Components/SideBar/SideBar';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from './Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from './Context/Notification/NotificationContextApi';
import { verifyUsersLoginStatus } from './Helper/api/api';
import HelmetSeo from './Helper/HelmetSeo';
import {
  clearLocalSessionStorage,
  getDataFromLocalStorage,
  storeDataInLocalStorage,
} from './Helper/HelperFunctions';
import ProtectedRoute from './Helper/ProtectedRoute';
import ClientInquiry from './Pages/ClientInquiry/ClientInquiry';
import Config from './Pages/config/Config';
import EditEmployeeProfile from './Pages/EmployeeProfile/AddEditEmployeeProfile';
import EmployeeProfile from './Pages/EmployeeProfile/EmployeeProfile';

function App() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { setGlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

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
        const localStorageData = {
          organization_name:
            response?.data?.organization?.general_info?.organization_name,
          organization_profile_picture:
            response?.data?.organization?.general_info
              ?.organization_profile_picture,
          portal_url: response?.data?.organization?.general_info?.portal_url,
          portal_url_slug:
            response?.data?.organization?.general_info?.portal_url.split(
              'https://orbitrms.com/'
            )[1],
        };

        storeDataInLocalStorage(
          JSON.stringify(localStorageData),
          'organization-info'
        );
        if (response?.data) setGlobalStateProvider(response?.data);
      }
    })();
  }, []);

  const HandelPathFunction = () => {
    const _data = getDataFromLocalStorage('organization-info');
    if (_data) {
      return (
        <Navigate
          to={`/${JSON.parse(_data)?.portal_url_slug}/config/project-status`}
          replace
        />
      );
    }
    return null;
  };

  return (
    <>
      <HelmetSeo
        Title='OrbitRMS'
        Content='Log in to OrbitRMS and start managing everything in one place with ease and efficiency!'
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='w-full h-screen bg-white'>
          <div className='w-full flex flex-col h-full'>
            <Navbar />
            <div className='w-full h-full flex-grow flex justify-stretch'>
              <div className='w-fit'>
                <SideBar />
              </div>
              <div className='w-[calc(100%-60px)] ml-auto bg-[var(--main-white-color)] overflow-hidden'>
                <Routes>
                  <Route path='/' element={<HandelPathFunction />} />

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
                  <Route
                    path='/employee-profile/:id'
                    element={<ProtectedRoute element={<EmployeeProfile />} />}
                  />
                  <Route
                    path='/employee-profile/:type/:id'
                    element={
                      <ProtectedRoute element={<EditEmployeeProfile />} />
                    }
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
