/* eslint-disable @typescript-eslint/no-explicit-any */
import validator from "validator";
import * as CryptoJS from "crypto-js";

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

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
export const storeDataInLocalStorage = (_data: any, key: string, encrypted: boolean = false) => {
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
    dataToStore = typeof _data == "object" ? JSON.stringify(_data) : String(_data);
  }
  localStorage.setItem(key, dataToStore);
};
