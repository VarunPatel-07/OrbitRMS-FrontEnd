/* eslint-disable @typescript-eslint/no-explicit-any */
//? -------------------------- This Is The Start Of The Onboarding Form InterFace -------------------------

import React, { SetStateAction } from 'react';
import { Area } from 'react-easy-crop';
import { Editor } from '@tiptap/react';

import { AddEditPostFormdataInterface } from './Dashboard';
import { RichTextEditorApiCallIngReturnInterface } from './propsInterface';
import { GlobalContextStore } from './UserProfileInterface';

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
  portal_slug: string;
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
  is_editable: boolean;
  description: string;
  source_type: string;
  status: boolean;
  created_by: null | object;
  created_at: string;
  updated_by: null | object;
  updated_at: null | string;
  modules: RolesAndPermissionsModule[];
}

export interface CountryDataInterface {
  country_code: string;
  country_flag: string;
  country_name: string;
  country_number_code: string;
  postal_code: { format: string; regex: string };
}
export interface StateOptionArrayInterFace {
  state_code: string;
  state_name: string;
}
//? -------------------------- This Is The End Of The Roles And Permission InterFace -------------------------

export interface DepartmentConfig {
  config_module_id: string;
  created_at: string;
  created_by: object | null;
  department_name: string;
  id: string;
  source_type: string;
  updated_at: object | null;
  updated_by: string | null;
}
export interface InquiryFormFieldsDataInterface {
  form_id: string;
  form_name: string;
  form_fields: InquiryFormFieldInterface[];
}
export interface InquiryFormFieldInterface {
  id: string;
  field_name: string;
  type: string;
  is_required_field: boolean;
  source_type: string;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  inquiry_form_schema_id: string;
}

export interface DesignationConfig {
  config_module_id: string;
  created_at: string;
  created_by: object | null;
  designations_name: string;
  authorized_recipient_emails: string | null;
  email_notification: boolean | null;
  id: string;
  source_type: string;
  updated_at: object | null;
  updated_by: string | null;
}

export interface ReportingManagerModuleInterface {
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
}

export interface EmployeeRoleModuleInterface {
  id: string;
  role_name: string;
  description: string;
  status: boolean;
  source_type: string;
  config_module_id: string;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
}

type InterFaceModuleLabelType =
  | 'employee_general_info'
  | 'personal_information'
  | 'employee_information'
  | 'personal_contact_information'
  | 'family_information'
  | 'employee_address'
  | 'social_link'
  | 'organization_general_info'
  | 'organization_address'
  | 'organization_contact_info'
  | 'organization_about_info'
  | 'organization_organization_settings';

export interface InterFaceModuleData {
  label: InterFaceModuleLabelType;
  title: string;
  module: React.ReactElement;
  id: number;
}

export interface EmployeeProfilePictureInterface {
  width: number;
  height: number;
  profilePicture?: string;
  isLoading?: boolean;
}

export interface InfoFieldProps {
  label: string;
  value: string | number | null | undefined;
  renderDate?: boolean;
  default_dateformat?: string;
  isLink?: boolean;
}

export interface ClientInquirySidebarModelInterface {
  clientInquiryData: any;
  showClientInquiryDetail: boolean;
  setShowClientInquiryDetail: React.Dispatch<SetStateAction<boolean>>;
}

export interface NavbarPropsInterface {
  handelLogout: (setLoading: React.Dispatch<SetStateAction<boolean>>) => void;
}

export interface AddEditPostModalInterface {
  showAddEditPostModal: boolean;

  GlobalStateProvider: GlobalContextStore;
  handelOnSubmit: () => void;
  onEditorReady?: (editor: Editor) => void;
  formData: AddEditPostFormdataInterface;
  dummyFormData: AddEditPostFormdataInterface;
  setFormData: React.Dispatch<SetStateAction<AddEditPostFormdataInterface>>;
  loading: boolean;
  setLoading: React.Dispatch<SetStateAction<boolean>>;
  handelCancelButton: () => void;
  handelApiCallingFunction: (
    query: string
  ) => Promise<RichTextEditorApiCallIngReturnInterface[]>;
}

export interface SelectedFileArrayObjInterface {
  id: string;
  file: File;
  croppedImagePreview: string;
  originalFile: File;
  croppedArea: Area;
  rotation: number;
}
export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}

export interface SelectedFileForCrop {
  id: string;
  file: File;
  previewUrl: string;
  croppedImagePreview: string;
  originalFile: File;
  croppedArea: Area;
  rotation: number;
}

export interface DragAndDropCropImageInterface {
  previewUrl: string;
  id: string;
}

export interface NoHolidayCardPropsInterface {
  portalSlug: string;
}

export interface AddEditInquiryFormSchemaInterface {
  id: string;
  form_id: string;
  form_name: string;
  status: boolean;
  description: string;
  authorized_recipient_emails: string[];
  email_notification: boolean;
  source_type: 'default' | 'user_created';
}

export interface PermissionObjectInterface {
  label: 'view' | 'edit' | 'delete';
  is_allowed: boolean;
}

export interface ConfigModuleSideBarListingInterface {
  label: string;
  path: string;
  module: React.ReactElement<{
    permissions?: PermissionObjectInterface[];
  }>;
}
export interface appRouterArraysInterface {
  label: string;
  path: string;
  module: React.ReactElement | null;
  subModule: appRouterArraysInterface[];
}

export interface ResetPasswordLinkModalInterface {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  handelSubmit: (mail: string, callBack: (success: boolean) => void) => void;
  companyEmail: string;
  personalEmail: string;
}

export interface OrganizationFormInfoInterface {
  organizationName: string;
  primaryEmail: string;
  defaultPortalUrlSlug: string;
  websiteUrl: string;
  contactNumber: string;
  industry: { label: string; value: string };
  employeeCount: string;
}

export type SocialMediaErrorCode =
  | 'fb_auth_denied'
  | 'fb_token_exchange_failed'
  | 'fb_no_pages_found'
  | 'fb_permission_missing'
  | 'fb_unexpected'
  | 'tw_auth_denied'
  | 'tw_token_exchange_failed'
  | 'tw_account_deactivated'
  | 'tw_org_deactivated'
  | 'tw_permission_missing'
  | 'tw_unexpected'
  | 'li_auth_denied'
  | 'li_token_exchange_failed'
  | 'li_no_pages_found'
  | 'li_permission_missing'
  | 'li_unexpected'
  | 'default';

export interface USER_FRIENDLY_ERRORS_INTERFACE {
  showModal: boolean;
  errorCode: SocialMediaErrorCode;
}

export interface CommanAddModalPropsInterface {
  modalTitle: string;
  showColorPicker: boolean;
  showPreview: boolean;
  labelFieldName: string;
  loading: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  handelFormSubmitFunction: (value: string, bgColor?: string) => void;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  modalType: 'add' | 'edit';
  color?: string;
  setColor?: React.Dispatch<SetStateAction<string>>;
  fieldType?: string;
  setFieldType?: React.Dispatch<SetStateAction<string>>;
  isRequiredField?: string;
  setIsRequiredField?: React.Dispatch<SetStateAction<string>>;
  dummyValue: string;
  dummyColor?: string;
  dummyFieldType?: string;
}
