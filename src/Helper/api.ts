import axios, { AxiosHeaders } from "axios";
import { loginForm } from "../interface/funcParamInterface";
import { ErrorHandler } from "./HelperFunctions";

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASEURL;
const defaultHeader = {
  "Content-Type": "multipart/form-data",
};

export const loginApiFunction = async (
  endpoint: string,
  data: loginForm,
  request_type: "GET" | "POST",
  headers?: AxiosHeaders
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
      return response.data;
    } else {
      throw new Error("Request Was Unsuccessful");
    }
  } catch (error) {
    ErrorHandler("Error from the login API", error as Error);
  }
};
