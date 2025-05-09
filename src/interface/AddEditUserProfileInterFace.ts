export interface AddEditUserProfileInterFace {
  personal_info: {
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
  employee_info: {
    status: string;
    organization_name: string;
    employee_code: string;
    department: string;
    designation: string;
    employee_email: string;
    reporting_to: { id: string; name: string };
    employee_role: { role_id: string; role_name: string };
  };
  personal_contact_info: {
    personal_email: string;
    mobile_number: string;
    country_info: string;
    emergency_contact: {
      emergency_contact_country_info: string;
      emergency_contact_number: string;
      emergency_contact_name: string;
    }[];
  };
  family_info: {
    father_name: string;
    mother_name: string;
    marital_status: string;
    children: {
      child_name: string;
      child_date_of_birth: null | Date;
    }[];
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
    state: string;
    city: string;
    zip_code: string;
    country_code: string;
  };
  social_links: {
    icon: string;
    name: string;
    link: string;
    target_blank: boolean;
  }[];
}
