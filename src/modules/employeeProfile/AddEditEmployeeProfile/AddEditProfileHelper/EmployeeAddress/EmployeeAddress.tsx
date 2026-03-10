import React, { useState } from 'react';

import DynamicAddressComponentHelper from '@/modules/employeeProfile//AddEditEmployeeProfile/AddEditProfileHelper/EmployeeAddress/DynamicAddressComponentHelper';
import { EmployeeAddressInfoInterface } from '@/interface/AddEditUserProfile.interface';
import {
  CountryDataInterface,
  StateOptionArrayInterFace,
} from '@/interface/Global.interface';

import Input from '@/components/common/Input';
import { endpointObject, multipleFetchApi } from '@/utils/api/multipleAPI';
import { initialCountryInfo } from '@/utils/constants/addEditEmployeeForm.constants';

const EmployeeAddress = React.memo(function EmployeeAddress(
  props: EmployeeAddressInfoInterface
) {
  const {
    formData,
    handleOnChange,
    setFormData,
    showEmptyFieldError,
    countryData,
    isFetchingCountryData,
    selectedCountryInfoForCurrentAddress,
    setSelectedCountryInfoForCurrentAddress,
    formSubmitLoader,
    disabled,
  } = props;

  const [citiesOptionsArray, setCitiesOptionsArray] = useState<{
    current_address: Array<string>;
    permanent_address: Array<string>;
  }>({ current_address: [], permanent_address: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingStateInfo, setFetchingStateInfo] = useState<boolean>(false);
  const [
    selectedCountryInfoForPermanentAddress,
    setSelectedCountryInfoForPermanentAddress,
  ] = useState<CountryDataInterface>(initialCountryInfo);

  const [stateOptionArray, setStateOptionArray] = useState<{
    current_address: Array<StateOptionArrayInterFace>;
    permanent_address: Array<StateOptionArrayInterFace>;
  }>({ current_address: [], permanent_address: [] });

  const handelTheSameAsCurrentAddressButton = (val: 'false' | 'true') => {
    setFormData((perValue) => ({
      ...perValue,
      same_as_current_address: val == 'false' ? false : true,
    }));
  };

  const FetchCityBasedOnTheState = async (
    country_code: string,
    stateCode: string,
    module_name: 'current_address' | 'permanent_address'
  ) => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: `country-info/getStateInfo?country=${country_code}&state_code=${stateCode}`,
        protected: false,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    if (response[0].success) {
      setCitiesOptionsArray((pervData) => ({
        ...pervData,
        [module_name]: response[0].data.cities_array,
      }));
    }
    setLoading(false);
  };

  const handleClickOnCountryValue = (
    data: CountryDataInterface,
    module_name: 'current_address' | 'permanent_address'
  ) => {
    setFormData((perValue) => ({
      ...perValue,
      [module_name]: {
        ...perValue[module_name],
        country: data?.country_name,
        country_code: data?.country_code,
        state: '',
        city: '',
        zip_code: '',
      },
    }));

    if (module_name == 'current_address') {
      setSelectedCountryInfoForCurrentAddress(data);
    } else {
      setSelectedCountryInfoForPermanentAddress(data);
    }

    fetchAllTheStateAccToCountry(data?.country_code, module_name);
  };

  const fetchAllTheStateAccToCountry = async (
    country_code: string,
    module_name: 'current_address' | 'permanent_address'
  ) => {
    setFetchingStateInfo(true);
    const endpointArray: Array<endpointObject> = [
      {
        endPoint: `country-info/getCountryInfo?country=${country_code}`,
        protected: false,
      },
    ];
    const response = await multipleFetchApi(endpointArray);
    if (response) {
      if (response[0]?.success) {
        setStateOptionArray((perValue) => ({
          ...perValue,
          [module_name]: response[0]?.data?.states,
        }));
      }
    }
    setFetchingStateInfo(false);
  };

  const handelZipCodeOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    module_name: 'current_address' | 'permanent_address'
  ) => {
    let { value } = e.target;
    // Remove any non-numeric characters
    value = value.replace(/\D/g, '');

    if (module_name == 'current_address') {
      if (selectedCountryInfoForCurrentAddress?.postal_code?.format) {
        const maxLength =
          selectedCountryInfoForCurrentAddress?.postal_code?.format?.length;

        // Restrict input length
        if (value.length > maxLength) {
          value = value.slice(0, maxLength);
        }
      }
      setFormData((prevValue) => ({
        ...prevValue,
        current_address: {
          ...prevValue.current_address,
          zip_code: value,
        },
      }));
    } else {
      if (selectedCountryInfoForPermanentAddress?.postal_code?.format) {
        const maxLength =
          selectedCountryInfoForPermanentAddress?.postal_code?.format?.length;

        // Restrict input length
        if (value.length > maxLength) {
          value = value.slice(0, maxLength);
        }
      }
      setFormData((prevValue) => ({
        ...prevValue,
        permanent_address: {
          ...prevValue.permanent_address,
          zip_code: value,
        },
      }));
    }
  };

  return (
    <div className='w-full bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
        <h2 className='font-inter text-xl text-black font-semibold capitalize'>
          Address Information
        </h2>
        <p className='font-inter text-base text-black font-light w-[70%]'>
          Provide your address details to help us maintain accurate records,
          ensure timely communication, and support logistical and emergency
          planning.
        </p>
      </div>
      <div className='w-full'>
        <div className='p-6 w-full'>
          <DynamicAddressComponentHelper
            formData={formData}
            disabled={disabled}
            formSubmitLoader={formSubmitLoader}
            handleOnChange={handleOnChange}
            module_name='current_address'
            module={formData?.current_address}
            setFormData={setFormData}
            showEmptyFieldError={showEmptyFieldError}
            isFetchingCountryData={isFetchingCountryData}
            countryData={countryData}
            loading={loading}
            FetchCityBasedOnTheState={FetchCityBasedOnTheState}
            citiesOptionsArray={citiesOptionsArray}
            setLoading={setLoading}
            handleClickOnCountryValue={handleClickOnCountryValue}
            handelZipCodeOnChange={handelZipCodeOnChange}
            selectedCountryInfoForCurrentAddress={
              selectedCountryInfoForCurrentAddress
            }
            selectedCountryInfoForPermanentAddress={
              selectedCountryInfoForPermanentAddress
            }
            stateOptionArray={stateOptionArray}
            fetchingStateInfo={fetchingStateInfo}
          />
        </div>
        <div className='py-3 px-6 w-full bg-gray-50 border-t border-t-black/10  rounded-b-xl'>
          <div className='w-full flex items-center justify-between'>
            <p className='text-black capitalize font-inter text-sm'>
              permanent address
            </p>
            <div className='flex items-center justify-end gap-3'>
              <p className='text-black capitalize font-inter text-sm'>
                same as current address
              </p>
              <Input
                type='checkbox'
                name='termsAccepted'
                disabled={disabled}
                value={formData?.same_as_current_address ? 'true' : 'false'}
                setValue={(val: string) =>
                  handelTheSameAsCurrentAddressButton(val as 'true' | 'false')
                }
              />
            </div>
          </div>

          {!formData?.same_as_current_address ? (
            <div className='pb-3 mt-6 transition-all'>
              <DynamicAddressComponentHelper
                disabled={disabled}
                formSubmitLoader={formSubmitLoader}
                formData={formData}
                handleOnChange={handleOnChange}
                module_name='permanent_address'
                module={formData?.permanent_address}
                setFormData={setFormData}
                showEmptyFieldError={showEmptyFieldError}
                isFetchingCountryData={isFetchingCountryData}
                countryData={countryData}
                loading={loading}
                FetchCityBasedOnTheState={FetchCityBasedOnTheState}
                citiesOptionsArray={citiesOptionsArray}
                setLoading={setLoading}
                handleClickOnCountryValue={handleClickOnCountryValue}
                handelZipCodeOnChange={handelZipCodeOnChange}
                selectedCountryInfoForCurrentAddress={
                  selectedCountryInfoForCurrentAddress
                }
                selectedCountryInfoForPermanentAddress={
                  selectedCountryInfoForPermanentAddress
                }
                stateOptionArray={stateOptionArray}
                fetchingStateInfo={fetchingStateInfo}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default EmployeeAddress;
