interface GeneralInfo {
  country_info: {
    country_code: string;
    country_flag: string;
    country_name: string;
    country_number_code: string;
  };

  email_verified: boolean;
  id: string;
  is_meta_verified: boolean;
  meta_key: string;
  meta_value: string;
  organization_id: string;
  organization_name: string;
  organization_profile_picture: string;
  portal_slug: string;
  portal_url: string;
  primary_email: string;
  primary_number: string;
  terms_accepted: true;
  website_url: string;
}
interface OrgAddress {
  address: string;
  city: string;
  country: string;
  country_code: string;
  id: string;
  organization_id: string;
  state: string;
  zip_code: string;
}

interface OrganizationContactInfo {
  company_email: string;
  country_info: string;
  id: string;
  organization_id: string;
  phone_number: string;
}

interface OrganizationSettings {
  default_dateformat: string;
  default_timezone: string;
  email_domain_slug: string;
  employee_code_prefix: string;
  id: string;
  intern_code_prefix: string;
  organization_id: string;
}

interface OrganizationAboutInfo {
  about: string;
  established_science: string;
  id: string;
  organization_id: string;
  registration_number: string;
}

export interface OrganizationSettingsInterface {
  id: string;
  status: boolean;
  updated_at: string;
  created_at: string;
  organization_created: boolean;
  general_info: GeneralInfo;
  address: OrgAddress;
  contact_info: OrganizationContactInfo[];
  organization_settings: OrganizationSettings;
  about_info: OrganizationAboutInfo;
}

export interface OrganizationHolidays {
  id: string;
  holiday_name: string;
  date: Date | null;
  year: number;
  config_module_id: string;
  created_at: string;
  created_by: object | null;
  source_type: string;
  updated_at: object | null;
  updated_by: string | null;
}

export interface LeavesTypesInterface {
  id: string;
  leave_name: string;
  leave_code: string;
  is_paid: boolean;
  max_number_of_leave: number;
  refill_quarterly: boolean;
  refill_from: string;
  description: string;
  gender: string;
  employee_status: string;
  marital_status: string;
  status: boolean;
  organization_id: string;
  created_at: string;
  created_by: object | null;
  source_type: string;
  updated_at: object | null;
  updated_by: string | null;
}

export interface HolidayFormData {
  holiday_name: string;
  date: Date | null;
  year: number;
}
