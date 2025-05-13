 
import { endpointObject, multipleFetchApi } from './api/multipleAPI';

export interface countryObject {
  country_flag: string;
  country_name: string;
  country_code: string;
}
export const countryDataApiHelper = async (): Promise<
  Array<countryObject> | undefined
> => {
  const endpointArr: Array<endpointObject> = [
    {
      endPoint: 'country-info/fetchAll',
      protected: true,
    },
  ];

  try {
    const response = await multipleFetchApi(endpointArr);
    if (!response || !Array.isArray(response) || response.length === 0) {
      console.error('Invalid or empty response from API:', response);
      return;
    }

    const country_Data = response[0];

    return country_Data;
  } catch (error) {
    console.error('Error fetching country data:', error);
  }
};

export const fetchUsersPosition = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.country_name || 'India'; // Return country name after the fetch completes
  } catch {
    return 'India'; // Return undefined in case of an error
  }
};

export const fetchFormattedCountryData = async (
  selectedCountryName?: string
): Promise<{
  success: boolean;
  message: string;
  filteredCountry: countryObject | undefined;
  countryOptionsData: countryObject[];
}> => {
  try {
    const country_Data = await countryDataApiHelper();
    if (!country_Data) {
      return {
        success: false,
        message: 'No Data Available',
        filteredCountry: undefined,
        countryOptionsData: [],
      };
    }
    const response = await fetchUsersPosition();
    if (selectedCountryName) {
      const data = country_Data.find(
        (item: countryObject) =>
          item?.country_name?.toLocaleLowerCase() ===
          selectedCountryName?.toLocaleLowerCase()
      );
      return {
        success: true,
        filteredCountry: data,
        countryOptionsData: country_Data,
        message: '',
      };
    } else {
      const data = country_Data.find(
        (item: countryObject) =>
          item?.country_name?.toLocaleLowerCase() ===
          response?.toLocaleLowerCase()
      );
      return {
        success: true,
        filteredCountry: data,
        countryOptionsData: country_Data,
        message: '',
      };
    }
  } catch (error) {
    console.error('Error fetching country data:', error);
    return {
      success: false,
      message: 'Failed to fetch country data',
      filteredCountry: undefined,
      countryOptionsData: [],
    };
  }
};
