import React, { SetStateAction } from 'react';

import { countryObject } from '../Helper/countryDataHelper';
import {
  CountryDataInterface,
  DepartmentConfig,
  DesignationConfig,
  EmployeeRoleModuleInterface,
  ReportingManagerModuleInterface,
  StateOptionArrayInterFace,
} from './interface';
import {
  GlobalContextStore,
  PermissionsModuleInterface,
} from './UserProfileInterface';

export interface AddressModuleInterface {
  address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  country_code: string;
}

export interface AddEditUserProfilePersonalInfoInterface {
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  gender: string;
  date_of_birth: null | Date;
  blood_group: string;
  about: string;
}

export interface AddEditUserProfileEmployeeInfoInterface {
  status: string;
  organization_name: string;
  employee_code: string;
  department: string;
  designation: string;
  employee_email: string;
  reporting_to: { id: string; name: string };
  employee_role: { role_id: string; role_name: string };
  employee_type: string;
  joining_date: null | Date;
}

export interface AddEditUserProfilePersonalContactInfo {
  personal_email: string;
  mobile_number: string;
  country_info: string;
  emergency_contacts: {
    emergency_contact_country_info: string;
    emergency_contact_number: string;
    emergency_contact_name: string;
    contact_id: string;
    id: string;
  }[];
}

export interface AddEditUserFamilyInfo {
  father_name: string;
  mother_name: string;
  marital_status: string;
  children: {
    child_name: string;
    child_date_of_birth: null | Date;
    family_info_id: string;
    id: string;
  }[];
}

export interface AddEditUserCurrentAddress {
  address: string;
  country: string;
  city: string;
  state: string;
  zip_code: string;
  country_code: string;
}

export interface AddEditUserSocialLinks {
  icon: string;
  name: string;
  link: string;
  target_blank: boolean;
  id: string;
  user_id: string;
}

export interface AddEditUserProfileInterFace {
  personal_info: AddEditUserProfilePersonalInfoInterface;
  employee_info: AddEditUserProfileEmployeeInfoInterface;
  personal_contact_info: AddEditUserProfilePersonalContactInfo;
  family_info: AddEditUserFamilyInfo;
  current_address: AddEditUserCurrentAddress;
  same_as_current_address: boolean;
  permanent_address: AddEditUserCurrentAddress;
  social_link: AddEditUserSocialLinks[];
}

export interface UserProfileInformationInterface {
  account_status: boolean;
  personal_info: {
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    profile_picture: string;
    gender: string;
    date_of_birth: string;
    blood_group: string;
    about: string;
  };
  employee_info: {
    status: string;
    organization_name: string;
    department: string;
    designation: string;
    reporting_manager: {
      id: string;
      first_name: string;
      middle_name: string;
      last_name: string;
      full_name: string;
      gender: string;
      profile_picture: string;
      profile_picture_bg: string;
    };
    employee_role: {
      id: string;
      role_name: string;
    };
    employee_email: string;
    employee_code: string;
    employee_type: string;
    joining_date: string;
  };
  personal_contact_info: {
    personal_email: string;
    mobile_number: string;
    country_info: string;
    emergency_contacts: Array<{
      emergency_contact_name: string;
      emergency_contact_number: string;
      emergency_contact_country_info: string;
      contact_id: string;
      id: string;
    }>;
  };
  family_info: {
    father_name: string;
    mother_name: string;
    marital_status: string;
    children: Array<{
      child_date_of_birth: string;
      child_name: string;
      family_info_id: string;
      id: string;
    }>;
  };
  current_address: {
    address: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    country_code: string;
  };
  same_as_current_address: boolean;
  permanent_address: {
    address: string;
    country: string;
    city: string;
    state: string;
    zip_code: string;
    country_code: string;
  };
  social_link: Array<{
    icon: string;
    link: string;
    name: string;
    target_blank: boolean;
    id: string;
    user_id: string;
  }>;
}

export interface EmployeeProfileActionArrayInterface {
  link: string;
  label: string;
  title: string;
  classNames: string;
}

export interface AddEditEmployeeFooterInterface {
  moduleType: 'edit' | 'add';
  fetchingTheEmployeeData: boolean;
  dummyFormData: AddEditUserProfileInterFace;
  formData: AddEditUserProfileInterFace;
  formSubmitLoader: boolean;
  organization_slug: string;
  handelSubmitAndUpdateButton: () => void;
}

export interface EmployeePersonalInfoComponentProps {
  formData: AddEditUserProfileInterFace;
  formSubmitLoader: boolean;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handelSearchDropSelectValue: (
    data: string | object,
    name: string,
    sectionName:
      | 'personal_info'
      | 'employee_info'
      | 'personal_contact_info'
      | 'family_info'
  ) => void;
  disabled: boolean;
}

