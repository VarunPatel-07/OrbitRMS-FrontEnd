/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import Cleave from 'cleave.js';
import CryptoJS from 'crypto-js';
import validator from 'validator';

import { phoneFormats } from '../constant/NumberFormate';

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const current_environment = import.meta.env.VITE_ENVIRONMENT;

//  * Validates if the given email is in a correct format.

export const isValidEmail = (email: string): boolean => {
  const isValid = validator.isEmail(email);
  return isValid;
};

//  * This function will generate an unique meta tag.

export const UniqueMetaTagGeneratingFunction = (lengthOfString: number) => {
  const character =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characterLength = character.length;
  let uniqueString = '';
  for (let i = 0; i < lengthOfString; i++) {
    uniqueString += character.charAt(
      Math.floor(Math.random() * characterLength)
    );
  }
  const timeStamp = Date.now().toString(36);
  return `${uniqueString}-${timeStamp}`;
};

//  * This Is The ClassName Function That Will Use To Simplify The ClassName With The Condition.

export const classNames = (
  defaultClass: string,
  conditionBasedClass: { [keys: string]: boolean }
) => {
  return `${defaultClass} ${Object.keys(conditionBasedClass)
    .filter((key) => conditionBasedClass[key])
    .join(' ')}`;
};

//  * To Handel The Error From The One Place.

export const ErrorHandler = (error: Error | AxiosError) => {
  if (error instanceof AxiosError) {
    const errorData = {
      success: error?.response?.data?.detail?.success ?? false,
      message: error?.response?.data?.detail?.message ?? 'something went wrong',
    };
    return errorData;
  } else {
    const errorData = {
      success: false,
      message: 'An unknown error occurred',
      data: null,
    };
    return errorData;
  }
};

//  * To Store The Data In The LocalStorage And This Function Have A Default Argument That If The Environment Is Production Then All The Data Will Be Stored In Encrypted Formate.

export const storeDataInLocalStorage = (
  _data: any,
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  if (!key) {
    console.error('the key is required to store the data');
    return;
  }
  let dataToStore: string;
  if (encrypted) {
    _data = typeof _data == 'object' ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  localStorage.setItem(key, dataToStore);
};

//  * To Handel The Error From The One Place.

export const getDataFromLocalStorage = (
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
): any | null => {
  try {
    const localStorageData = localStorage.getItem(key);
    if (!localStorageData) return null;

    if (encrypted) {
      if (!encryptionKey)
        throw new Error('Encryption key is required for decryption');
      const decryptedData = CryptoJS.AES.decrypt(
        localStorageData,
        encryptionKey
      ).toString();
      if (key != 'authenticationToken') {
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
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  if (!key) {
    console.error('the key is required to store the data');
    return;
  }
  let dataToStore: string;
  if (encrypted) {
    _data = typeof _data == 'object' ? JSON.stringify(_data) : _data;
    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }
  sessionStorage.setItem(key, dataToStore);
};

export const getDataFromTheSessionStorage = (
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  const sessionStorageData = sessionStorage.getItem(key);
  if (!sessionStorageData) return null;
  if (encrypted) {
    if (!encryptionKey)
      throw new Error('Encryption key is required for decryption');
    const decryptedData = CryptoJS.AES.decrypt(
      sessionStorageData,
      encryptionKey
    ).toString();
    if (key != 'authenticationToken') {
      return JSON.parse(decryptedData);
    } else {
      return decryptedData;
    }
  }
  return JSON.parse(sessionStorageData);
};

// *
export const formateAndVerifyPhoneNumber = (
  number: string,
  countryCode: string
) => {
  if (!countryCode) return number;

  const upperCountryCode = countryCode.toUpperCase();
  const format = phoneFormats[upperCountryCode];

  if (!format) return number;
  // Create a dummy input element for Cleave
  const dummyInput = document.createElement('input');

  const cleave = new Cleave(dummyInput, {
    delimiter: '-',
    blocks: format.split('-').map((x) => x.length),
    numericOnly: true, // Ensures only numbers are processed
    rawValueTrimPrefix: true,
    delimiterLazyShow: true,
  });

  cleave.setRawValue(number);

  // Prevent retention of formatting when clearing
  return cleave.getFormattedValue();
};

export const verifyPhoneNumberLength = (
  phoneNumber: string,
  countryCode: string
): boolean => {
  if (!countryCode) return false;

  const upperCountryCode = countryCode.toUpperCase();
  const format = phoneFormats[upperCountryCode];

  if (!format) return true;

  // Extract lengths from format like 'XXX-XXX-XXXX' or '3-3-4'
  const blocks = format.split('-').map((block) => block.length);
  const expectedLength = blocks.reduce((sum, len) => sum + len, 0);
  const number = formateAndVerifyPhoneNumber(phoneNumber, countryCode);
  const rowPhoneNumber = number.replace(/-/g, '');

  return rowPhoneNumber.length == expectedLength ? true : false;
};

export const getRadianAngle = (rotation: number) => {
  return (rotation * Math.PI) / 180;
};

export const createImageUtilFunction = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};

export const getBoundingBox = (
  _width: number,
  _height: number,
  radian: number
) => {
  return {
    width:
      Math.abs(_width * Math.cos(radian)) +
      Math.abs(_height * Math.sin(radian)),
    height:
      Math.abs(_width * Math.sin(radian)) +
      Math.abs(_height * Math.cos(radian)),
  };
};

export const dataUrlToFileConvertor = (dataUrl: string, filename: string) => {
  const arr = dataUrl.split(',');
  const match = arr[0].match(/:(.*?);/);
  const mime = match ? match[1] : 'application/octet-stream';

  const correctedFilename =
    filename.endsWith('.png') && mime !== 'image/png'
      ? filename.replace('.png', '.jpeg')
      : filename;

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], correctedFilename, { type: mime });
};

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export const formateDate = (
  UTCString: string,
  default_dateformat: string,
  showTime: boolean = true
): string => {
  const date = new Date(UTCString + 'Z');
  const year = date.getFullYear();
  const twoDigitYear = year % 100;
  const month = date.getMonth(); // 0-based
  const day = date.getDate();

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const replacements: Record<string, string> = {
    YYYY: `${year}`,
    MMM: monthNames[month],
    YY: twoDigitYear <= 9 ? `0${twoDigitYear}` : `${twoDigitYear}`,
    MM: month + 1 <= 9 ? `0${month + 1}` : `${month + 1}`,
    Y: `${year}`,
    DD: day <= 9 ? `0${day}` : `${day}`,
    D: `${day}`,
    M: `${month + 1}`,
  };

  // Replace tokens in order from longest to shortest to avoid partial replacements
  const tokenOrder = ['YYYY', 'MMM', 'YY', 'MM', 'Y', 'DD', 'D', 'M'];

  let formattedDate = default_dateformat;

  for (const token of tokenOrder) {
    // Replace exact tokens only (use \b boundaries or match whole token)
    const regex = new RegExp(`\\b${token}\\b`, 'g');
    formattedDate = formattedDate.replace(regex, replacements[token]);
  }

  if (showTime) {
    const creationTime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    formattedDate += `, ${creationTime.toUpperCase()}`;
  }

  return formattedDate;
};
