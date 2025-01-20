import axios, { AxiosRequestHeaders } from "axios";
import { loginForm, signUpForm } from "../../interface/funcParamInterface";
import { clearLocalStorage, ErrorHandler, storeDataInLocalStorage } from "../HelperFunctions";
import { endpointObject, multipleFetchApi } from "./multipleAPI";
import React, { SetStateAction } from "react";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;
const defaultHeader = {
  "Content-Type": "multipart/form-data",
};

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
  endPoint: string,
  data: signUpForm,
  request_type: "GET" | "POST",
  setLoader: React.Dispatch<SetStateAction<boolean>>,
  headers?: AxiosRequestHeaders
) => {
  try {
    const url = `${BASE_URL}/${endPoint}`;
    const config = {
      method: request_type,
      url,
      headers: headers || defaultHeader,
    };
    if (request_type == "POST") {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("first_name", data.firstName);
      formData.append("last_name", data.lastName);
      formData.append("username", data.userName);
      Object.assign(config, { data: formData });
    } else {
      Object.assign(config, { params: data });
    }
    const response = await axios(config);
    if (response?.data?.success) {
      setLoader(false);
      storeDataInLocalStorage(response?.data.user_info, "user-info");
      storeDataInLocalStorage(response?.data?.token, "authenticationToken");
      window.location.href = "/pages/organizations";
    } else {
      setLoader(false);
      throw new Error("Request Was Unsuccessful");
    }
  } catch (error) {
    setLoader(false);
    ErrorHandler("Error from the login API", error as Error);
  }
};

export const verifyUsersLoginStatus = async (setShowGlobalLoader: React.Dispatch<SetStateAction<boolean>>) => {
  const endpointArray: Array<endpointObject> = [
    {
      endPoint: "auth/verify-user",
      protected: true,
      isFormData: true,
    },
  ];
  const responses = await multipleFetchApi(endpointArray);
  const res = responses?.[0];
  if (res?.success) {
    setShowGlobalLoader(false);
    const user = res?.user_info;
    if (user?.default_organization_id || user?.organizations.length >= 1) {
      console.log("hello");
    } else {
      window.location.href = "/pages/organizations";
    }
  } else {
    setShowGlobalLoader(false);
    clearLocalStorage();
  }
};
