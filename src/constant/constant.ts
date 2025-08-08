import { MetaDataInterface } from '../interface/propsInterface';

export const getEnterAnimationClass = {
  'top-right': 'animate-enter-top-right',
  'top-left': 'animate-enter-top-left',
  'bottom-right': 'animate-enter-bottom-right',
  'bottom-left': 'animate-enter-bottom-left',
  center: 'animate-enter-center',
};
export const getExitAnimationClass = {
  'top-right': 'animate-exit-top-right',
  'top-left': 'animate-exit-top-left',
  'bottom-right': 'animate-exit-bottom-right',
  'bottom-left': 'animate-exit-bottom-left',
  center: 'animate-exit-center',
};

export const bloodGroupArray = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Bombay (hh)',
  'Rh-null',
];
export const GenderArray = ['Male', 'Female', 'Other'];

export const formFieldAllowedFieldType = [
  'string',
  'boolean',
  'number',
  'array',
  'object',
  'array of string',
  'array of object',
];

export const maritalStatus = [
  'Single',
  'Married',
  'Divorced',
  'Widowed',
  'Prefer not to say',
];

export const AlignableForChildInfo = [
  'Married',
  'Divorced',
  'Widowed',
  'Prefer not to say',
];

export const OrganizationEmployeeStatusArray = [
  'Intern',
  'Trainee',
  'Probation',
  'Confirmed',
];

export const employeeTypesArray = [
  'Technical',
  'Support',
  'Non-Technical',
  'Management',
];

export const dropdownMenuArray = [10, 25, 50, 100];

export const unauthorizedStatusCodes = [
  404,
  401, // Unauthorized (authentication required or token missing/invalid)
  403, // Forbidden (authenticated but not authorized for the resource)
  407, // Proxy Authentication Required (rare, but still access-related)
];

export const MaintenanceModeIsActiveStatusCode = [503];

export const NotAllowedObjectField = ['client_inquire_id', 'id'];

export const PASSWORD_RESET_KEY = 'expiry_time';

export const MAX_SIGN_IN_ATTEMPT = 'sign_in_attempt';

export const MAINTENANCE_MODE_LOCAL_STORAGE_KEY = 'MAINTENANCE_MODE';

export const defaultCountryInfo = {
  country_code: 'IN',
  country_flag: '🇮🇳',
  country_name: 'India',
  country_number_code: '+91',
};

export const initialMetadata: MetaDataInterface = {
  total_data: 0,
  total_pages: 1,
  current_page: 1,
  record_per_page: 10,
};
