/* eslint-disable @typescript-eslint/no-explicit-any */
import validator from "validator";
import CryptoJS from "crypto-js";
import Cleave from "cleave.js";
import { phoneFormats } from "../constant/NumberFormate";
import { AxiosError } from "axios";

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const current_environment = import.meta.env.VITE_ENVIRONMENT;

//  * Validates if the given email is in a correct format.

export const isValidEmail = (email: string): boolean => {
  const isValid = validator.isEmail(email);
  return isValid;
};

//  * This function will generate an unique meta tag.

export const UniqueMetaTagGeneratingFunction = (lengthOfString: number) => {
  const character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const characterLength = character.length;
  let uniqueString = "";
  for (let i = 0; i < lengthOfString; i++) {
    uniqueString += character.charAt(Math.floor(Math.random() * characterLength));
  }
  const timeStamp = Date.now().toString(36);
  return `${uniqueString}-${timeStamp}`;
};

//  * This Is The ClassName Function That Will Use To Simplify The ClassName With The Condition.

export const classNames = (defaultClass: string, conditionBasedClass: { [keys: string]: boolean }) => {
  return `${defaultClass} ${Object.keys(conditionBasedClass)
    .filter((key) => conditionBasedClass[key])
    .join(" ")}`;
};

//  * To Handel The Error From The One Place.

export const ErrorHandler = (error: Error | AxiosError) => {
  if (error instanceof AxiosError) {
    const errorData = {
      success: error?.response?.data?.detail?.success ?? false,
      message: error?.response?.data?.detail?.message ?? "something went wrong",
    };
    return errorData;
  } else {
    const errorData = {
      success: false,
      message: "An unknown error occurred",
    };
    return errorData;
  }
};

//  * To Store The Data In The LocalStorage And This Function Have A Default Argument That If The Environment Is Production Then All The Data Will Be Stored In Encrypted Formate.

export const storeDataInLocalStorage = (
  _data: any,
  key: string,
  encrypted: boolean = current_environment == "PRODUCTION" ? true : false
) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }
  let dataToStore: string;
  if (encrypted) {
    _data = typeof _data == "object" ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  localStorage.setItem(key, dataToStore);
};

//  * To Handel The Error From The One Place.

export const getDataFromLocalStorage = (
  key: string,
  encrypted: boolean = current_environment == "PRODUCTION" ? true : false
): any | null => {
  try {
    const localStorageData = localStorage.getItem(key);
    if (!localStorageData) return null;

    if (encrypted) {
      if (!encryptionKey) throw new Error("Encryption key is required for decryption");
      const decryptedData = CryptoJS.AES.decrypt(localStorageData, encryptionKey).toString();
      if (key != "authenticationToken") {
        return JSON.parse(decryptedData);
      } else {
        return decryptedData;
      }
    }

    return JSON.parse(localStorageData);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
};

// * to clear local storage all the value form it
export const clearLocalSessionStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const storeDataInSessionStorage = (
  _data: any,
  key: string,
  encrypted: boolean = current_environment == "PRODUCTION" ? true : false
) => {
  if (!key) {
    console.error("the key is required to store the data");
    return;
  }
  let dataToStore: string;
  if (encrypted) {
    _data = typeof _data == "object" ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  sessionStorage.setItem(key, dataToStore);
};

export const getDataFromTheSessionStorage = (
  key: string,
  encrypted: boolean = current_environment == "PRODUCTION" ? true : false
) => {
  const sessionStorageData = sessionStorage.getItem(key);
  if (!sessionStorageData) return null;
  if (encrypted) {
    if (!encryptionKey) throw new Error("Encryption key is required for decryption");
    const decryptedData = CryptoJS.AES.decrypt(sessionStorageData, encryptionKey).toString();
    if (key != "authenticationToken") {
      return JSON.parse(decryptedData);
    } else {
      return decryptedData;
    }
  }
  return JSON.parse(sessionStorageData);
};

// *
export const formateAndVerifyPhoneNumber = (number: string, countryCode: string) => {
  if (!countryCode) return number;

  const upperCountryCode = countryCode.toUpperCase();
  const format = phoneFormats[upperCountryCode];

  if (!format) return number;
  // Create a dummy input element for Cleave
  const dummyInput = document.createElement("input");

  const cleave = new Cleave(dummyInput, {
    delimiter: "-",
    blocks: format.split("-").map((x) => x.length),
    numericOnly: true, // Ensures only numbers are processed
    rawValueTrimPrefix: true,
    delimiterLazyShow: true,
  });

  cleave.setRawValue(number);

  // Prevent retention of formatting when clearing
  return cleave.getFormattedValue();
};
