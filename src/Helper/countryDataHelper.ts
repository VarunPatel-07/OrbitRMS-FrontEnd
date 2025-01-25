/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from "react";
import { endpointObject, multipleFetchApi } from "./api/multipleAPI";

export interface countryObject {
  country_flag: string;
  country_name: string;
  country_code: string;
}
export const FetchCountryData = async (setCountryData: React.Dispatch<SetStateAction<Array<countryObject>>>) => {
  const endpointArr: Array<endpointObject> = [
    {
      endPoint: "https://restcountries.com/v3.1/all",
      protected: false,
    },
  ];

  try {
    const response = await multipleFetchApi(endpointArr);

    // Check if the response is an array and contains data
    if (Array.isArray(response) && response.length > 0) {
      const country_Data: Array<countryObject> = response[0].map((item: any) => {
        const country_flag = item?.flag;
        const country_name = item?.name?.common;
        let country_code = "";
        if (!item?.idd?.suffixes) {
          country_code = item?.idd?.root;
        } else {
          country_code = item?.idd?.root + "" + item?.idd?.suffixes[0];
        }
        return { country_flag, country_name, country_code };
      });

      setCountryData(country_Data);
    } else {
      console.error("Unexpected response format or empty response", response);
    }
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
};

export const fetchUsersPosition = async (): Promise<string | undefined> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.country_name; // Return country name after the fetch completes
  } catch (error) {
    console.log("Error fetching country data:", error);
    return undefined; // Return undefined in case of an error
  }
};
