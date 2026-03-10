import { useContext, useEffect, useState } from 'react';

import MainSuspenseLoader from '../Components/Loader/MainSuspenseLoader';
import Navbar from '../Components/Navbar/Navbar';
import SideBar from '../Components/SideBar/SideBar';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../Context/globalState/GlobalStateContectApi';
import HelmetSeo from '../Helper/HelmetSeo';
import { useBrowserProtection } from '../Hooks/useBrowserProtection';
import useMaintenanceWorker from '../Hooks/useMaintenanceWorker';
import { useUserAuthVerify } from '../Hooks/useUserAuthVerify';
import AppRoutes from '../routes/AppRoutes';

function DashboardLayout() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const [showGlobalLoader, setShowGlobalLoader] = useState<boolean>(true);
  const isUserVerified = useUserAuthVerify();

  useMaintenanceWorker();
  useBrowserProtection();

  const hasPermissions =
    GlobalStateProvider?.roles_permissions?.permissions?.length > 0;

  useEffect(() => {
    setShowGlobalLoader(isUserVerified);
  }, [isUserVerified]);

  return (
    <>
      <HelmetSeo
        Title='OrbitRMS'
        Content='Streamline your business operations with OrbitRMS. Manage clients, content, resources, and more — all in one powerful platform.'
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && hasPermissions && (
        <div className='w-full h-screen bg-white'>
          <div className='w-full flex flex-col h-full'>
            <Navbar />
            <div className='w-full h-full flex-grow flex justify-stretch'>
              <div className='w-fit'>
                <SideBar />
              </div>
              <div className='w-[calc(100%-60px)] ml-auto bg-[var(--main-white-color)] overflow-hidden'>
                <AppRoutes GlobalStateProvider={GlobalStateProvider} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardLayout;
