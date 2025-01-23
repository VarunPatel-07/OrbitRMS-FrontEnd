import React, { SetStateAction } from "react";
import { endpointObject, multipleFetchApi } from "./api/multipleAPI";

export const FetchCountryData = async (
  setCountryData: React.Dispatch<SetStateAction<Array<{ country_code: string; country_flag: string }>>>
) => {
  const endpointArr: Array<endpointObject> = [
    {
      endPoint: "https://restcountries.com/v3.1/all",
      protected: false,
    },
  ];
  const response = await multipleFetchApi(endpointArr);
};
