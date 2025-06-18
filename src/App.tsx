import { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import ComingSoon from './Components/ComingSoon';
import MainSuspenseLoader from './Components/Loader/MainSuspenseLoader';
import Navbar from './Components/Navbar/Navbar';
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
import ApiManager from './Pages/ApiManager/ApiManager';
import ClientInquiry from './Pages/ClientInquiry/ClientInquiry';
import Config from './Pages/config/Config';
import EmployeeListing from './Pages/Employee/EmployeeListing';
import AddEditEmployeeProfile from './Pages/EmployeeProfile/AddEditEmployeeProfile';
import EmployeeProfile from './Pages/EmployeeProfile/EmployeeProfile';

export const HandelPathFunction = () => {
  const _data = getDataFromLocalStorage('organization-info');
  const _isAuthenticated = getDataFromLocalStorage('authenticationToken');
  if (_data && _isAuthenticated) {
    return (
      <Navigate
        to={`/${JSON.parse(_data)?.portal_slug}/config/project-status`}
        replace
      />
    );
  } else {
    clearLocalSessionStorage();
    return <Navigate to={`/auth/sign-in`} replace />;
  }
};

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
          portal_slug: response?.data?.organization?.general_info?.portal_slug,
        };

        storeDataInLocalStorage(
          JSON.stringify(localStorageData),
          'organization-info'
        );
        if (response?.data) setGlobalStateProvider(response?.data);
      }
    })();
  }, []);

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
                  <Route path='*' element={<HandelPathFunction />} />

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
                    path='/employee-profile/:id/*'
                    element={<ProtectedRoute element={<EmployeeProfile />} />}
                  />

                  <Route
                    path='/employee/:type/:id?'
                    element={
                      <ProtectedRoute element={<AddEditEmployeeProfile />} />
                    }
                  />
                  <Route
                    path='/employee/employee-listing'
                    element={<ProtectedRoute element={<EmployeeListing />} />}
                  />

                  <Route
                    path='/api-manager/*'
                    element={<ProtectedRoute element={<ApiManager />} />}
                  />
                  {/* <Route path='*' element={<PageNotFound />} /> */}
                  <Route path='*' element={<HandelPathFunction />} />
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
