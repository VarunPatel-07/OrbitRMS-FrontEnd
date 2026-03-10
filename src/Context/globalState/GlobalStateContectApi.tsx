import React, { createContext, ReactNode, useState } from 'react';

import { GlobalContextStore } from '../../interface/UserProfileInterface';

const initialState: GlobalContextStore = {
  user: {
    employee_info: {
      id: '',
      status: '',
      organization_name: '',
      employee_code: '',
      department: '',
      designation: '',
      reporting_to_id: '', // empty object
      employee_role_id: '',
      employee_type: '',
      employee_email: '',
      user_id: '',
    },
    personal_info: {
      first_name: '',
      middle_name: '',
      last_name: '',
      full_name: '',
      profile_picture: '',
      profile_picture_bg: '',
      gender: '',
      date_of_birth: null,
      blood_group: '',
      about: '',
      id: '',
      user_id: '',
    },
  },
  organization: {
    id: '',
    general_info: {
      id: '',
      organization_name: '',
      primary_email: '',
      primary_number: '',
      country_info: {
        country_code: '',
        country_flag: '',
        country_name: '',
        country_number_code: '',
      },
      portal_url: '',
      portal_slug: '',
      website_url: '',
      is_meta_verified: false,
      meta_key: '',
      meta_value: '',
      terms_accepted: false,
      email_verified: false,
      organization_profile_picture: '',
      organization_id: '',
    },
    address: {
      id: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      country_code: '',
      organization_id: '',
    },
    contact_info: [
      {
        id: '',
        country_info: '', // JSON string expected
        phone_number: '',
        organization_id: '',
        company_email: '',
      },
    ],
    about_info: {
      id: '',
      about: '',
      established_science: '',
      registration_number: '',
      organization_id: '',
    },
    organization_settings: {
      id: '',
      email_domain_slug: '',
      employee_code_prefix: '',
      intern_code_prefix: '',
      default_timezone: '',
      default_dateformat: '',
      organization_id: '',
    },
    status: false,
    organization_created: false,
    created_at: '',
    updated_at: '',
  },
  roles_permissions: { id: '', role_name: '', permissions: [] },
};

export interface GlobalStateContextApiProps {
  GlobalStateProvider: GlobalContextStore;
  setGlobalStateProvider: React.Dispatch<
    React.SetStateAction<GlobalContextStore>
  >;
}

const GlobalStateContext = createContext<
  GlobalStateContextApiProps | undefined
>(undefined);

const GlobalStateContentApiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [GlobalStateProvider, setGlobalStateProvider] =
    useState<GlobalContextStore>(initialState);
  const NotificationContextValue = {
    GlobalStateProvider,
    setGlobalStateProvider,
  };
  return (
    <GlobalStateContext.Provider value={NotificationContextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export { GlobalStateContentApiProvider, GlobalStateContext };
