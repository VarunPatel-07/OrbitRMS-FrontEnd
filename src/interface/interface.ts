//? -------------------------- This Is The Start Of The Onboarding Form InterFace -------------------------

//? -------------------------- Start Of The Onboarding Form InterFace Utility -------------------------

export interface CountryInfo {
  country_code: string;
  country_flag: string;
  country_name: string;
  country_number_code: string;
}

export interface GeneralInfo {
  organization_name: string;
  primary_email: string;
  primary_number: string;
  country_info: CountryInfo | null;
  portal_url: string;
  website_url: string;
  is_meta_verified: boolean;
  meta_key: string;
  meta_value: string;
  terms_accepted: boolean;
  email_verified: boolean;
  organization_profile_picture: string;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  country_code: string;
}

export interface ContactInfo {
  phone_number: string;
  company_email: string;
  country_info: string;
}

export interface AboutInfo {
  about: string;
  established_science: Date | null;
  registration_number: string;
}

export interface OrganizationSettings {
  email_domain_slug: string;
  employee_code_prefix: string;
  intern_code_prefix: string;
  default_timezone: string;
  default_dateformat: string;
}

export interface EmployeeProfileInfo {
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string; // auto generated based on the first,middle, last name
  profile_picture: string; // we will send it empty
  profile_picture_bg: string; // we will send it empty
  gender: string;
  date_of_birth: Date | null;
  blood_group: string;
}

//? --------------------------  End Of The Onboarding Form InterFace Utility -------------------------

export interface OnboardingFormInterface {
  general_info: GeneralInfo;
  address: Address;
  contact_info: Array<ContactInfo>;
  about_info: AboutInfo;
  organization_settings: OrganizationSettings;
  employee_profile_info: EmployeeProfileInfo;
  status: boolean;
}

//? -------------------------- This Is The End Of The Onboarding Form InterFace -------------------------

//? -------------------------- This Is The Start Of The Roles And Permission InterFace -------------------------

export interface PermissionModule {
  id: string;
  label: string;
  is_allowed: boolean;
  show_input: boolean;
}

export interface RolesAndPermissionsModule {
  id: string;
  module_label: string;
  module_title: string;
  is_active: boolean;
  permissions: PermissionModule[];
  sub_modules: RolesAndPermissionsModule[];
}

export interface ConfigRolesAndPermissionModule {
  id: string;
  role_name: string;
  description: string;
  source_type: string;
  status: boolean;
  created_by: null | object;
  created_at: string;
  updated_by: null | object;
  updated_at: null | string;
  modules: RolesAndPermissionsModule[];
}

//? -------------------------- This Is The End Of The Roles And Permission InterFace -------------------------



