export interface EmployeePersonalInfo {
  user_id: string;
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  profile_picture_bg: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  about: string;
}

export interface ReportingManager {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  profile_picture_bg: string;
  gender: string;

  employee_code: string;
}

export interface EmployeeRole {
  id: string;
  role_name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  source_type: string;
  config_module_id: string;
}

export interface EmployeeEmployeeInfo {
  id: string;
  user_id: string;
  status: string;
  organization_id: string;
  organization_name: string;
  department: string;
  designation: string;
  reporting_to_id: string;
  reporting_manager: ReportingManager;
  employee_role: EmployeeRole;
  employee_email: string;
  employee_code: string;
  employee_type: string;
  joining_date: string;
  account_status: boolean;
}

export interface EmployeeFieldInterface {
  personal_info: EmployeePersonalInfo;
  employee_info: EmployeeEmployeeInfo;

  account_status: boolean;
  organization_id: string;
}

export type EmployeeStatusInterface =
  | 'Intern'
  | 'Trainee'
  | 'Probation'
  | 'Confirmed';
