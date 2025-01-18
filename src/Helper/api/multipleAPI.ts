import axios from "axios";
import { getDataFromLocalStorage } from "../HelperFunctions";

export interface endpointObject {
  endPoint: string;
  protected: boolean;
}

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;

export const multipleFetchApi = async (endPointArr: Array<endpointObject>) => {
  const promises = endPointArr.map(async (eachEndPoint) => {
    if (eachEndPoint.protected) {
      const _token = getDataFromLocalStorage("authenticationToken");
      //   todo we will show the error in the form of the notification
      if (!_token) return null; // return null or an error message if there's no token

      const authToken = `Bearer ${_token}`;
      const headers = {
        "Content-Type": "multipart/form-data",
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
    }
  });

  // Wait for all promises to resolve
  return await Promise.all(promises);
};
