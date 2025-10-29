/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';

import {
  MAINTENANCE_MODE_LOCAL_STORAGE_KEY,
  MaintenanceModeIsActiveStatusCode,
  unauthorizedStatusCodes,
} from '../../constant/constant';
import {
  clearLocalSessionStorage,
  ErrorHandler,
  getDataFromLocalStorage,
  getDataFromTheSessionStorage,
  storeDataInLocalStorage,
} from '../HelperFunctions';

export interface endpointObject {
  endPoint: string;
  protected: boolean;
  data?: object;
  header?: object;
}
export interface URLObject {
  url: string;
  Method: 'GET' | 'POST';
  data?: object;
  header?: object;
}
export interface ApiReturnInterface {
  message: string;
  success: boolean;
  data?: any;
  metadata?: any;
  current_session_id?: string;
}

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;
// const VITE_ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT;

const defaultHeader = {
  'Content-Type': 'application/json',
};

const multipleFetchApiErrorHandler = (error: any) => {
  return; // console.log(error)
  if (MaintenanceModeIsActiveStatusCode.includes(error?.status)) {
    storeDataInLocalStorage(
      error?.response?.data?.detail.data,
      MAINTENANCE_MODE_LOCAL_STORAGE_KEY
    );
    window.location.href = '/maintenance-mode';
    return;
  }
  if (unauthorizedStatusCodes.includes(error?.status)) {
    const status = error?.response?.status || error?.status;

    if (unauthorizedStatusCodes.includes(status)) {
      clearLocalSessionStorage();
      window.location.href = '/auth/sign-in';
      return;
    }
  } else {
    return ErrorHandler(error);
  }
};

export const multipleFetchApi = async (
  endPointArr: Array<endpointObject>,
  signal?: AbortSignal
): Promise<ApiReturnInterface[]> => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _localToken = getDataFromLocalStorage('authenticationToken');
      const _sessionToken = getDataFromTheSessionStorage('authenticationToken');
      //   todo we will show the error in the form of the notification

      const authToken = `Bearer ${_localToken || _sessionToken}`;
      const headers: Record<string, string> = eachEndPoint?.header
        ? (eachEndPoint.header as Record<string, string>)
        : {
            'Content-Type': 'application/json',
            Authorization: authToken,
          };

      if (!headers?.Authorization) {
        headers.Authorization = authToken;
      }
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'GET',
        url,
        headers: headers,
        signal,
      };

      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    } else {
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;
      const config = {
        method: 'GET',
        url,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    }
  });

  // Wait for all promises to resolve
  return await Promise.all(promises);
};

export const multiplePostApi = async (
  endPointArr: Array<endpointObject>
): Promise<ApiReturnInterface[]> => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _localToken = getDataFromLocalStorage('authenticationToken');
      const _sessionToken = getDataFromTheSessionStorage('authenticationToken');
      //   todo we will show the error in the form of the notification

      const authToken = `Bearer ${_localToken || _sessionToken}`;

      const headers: Record<string, string> = eachEndPoint?.header
        ? (eachEndPoint.header as Record<string, string>)
        : {
            'Content-Type': 'application/json',
            Authorization: authToken,
          };

      if (!headers?.Authorization) {
        headers.Authorization = authToken;
      }

      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'POST',
        url,
        headers: headers,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    } else {
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'POST',
        url,
        headers: eachEndPoint?.header ? eachEndPoint.header : defaultHeader,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    }
  });

  return await Promise.all(promises);
};

// todo we need to add put api helper for editing api

export const multiplePutApi = async (
  endPointArr: Array<endpointObject>
): Promise<ApiReturnInterface[]> => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _localToken = getDataFromLocalStorage('authenticationToken');
      const _sessionToken = getDataFromTheSessionStorage('authenticationToken');
      const authToken = `Bearer ${_localToken || _sessionToken}`;

      const headers: Record<string, string> = eachEndPoint.header
        ? (eachEndPoint.header as Record<string, string>)
        : {
            'Content-Type': 'application/json',
            Authorization: authToken,
          };

      if (!headers.Authorization) {
        headers.Authorization = authToken;
      }

      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'PUT',
        url,
        headers,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    } else {
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'PUT',
        url,
        headers: eachEndPoint?.header ? eachEndPoint.header : defaultHeader,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    }
  });

  return await Promise.all(promises);
};

export const multipleDeleteApi = async (
  endPointArr: Array<endpointObject>
): Promise<ApiReturnInterface[]> => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _localToken = getDataFromLocalStorage('authenticationToken');
      const _sessionToken = getDataFromTheSessionStorage('authenticationToken');
      //   todo we will show the error in the form of the notification

      const authToken = `Bearer ${_localToken || _sessionToken}`;

      const headers: Record<string, string> = eachEndPoint?.header
        ? (eachEndPoint.header as Record<string, string>)
        : {
            'Content-Type': 'application/json',
            Authorization: authToken,
          };

      if (!headers?.Authorization) {
        headers.Authorization = authToken;
      }

      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'DELETE',
        url,
        headers: headers,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    } else {
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: 'DELETE',
        url,
        headers: eachEndPoint?.header ? eachEndPoint.header : defaultHeader,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        return multipleFetchApiErrorHandler(error);
      }
    }
  });

  return await Promise.all(promises);
};

export const multiUrlFetcher = async (urlArray: Array<URLObject>) => {
  const promises = urlArray.map(async (eachURL: URLObject) => {
    if (eachURL.Method == 'GET') {
      const config = {
        method: eachURL.Method,
        url: eachURL.url,
        headers: eachURL.header || defaultHeader,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        console.error(`Error fetching data from ${eachURL.url}`, error);
        return ErrorHandler(error);
      }
    } else if (eachURL.Method == 'POST') {
      const config = {
        method: eachURL.Method,
        url: eachURL.url,
        headers: eachURL.header || defaultHeader,
        data: eachURL?.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        console.error(`Error fetching data from ${eachURL.url}`, error);
        return ErrorHandler(error);
      }
    }
  });
  return await Promise.all(promises);
};
