/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import { FaCheck, FaStarOfLife } from 'react-icons/fa';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';
import { MdDelete, MdModeEdit, MdModeEditOutline } from 'react-icons/md';

import signInGradientBgImage from '../../assets/Images/gradient-bg.png';
import orbitLogo from '../../assets/Images/OrbitRMS-White-Transperent-Logo.png';
import CommonDatePicker from '../../common/CommonDatePicker';
import Input from '../../common/Input';
import SearchDrop from '../../common/SearchDrop';
import TextArea from '../../common/TextArea';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import {
  countryObject,
  fetchFormattedCountryData,
} from '../../Helper/countryDataHelper';
import {
  classNames,
  formateAndVerifyPhoneNumber,
} from '../../Helper/HelperFunctions';
import { OnboardingFormInterface } from '../../interface/interface';
import VerifyWebsiteUrlModal from './VerifyWebsiteUrlModal';

const initialState = {
  general_info: {
    organization_name: '',
    primary_email: '',
    primary_number: '',
    country_info: null,
    portal_url: '',
    website_url: '',
    is_meta_verified: false,
    meta_key: '',
    meta_value: '',
    terms_accepted: false,
    email_verified: false,
    organization_profile_picture: '',
  },
  address: {
    address: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
    country_code: '',
  },
  contact_info: [
    {
      phone_number: '',
      company_email: '',
      country_info: '',
    },
  ],
  about_info: {
    about: '',
    established_science: new Date(),
    registration_number: '',
  },
  organization_settings: {
    email_domain_slug: '',
    employee_code_prefix: '',
    intern_code_prefix: '',
    default_timezone: '',
    default_dateformat: '',
  },
  status: true,
};

const SideBarArray = [
  {
    id: 0,
    label: 'General Info',
  },
  {
    id: 1,
    label: 'Address',
  },
  {
    id: 2,
    label: 'Contact & About Information',
  },
  {
    id: 3,
    label: 'Organization Settings',
  },
];

const initialCountryInfo = {
  country_code: '',
  country_name: '',
  country_flag: '',
  country_number_code: '',
  postal_code: {
    format: '',
    regex: new RegExp(''),
  },
};

interface countryInfoInterFace {
  country_code: string;
  country_name: string;
  country_flag: string;
  country_number_code: string;
  postal_code: {
    format: string;
    regex: RegExp;
  };
}

