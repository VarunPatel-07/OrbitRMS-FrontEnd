/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosError } from 'axios';
import Cleave from 'cleave.js';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import validator from 'validator';

import { PHONE_NUMBER_FORMATE } from '@/utils/constants/numberFormate.constants';

const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
const current_environment = import.meta.env.VITE_ENVIRONMENT;

//  * Validates if the given email is in a correct format.

export const isValidEmail = (
  email: string,
  host_blacklist: string[] = []
): boolean => {
  const isValid = validator.isEmail(email, { host_blacklist: host_blacklist });
  return isValid;
};

export const IsOdd = (num: number) => num % 2 !== 0;

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
      data: error?.response?.data?.detail?.data ?? null,
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
const getCookieConfig = () => {
  const isProd = current_environment === 'PRODUCTION';

  return {
    secure: isProd,
    sameSite: 'Strict',
    path: '/',
    ...(isProd && { domain: 'localhost' }),
  };
};

// here we are writing the function that will store the auth token and every thing in the cookie for the production
export const storeDataInSecureCookie = (
  _data: any,
  key: string,
  is_persistent: boolean,
  expire?: number,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
) => {
  if (!key) {
    console.error('the key is required to store the data');
    return;
  }

  const cookieConfig: any = getCookieConfig();

  Cookies.remove(key, cookieConfig);

  let dataToStore: string;
  if (encrypted) {
    _data = typeof _data == 'object' ? JSON.stringify(_data) : String(_data);

    dataToStore = CryptoJS.AES.encrypt(_data, encryptionKey).toString();
  } else {
    dataToStore = JSON.stringify(_data);
  }

  if (is_persistent === true) {
    cookieConfig.expires = expire ?? 30;
  }

  Cookies.set(key, dataToStore, cookieConfig);
};

export const getDataFromSecureCookie = (
  key: string,
  encrypted: boolean = current_environment == 'PRODUCTION' ? true : false
): any | null => {
  try {
    const cookieStorageData = Cookies.get(key);

    if (!cookieStorageData) return null;

    if (encrypted) {
      if (!encryptionKey)
        throw new Error('Encryption key is required for decryption');

      const decryptedData = CryptoJS.AES.decrypt(
        cookieStorageData,
        encryptionKey
      ).toString(CryptoJS.enc.Utf8);

      if (typeof decryptedData !== 'string') return decryptedData;

      try {
        return JSON.parse(decryptedData);
      } catch {
        return decryptedData;
      }
    }

    return JSON.parse(cookieStorageData);
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
};

export const removeDataFromSecureCookie = (key: string) => {
  if (!key) {
    console.error('the key is required to store the data');
    return;
  }

  const cookieConfig: any = getCookieConfig();

  Cookies.remove('authenticationToken', cookieConfig);
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
      ).toString(CryptoJS.enc.Utf8);
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
export const removeDataFromLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
// * to clear local storage all the value form it
export const clearLocalSessionStorage = () => {
  localStorage.clear();
  sessionStorage.clear();

  const cookieConfig: any = getCookieConfig();
  Object.keys(Cookies.get()).forEach((cookieName) => {
    Cookies.remove(cookieName, cookieConfig);
  });
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
    ).toString(CryptoJS.enc.Utf8);
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
  const format = PHONE_NUMBER_FORMATE[upperCountryCode];

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
  const format = PHONE_NUMBER_FORMATE[upperCountryCode];

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
    formattedDate = formattedDate?.replace(regex, replacements[token]);
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

export const formatIsoDate = (
  dateInput: string | Date,
  default_dateformat: string
): string => {
  let year: number;
  let month: number;
  let day: number;

  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return '';

    year = Number(match[1]);
    month = Number(match[2]) - 1;
    day = Number(match[3]);
  } else {
    year = dateInput.getFullYear();
    month = dateInput.getMonth();
    day = dateInput.getDate();
  }

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
    YY: `${year % 100}`.padStart(2, '0'),
    MM: `${month + 1}`.padStart(2, '0'),
    DD: `${day}`.padStart(2, '0'),
    D: `${day}`,
    M: `${month + 1}`,
    Y: `${year}`,
  };

  let formattedDate = default_dateformat;

  for (const token of ['YYYY', 'MMM', 'YY', 'MM', 'Y', 'DD', 'D', 'M']) {
    formattedDate = formattedDate.replace(
      new RegExp(`\\b${token}\\b`, 'g'),
      replacements[token]
    );
  }

  return formattedDate;
};

