import { AddEditLeavesTypesInterface } from '../interface/OrganizationSettings';
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

export const BLOOD_GROUP_ARRAY = [
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
export const GENDER_ARRAY = ['Male', 'Female', 'Other'];

export const formFieldAllowedFieldType = [
  'string',
  'boolean',
  'number',
  'array',
  'object',
  'array of string',
  'array of object',
];

export const MARITAL_STATUS = [
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

export const ORG_EMPLOYEE_STATUS_ARRAY = [
  'Intern',
  'Trainee',
  'Probation',
  'Confirmed',
];

export const SocialMediaPostStatusArray = [
  'queued',
  'scheduled',
  'posted',
  'cancelled',
];

export const employeeTypesArray = [
  'Technical',
  'Support',
  'Non-Technical',
  'Management',
];

export const dropdownMenuArray = [10, 25, 50, 100];

export const UNAUTHORIZED_STATUS_CODE = [
  404,
  401, // Unauthorized (authentication required or token missing/invalid)
  403, // Forbidden (authenticated but not authorized for the resource)
  407, // Proxy Authentication Required (rare, but still access-related)
];

export const MAINTENANCE_MODE_IS_ACTIVE_STATUS_CODE = [503];

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

export const EmployeeCountArray = [
  'Less than 10',
  '10 - 20',
  '21 - 30',
  '31 - 40',
  '41 - 50',
  '51 - 60',
  '61 - 70',
  '71 - 80',
  '81 - 90',
  '91 - 100',
  'More than 100',
];

export const industryType: { label: string; value: string }[] = [
  { label: 'software_company', value: 'Software Company' },
  { label: 'consultancy_firm', value: 'Consultancy Firm' },
  { label: 'media_agency', value: 'Media Agency' },
  {
    label: 'architecture_interior_design_studio',
    value: 'Architecture & Interior Design Studio',
  },
  { label: 'marketing_agency', value: 'Marketing Agency' },
];

export const WebsiteUrlSafetyCheckErrorMessages: { [key: string]: string } = {
  invalid: 'The URL format is invalid. Please enter a valid website URL.',
  unsafe: 'This URL is marked as unsafe. Please check your website security.',
  error: 'An error occurred while verifying the URL. Try again later.',
};

export const USER_FRIENDLY_ERRORS = {
  fb_auth_denied: {
    title: 'Facebook connection was not completed',
    message:
      'The Facebook connection process was cancelled before it could be completed. To connect your Facebook account, we need permission to access your Pages. Please restart the connection process and make sure to allow all requested permissions.',
    action: 'Connect Facebook',
  },
  fb_token_exchange_failed: {
    title: 'Unable to complete Facebook connection',
    message:
      'We were unable to complete the connection with Facebook at this time. This can happen due to a temporary issue with Facebook’s services or a network interruption. Your account has not been affected. Please wait a moment and try connecting Facebook again.',
    action: 'Try again',
  },
  fb_no_pages_found: {
    title: 'No Facebook Pages could be found',
    message:
      'We successfully connected to Facebook, but couldn’t find any Facebook Pages linked to your account. To continue, make sure you are an admin or editor of at least one Facebook Page. Once confirmed, return here and try connecting again.',
    action: 'Check Facebook Pages',
  },
  fb_permission_missing: {
    title: 'Additional Facebook permissions are required',
    message:
      'The Facebook account was connected, but some required permissions were not granted. These permissions are necessary for managing and publishing content to your Pages. Please reconnect Facebook and allow all requested permissions to continue.',
    action: 'Reconnect Facebook',
  },
  fb_unexpected: {
    title: 'Facebook connection encountered an issue',
    message:
      'Something interrupted the Facebook connection process before it could be completed. This does not indicate a problem with your account. Please try connecting Facebook again, and contact support if the issue continues.',
    action: 'Retry',
  },

  tw_auth_denied: {
    title: 'Twitter connection was not completed',
    message:
      'The Twitter connection process was cancelled before it could be completed. To connect your Twitter account, we need permission to access your profile. Please start the connection process again and allow the requested permissions.',
    action: 'Connect Twitter',
  },
  tw_token_exchange_failed: {
    title: 'Unable to complete Twitter connection',
    message:
      'We were unable to complete the connection with Twitter at this time. This may be due to a temporary issue with Twitter or a network interruption. No changes were made to your account. Please wait a moment and try again.',
    action: 'Try again',
  },
  tw_account_deactivated: {
    title: 'Your account is currently unavailable',
    message:
      'We’re unable to continue because your account appears to be deactivated or restricted. To proceed, please contact support or reactivate your account. Once your account is active, you can reconnect Twitter.',
    action: 'Contact support',
  },
  tw_org_deactivated: {
    title: 'Organization access is currently restricted',
    message:
      'The organization linked to your account is currently inactive. This prevents us from connecting social media accounts at the moment. Please contact your organization administrator to resolve this and try again later.',
    action: 'Contact administrator',
  },
  tw_permission_missing: {
    title: 'Additional Twitter permissions are required',
    message:
      'The Twitter account was connected, but some required permissions were not granted. These permissions are needed to post content and manage your account. Please reconnect Twitter and allow all requested permissions to continue.',
    action: 'Reconnect Twitter',
  },
  tw_unexpected: {
    title: 'Twitter connection encountered an issue',
    message:
      'An unexpected interruption occurred while connecting your Twitter account. This does not affect your account or existing data. Please try connecting Twitter again in a moment.',
    action: 'Retry',
  },

  li_auth_denied: {
    title: 'LinkedIn connection was not completed',
    message:
      'The LinkedIn connection process was cancelled before it could be completed. To connect your LinkedIn account or Page, we need permission to access your profile and Pages. Please start the connection process again and allow all requested permissions.',
    action: 'Connect LinkedIn',
  },
  li_token_exchange_failed: {
    title: 'Unable to complete LinkedIn connection',
    message:
      'We were unable to complete the connection with LinkedIn at this time. This can happen due to a temporary issue with LinkedIn’s services or a network interruption. Please wait a moment and try connecting LinkedIn again.',
    action: 'Try again',
  },
  li_no_pages_found: {
    title: 'No LinkedIn Pages could be found',
    message:
      'We successfully connected to LinkedIn, but couldn’t find any LinkedIn Pages linked to your account. To continue, make sure you are an admin of at least one LinkedIn Page. Once confirmed, return here and try connecting LinkedIn again.',
    action: 'Check LinkedIn Pages',
  },
  li_permission_missing: {
    title: 'Additional LinkedIn permissions are required',
    message:
      'The LinkedIn account was connected, but some required permissions were not granted. These permissions are necessary for managing and publishing content on your behalf. Please reconnect LinkedIn and allow all requested permissions to continue.',
    action: 'Reconnect LinkedIn',
  },
  li_unexpected: {
    title: 'LinkedIn connection encountered an issue',
    message:
      'An unexpected interruption occurred while connecting your LinkedIn account. This does not indicate a problem with your account. Please try connecting LinkedIn again, and contact support if the issue persists.',
    action: 'Retry',
  },
  default: {
    title: 'Some Thing Went Wrong',
    message: 'Some Thing Went Wrong',
    action: 'Retry',
  },
};

export const initialLeavePolicy: AddEditLeavesTypesInterface = {
  leave_name: '',
  leave_code: '',
  is_paid: true,
  max_number_of_leave: 12,
  refill_quarterly: false,
  refill_from: '',
  description: '',
  gender: [],
  employee_status: [],
  marital_status: [],
  status: true,
};

export const QUARTER_REFILE_MONTHS = ['January', 'April', 'July', 'October'];
export const MONTH_INDEX: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export const LEAVE_MODULE_TAB_TYPE = ['Self', 'Team', 'Organization'];
export const DEFAULT_LEAVE_TAB = 'Self';
export const LEAVE_MODULE_TAB_TYPE_OBJECT = {
  SELF: 'Self',
  TEAM: 'Team',
  ORGANIZATION: 'Organization',
};

export const TEAM_SUMMARY_INITIAL_DATA = {
  total_employees: 0,
  employees_on_leave: 0,
  planned_leaves: 0,
  unplanned_leaves: 0,
  pending_leaves: 0,
  cancelled_leaves: 0,
};

export const LEAVE_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
  approved: {
    label: 'Approved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
};
