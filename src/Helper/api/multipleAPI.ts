/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ErrorHandler, getDataFromLocalStorage } from "../HelperFunctions";

export interface endpointObject {
  endPoint: string;
  protected: boolean;
  data?: object;
}
export interface URLObject {
  url: string;
  Method: "GET" | "POST";
  data?: object;
  header?: object;
}

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;

const defaultHeader = {
  "Content-Type": "application/json",
};

export const multipleFetchApi = async (endPointArr: Array<endpointObject>) => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _token = getDataFromLocalStorage("authenticationToken");
      //   todo we will show the error in the form of the notification
      if (!_token) return null; // return null or an error message if there's no token

      const authToken = `Bearer ${_token}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: authToken,
      };
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: "GET",
        url,
        headers: headers,
      };

      try {
        const res = await axios(config);
        return res?.data;
      } catch (error) {
        // Handle error (e.g., return an error object or log it)
        console.error(`Error fetching data from ${eachEndPoint.endPoint}`, error);
        return null;
      }
    } else {
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;
      const config = {
        method: "GET",
        url,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error) {
        // Handle error (e.g., return an error object or log it)
        console.error(`Error fetching data from ${eachEndPoint.endPoint}`, error);
        return null;
      }
    }
  });

  // Wait for all promises to resolve
  return await Promise.all(promises);
};

export const multiplePostApi = async (endPointArr: Array<endpointObject>) => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _token = getDataFromLocalStorage("authenticationToken");

      if (!_token) return;

      const authToken = `Bearer ${_token}`;

      const headers = {
        "Content-Type": "application/json",
        Authorization: authToken,
      };

      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: "POST",
        url,
        headers,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error) {
        // Handle error (e.g., return an error object or log it)
        console.error(`Error fetching data from ${eachEndPoint.endPoint}`, error);
        return null;
      }
    } else {
      const url = `${BASE_URL}/${eachEndPoint.endPoint}`;

      const config = {
        method: "POST",
        url,
        headers: defaultHeader,
        data: eachEndPoint.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error: any) {
        // Handle error (e.g., return an error object or log it)

        return ErrorHandler(error);
      }
    }
  });

  return await Promise.all(promises);
};

export const multiUrlFetcher = async (urlArray: Array<URLObject>) => {
  const promises = urlArray.map(async (eachURL: URLObject) => {
    if (eachURL.Method == "GET") {
      const config = {
        method: eachURL.Method,
        url: eachURL.url,
        headers: eachURL.header || defaultHeader,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error) {
        console.error(`Error fetching data from ${eachURL.url}`, error);
        return null;
      }
    } else if (eachURL.Method == "POST") {
      const config = {
        method: eachURL.Method,
        url: eachURL.url,
        headers: eachURL.header || defaultHeader,
        data: eachURL?.data,
      };
      try {
        const res = await axios(config);
        return res?.data;
      } catch (error) {
        console.error(`Error fetching data from ${eachURL.url}`, error);
        return null;
      }
    }
  });
  return await Promise.all(promises);
};
