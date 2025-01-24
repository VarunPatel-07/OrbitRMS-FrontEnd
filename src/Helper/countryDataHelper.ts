/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from "react";
import { endpointObject, multipleFetchApi } from "./api/multipleAPI";

export interface countryObject {
  country_code: string;
}

export const FetchCountryData = async (setCountryData: React.Dispatch<SetStateAction<Array<string>>>) => {
  const endpointArr: Array<endpointObject> = [
    {
      endPoint: "https://restcountries.com/v3.1/all",
      protected: false,
    },
  ];
  const response = await multipleFetchApi(endpointArr);

  const country_Data: Array<string> = response[0].map((item: any) => {
    const country_flag = item?.flag;
    return country_flag;
  });

  setCountryData(country_Data);
};
