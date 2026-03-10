/* eslint-disable @typescript-eslint/no-explicit-any */

import OrbitRMSLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import Maintenance from '../../assets/lottie/Maintenance.lottie';
import {
  MAINTENANCE_MODE_LOCAL_STORAGE_KEY,
  UNAUTHORIZED_STATUS_CODE,
} from '../../constant/constant';
import {
  clearLocalSessionStorage,
  ErrorHandler,
  getDataFromLocalStorage,
  getDataFromSecureCookie,
  storeDataInLocalStorage,
} from '../../Helper/HelperFunctions';

import '../../css/text-editor.css';

import React, { useContext, useEffect, useRef, useState } from 'react';

import axios from 'axios';

import Button from '../../common/Button';
import MainSuspenseLoader from '../../Components/Loader/MainSuspenseLoader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import HelmetSeo from '../../Helper/HelmetSeo';
import { useDebounce } from '../../Hooks/useDebounce';

const DotLottieReact = React.lazy(() =>
  import('@lottiefiles/dotlottie-react').then((mod) => ({
    default: mod.DotLottieReact,
  }))
);

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;

function MaintenanceMode() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [maintenanceModeData, setMaintenanceModeData] = useState<string>('');
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);

  const checkForTheMaintenanceModeWithDebounce = useDebounce(async () => {
    try {
      const url = `${BASE_URL}/auth/maintenance/check-maintenance-mode`;

      const authToken = `Bearer ${getDataFromSecureCookie('authenticationToken')}`;
      const tokenValue = authToken.split('Bearer')[1]?.trim();

      if (!tokenValue || tokenValue === 'null' || tokenValue === 'undefined') {
        clearLocalSessionStorage();
        window.location.href = '/auth/sign-in';
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: authToken,
      };

      const config = {
        method: 'GET',
        url,
        headers: headers,
      };

      const response = await axios(config);
      if (response?.data?.success) {
        window.location.href = `/${response?.data?.data?.portal_slug}/dashboard`;
      }
    } catch (error: any) {
      if (UNAUTHORIZED_STATUS_CODE.includes(error?.status)) {
        const status = error?.response?.status || error?.status;

        if (UNAUTHORIZED_STATUS_CODE.includes(status)) {
          clearLocalSessionStorage();
          window.location.href = '/auth/sign-in';
          return;
        }
      }
      const response = ErrorHandler(error as Error);

      if (!response?.success) {
        storeDataInLocalStorage(
          response?.data,
          MAINTENANCE_MODE_LOCAL_STORAGE_KEY
        );
        setMaintenanceModeData(response?.data?.message);
        handelNotification(response, 'top-right');
      }
    } finally {
      setLoading(false);
      setShowGlobalLoader(false);
    }
  }, 100);

  const handelClickOnCheckStatus = () => {
    setLoading(true);
    checkForTheMaintenanceModeWithDebounce();
  };

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    const localData = getDataFromLocalStorage(
      MAINTENANCE_MODE_LOCAL_STORAGE_KEY
    );
    if (localData && localData?.is_active) {
      setMaintenanceModeData(localData?.message);
      setShowGlobalLoader(false);
    } else {
      setLoading(true);
      checkForTheMaintenanceModeWithDebounce();
    }
  }, []);

  return (
    <>
      <HelmetSeo
        Title='OrbitRMS | Under Maintenance'
        Content="OrbitRMS is temporarily down for maintenance. We're working to improve your experience and will be back shortly."
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='w-full h-screen overflow-auto hide-scrollbar bg-white'>
          <div className='w-fit pl-4 flex items-center justify-center absolute top-4 left-1/2 -translate-x-1/2'>
            <img
              src={OrbitRMSLogo}
              width={150}
              className='w-36 h-10 object-cover'
              alt=''
            />
          </div>
          <div className='w-full h-full flex flex-col items-center justify-center'>
            <div className='w-full max-w-[80%] flex flex-col items-center justify-center gap-5'>
              <div className='min-w-[250px] min-h-[250px] max-w-[250px] max-h-[250px]'>
                <DotLottieReact
                  src={Maintenance}
                  loop
                  autoplay
                  className='w-full h-full'
                  width={'100%'}
                  height={'100%'}
                />
              </div>
              <div
                className='text-black text-editor-wrapper max-w-[80%]'
                dangerouslySetInnerHTML={{ __html: maintenanceModeData }}
              ></div>
              <div>
                <Button
                  type='button'
                  className='bg-[var(--them-green-light-color)] text-white font-bold text-base font-inter px-5 py-2 border-0 rounded-lg'
                  onClick={handelClickOnCheckStatus}
                  disabled={loading}
                >
                  Check Status
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MaintenanceMode;
