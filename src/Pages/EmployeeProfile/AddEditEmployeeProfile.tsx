/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import {
  MdDelete,
  MdModeEditOutline,
  MdOutlineFileUpload,
} from 'react-icons/md';
import { useParams } from 'react-router-dom';

import CommonDatePicker from '../../common/CommonDatePicker';
import DragAndDropFileUploader from '../../common/DragDropUploader/DragAndDropFileUploader';
import Input from '../../common/Input';
import SearchDrop from '../../common/SearchDrop';
import TextArea from '../../common/TextArea';
import {
  AlignableForChildInfo,
  bloodGroupArray,
  GenderArray,
  maritalStatus,
  OrganizationEmployeeStatusArray,
} from '../../constant/constant';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import {
  countryObject,
  fetchFormattedCountryData,
} from '../../Helper/countryDataHelper';
import { formateAndVerifyPhoneNumber } from '../../Helper/HelperFunctions';
import { AddEditUserProfileInterFace } from '../../interface/AddEditUserProfileInterFace';
import {
  CountryDataInterface,
  DepartmentConfig,
  DesignationConfig,
  StateOptionArrayInterFace,
} from '../../interface/interface';

type ErrorModuleType =
  | ''
  | 'personal_info'
  | 'employee_info'
  | 'personal_contact_info'
  | 'family_info'
  | 'organization_settings'
  | 'employee_profile_info';

interface AddressModuleInterface {
  address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  country_code: string;
}

const initialState: AddEditUserProfileInterFace = {
  personal_info: {
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    profile_picture: '',
    gender: '',
    date_of_birth: null, // or new Date() if you want to initialize with current date
    blood_group: '',
    about: '',
  },
  employee_info: {
    status: '',
    organization_name: '',
    department: '',
    designation: '',
    reporting_to: { id: '', name: '' },
    employee_role: { role_id: '', role_name: '' },
    employee_email: '',
    employee_code: '',
  },
  personal_contact_info: {
    personal_email: '',
    mobile_number: '',
    country_info: '',
    emergency_contact: [
      {
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_country_info: '',
      },
    ],
  },
  family_info: {
    father_name: '',
    mother_name: '',
    marital_status: '',
    children: [
      {
        child_date_of_birth: null,
        child_name: '',
      },
    ],
  },
  current_address: {
    address: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
    country_code: '',
  },
  same_as_current_address: true,
  permanent_address: {
    address: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
    country_code: '',
  },
};
const initialCountryInfo: CountryDataInterface = {
  country_code: '',
  country_flag: '',
  country_name: '',
  country_number_code: '',
  postal_code: { format: '', regex: '' },
};

