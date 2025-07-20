import React from 'react';

import Input from '../../../../../common/Input';
import SearchDrop from '../../../../../common/SearchDrop';
import TextArea from '../../../../../common/TextArea';
import { DynamicAddressComponentPropsInterface } from '../../../../../interface/AddEditUserProfileInterFace';
import {
  CountryDataInterface,
  StateOptionArrayInterFace,
} from '../../../../../interface/interface';

const DynamicAddressComponentHelper = React.memo(
  function DynamicAddressComponentHelper(
    props: DynamicAddressComponentPropsInterface
  ) {
    const {
      module_name,
      module,
      handleOnChange,
      showEmptyFieldError,
      formData,
      setFormData,
      countryData,
      isFetchingCountryData,
      loading,
      citiesOptionsArray,
      FetchCityBasedOnTheState,
      setLoading,
      handelZipCodeOnChange,
      handleClickOnCountryValue,
      selectedCountryInfoForCurrentAddress,
      selectedCountryInfoForPermanentAddress,
      fetchingStateInfo,
      stateOptionArray,
      formSubmitLoader,
    } = props;

    const handleClickOnStateValue = (
      data: StateOptionArrayInterFace,
      module_name: 'current_address' | 'permanent_address'
    ) => {
      setFormData((perValue) => ({
        ...perValue,
        [module_name]: {
          ...perValue[module_name],
          state: data?.state_name,
          city: '',
          zip_code: '',
        },
      }));

      setLoading(true);
      FetchCityBasedOnTheState(
        formData[module_name]?.country_code,
        data?.state_code,
        module_name
      );
    };

    const handleClickOnCityVal = (
      data: string,
      module_name: 'current_address' | 'permanent_address'
    ) => {
      setFormData((perValue) => ({
        ...perValue,
        [module_name]: {
          ...perValue[module_name],
          city: data,
        },
      }));
    };

    return (
      <div className='w-full min-w-full grid grid-cols-1 gap-6'>
        <div className='w-full'>
          <TextArea
            name={`${module_name}.address`}
            rows={4}
            value={module?.address}
            onChange={handleOnChange}
            isRequiredField={true}
            labelFieldName='Address'
            disabled={formSubmitLoader}
            showError={showEmptyFieldError}
            errorMessage={
              module_name === 'current_address'
                ? module?.address?.trim()
                  ? ''
                  : 'this field is required'
                : module_name === 'permanent_address' &&
                    !formData?.same_as_current_address
                  ? module?.address?.trim()
                    ? ''
                    : 'this field is required'
                  : ''
            }
          />
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <div className='w-full'>
            <SearchDrop
              options={countryData}
              disabled={formSubmitLoader}
              searchKey='country_name'
              isRequiredField={true}
              labelFieldName='Country'
              selectedValue={module?.country}
              onSelectValBtn={(data) =>
                handleClickOnCountryValue(
                  data as CountryDataInterface,
                  module_name
                )
              }
              position='bottom'
              emptyDataMessage={'No Option'}
              loading={isFetchingCountryData}
              showError={showEmptyFieldError}
              errorMessage={
                module_name === 'current_address'
                  ? module?.country?.trim()
                    ? ''
                    : 'this field is required'
                  : module_name === 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module?.country?.trim()
                      ? ''
                      : 'this field is required'
                    : ''
              }
            />
          </div>
          <div className='w-full'>
            <SearchDrop
              options={stateOptionArray[module_name]}
              disabled={formSubmitLoader}
              searchKey='state_name'
              isRequiredField={true}
              labelFieldName='State'
              selectedValue={module?.state}
              onSelectValBtn={(data) =>
                handleClickOnStateValue(
                  data as StateOptionArrayInterFace,
                  module_name
                )
              }
              position='top'
              emptyDataMessage={
                module?.country?.trim() == ''
                  ? 'Please Select A Country First'
                  : 'No Option'
              }
              loading={fetchingStateInfo}
              showError={showEmptyFieldError}
              errorMessage={
                module_name === 'current_address'
                  ? module?.state?.trim()
                    ? ''
                    : 'this field is required'
                  : module_name === 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module?.state?.trim()
                      ? ''
                      : 'this field is required'
                    : ''
              }
            />
          </div>
          <div className='w-full'>
            <SearchDrop
              options={citiesOptionsArray[module_name]}
              disabled={formSubmitLoader}
              searchKey='city_name'
              isRequiredField={true}
              labelFieldName='City'
              selectedValue={module?.city}
              onSelectValBtn={(data) =>
                handleClickOnCityVal(data as string, module_name)
              }
              position='top'
              emptyDataMessage={
                module?.state?.trim() == ''
                  ? 'Please Select A State First'
                  : 'No Option'
              }
              loading={loading}
              showError={showEmptyFieldError}
              errorMessage={
                module_name === 'current_address'
                  ? module?.city?.trim()
                    ? ''
                    : 'this field is required'
                  : module_name === 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module?.city?.trim()
                      ? ''
                      : 'this field is required'
                    : ''
              }
            />
          </div>
          <div className='w-full h-full'>
            <Input
              type='text'
              name='address.zip_code'
              className='border border-black/45'
              disabled={formSubmitLoader}
              isRequiredField={true}
              labelFieldName='Zip Code'
              value={module?.zip_code}
              onChange={(e) => handelZipCodeOnChange(e, module_name)}
              showError={showEmptyFieldError}
              errorMessage={
                module_name == 'current_address'
                  ? module?.zip_code?.length ==
                    selectedCountryInfoForCurrentAddress?.postal_code?.format
                      ?.length
                    ? module?.zip_code?.trim()
                      ? ''
                      : 'this field is required'
                    : `Zip code must be ${selectedCountryInfoForCurrentAddress?.postal_code?.format?.length} characters long`
                  : module_name == 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module?.zip_code?.length ==
                      selectedCountryInfoForPermanentAddress?.postal_code
                        ?.format?.length
                      ? module?.zip_code?.trim()
                        ? ''
                        : 'this field is required'
                      : `Zip code must be ${selectedCountryInfoForPermanentAddress?.postal_code?.format?.length} characters long`
                    : ''
              }
            />
          </div>
        </div>
      </div>
    );
  }
);

export default DynamicAddressComponentHelper;
