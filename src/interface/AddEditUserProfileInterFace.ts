export interface AddEditUserProfileInterFace {
  PersonalInfo: {
    first_name: string;
    middle_name: string;
    last_name: string;
    full_name: string;
    profile_picture: string;
    gender: string;
    date_of_birth: null | Date;
    blood_group: string;
    about: string;
  };
  EmployeeInfo: {
    status: string;
    organization_name: string;
    employee_code: string;
    department: string;
    designation: string;
    employee_email: string;
    reporting_to: { id: string; name: string };
    employee_role: { role_id: string; role_name: string };
  };
}
