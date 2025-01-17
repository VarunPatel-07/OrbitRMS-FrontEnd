/* eslint-disable @typescript-eslint/no-explicit-any */
import validator from "validator";
import * as CryptoJS from "crypto-js";

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const current_environment = import.meta.env.VITE_ENVIRONMENT;

export const isValidEmail = (email: string) => {
  const isValid = validator.isEmail(email);
  return isValid;
};

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

export const classNames = (defaultClass: string, conditionBasedClass: { [keys: string]: boolean }) => {
  return `${defaultClass} ${Object.keys(conditionBasedClass)
    .filter((key) => conditionBasedClass[key])
    .join(" ")}`;
};

export const ErrorHandler = (message: string, error: Error) => {
  console.log(`GlobalErrorHandler:<${message}>`, error);
};
// const encryptedData = ;
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
    if (typeof _data == "object") {
      _data = JSON.stringify(_data);
    }
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  localStorage.setItem(key, dataToStore);
};

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
export const clearLocalStorage = () => {
  localStorage.clear();
};
