import {
  AddEditUserProfileInterFace,
  employeeFormDropdownsInterface,
  fetchingDesignationsDepartmentsLoadingFlagInterface,
} from '../interface/AddEditUserProfileInterFace';
import { CountryDataInterface } from '../interface/interface';
import { defaultCountryInfo } from './constant';

export const AddEditEmployeeFormInitialState: AddEditUserProfileInterFace = {
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
    joining_date: new Date(),
    employee_type: '',
  },
  personal_contact_info: {
    personal_email: '',
    mobile_number: '',
    country_info: JSON.stringify({
      country_code: 'IN',
      country_flag: '🇮🇳',
      country_name: 'India',
      country_number_code: '+91',
    }),
    emergency_contacts: [
      {
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_country_info: JSON.stringify({
          country_code: 'IN',
          country_flag: '🇮🇳',
          country_name: 'India',
          country_number_code: '+91',
        }),
        contact_id: '',
        id: '',
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
        family_info_id: '',
        id: '',
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
  social_link: [
    {
      icon: '',
      link: '',
      name: '',
      target_blank: true,
      id: '',
      user_id: '',
    },
  ],
};

export const BreadcrumbsObjects = (
  organization_slug: string,
  moduleType: string | undefined,
  employee_id: string | undefined
) => [
  {
    name: 'Home',
    label: 'home',
    link: `/${organization_slug}/dashboard`,
  },
  {
    name: 'Employee Listing',
    label: 'employee_listing',
    link: `/${organization_slug}/employee/employee-listing`,
  },
  {
    name: moduleType == 'edit' ? 'Edit Profile' : 'Add Employee',
    label: 'employee-profile',
    link:
      moduleType == 'edit'
        ? `/${organization_slug}/employee/${moduleType}/${employee_id}`
        : `/${organization_slug}/employee/${moduleType}`,
  },
];

export const fetchingDesignationsDepartmentsLoadingFlag: fetchingDesignationsDepartmentsLoadingFlagInterface =
  {
    departments: false,
    designations: false,
    reporting_to: false,
    employee_role: false,
  };

export const employeeFormDropdownsInitial: employeeFormDropdownsInterface = {
  departmentOptions: [],
  designationOptions: [],
  reportingManagerOptions: [],
  employeeRoleOptions: [],
};

export const defaultEmergencyContactInfo = (filteredCountry: string) => {
  return {
    emergency_contact_country_info:
      filteredCountry || JSON.stringify(defaultCountryInfo),
    emergency_contact_name: '',
    emergency_contact_number: '',
    contact_id: '',
    id: '',
  };
};

export const initialCountryInfo: CountryDataInterface = {
  country_code: '',
  country_flag: '',
  country_name: '',
  country_number_code: '',
  postal_code: { format: '', regex: '' },
};
