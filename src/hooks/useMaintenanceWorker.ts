import { useEffect } from 'react';

import {
  MAINTENANCE_MODE_IS_ACTIVE_STATUS_CODE,
  MAINTENANCE_MODE_LOCAL_STORAGE_KEY,
  UNAUTHORIZED_STATUS_CODE,
} from '@/utils/constants/global.constants';
import {
  ErrorHandler,
  getDataFromSecureCookie,
  storeDataInLocalStorage,
} from '@/utils/helpers/commonHelpers';

import MaintenanceWorker from '../../worker/MaintenanceWorker?worker';

function useMaintenanceWorker() {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;

  useEffect(() => {
    const authToken = getDataFromSecureCookie('authenticationToken');

    if (!authToken) return;

    const worker = new MaintenanceWorker();

    const url = `${BASE_URL}/auth/maintenance/check-maintenance-mode`;

    worker.onmessage = (e) => {
      const { success, error } = e.data;
      if (!success) {
        const status = error?.status;

        const data = ErrorHandler(error);
        if (UNAUTHORIZED_STATUS_CODE.includes(status)) {
          window.location.href = '/auth/sign-in';
          return;
        }
        if (MAINTENANCE_MODE_IS_ACTIVE_STATUS_CODE.includes(status)) {
          storeDataInLocalStorage(
            data.data,
            MAINTENANCE_MODE_LOCAL_STORAGE_KEY
          );
          window.location.href = '/maintenance-mode';
          return;
        }
      }
    };
    worker.onerror = (err) => {
      console.error('Worker internal error:', err);
    };

    worker.postMessage({ url, token: authToken });

    return () => {
      worker.terminate();
    };
  }, []);
}

export default useMaintenanceWorker;
