/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestHeaders } from "axios";
import { loginForm, signUpForm } from "../../interface/funcParamInterface";
import { ErrorHandler, storeDataInLocalStorage } from "../HelperFunctions";
import React, { SetStateAction } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;
const defaultHeader = {
  "Content-Type": "application/json",
};

// ? We Are Defining The InterFace For The API Response

interface SignUpApiResponse {
  message: string;
  success: boolean;
  showModal: boolean;
  title: string;
}

// * The Function That Are HelpFull For Sign-IN And Sign-UP

export const loginApiFunction = async (
  endpoint: string,
  data: loginForm,
  request_type: "GET" | "POST",
  setLoader: React.Dispatch<SetStateAction<boolean>>,
  headers?: AxiosRequestHeaders
) => {
  try {
    const url = `${BASE_URL}/${endpoint}`;

    const config = {
      method: request_type,
      url,
      headers: headers || defaultHeader,
    };

    if (request_type == "POST") {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      Object.assign(config, { data: formData });
    } else {
      Object.assign(config, { params: data });
    }

    const response = await axios(config);
    if (response.data.success) {
      setLoader(false);
      storeDataInLocalStorage(response?.data.user_info, "user-info");
      storeDataInLocalStorage(response?.data?.token, "authenticationToken");
      if (response?.data?.user_info?.default_organization_id || response?.data?.user_info?.organizations.length >= 1) {
        console.log("hello");
      } else {
        window.location.href = "/pages/organizations";
      }
    } else {
      setLoader(false);
      throw new Error("Request Was Unsuccessful");
    }
  } catch (error) {
    setLoader(false);
    ErrorHandler("Error from the login API", error as Error);
  }
};

export const signUpApiFunction = async (
  endpoint: string,
  data: signUpForm,
  request_type: "POST",
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
      website_url: data.websiteUrl || "",
      is_meta_verified: false,
      meta_key: "",
      meta_value: "",
      terms_accepted: data.termsAccepted,
      email_verified: false,
      organization_profile_picture: "",
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
        message: `We've sent a verification email to **${response.data?.organization?.primary_email}**.  
        Please check your inbox and verify your email to activate your account.`,
        success: true,
        showModal: true,
        title: "Organization Created Successfully!",
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
        title: "Organization Already Exists!",
      };
    }
  }
};

export const verifyUsersLoginStatus = async (setShowGlobalLoader: React.Dispatch<SetStateAction<boolean>>) => {
  setShowGlobalLoader(false);
};
