import React, { SetStateAction } from 'react';

import {
  AddEditUserProfileInterFace,
  UserProfileInformationInterface,
} from '../interface/AddEditUserProfileInterFace';

export const responseToStateDataFeeder = (
  data: UserProfileInformationInterface,
  setFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>,
  setDummyFormData: React.Dispatch<SetStateAction<AddEditUserProfileInterFace>>,
  filteredCountry: string
) => {
  //   const data: UserProfileInformationInterface = res?.data;
  const dataObject: AddEditUserProfileInterFace = {
    personal_info: {
      ...data?.personal_info,
      date_of_birth: new Date(data?.personal_info.date_of_birth),
      about: data?.personal_info?.about || '',
    },
    employee_info: {
      department: data?.employee_info?.department,
      designation: data?.employee_info?.designation,
      employee_code: data?.employee_info?.employee_code,
      employee_email: data?.employee_info?.employee_email,
      employee_type: data?.employee_info?.employee_type,
      joining_date: data?.employee_info?.joining_date
        ? new Date(data?.employee_info?.joining_date)
        : new Date(),
      employee_role: {
        role_id: data?.employee_info?.employee_role?.id,
        role_name: data?.employee_info?.employee_role?.role_name,
      },
      organization_name: data?.employee_info?.organization_name,
      status: data?.employee_info?.status,
      reporting_to: {
        id: data?.employee_info?.reporting_manager?.id,
        name: data?.employee_info?.reporting_manager?.full_name
          ? data?.employee_info?.reporting_manager?.full_name
          : [
              data?.employee_info?.reporting_manager?.first_name,
              data?.employee_info?.reporting_manager?.middle_name,
              data?.employee_info?.reporting_manager?.last_name,
            ]
              ?.filter(Boolean)
              ?.join(' '),
      },
    },
    personal_contact_info: {
      country_info:
        data?.personal_contact_info &&
        Object.keys(data.personal_contact_info).length > 0
          ? data?.personal_contact_info?.country_info
          : JSON.stringify({
              country_code: 'IN',
              country_flag: '🇮🇳',
              country_name: 'India',
              country_number_code: '+91',
            }),
      mobile_number:
        data?.personal_contact_info &&
        Object.keys(data.personal_contact_info).length > 0
          ? data?.personal_contact_info?.mobile_number
          : '',
      personal_email:
        data?.personal_contact_info &&
        Object.keys(data.personal_contact_info).length > 0
          ? data?.personal_contact_info?.personal_email
          : '',
      emergency_contacts:
        !data?.personal_contact_info ||
        !Array.isArray(data.personal_contact_info.emergency_contacts) ||
        data.personal_contact_info.emergency_contacts.length === 0
          ? [
              {
                emergency_contact_country_info:
                  filteredCountry ||
                  JSON.stringify({
                    country_code: 'IN',
                    country_flag: '🇮🇳',
                    country_name: 'India',
                    country_number_code: '+91',
                  }),
                emergency_contact_name: '',
                emergency_contact_number: '',
                contact_id: '',
                id: '',
              },
            ]
          : data?.personal_contact_info?.emergency_contacts,
    },
    family_info: {
      ...data?.family_info,
      children:
        !data?.family_info?.children ||
        !Array.isArray(data?.family_info?.children) ||
        data?.family_info?.children?.length === 0
          ? [
              {
                child_name: '',
                child_date_of_birth: null,
                family_info_id: '',
                id: '',
              },
            ]
          : data?.family_info?.children?.map((child) => ({
              child_name: child?.child_name,
              child_date_of_birth: new Date(child?.child_date_of_birth),
              family_info_id: child?.family_info_id,
              id: child?.id,
            })),
    },
    current_address: data?.current_address,
    same_as_current_address: data?.same_as_current_address,
    permanent_address: {
      address: data?.permanent_address?.address || '',
      city: data?.permanent_address?.city || '',
      country: data?.permanent_address?.country || '',
      country_code: data?.permanent_address?.country_code || '',
      state: data?.permanent_address?.state || '',
      zip_code: data?.permanent_address?.zip_code || '',
    },
    social_link:
      data?.social_link?.length == 0
        ? [
            {
              icon: '',
              link: '',
              name: '',
              target_blank: true,
              id: '',
              user_id: '',
            },
          ]
        : data?.social_link,
  };
  setFormData((prevData) => ({
    ...prevData,
    ...dataObject,
  }));
  setDummyFormData((prevData) => ({
    ...prevData,
    ...dataObject,
  }));
};