function Onboarding() {
  const countryUseEffectRef = useRef(false);

  const [formData, setFormData] =
    useState<OnboardingFormInterface>(initialState);

  const [page, setPage] = useState(3);
  const [showVerifyWebsiteUrlModal, setShowVerifyWebsiteUrlModal] =
    useState<boolean>(false);
  const [stateOptionArray, setStateOptionArray] = useState<
    Array<string | object>
  >([]);
  const [countryData, setCountryData] = useState<Array<object>>([]);
  const [isFetchingCountryData, setIsFetchingCountryData] =
    useState<boolean>(false);
  const [citiesOptionsArray, setCitiesOptionsArray] = useState<Array<string>>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingStateInfo, setFetchingStateInfo] = useState<boolean>(false);

  const [selectedCountryInfo, setSelectedCountryInfo] =
    useState<countryInfoInterFace>(initialCountryInfo);
  const [countryOptionsDataArray, setCountryOptionsDataArray] = useState<
    Array<countryObject>
  >([]);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    setFormData((previous) => {
      const updatedData = { ...previous };
      let nested: any = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!nested[keys[i]]) {
          nested[keys[i]] = {}; // Ensure the nested object exists
        }
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = value;

      return { ...updatedData };
    });
  };

  const addWebsiteUrlFunction = (
    url: string,
    meta_name: string,
    meta_value: string,
    meta_verified: boolean
  ) => {
    setFormData((previousData) => ({
      ...previousData,
      general_info: {
        ...previousData.general_info,
        website_url: url,
        meta_key: meta_name,
        meta_value,
        is_meta_verified: meta_verified,
      },
    }));
  };

  const handelIncrementPage = () => {
    if (page < SideBarArray.length - 1) {
      setPage((pervPage) => pervPage + 1);
    }
  };
  const handelDecreesPage = () => {
    if (page >= 1) {
      setPage((pervPage) => pervPage - 1);
    }
  };
  const getTheCitiesOfState = async (stateCode: string) => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: `country-info/getStateInfo?country=IN&state_code=${stateCode}`,
        protected: false,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    if (response[0].success) {
      setCitiesOptionsArray(response[0].cities_array);
    }
    setLoading(false);
  };

  const fetchAllTheStateAccToCountry = async (country_code: string) => {
    setFetchingStateInfo(true);
    const endpointArray: Array<endpointObject> = [
      {
        endPoint: `country-info/getCountryInfo?country=${country_code}`,
        protected: false,
      },
      {
        endPoint: `country-info/getFormats?country_code=${country_code}`,
        protected: false,
      },
    ];
    const response = await multipleFetchApi(endpointArray);
    if (response) {
      if (response[0]?.success) {
        setStateOptionArray(response[0].states);
      }
      if (response[1]?.success) {
        setFormData((prevValue) => ({
          ...prevValue,

          organization_settings: {
            ...prevValue.organization_settings,
            default_dateformat: response[1]?.country_date_formate,
            default_timezone: response[1]?.timeZones[0],
          },
        }));
      }
    }

    setFetchingStateInfo(false);
  };

  const handleClickOnCountryValue = async (data: string | object) => {
    if (typeof data != 'object') return;
    const country_name = (data as Record<string, string>)['country_name'];
    const country_code = (data as Record<string, string>)['country_code'];
    const country_flag = (data as Record<string, string>)['country_flag'];
    const country_number_code = (data as Record<string, string>)[
      'country_number_code'
    ];

    const infoObj = {
      country_name,
      country_code,
      country_flag,
      country_number_code,
    };
    setFormData((prevValue) => ({
      ...prevValue,
      address: {
        ...prevValue.address,
        country: country_name,
        country_code: country_code,
        state: '',
        city: '',
        zip_code: '',
      },
      contact_info: prevValue.contact_info.map((item) => ({
        ...item,
        country_info: JSON.stringify(infoObj),
      })),
    }));

    setSelectedCountryInfo(data as countryInfoInterFace);

    fetchAllTheStateAccToCountry(country_code);
  };

  const handleClickOnStateValue = (data: string | object) => {
    const stateName =
      typeof data === 'object'
        ? (data as Record<string, string>)['state_name']
        : data;
    const stateCode =
      typeof data === 'object'
        ? (data as Record<string, string>)['state_code']
        : data;

    setFormData((pervValue) => ({
      ...pervValue,
      address: {
        ...pervValue.address,
        state: stateName,
        city: '',
        zip_code: '',
      },
    }));

    if (stateCode) {
      setLoading(true);
      getTheCitiesOfState(stateCode);
    }
  };

  const handleClickOnCityVal = (data: string | object) => {
    const cityName =
      typeof data === 'object'
        ? (data as Record<string, string>)['city_name']
        : data;

    setFormData((pervValue) => ({
      ...pervValue,
      address: {
        ...pervValue.address,
        city: cityName,
        zip_code: '',
      },
    }));
  };

  const handelAddNewContact = () => {
    const infoObj = {
      country_name: selectedCountryInfo?.country_name,
      country_code: selectedCountryInfo?.country_code,
      country_flag: selectedCountryInfo?.country_flag,
      country_number_code: selectedCountryInfo?.country_number_code,
    };
    setFormData((pervData) => ({
      ...pervData,
      contact_info: [
        ...pervData.contact_info,
        {
          phone_number: '',
          company_email: '',
          country_info: JSON.stringify(infoObj),
        },
      ],
    }));
  };
  const removeContactInfo = (index: number) => {
    setFormData((pervValue) => ({
      ...pervValue,
      contact_info: pervValue.contact_info.filter((_, i) => i !== index),
    }));
  };

  const handelContactNumberOnChangeFunction = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;

    setFormData((pervValue) => ({
      ...pervValue,
      contact_info: pervValue.contact_info.map((contact, i) =>
        i === index
          ? {
              ...contact,
              [name]:
                name == 'phone_number'
                  ? formateAndVerifyPhoneNumber(
                      value,
                      formData.contact_info[index].country_info
                        ? JSON.parse(
                            formData.contact_info[index]?.country_info as string
                          )?.country_code
                        : 'IN'
                    )
                  : value,
            }
          : contact
      ),
    }));
  };

  const handleDatePickerOnChangeFunction = (date: Date | null) => {
    setFormData((pervValue) => ({
      ...pervValue,
      about_info: {
        ...pervValue?.about_info,
        established_science: date,
      },
    }));
  };

  const handleDropDownSelectValue = (val: string, index: number) => {
    setFormData((pervValue) => ({
      ...pervValue,
      contact_info: pervValue.contact_info.map((contact, i) =>
        i === index
          ? {
              ...contact,
              country_info: val as string,
              phone_number: formateAndVerifyPhoneNumber(
                formData?.contact_info[index].phone_number,
                val ? JSON.parse(val as string)?.country_code : 'IN'
              ),
            }
          : contact
      ),
    }));
  };

  const handelZipCodeOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;

    // Remove any non-numeric characters
    value = value.replace(/\D/g, '');

    if (selectedCountryInfo.postal_code) {
      const maxLength = selectedCountryInfo.postal_code.format.length;

      // Restrict input length
      if (value.length > maxLength) {
        value = value.slice(0, maxLength);
      }

      // Update form data in real-time
      setFormData((prevValue) => ({
        ...prevValue,
        address: {
          ...prevValue.address,
          zip_code: value,
        },
      }));
    }
  };

  const handelClickOnOrganizationToggleButton = () => {
    setFormData((pervValue) => ({
      ...pervValue,
      status: pervValue.status ? false : true,
    }));
  };

  useEffect(() => {
    if (countryUseEffectRef.current) return;
    countryUseEffectRef.current = true;
    (async () => {
      if (countryOptionsDataArray.length == 0) {
        const response = await fetchFormattedCountryData(
          selectedCountryInfo?.country_code
        );
        if (response?.success && response?.countryOptionsData) {
          setCountryOptionsDataArray(response?.countryOptionsData);
          handleDropDownSelectValue(
            JSON.stringify(response?.filteredCountry),
            0
          );
        }
      }
      setIsFetchingCountryData(true);
      const endpointArray: Array<endpointObject> = [
        {
          endPoint: 'country-info/fetchAllCountry',
          protected: false,
        },
      ];

      const response = await multipleFetchApi(endpointArray);
      const res = response[0];

      if (res?.success) {
        setCountryData(res.data);
      }

      setIsFetchingCountryData(false);
    })();
  }, [countryOptionsDataArray, selectedCountryInfo?.country_code]);

  return (
    <>
      <div className='h-screen w-screen bg-[var(--them-pink-color)]'>
        <div className='w-full h-full flex items-stretch justify-start relative'>
          <img
            src={signInGradientBgImage}
            className='w-2/3 h-full absolute top-0 left-0'
          />
          <div className='w-1/3 relative hidden md:block'>
            <div className='w-full h-full p-7'>
              <div>
                <img
                  src={orbitLogo}
                  className='max-w-[250px] h-fit max-h-[55px] lg:max-h-[75px]'
                  alt='OrbitRMS Logo'
                />
              </div>
              <div className='pt-7 '>
                <h1 className='font-syne text-base lg:text-xl text-white font-extrabold text-balance pl-0.5'>
                  Welcome to <span className=''>OrbitRMS </span>– Let’s Get You
                  Onboard!
                </h1>
              </div>

              <div className='flex flex-col items-start justify-center py-12'>
                {SideBarArray?.map((item) => (
                  <div
                    className={classNames('flex flex-col items-start', {
                      'opacity-50': page < item?.id,
                    })}
                    key={item?.id}
                  >
                    <div className='flex items-center gap-2'>
                      <span
                        className={classNames(
                          'w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all',
                          {
                            'bg-white text-black': page <= item?.id,
                            'bg-green-600 text-white': page > item?.id,
                          }
                        )}
                      >
                        {page > item?.id ? (
                          <FaCheck className='w-4 h-4 transition-all' />
                        ) : (
                          item?.id + 1
                        )}
                      </span>
                      <span className='text-sm lg:text-base xl:text-xl font-bold text-white'>
                        {item?.label}
                      </span>
                    </div>
                    {item?.id + 1 != SideBarArray.length ? (
                      <div className='w-10 flex items-center justify-center relative'>
                        <span
                          className={classNames(
                            'w-1.5 h-14 bg-green-100/30 inline-block',
                            {}
                          )}
                        ></span>
                        <span
                          className={classNames(
                            'w-1.5 h-14 bg-green-600 inline-block absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-200 origin-top',
                            {
                              'scale-y-0': page <= item?.id,
                              'scale-y-100': page > item?.id,
                            }
                          )}
                        ></span>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px] relative z-10 p-6'>
            <div className='max-w-[800px] mx-auto h-full pb-10 flex items-center justify-center relative'>
              <div className='w-full flex flex-col items-start justify-start gap-5 overflow-hidden'>
                <div className='w-full flex flex-col items-start justify-start gap-1.5 pb-8 border-b border-black/20'>
                  <h3 className='text-xl font-inter font-semibold text-black'>
                    General Info
                  </h3>
                  <p className='font-inter text-sm text-black/60'>
                    Essential details about the organization for registration.
                  </p>
                </div>
                <div
                  className={`flex items-start justify-start transition-all`}
                  style={{ transform: `translateX(-${page * 100}%)` }}
                >
                  {/* general Info */}
                  <div className='w-full min-w-full grid grid-cols-1 gap-4 pt-4 px-1.5'>
                    <div className='w-full'>
                      <Input
                        name='general_info.organization_profile_picture'
                        type='file'
                        RequiredFileTypeArray={[
                          'image/png',
                          'image/jpeg',
                          'image/webp',
                        ]}
                        labelFieldName='Organization Profile Picture'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='general_info.organization_name'
                          labelFieldName='Organization Name'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={formData.general_info.organization_name}
                          onChange={handleOnChange}
                          disabled={true}
                        />
                      </div>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='general_info.portal_url'
                          labelFieldName='Portal Url'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={formData.general_info.portal_url}
                          onChange={handleOnChange}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='general_info.primary_email'
                          labelFieldName='Primary Email'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={formData.general_info.primary_email}
                          onChange={handleOnChange}
                          disabled={true}
                        />
                      </div>
                      <div className='w-full h-full'>
                        <label
                          htmlFor=''
                          className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
                        >
                          <span className='flex gap-1'>
                            <span>Primary Number</span>
                            <FaStarOfLife className='w-1.5 text-red-700' />
                          </span>
                        </label>

                        <div className='w-full flex items-stretch justify-start h-[42px]'>
                          <div
                            className='rounded-l-lg font-inter overflow-hidden h-full border border-[#7fab98] border-r-0 bg-[#7fab98]/15 flex items-center justify-center px-3.5'
                            aria-disabled='true'
                          >
                            <span className='font-inter text-sm text-black'>
                              +91
                            </span>
                          </div>
                          <input
                            type='text'
                            className='rounded-r-lg w-full relative focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] font-inter overflow-hidden h-full disabled:border disabled:border-[#7fab98] disabled:bg-[#7fab98]/15'
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <label
                        htmlFor=''
                        className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
                      >
                        <span className='flex gap-1'>
                          <span>Website URL</span>
                          <FaStarOfLife className='w-1.5 text-red-700' />
                        </span>
                      </label>
                      <div className='flex items-stretch gap-2'>
                        <div className='w-full'>
                          <Input
                            type='text'
                            name='general_info.website_url'
                            className='border border-black/45'
                            isRequiredField={true}
                            value={formData.general_info.website_url}
                            onChange={handleOnChange}
                            disabled={true}
                          />
                        </div>
                        <div className=''>
                          <button
                            className='text-black flex items-center justify-center h-full border border-black/65 w-[40px] rounded-lg'
                            onClick={() => setShowVerifyWebsiteUrlModal(true)}
                          >
                            <MdModeEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* address */}
                  <div className='w-full min-w-full grid grid-cols-1 gap-4 pt-4 px-1.5'>
                    <div className='w-full'>
                      <TextArea
                        name='address.address'
                        rows={5}
                        value={formData.address.address}
                        onChange={handleOnChange}
                        isRequiredField={true}
                        labelFieldName='Address'
                      />
                    </div>
                    <div className='w-full'>
                      <SearchDrop
                        options={countryData}
                        searchKey='country_name'
                        isRequiredField={true}
                        labelFieldName='Country'
                        selectedValue={formData.address.country}
                        onSelectValBtn={handleClickOnCountryValue}
                        position='bottom'
                        emptyDataMessage={'No Option'}
                        loading={isFetchingCountryData}
                      />
                    </div>
                    <div className='w-full'>
                      <SearchDrop
                        options={stateOptionArray}
                        searchKey='state_name'
                        isRequiredField={true}
                        labelFieldName='State'
                        selectedValue={formData.address.state}
                        onSelectValBtn={handleClickOnStateValue}
                        position='top'
                        emptyDataMessage={
                          formData.address.country.trim() == ''
                            ? 'Please Select A Country First'
                            : 'No Option'
                        }
                        loading={fetchingStateInfo}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='w-full'>
                        <SearchDrop
                          options={citiesOptionsArray}
                          searchKey='city_name'
                          isRequiredField={true}
                          labelFieldName='City'
                          selectedValue={formData.address.city}
                          onSelectValBtn={handleClickOnCityVal}
                          position='top'
                          emptyDataMessage={
                            formData.address.state.trim() == ''
                              ? 'Please Select A State First'
                              : 'No Option'
                          }
                          loading={loading}
                        />
                      </div>
                      <div className='w-full h-full'>
                        <Input
                          type='text'
                          name='address.zip_code'
                          className='border border-black/45'
                          isRequiredField={true}
                          labelFieldName='Zip Code'
                          value={formData.address.zip_code}
                          onChange={handelZipCodeOnChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/*Contact & About Info */}
                  <div className='w-full min-w-full grid grid-cols-1 gap-4 pt-4 px-1.5'>
                    <div className='w-full'>
                      <TextArea
                        name='about_info.about'
                        rows={4}
                        value={formData.about_info.about}
                        onChange={handleOnChange}
                        isRequiredField={true}
                        labelFieldName='About'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <CommonDatePicker
                          onChange={handleDatePickerOnChangeFunction}
                          selectedValue={
                            formData?.about_info?.established_science as Date
                          }
                          name='established_science'
                          labelFieldName='Established Science'
                          isRequiredField={true}
                        />
                      </div>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='about_info.registration_number'
                          labelFieldName='Registration Number'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={formData.about_info.registration_number}
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>
                    <div className='w-full min-w-full h-full'>
                      <div className='flex w-full gap-2 items-center pt-4 pb-2'>
                        <div className='grid grid-cols-2 w-full gap-2.5'>
                          <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                            Phone Number
                          </p>
                          <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                            Company Email
                          </p>
                        </div>
                        <div className='min-w-[100px]'></div>
                      </div>
                      <div className='w-full min-h-[180px] max-h-[180px] overflow-auto pt-1'>
                        {formData.contact_info.map((_, index) => (
                          <div
                            className='flex w-full gap-2 items-stretch pb-2'
                            key={index}
                          >
                            <div className='grid grid-cols-2 gap-2.5 w-full'>
                              <div className='w-full'>
                                <Input
                                  type='number'
                                  countryDropDownPosition='bottom'
                                  name='phone_number'
                                  className='border border-black/45 rounded-l-none'
                                  countryDropDownMaxHeight={100}
                                  value={
                                    formData.contact_info[index].phone_number
                                  }
                                  onChange={(e) =>
                                    handelContactNumberOnChangeFunction(
                                      e,
                                      index
                                    )
                                  }
                                  dropDownSelectedValue={
                                    formData.contact_info[index].country_info
                                      ? JSON.parse(
                                          formData.contact_info[index]
                                            ?.country_info as string
                                        )?.country_number_code
                                      : ''
                                  }
                                  setDropDownSelectedValue={(val) =>
                                    handleDropDownSelectValue(
                                      val as string,
                                      index
                                    )
                                  }
                                  countryOptionsData={countryOptionsDataArray}
                                />
                              </div>
                              <div className='w-full'>
                                <Input
                                  type='text'
                                  name='company_email'
                                  className='border border-black/45'
                                  value={
                                    formData.contact_info[index].company_email
                                  }
                                  onChange={(e) =>
                                    handelContactNumberOnChangeFunction(
                                      e,
                                      index
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className='min-w-[100px] grid grid-cols-2 gap-2.5'>
                              {index == formData.contact_info.length - 1 && (
                                <button
                                  className='bg-green-100 h-full w-full rounded-[4px] flex items-center justify-center border border-green-600 text-black text-xl'
                                  onClick={handelAddNewContact}
                                >
                                  <MdModeEditOutline />
                                </button>
                              )}
                              {formData.contact_info.length > 1 && (
                                <button
                                  className='bg-rose-100 h-full w-full rounded-[4px] flex items-center justify-center border border-rose-500 text-black text-xl'
                                  onClick={() => removeContactInfo(index)}
                                >
                                  <MdDelete />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Organization Settings */}
                  <div className='w-full min-w-full grid grid-cols-1 gap-4 pt-4 px-1.5'>
                    <div className='w-full'>
                      <Input
                        type='text'
                        name='organization_settings.email_domain_slug'
                        labelFieldName='Email Domain Slug'
                        className='border border-black/45'
                        isRequiredField={true}
                        value={formData.organization_settings.email_domain_slug}
                        onChange={handleOnChange}
                        disabled={true}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='organization_settings.default_dateformat'
                          labelFieldName='Default Date Formate'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={
                            formData.organization_settings.default_dateformat
                          }
                          onChange={handleOnChange}
                          disabled={true}
                        />
                      </div>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='organization_settings.default_timezone'
                          labelFieldName='Default Timezone'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={
                            formData.organization_settings.default_timezone
                          }
                          onChange={handleOnChange}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='organization_settings.employee_code_prefix'
                          labelFieldName='Employee Code Prefix'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={
                            formData.organization_settings.employee_code_prefix
                          }
                          onChange={handleOnChange}
                        />
                      </div>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='organization_settings.intern_code_prefix'
                          labelFieldName='Intern Code Prefix'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={
                            formData.organization_settings.intern_code_prefix
                          }
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>
                    <div className='w-full'>
                      <span className='w-full inline-block h-[1px] bg-black/45 my-8'></span>
                      <p className='text-sm font-inter font-normal text-black/65 pb-4 inline-block'>
                        Organization Status
                      </p>
                      <div className='bg-slate-100 w-full py-4 px-4 rounded-lg border border-black/15'>
                        <div className='flex items-center justify-between'>
                          <p className='text-black text-base font-normal'>
                            Your Organization Is:
                            <span
                              className={`font-bold transition-all duration-100 ${formData.status ? 'text-green-500' : 'text-red-500'}`}
                            >
                              {formData.status ? ' Active' : ' Inactive'}
                            </span>
                          </p>
                          <button
                            className={`w-14 h-[26px] rounded-full relative transition-all duration-200 ${formData.status ? 'bg-green-500' : 'bg-red-500'}`}
                            onClick={handelClickOnOrganizationToggleButton}
                          >
                            <span
                              className={`w-5 h-5 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.status ? 'left-8' : 'left-1'}`}
                            ></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='absolute bottom-0 w-full flex items-center justify-between px-1.5'>
                <button
                  className={classNames(
                    'bg-transparent text-base py-2 px-6 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 capitalize w-fit text-black border border-black/45 hover:bg-black/5',
                    { invisible: page <= 0 }
                  )}
                  onClick={handelDecreesPage}
                >
                  <FaArrowLeftLong />
                  <span>Back</span>
                </button>
                <button
                  className={classNames(
                    'bg-[var(--them-green-color)] text-base py-2 px-6 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 capitalize w-fit',
                    { hidden: page >= SideBarArray.length - 1 }
                  )}
                  onClick={handelIncrementPage}
                >
                  <span>next</span>
                  <FaArrowRightLong />
                </button>
                <button
                  className={classNames(
                    'bg-[var(--them-green-color)] text-base py-2 px-6 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 capitalize w-fit',
                    { hidden: page != SideBarArray.length - 1 }
                  )}
                  onClick={handelIncrementPage}
                >
                  <span>Submit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showVerifyWebsiteUrlModal && (
        <VerifyWebsiteUrlModal
          showModal={showVerifyWebsiteUrlModal}
          setShowModal={setShowVerifyWebsiteUrlModal}
          addWebsiteUrlFunction={addWebsiteUrlFunction}
          default_website_url={formData.general_info.website_url}
        />
      )}
    </>
  );
}

export default Onboarding;
