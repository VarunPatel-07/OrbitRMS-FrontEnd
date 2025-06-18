export interface EmployeeInfo {
  id: string;
  status: string;
  organization_name: string;
  employee_code: string;
  department: string;
  designation: string;
  reporting_to: Record<string, unknown>; // Assuming it's an object, adjust if needed
  employee_role: string;
  employee_email: string;
  user_id: string;
}

export interface PersonalInfo {
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  profile_picture_bg: string;
  gender: string;
  date_of_birth: null | Date;
  blood_group: string;
  about: string;
  id: string;
  user_id: string;
}
export interface CountryInfo {
  country_code: string;
  country_flag: string;
  country_name: string;
  country_number_code: string;
}

export interface GeneralInfo {
  id: string;
  organization_name: string;
  primary_email: string;
  primary_number: string;
  country_info: CountryInfo;
  portal_url: string;
  portal_slug: string;
  website_url: string;
  is_meta_verified: boolean;
  meta_key: string;
  meta_value: string;
  terms_accepted: boolean;
  email_verified: boolean;
  organization_profile_picture: string;
  organization_id: string;
}

export interface Address {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  country_code: string;
  organization_id: string;
}

export interface ContactInfo {
  country_info: string; // This is a JSON string, consider parsing if needed
  phone_number: string;
  organization_id: string;
  company_email: string;
  id: string;
}

export interface AboutInfo {
  id: string;
  about: string;
  established_science: string;
  registration_number: string;
  organization_id: string;
}

export interface OrganizationSettings {
  id: string;
  email_domain_slug: string;
  employee_code_prefix: string;
  intern_code_prefix: string;
  default_timezone: string;
  default_dateformat: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  general_info: GeneralInfo;
  address: Address;
  contact_info: ContactInfo[];
  about_info: AboutInfo;
  organization_settings: OrganizationSettings;
  status: boolean;
  organization_created: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  employee_info: EmployeeInfo;
  personal_info: PersonalInfo;
}

export interface GlobalContextStore {
  user: User;
  organization: Organization;
}

export interface UserSessionsInterFace {
  browser: string;
  browser_version: string;
  created_at: string;
  device_type: string;
  fingerprint: string;
  id: string;
  ip_address: string;
  is_bot: boolean;
  is_mobile: boolean;
  is_pc: boolean;
  is_tablet: boolean;
  os: string;
  os_version: string;
  updated_at: string;
  user_id: string;
}