export interface AddEditComponentListingPropsInterface {
  formData: AddEditUserProfileInterFace;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  GlobalStateProvider: GlobalContextStore;
  countryOptionsDataArray: Array<countryObject>;
  filteredCountry: string;
  isFetchingCountryData: boolean;
  countryData: CountryDataInterface[];
  selectedCountryInfoForCurrentAddress: CountryDataInterface;
  setSelectedCountryInfoForCurrentAddress: React.Dispatch<
    SetStateAction<CountryDataInterface>
  >;
  formSubmitLoader: boolean;
  permissionData: PermissionsModuleInterface;
  isEditingCurrentEmployee: boolean;
}

export interface EmployeeEmployerInformationPropsInterface {
  GlobalStateProvider: GlobalContextStore;
  formSubmitLoader: boolean;
  formData: AddEditUserProfileInterFace;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  employeeFormDropdowns: employeeFormDropdownsInterface;
  fetchingDesignationsDepartments: fetchingDesignationsDepartmentsLoadingFlagInterface;
  handelSearchDropSelectValue: (
    data: string | object,
    name: string,
    sectionName:
      | 'personal_info'
      | 'employee_info'
      | 'personal_contact_info'
      | 'family_info'
  ) => void;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled: boolean;
}

export interface fetchingDesignationsDepartmentsLoadingFlagInterface {
  departments: boolean;
  designations: boolean;
  reporting_to: boolean;
  employee_role: boolean;
}

export interface employeeFormDropdownsInterface {
  departmentOptions: DepartmentConfig[];
  designationOptions: DesignationConfig[];
  reportingManagerOptions: ReportingManagerModuleInterface[];
  employeeRoleOptions: EmployeeRoleModuleInterface[];
}

export interface EmployeePersonalContactInformationInterface {
  formData: AddEditUserProfileInterFace;
  formSubmitLoader: boolean;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  countryOptionsDataArray: Array<countryObject>;
  filteredCountry: string;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handelSearchDropSelectValue: (
    data: string | object,
    name: string,
    sectionName:
      | 'personal_info'
      | 'employee_info'
      | 'personal_contact_info'
      | 'family_info'
  ) => void;
  disabled: boolean;
}

export interface EmployeeFamilyInfoInterface {
  formData: AddEditUserProfileInterFace;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  formSubmitLoader: boolean;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handelSearchDropSelectValue: (
    data: string | object,
    name: string,
    sectionName:
      | 'personal_info'
      | 'employee_info'
      | 'personal_contact_info'
      | 'family_info'
  ) => void;
  disabled: boolean;
}

export interface EmployeeAddressInfoInterface {
  formData: AddEditUserProfileInterFace;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  formSubmitLoader: boolean;
  isFetchingCountryData: boolean;
  countryData: CountryDataInterface[];
  selectedCountryInfoForCurrentAddress: CountryDataInterface;
  setSelectedCountryInfoForCurrentAddress: React.Dispatch<
    SetStateAction<CountryDataInterface>
  >;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled: boolean;
}

export interface DynamicAddressComponentPropsInterface {
  module_name: 'current_address' | 'permanent_address';
  formSubmitLoader: boolean;
  disabled: boolean;
  module: AddEditUserCurrentAddress;
  formData: AddEditUserProfileInterFace;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  loading: boolean;
  isFetchingCountryData: boolean;
  countryData: CountryDataInterface[];
  citiesOptionsArray: {
    current_address: Array<string>;
    permanent_address: Array<string>;
  };
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  fetchingStateInfo: boolean;
  selectedCountryInfoForPermanentAddress: CountryDataInterface;
  selectedCountryInfoForCurrentAddress: CountryDataInterface;
  stateOptionArray: {
    current_address: Array<StateOptionArrayInterFace>;
    permanent_address: Array<StateOptionArrayInterFace>;
  };
  FetchCityBasedOnTheState: (
    country_code: string,
    stateCode: string,
    module_name: 'current_address' | 'permanent_address'
  ) => void;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleClickOnCountryValue: (
    data: CountryDataInterface,
    module_name: 'current_address' | 'permanent_address'
  ) => void;
  handelZipCodeOnChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    module_name: 'current_address' | 'permanent_address'
  ) => void;
}

export interface AddEditEmployeeSocialLinksInterface {
  formData: AddEditUserProfileInterFace;
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>;
  showEmptyFieldError: boolean;
  formSubmitLoader: boolean;
  disabled: boolean;
}