export const getTotalExperience = (dateString: string) => {
  const joiningDate = new Date(dateString);
  const currentDate = new Date();

  let year = currentDate?.getFullYear() - joiningDate?.getFullYear();

  let months = currentDate?.getMonth() - joiningDate?.getMonth();

  let day = currentDate?.getDate() - joiningDate?.getDate();

  if (day < 0) {
    months--;
    const previousMonth = new Date(
      currentDate?.getFullYear(),
      currentDate?.getMonth(),
      0
    );

    day += previousMonth?.getDate();
  }

  if (months < 0) {
    year--;
    months += 12;
  }

  return `${year}Y ${months}M ${day}D`;
};

export const getLocalDateString = (date: Date | null): string => {
  if (!date) {
    return '';
  }
  const localDateString =
    date.getFullYear() +
    '-' +
    String(date.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(date.getDate()).padStart(2, '0');

  return localDateString;
};

export const compareTwoNestedObject = (objOne: any, objTwo: any): boolean => {
  if (objOne === objTwo) return true;

  if (
    typeof objOne !== 'object' ||
    typeof objTwo !== 'object' ||
    objOne == null ||
    objTwo == null
  )
    return false;

  const objOneKeys = Object.keys(objOne);
  const objTwoKeys = Object.keys(objTwo);

  if (objOneKeys.length !== objTwoKeys.length) return false;

  for (const key of objOneKeys) {
    if (!objTwoKeys.includes(key)) return false;
    const valOne = objOne[key];
    const valTwo = objTwo[key];

    const areObjects =
      typeof valOne === 'object' &&
      valOne !== null &&
      typeof valTwo === 'object' &&
      valTwo !== null;

    if (areObjects) {
      if (!compareTwoNestedObject(valOne, valTwo)) return false;
    } else {
      if (valOne !== valTwo) return false;
    }
  }

  return true;
};

export const CompareTwoArrayOfString = (
  arrayOne: Array<string>,
  arrayTwo: Array<string>
) => {
  if (arrayOne?.length !== arrayTwo?.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    const itemOne = arrayOne[i]?.trim()?.toLowerCase();
    const itemTwo = arrayTwo[i]?.trim()?.toLowerCase();
    if (itemOne !== itemTwo) {
      return false;
    }
  }
  return true;
};

export const generateTimeBasedGreeting = (): string => {
  const date = new Date();
  const time = date?.getHours();

  if (time >= 5 && time < 12) return 'Good Morning';
  if (time >= 12 && time < 16) return 'Good Afternoon';
  if (time >= 16 && time < 20) return 'Good Evening';
  return 'Good Night';
};

export const compareDates = (date: Date) => {
  const currentDate = new Date();
  const currentDay = currentDate?.getDate();
  const currentMonth = currentDate?.getMonth() + 1;

  const holidayDate = new Date(date + 'Z');
  const holidayDay = holidayDate?.getDate();
  const holidayMonth = holidayDate?.getMonth() + 1;

  if (currentMonth > holidayMonth) return false;

  if (holidayMonth <= currentMonth) {
    if (holidayDay < currentDay) return false;
    return true;
  }
  return true;
};

export const isRichTextEditorIsEmpty = (htmlString: string) => {
  const text = htmlString
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/"/g, '')
    .trim();

  return text === '';
};

// * This Function Help you to get the counter

export const convertToTitleCase = (field_name: string) => {
  return field_name
    ?.split('_')
    .map(
      (word) =>
        word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLocaleLowerCase()
    )
    .join(' ');
};

export const MaxLimitCountDownTimeFormatter = (seconds: number) => {
  const mins = Math.floor((seconds % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((seconds % (1000 * 60)) / 1000);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const getMaxEndDate = (
  startDate: Date | null,
  availableLeaves: number
): Date | undefined => {
  if (!startDate || !availableLeaves) return undefined;

  const maxDate = new Date(startDate);
  maxDate.setDate(maxDate.getDate() + availableLeaves - 1);

  return maxDate;
};
