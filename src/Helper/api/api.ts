/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction } from 'react';
import axios, { AxiosRequestHeaders } from 'axios';

import {
  MAINTENANCE_MODE_LOCAL_STORAGE_KEY,
  MaintenanceModeIsActiveStatusCode,
} from '../../constant/constant';
import { loginForm, signUpForm } from '../../interface/funcParamInterface';
import { GlobalContextStore } from '../../interface/UserProfileInterface';
import {
  ErrorHandler,
  getDataFromLocalStorage,
  getDataFromTheSessionStorage,
  storeDataInLocalStorage,
  storeDataInSessionStorage,
} from '../HelperFunctions';

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;
const defaultHeader = {
  'Content-Type': 'application/json',
};

// ? We Are Defining The InterFace For The API Response

interface SignUpApiResponse {
  message: string;
  success: boolean;
  showModal: boolean;
  title: string;
}

export interface verifyUsersLoginStatusResponse {
  success: boolean;
  message: string;
  data: GlobalContextStore | null;
  status_code?: number;
}

// * The Function That Are HelpFull For Sign-IN And Sign-UP

export const signInApiFunction = async (
  endpoint: string,
  data: loginForm,
  request_type: 'POST',
  setLoader: React.Dispatch<SetStateAction<boolean>>,
  headers?: AxiosRequestHeaders
) => {
  try {
    const url = `${BASE_URL}/${endpoint}`;

    const payload = {
      email: data?.email,
      password: data?.password,
    };

    const config = {
      method: request_type,
      url,
      headers: headers || defaultHeader,
      data: payload,
    };
    const response = await axios(config);
    const res = response?.data;

    if (res?.success) {
      setLoader(true);
      if (data?.rememberMe) {
        storeDataInLocalStorage(
          response?.data?.data?.authenticationToken,
          'authenticationToken'
        );
      } else {
        storeDataInSessionStorage(
          response?.data?.data?.authenticationToken,
          'authenticationToken'
        );
      }
    }

    return response?.data;
  } catch (error: any) {
    return ErrorHandler(error);
  }
};

export const signUpApiFunction = async (
  endpoint: string,
  data: signUpForm,
  request_type: 'POST',
  setLoader: React.Dispatch<SetStateAction<boolean>>,
  headers?: AxiosRequestHeaders
): Promise<SignUpApiResponse | undefined> => {
  try {
    const url = `${BASE_URL}/${endpoint}`;

    const payload = {
      organization_name: data.organizationName,
      primary_email: data.primaryEmail,
      primary_number: data.contactNumber,
      country_info: JSON.parse(data.countryInfo as string),
      portal_url: `${data.defaultPortalUrlSlug}${data.portalUrl}`,
      portal_slug: data.portalUrl,
      website_url: data.websiteUrl || '',
      is_meta_verified: false,
      meta_key: '',
      meta_value: '',
      terms_accepted: data.termsAccepted,
      email_verified: false,
      organization_profile_picture: '',
    };

    const config = {
      method: request_type,
      url,
      headers: headers || defaultHeader,
      data: payload,
    };
    const response = await axios(config);

    if (response?.data?.success) {
      setLoader(false);
      return {
        message: `We've sent a verification email to **${data.primaryEmail}**.  
        Please check your inbox and verify your email to activate your account.`,
        success: true,
        showModal: true,
        title: 'Organization Created Successfully!',
      };
    }
    setLoader(false);
  } catch (error: any) {
    setLoader(false);
    const statusCode = error?.response?.status;
    const response = error?.response?.data?.detail;

    if (statusCode === 409) {
      return {
        message: `An organization with this email domain is already registered.  
    Please contact the owner at **${response?.owner_email}**, or reach out to our support team for further assistance.`,
        success: false,
        showModal: true,
        title: 'Organization Already Exists!',
      };
    }
  }
};

const MaintenanceModeChecker = (error: any) => {
  const status = error?.response?.status || error?.status;

  const data = ErrorHandler(error);
  if (MaintenanceModeIsActiveStatusCode.includes(status)) {
    storeDataInLocalStorage(data.data, MAINTENANCE_MODE_LOCAL_STORAGE_KEY);
    window.location.href = '/maintenance-mode';
    return;
  }
};

export const verifyUsersLoginStatus = async () => {
  try {
    const url = `${BASE_URL}/auth/verify-user`;

    const _localToken = getDataFromLocalStorage('authenticationToken');
    const _sessionToken = getDataFromTheSessionStorage('authenticationToken');
    //   todo we will show the error in the form of the notification

    const authToken = `Bearer ${_localToken || _sessionToken}`;
    const tokenValue = authToken.split('Bearer')[1]?.trim();

    if (!tokenValue || tokenValue === 'null' || tokenValue === 'undefined') {
      return {
        success: false,
        message: '',
        data: null,
      } as verifyUsersLoginStatusResponse;
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: authToken,
    };

    const config = {
      method: 'GET',
      url,
      headers: headers,
    };

    const response = await axios(config);

    return response?.data as verifyUsersLoginStatusResponse;
  } catch (error: any) {
    if (MaintenanceModeIsActiveStatusCode.includes(error?.status)) {
      MaintenanceModeChecker(error);
    } else {
      return ErrorHandler(error as Error) as verifyUsersLoginStatusResponse;
    }
  }
};