export default function AddEditEmployeeProfile() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { organization } = useParams();

  const CountryDataRef = useRef(false);
  const DesignationsDepartmentsRef = useRef(false);

  const [showEmptyFieldError, setShowEmptyFieldError] =
    useState<boolean>(false);
  const [formData, setFormData] =
    useState<AddEditUserProfileInterFace>(initialState);

  const [countryOptionsDataArray, setCountryOptionsDataArray] = useState<
    Array<countryObject>
  >([]);

  const [countryData, setCountryData] = useState<Array<CountryDataInterface>>(
    []
  );
  const [isFetchingCountryData, setIsFetchingCountryData] =
    useState<boolean>(false);

  const [
    selectedCountryInfoForPermanentAddress,
    setSelectedCountryInfoForPermanentAddress,
  ] = useState<CountryDataInterface>(initialCountryInfo);
  const [
    selectedCountryInfoForCurrentAddress,
    setSelectedCountryInfoForCurrentAddress,
  ] = useState<CountryDataInterface>(initialCountryInfo);
  const [citiesOptionsArray, setCitiesOptionsArray] = useState<{
    current_address: Array<string>;
    permanent_address: Array<string>;
  }>({ current_address: [], permanent_address: [] });
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingDesignationsDepartments, setFetchingDesignationsDepartments] =
    useState<{
      departments: boolean;
      designations: boolean;
    }>({
      departments: false,
      designations: false,
    });
  const [departmentOptions, setDepartmentOptions] = useState<
    Array<DepartmentConfig>
  >([]);
  const [designationOptions, setDesignationOptions] = useState<
    Array<DepartmentConfig>
  >([]);
  const [fetchingStateInfo, setFetchingStateInfo] = useState<boolean>(false);

  const [stateOptionArray, setStateOptionArray] = useState<{
    current_address: Array<StateOptionArrayInterFace>;
    permanent_address: Array<StateOptionArrayInterFace>;
  }>({ current_address: [], permanent_address: [] });

  // The Function That Handel The Profile Photo Uploading
  const handelProfileUploadation = (url: string) => {
    setFormData((pervValue) => ({
      ...pervValue,
      personal_info: {
        ...pervValue.personal_info,
        profile_picture: url,
      },
    }));
  };

  // this is the validation function that is being used to validate the employee profile while adding or updating

  const userProfileValidation: {
    validated: () => boolean;
    errorModule: ErrorModuleType;
  }[] = [
    {
      validated: () =>
        !!(
          formData?.personal_info?.first_name &&
          formData?.personal_info?.last_name &&
          formData?.personal_info?.full_name &&
          formData?.personal_info?.gender &&
          formData?.personal_info?.date_of_birth &&
          formData?.personal_info?.blood_group
        ),
      errorModule: 'personal_info',
    },
    {
      validated: () =>
        !!(
          formData?.employee_info?.status &&
          formData?.employee_info?.organization_name &&
          formData?.employee_info?.department &&
          formData?.employee_info?.designation &&
          formData?.employee_info?.reporting_to?.id &&
          formData?.employee_info?.reporting_to?.name &&
          formData?.employee_info?.employee_role?.role_id &&
          formData?.employee_info?.employee_role?.role_name &&
          formData?.employee_info?.employee_email &&
          formData?.employee_info?.employee_code
        ),
      errorModule: 'employee_info',
    },
    {
      validated: () =>
        !!(
          formData?.personal_contact_info?.personal_email &&
          formData?.personal_contact_info?.mobile_number &&
          formData?.personal_contact_info?.country_info &&
          formData?.personal_contact_info?.emergency_contact?.every(
            (contact) =>
              contact.emergency_contact_name &&
              contact.emergency_contact_number &&
              contact.emergency_contact_country_info
          )
        ),
      errorModule: 'personal_contact_info',
    },
    {
      validated: () =>
        !!(
          formData?.family_info?.father_name &&
          formData?.family_info?.mother_name &&
          formData?.family_info?.marital_status &&
          formData?.family_info?.children?.every(
            (child) => child.child_name && child.child_date_of_birth
          )
        ),
      errorModule: 'family_info',
    },
  ];

  // The Comman Function To Single Handedly Handel The Selected Drop Down Value
  const handelSearchDropSelectValue = (
    data: string | object,
    name: string,
    sectionName:
      | 'personal_info'
      | 'employee_info'
      | 'personal_contact_info'
      | 'family_info'
  ) => {
    setFormData((pervData) => ({
      ...pervData,
      [sectionName]: {
        ...pervData[sectionName],
        [name]: typeof data === 'object' ? JSON.stringify(data) : data,
      },
    }));
  };

  const handelInputFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
    sectionName: 'personal_info' | 'employee_info' | 'personal_contact_info'
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormData((pervData) => ({
      ...pervData,
      [sectionName]: {
        ...pervData[sectionName],
        [name]: value,
      },
    }));
  };

  // The Function To Handel The Change In The Date
  const handelDateOfBirthPickUpChangeFunction = (date: Date | null) => {
    setFormData((pervValue) => ({
      ...pervValue,
      personal_info: {
        ...pervValue.personal_info,
        date_of_birth: date,
      },
    }));
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    let filteredValue = value;

    if (name == 'employee_info.employee_code') {
      const codePrefix =
        formData?.employee_info?.status.toLocaleLowerCase() == 'intern'
          ? GlobalStateProvider?.organization?.organization_settings
              ?.intern_code_prefix
          : GlobalStateProvider?.organization?.organization_settings
              ?.employee_code_prefix;
      filteredValue = codePrefix + '-' + value.replace(/\D/g, '');
    }
    if (name == 'employee_info.employee_email') {
      filteredValue =
        value +
        '@' +
        GlobalStateProvider?.organization?.general_info?.primary_email?.split(
          '@'
        )[1];
    }
    setFormData((previous) => {
      const updatedData = { ...previous };
      let nested: any = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!nested[keys[i]]) {
          nested[keys[i]] = {}; // Ensure the nested object exists
        }
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = filteredValue;

      return { ...updatedData };
    });
  };

  const handelAddNewContact = () => {
    if (
      formData.personal_contact_info.emergency_contact.every(
        (eachContact) =>
          eachContact?.emergency_contact_name !== '' &&
          eachContact?.emergency_contact_number !== ''
      )
    ) {
      setFormData((prevData) => ({
        ...prevData,
        personal_contact_info: {
          ...prevData.personal_contact_info,
          emergency_contact: [
            ...(prevData.personal_contact_info?.emergency_contact || []),
            {
              emergency_contact_name: '',
              emergency_contact_number: '',
              emergency_contact_country_info: '',
            },
          ],
        },
      }));
    }
  };
  const removeContactInfo = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      personal_contact_info: {
        ...prevData.personal_contact_info,
        emergency_contact:
          prevData.personal_contact_info.emergency_contact.filter(
            (_, i) => i !== index
          ),
      },
    }));
  };

  const handleEmergencyContactField = (
    index: number,
    name: string,
    ParentSectionName: 'personal_contact_info' | 'family_info',
    SubSectionName: 'emergency_contact' | 'children',
    dateOfBirth?: Date | null,
    e?: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      name == 'child_date_of_birth' ? dateOfBirth : e?.target?.value;
    if (value == undefined) return;
    setFormData((prevData) => {
      const ParentSection = prevData[ParentSectionName];
      const SubSection = ParentSection[
        SubSectionName as keyof typeof ParentSection
      ] as any;

      if (!Array.isArray(SubSection)) return prevData;

      const UpdatedSubSectionInfo = SubSection.map((data: object, i: number) =>
        i === index ? { ...data, [name]: value } : data
      );

      return {
        ...prevData,
        [ParentSectionName]: {
          ...ParentSection,
          [SubSectionName]: UpdatedSubSectionInfo,
        },
      };
    });
  };

  const handleEmergencyContactCountryInfo = (data: string, index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      personal_contact_info: {
        ...prevData.personal_contact_info,
        emergency_contact: prevData.personal_contact_info.emergency_contact.map(
          (contact, i) =>
            i == index
              ? {
                  ...contact,
                  emergency_contact_country_info: data,
                }
              : contact
        ),
      },
    }));
  };

  const handelAddNewChild = () => {
    if (
      formData.family_info.children.every(
        (contacts) =>
          contacts.child_date_of_birth !== null && contacts.child_name !== ''
      )
    ) {
      setFormData((pervData) => ({
        ...pervData,
        family_info: {
          ...pervData.family_info,
          children: [
            ...pervData.family_info.children,
            {
              child_date_of_birth: null,
              child_name: '',
            },
          ],
        },
      }));
    }
  };

  const removeSpecificChild = (index: number) => {
    setFormData((pervData) => ({
      ...pervData,
      family_info: {
        ...pervData.family_info,
        children: pervData.family_info.children.filter((_, i) => i !== index),
      },
    }));
  };

  // The function to handel the Form Submit
  const handelSubmitAndUpdateButton = () => {
    const invalidModule = userProfileValidation.find(
      (section) => !section.validated()
    );

    if (invalidModule) {
      setShowEmptyFieldError(true);
    } else {
      console.log('All sections are valid. Submitting form...');
    }
  };
  //
  // This is the function that handel The Fetching Of The State According To The Country
  //
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
          [module_name]: response[0]?.states,
        }));
      }
    }
    setFetchingStateInfo(false);
  };
  //
  // This is the function that handel the click on the country value
  //
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
      },
    }));

    if (module_name == 'current_address') {
      setSelectedCountryInfoForCurrentAddress(data);
    } else {
      setSelectedCountryInfoForPermanentAddress(data);
    }

    fetchAllTheStateAccToCountry(data?.country_code, module_name);
  };
  //
  // This Is The Function That Is Fetch The City Based On the State
  //
  const getTheCitiesOfState = async (
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
      setCitiesOptionsArray((perValue) => ({
        ...perValue,
        [module_name]: response[0].cities_array,
      }));
    }
    setLoading(false);
  };
  const handelTheSameAsCurrentAddressButton = (val: 'false' | 'true') => {
    setFormData((perValue) => ({
      ...perValue,
      same_as_current_address: val == 'false' ? false : true,
    }));
  };
  //
  // This Is The Function That Is Being Used To Fetch The city from a state and also add it in to the form data
  //
  const handleClickOnStateValue = (
    data: StateOptionArrayInterFace,
    module_name: 'current_address' | 'permanent_address'
  ) => {
    setFormData((perValue) => ({
      ...perValue,
      [module_name]: {
        ...perValue[module_name],
        state: data?.state_name,
      },
    }));

    setLoading(true);
    getTheCitiesOfState(
      formData[module_name]?.country_code,
      data?.state_code,
      module_name
    );
  };

  const handelZipCodeOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    module_name: 'current_address' | 'permanent_address'
  ) => {
    let { value } = e.target;

    console.log(
      'selectedCountryInfoForCurrentAddress',
      selectedCountryInfoForCurrentAddress
    );

    console.log(
      'selectedCountryInfoForPermanentAddress',
      selectedCountryInfoForPermanentAddress
    );

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

  const FetchDepartmentAndDesignation = async () => {
    setFetchingDesignationsDepartments({
      departments: true,
      designations: true,
    });
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: 'config/department/fetch',
        protected: true,
      },
      {
        endPoint: 'config/designations/fetch',
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    if (response) {
      if (response[0]?.success) {
        setDepartmentOptions(response[0]?.data);
      }
      if (response[1]?.success) {
        setDesignationOptions(response[1]?.data);
      }
    }
    setFetchingDesignationsDepartments({
      departments: false,
      designations: false,
    });
  };

  //
  // ? Defining The UseEffect That is Going To be Used To load the Initial Data
  //
  useEffect(() => {
    if (organization) {
      setFormData((pervValue) => ({
        ...pervValue,
        employee_info: {
          ...pervValue.employee_info,
          organization_name: organization,
        },
      }));
    }
  }, [organization]);

  useEffect(() => {
    const loadCountryData = async () => {
      if (CountryDataRef.current) return;
      CountryDataRef.current = true;
      if (countryOptionsDataArray.length === 0) {
        const response = await fetchFormattedCountryData();
        if (response?.success) {
          setCountryOptionsDataArray(response?.countryOptionsData);
          setFormData((pervData) => ({
            ...pervData,
            personal_contact_info: {
              ...pervData.personal_contact_info,
              country_info: JSON.stringify(response.filteredCountry),
            },
          }));
        }
      }
      if (countryData.length == 0) {
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
      }
    };
    loadCountryData();
  }, []);

  useEffect(() => {
    setFormData((pervValue) => ({
      ...pervValue,
      personal_info: {
        ...pervValue.personal_info,
        full_name:
          formData?.personal_info?.first_name +
          ' ' +
          formData?.personal_info?.middle_name +
          ' ' +
          formData?.personal_info?.last_name,
      },
    }));
  }, [
    formData?.personal_info?.first_name,
    formData?.personal_info?.last_name,
    formData?.personal_info?.middle_name,
  ]);
  useEffect(() => {
    if (DesignationsDepartmentsRef.current) return;
    DesignationsDepartmentsRef.current = true;
    FetchDepartmentAndDesignation();
  }, []);

  const personal_information = () => {
    return (
      <div className='bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            Personal Information
          </h2>
          <p className='font-inter text-sm text-black font-light'>
            Please provide your basic personal details. This information will
            help us get to know you better and ensure your profile is complete.
          </p>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            {formData?.personal_info?.profile_picture?.trim() == '' ? (
              <div className='w-full'>
                <DragAndDropFileUploader
                  name='general_info.organization_profile_picture'
                  type='file'
                  RequiredFileTypeArray={[
                    'image/png',
                    'image/jpeg',
                    'image/webp',
                  ]}
                  showDropFileScreenInFullScreen={true}
                  cropShape='round'
                  maxCropHeight={400}
                  maxCropWidth={400}
                  setImageUrl={handelProfileUploadation}
                />
              </div>
            ) : (
              <div className='w-full pb-2'>
                <div className='flex items-center justify-start gap-10'>
                  <div
                    className='image w-[180px] h-[180px] aspect-square rounded-full overflow-hidden border
                    border-black/20'
                  >
                    <img
                      src={formData?.personal_info?.profile_picture}
                      alt='organization profile picture'
                      width={150}
                      height={150}
                      loading='lazy'
                      className='w-full h-full object-center rounded-full bg-cover'
                    />
                  </div>
                  <div className='flex items-center justify-start gap-4'>
                    <button
                      className='text-black bg-black/10 hover:bg-black/15 transition-all p-2.5 rounded-lg'
                      onClick={() => handelProfileUploadation('')}
                    >
                      <MdOutlineFileUpload className='w-6 h-6' />
                    </button>
                    <button
                      className='text-black bg-black/10 hover:bg-black/15 transition-all p-2.5 rounded-lg'
                      onClick={() => handelProfileUploadation('')}
                    >
                      <IoCloseSharp className='w-6 h-6' />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className='w-full'>
              <Input
                type='text'
                name='personal_info.full_name'
                labelFieldName='Full Name'
                className='border border-black/45'
                isRequiredField={true}
                value={formData.personal_info.full_name}
                onChange={handleOnChange}
                disabled={true}
                showError={showEmptyFieldError}
                errorMessage={
                  formData?.personal_info?.full_name?.trim()
                    ? ''
                    : 'this field is required'
                }
              />
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='personal_info.first_name'
                    labelFieldName='First Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.personal_info.first_name}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_info?.first_name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='personal_info.middle_name'
                    labelFieldName='Middle Name'
                    className='border border-black/45'
                    isRequiredField={false}
                    value={formData.personal_info.middle_name}
                    onChange={handleOnChange}
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='personal_info.last_name'
                    labelFieldName='Last Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.personal_info.last_name}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_info?.last_name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <SearchDrop
                    options={GenderArray}
                    searchKey=''
                    position='bottom'
                    emptyDataMessage=''
                    showSearchBar={false}
                    labelFieldName='Gender'
                    isRequiredField={true}
                    selectedValue={formData?.personal_info?.gender}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        data,
                        'gender',
                        'personal_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_info?.gender
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <CommonDatePicker
                    onChange={handelDateOfBirthPickUpChangeFunction}
                    selectedValue={
                      formData?.personal_info?.date_of_birth as Date
                    }
                    name='date_of_birth'
                    labelFieldName='Date Of Birth'
                    isRequiredField={true}
                    datePickerPosition={'left-start'}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_info?.date_of_birth
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <SearchDrop
                    options={bloodGroupArray}
                    searchKey=''
                    position='bottom'
                    emptyDataMessage=''
                    showSearchBar={true}
                    labelFieldName='Blood Group'
                    isRequiredField={true}
                    selectedValue={formData?.personal_info?.blood_group}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        data,
                        'blood_group',
                        'personal_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_info?.blood_group
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <TextArea
                name='personal_info.about'
                rows={4}
                value={formData?.personal_info?.about}
                onChange={handleOnChange}
                labelFieldName='About'
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const employee_information = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            Employee Information
          </h2>
          <p className='font-inter text-base text-black font-light'>
            Enter key employment details to help us manage records accurately
            and maintain a complete employee profile.
          </p>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <SearchDrop
                    options={OrganizationEmployeeStatusArray}
                    searchKey=''
                    position='bottom'
                    emptyDataMessage='No Status Found'
                    showSearchBar={true}
                    labelFieldName='Status'
                    isRequiredField={true}
                    selectedValue={formData?.employee_info?.status}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        data,
                        'status',
                        'employee_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.employee_info?.status
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='employee_info.organization_name'
                    labelFieldName='Organization Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    disabled
                    value={formData.employee_info?.organization_name}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.employee_info?.organization_name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <SearchDrop
                    options={departmentOptions}
                    searchKey='department_name'
                    position='bottom'
                    emptyDataMessage='No Department Found'
                    showSearchBar={true}
                    labelFieldName='Department'
                    isRequiredField={true}
                    selectedValue={formData?.employee_info?.department}
                    loading={fetchingDesignationsDepartments['departments']}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        (data as DepartmentConfig).department_name,
                        'department',
                        'employee_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.employee_info?.department
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full grid grid-cols-3 gap-5'>
                <div className='w-full'>
                  <SearchDrop
                    options={designationOptions}
                    searchKey='designations_name'
                    position='bottom'
                    emptyDataMessage='No Designation Found'
                    showSearchBar={true}
                    labelFieldName='Designation'
                    isRequiredField={true}
                    loading={fetchingDesignationsDepartments['designations']}
                    selectedValue={formData?.employee_info?.designation}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        (data as DesignationConfig).designations_name,
                        'designation',
                        'employee_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.employee_info?.designation
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <SearchDrop
                    options={[]}
                    searchKey=''
                    position='bottom'
                    emptyDataMessage='No Reporting Manager Found'
                    showSearchBar={true}
                    labelFieldName='Reporting To'
                    isRequiredField={true}
                    selectedValue={formData?.employee_info?.reporting_to?.name}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        data,
                        'reporting_to',
                        'employee_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.employee_info?.reporting_to?.name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <SearchDrop
                    options={[]}
                    searchKey=''
                    position='bottom'
                    emptyDataMessage='No Role Found'
                    showSearchBar={true}
                    labelFieldName='Employee Role'
                    isRequiredField={true}
                    selectedValue={
                      formData?.employee_info?.employee_role?.role_name
                    }
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        data,
                        'employee_role',
                        'employee_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.employee_info?.employee_role?.role_name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
              </div>
            </div>
            <div className='w-full'>
              <div className='grid grid-cols-2 gap-5'>
                <div className='w-full'>
                  <label
                    htmlFor=''
                    className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
                  >
                    <span className='flex gap-1'>
                      <span>Employee Code</span>
                      <FaStarOfLife className='w-1.5 text-red-700' />
                    </span>
                  </label>
                  <div className='relative w-full flex items-stretch justify-start'>
                    <div className='flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-3 whitespace-nowrap'>
                      {formData?.employee_info?.status.toLocaleLowerCase() ==
                      'intern'
                        ? GlobalStateProvider?.organization
                            ?.organization_settings?.intern_code_prefix
                        : GlobalStateProvider?.organization
                            ?.organization_settings?.employee_code_prefix}{' '}
                      -
                    </div>
                    <Input
                      name='employee_info.employee_code'
                      className='border border-black/[.65] border-l-0 rounded-l-none text-black w-full'
                      type='number'
                      value={formData?.employee_info?.employee_code
                        ?.split('-')
                        .pop()}
                      onChange={handleOnChange}
                    />
                  </div>
                  {showEmptyFieldError &&
                  formData?.employee_info?.employee_code?.trim() == '' ? (
                    <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                      This field is required.
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                <div className='w-full'>
                  <label
                    htmlFor=''
                    className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
                  >
                    <span className='flex gap-1'>
                      <span>Employee Email</span>
                      <FaStarOfLife className='w-1.5 text-red-700' />
                    </span>
                  </label>
                  <div className='relative w-full flex items-stretch justify-start'>
                    <Input
                      name='employee_info.employee_email'
                      className='border border-black/[.65] border-r-0 rounded-r-none text-black w-full'
                      type='text'
                      value={
                        formData?.employee_info?.employee_email?.split('@')[0]
                      }
                      onChange={handleOnChange}
                    />
                    <div className='flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-r-lg text-[14px] px-3 whitespace-nowrap'>
                      @
                      {
                        GlobalStateProvider?.organization?.general_info?.primary_email?.split(
                          '@'
                        )[1]
                      }
                    </div>
                  </div>
                  {showEmptyFieldError &&
                  formData?.employee_info?.employee_email?.trim() == '' ? (
                    <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                      This field is required.
                    </span>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const personal_contact_information = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            Personal contact information
          </h2>
          <p className='font-inter text-base text-black font-light'>
            Enter your personal contact information to help us maintain accurate
            records and ensure seamless communication.
          </p>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-2 gap-5'>
                <div className='w-full'>
                  <Input
                    type='email'
                    name='personal_contact_info.personal_email'
                    labelFieldName='Personal Email'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.personal_contact_info.personal_email}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_contact_info.personal_email
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='number'
                    name='personal_contact_info.mobile_number'
                    className='border border-black/[.65] text-black rounded-lg rounded-l-none'
                    labelFieldName='Contact Number'
                    isRequiredField={true}
                    value={formateAndVerifyPhoneNumber(
                      formData?.personal_contact_info?.mobile_number,
                      formData?.personal_contact_info?.country_info
                        ? JSON.parse(
                            formData?.personal_contact_info
                              ?.country_info as string
                          )?.country_code
                        : 'IN'
                    )}
                    onChange={(e) =>
                      handelInputFieldChange(
                        e,
                        'mobile_number',
                        'personal_contact_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_contact_info?.mobile_number
                        ? ''
                        : 'this field is required'
                    }
                    dropDownSelectedValue={
                      formData?.personal_contact_info?.country_info
                        ? JSON.parse(
                            formData?.personal_contact_info
                              ?.country_info as string
                          )?.country_number_code
                        : '+91'
                    }
                    setDropDownSelectedValue={(data) =>
                      handelSearchDropSelectValue(
                        data as string,
                        'country_info',
                        'personal_contact_info'
                      )
                    }
                    countryDropDownPosition='top'
                    countryOptionsData={countryOptionsDataArray}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className='font-inter text-base text-black font-medium pt-7 pb-3 border-b border-b-black/45'>
              Emergency Contact Information
            </h2>
            <div className='flex w-full gap-2 items-center pb-2 pt-6'>
              <div className='grid grid-cols-2 w-full gap-2.5'>
                <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                  <span className='flex gap-1'>
                    <span>Emergency Contact Name</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </p>
                <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                  <span className='flex gap-1'>
                    <span>Emergency Contact Number</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </p>
              </div>
              <div className='min-w-[100px]'></div>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              {formData?.personal_contact_info?.emergency_contact?.map(
                (eachContact, index) => (
                  <div
                    className='w-full flex items-stretch justify-start gap-5'
                    key={index}
                  >
                    <div className='w-full grid grid-cols-2 gap-5'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='emergency_contact_name'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={eachContact?.emergency_contact_name}
                          onChange={(e) =>
                            handleEmergencyContactField(
                              index,
                              'emergency_contact_name',
                              'personal_contact_info',
                              'emergency_contact',
                              undefined,
                              e
                            )
                          }
                          showError={showEmptyFieldError}
                          errorMessage={
                            eachContact?.emergency_contact_name
                              ? ''
                              : 'this field is required'
                          }
                        />
                      </div>
                      <div className='w-full'>
                        <Input
                          type='number'
                          name='emergency_contact_number'
                          className='border border-black/[.65] text-black rounded-lg rounded-l-none'
                          isRequiredField={true}
                          value={formateAndVerifyPhoneNumber(
                            eachContact?.emergency_contact_number,
                            eachContact?.emergency_contact_country_info
                              ? JSON.parse(
                                  eachContact?.emergency_contact_country_info as string
                                )?.country_code
                              : 'IN'
                          )}
                          onChange={(e) =>
                            handleEmergencyContactField(
                              index,
                              'emergency_contact_number',
                              'personal_contact_info',
                              'emergency_contact',
                              undefined,
                              e
                            )
                          }
                          showError={showEmptyFieldError}
                          errorMessage={
                            eachContact?.emergency_contact_number
                              ? ''
                              : 'this field is required'
                          }
                          dropDownSelectedValue={
                            eachContact?.emergency_contact_country_info
                              ? JSON.parse(
                                  eachContact?.emergency_contact_country_info as string
                                )?.country_number_code
                              : '+91'
                          }
                          setDropDownSelectedValue={(data) =>
                            handleEmergencyContactCountryInfo(
                              data as string,
                              index
                            )
                          }
                          countryDropDownPosition='top'
                          countryOptionsData={countryOptionsDataArray}
                        />
                      </div>
                    </div>
                    <div className='min-w-[100px] grid grid-cols-2 gap-2.5 max-h-[41px]'>
                      {index ==
                        formData.personal_contact_info?.emergency_contact
                          .length -
                          1 && (
                        <button
                          className='bg-green-100 h-full w-full rounded-[4px] flex items-center justify-center border border-green-600 text-black text-xl'
                          onClick={handelAddNewContact}
                        >
                          <MdModeEditOutline />
                        </button>
                      )}
                      {formData.personal_contact_info?.emergency_contact
                        .length > 1 && (
                        <button
                          className='bg-rose-100 h-full w-full rounded-[4px] flex items-center justify-center border border-rose-500 text-black text-xl'
                          onClick={() => removeContactInfo(index)}
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const family_info = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            Family information
          </h2>
          <p className='font-inter text-base text-black font-light'>
            Provide your family information to help us support you better and
            ensure accurate records for benefits and emergency planning.
          </p>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-2 gap-5'>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='family_info.father_name'
                    labelFieldName='Father Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.family_info?.father_name}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData.family_info?.father_name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='text'
                    name='family_info.mother_name'
                    labelFieldName='Mother Name'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.family_info?.mother_name}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData.family_info?.mother_name
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <SearchDrop
                    options={maritalStatus}
                    searchKey=''
                    position='bottom'
                    emptyDataMessage=''
                    labelFieldName='Marital Status'
                    isRequiredField
                    showSearchBar={false}
                    selectedValue={formData?.family_info?.marital_status}
                    onSelectValBtn={(data: string | object) =>
                      handelSearchDropSelectValue(
                        data,
                        'marital_status',
                        'family_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.family_info?.marital_status
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {AlignableForChildInfo.includes(
            formData?.family_info?.marital_status
          ) && (
            <div className='w-full transition-all'>
              <h2 className='font-inter text-base text-black font-medium pt-7 pb-3 border-b border-b-black/45'>
                Child Information
              </h2>
              <div className='flex w-full gap-2 items-center pb-2 pt-6'>
                <div className='grid grid-cols-2 w-full gap-2.5'>
                  <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                    <span className='flex gap-1'>
                      <span>Children Name</span>
                      <FaStarOfLife className='w-1.5 text-red-700' />
                    </span>
                  </p>
                  <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                    <span className='flex gap-1'>
                      <span>Children Date Of Birth</span>
                      <FaStarOfLife className='w-1.5 text-red-700' />
                    </span>
                  </p>
                </div>
                <div className='min-w-[100px]'></div>
              </div>
              <div className='grid grid-cols-1 gap-6'>
                {formData?.family_info.children.map((eachContact, index) => (
                  <div
                    className='w-full flex items-stretch justify-start gap-5'
                    key={index}
                  >
                    <div className='w-full grid grid-cols-2 gap-5'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='child_name'
                          className='border border-black/45'
                          isRequiredField={true}
                          value={eachContact?.child_name}
                          onChange={(e) =>
                            handleEmergencyContactField(
                              index,
                              'child_name',
                              'family_info',
                              'children',
                              undefined,
                              e
                            )
                          }
                          showError={showEmptyFieldError}
                          errorMessage={
                            eachContact?.child_name
                              ? ''
                              : 'this field is required'
                          }
                        />
                      </div>
                      <div className='w-full'>
                        <CommonDatePicker
                          onChange={(date) =>
                            handleEmergencyContactField(
                              index,
                              'child_date_of_birth',
                              'family_info',
                              'children',
                              date
                            )
                          }
                          selectedValue={
                            eachContact?.child_date_of_birth as Date
                          }
                          name='child_date_of_birth'
                          datePickerPosition={'left-start'}
                          showError={showEmptyFieldError}
                          errorMessage={
                            eachContact?.child_date_of_birth
                              ? ''
                              : 'this field is required'
                          }
                        />
                      </div>
                    </div>
                    <div className='min-w-[100px] grid grid-cols-2 gap-2.5 max-h-[41px]'>
                      {index == formData.family_info.children.length - 1 && (
                        <button
                          className='bg-green-100 h-full w-full rounded-[4px] flex items-center justify-center border border-green-600 text-black text-xl'
                          onClick={handelAddNewChild}
                        >
                          <MdModeEditOutline />
                        </button>
                      )}
                      {formData.family_info.children.length > 1 && (
                        <button
                          className='bg-rose-100 h-full w-full rounded-[4px] flex items-center justify-center border border-rose-500 text-black text-xl'
                          onClick={() => removeSpecificChild(index)}
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const RenderTheAddressFieldDynamically = (
    module_name: 'current_address' | 'permanent_address',
    module: AddressModuleInterface
  ) => {
    return (
      <div className='w-full min-w-full grid grid-cols-1 gap-6'>
        <div className='w-full'>
          <TextArea
            name={`${module_name}.address`}
            rows={4}
            value={module.address}
            onChange={handleOnChange}
            isRequiredField={true}
            labelFieldName='Address'
            showError={showEmptyFieldError}
            errorMessage={
              module_name === 'current_address'
                ? module.address.trim()
                  ? ''
                  : 'this field is required'
                : module_name === 'permanent_address' &&
                    !formData?.same_as_current_address
                  ? module.address.trim()
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
              searchKey='country_name'
              isRequiredField={true}
              labelFieldName='Country'
              selectedValue={module.country}
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
                  ? module.country.trim()
                    ? ''
                    : 'this field is required'
                  : module_name === 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module.country.trim()
                      ? ''
                      : 'this field is required'
                    : ''
              }
            />
          </div>
          <div className='w-full'>
            <SearchDrop
              options={stateOptionArray[module_name]}
              searchKey='state_name'
              isRequiredField={true}
              labelFieldName='State'
              selectedValue={module.state}
              onSelectValBtn={(data) =>
                handleClickOnStateValue(
                  data as StateOptionArrayInterFace,
                  module_name
                )
              }
              position='top'
              emptyDataMessage={
                module.country.trim() == ''
                  ? 'Please Select A Country First'
                  : 'No Option'
              }
              loading={fetchingStateInfo}
              showError={showEmptyFieldError}
              errorMessage={
                module_name === 'current_address'
                  ? module.state.trim()
                    ? ''
                    : 'this field is required'
                  : module_name === 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module.state.trim()
                      ? ''
                      : 'this field is required'
                    : ''
              }
            />
          </div>
          <div className='w-full'>
            <SearchDrop
              options={citiesOptionsArray[module_name]}
              searchKey='city_name'
              isRequiredField={true}
              labelFieldName='City'
              selectedValue={module.city}
              onSelectValBtn={(data) =>
                handleClickOnCityVal(data as string, module_name)
              }
              position='top'
              emptyDataMessage={
                module.state.trim() == ''
                  ? 'Please Select A State First'
                  : 'No Option'
              }
              loading={loading}
              showError={showEmptyFieldError}
              errorMessage={
                module_name === 'current_address'
                  ? module.city.trim()
                    ? ''
                    : 'this field is required'
                  : module_name === 'permanent_address' &&
                      !formData?.same_as_current_address
                    ? module.city.trim()
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
              isRequiredField={true}
              labelFieldName='Zip Code'
              value={module.zip_code}
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
  };

  const RenderAddressComponent = () => {
    return (
      <div className='w-full bg-white rounded-xl'>
        <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            Family information
          </h2>
          <p className='font-inter text-base text-black font-light'>
            Provide your family information to help us support you better and
            ensure accurate records for benefits and emergency planning.
          </p>
        </div>
        <div className='w-full'>
          <div className='p-6 w-full'>
            {RenderTheAddressFieldDynamically(
              'current_address',
              formData.current_address
            )}
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
                  value={formData?.same_as_current_address ? 'true' : 'false'}
                  setValue={(val: string) =>
                    handelTheSameAsCurrentAddressButton(val as 'true' | 'false')
                  }
                />
              </div>
            </div>

            {!formData?.same_as_current_address ? (
              <div className='pb-3 mt-6 transition-all'>
                {RenderTheAddressFieldDynamically(
                  'permanent_address',
                  formData.permanent_address
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <div className='w-full h-full relative'>
        <div className='w-full'>
          <div className='w-full h-full flex items-stretch justify-between'>
            <div className='w-full xl:w-[80%] flex-grow h-[calc(100vh-135px)] overflow-auto px-6 flex flex-col gap-6 pt-6 pb-5'>
              <div className='w-full'>{personal_information()}</div>
              <div className='w-full'>{employee_information()}</div>
              <div className='w-full'>
                {personal_contact_information()}
              </div>
              <div className='w-full'>{family_info()}</div>
              <div className='w-full'>{RenderAddressComponent()}</div>
            </div>
            <div className='hidden xl:w-[20%] xl:block bg-white'></div>
          </div>
        </div>
        <div className='w-full bg-white px-4 py-3 mt-2 flex items-center justify-between'>
          <div className='w-fit'>
            <p className='font-inter text-xl font-medium capitalize text-black whitespace-nowrap'>
              Editing profile details -{' '}
              <span className='font-semibold text-[var(--them-orange-color)]'>
                {formData?.personal_info?.full_name}
              </span>
            </p>
          </div>
          <div className='flex items-center gap-4 w-full justify-end'>
            <button className='text-[var(--them-green-color)] py-2.5 px-14 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 transition-all w-fit'>
              Cancel
            </button>
            <button
              className='text-white bg-[var(--them-green-color)] hover:bg-[var(--them-green-light-color)] w-fit py-2.5 px-14 rounded-lg font-inter text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed'
              onClick={handelSubmitAndUpdateButton}
            >
              <span>Update</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
