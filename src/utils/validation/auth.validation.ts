import {
   loginFormDataInterface,
   signUpFormFormDataInterface,
} from '@/interface/FunctionParams.interface';
import { ValidationResult } from '@/interface/Global.interface';

import { ERROR_MESSAGES } from '@/utils/constants/errorMessages.constants';
import { WebsiteUrlSafetyCheckErrorMessages } from '@/utils/constants/global.constants';
import { PUBLIC_EMAIL_PROVIDERS } from '@/utils/constants/publicEmailArray.constants';
import {
   isValidEmail,
   verifyPhoneNumberLength,
} from '@/utils/helpers/commonHelpers';
import { URLSafetyCheckerFunction } from '@/utils/helpers/urlSafetyChecker';

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;

export const ValidateSignInForm = ({
   value,
}: {
   value: loginFormDataInterface;
}): ValidationResult => {
   const errors: Record<string, string> = {};

   let isValid = true;

   const email = value?.email?.trim();
   const password = value?.password?.trim();

   if (!email) {
      errors.email = ERROR_MESSAGES.PLEASE_ENTER_VALID_PHONE_NUMBER;
      isValid = false;
   }

   if (!password?.trim()) {
      errors.password = ERROR_MESSAGES.PLEASE_ENTER_A_LONG_PASSWORD;
      isValid = false;
   }

   if (password?.length < 8) {
      errors.password = ERROR_MESSAGES.PLEASE_ENTER_A_LONG_PASSWORD;
      isValid = false;
   }

   if (!PASSWORD_REGEX.test(password)) {
      errors.password = ERROR_MESSAGES.PLEASE_ENTER_VALID_PASSWORD;
      isValid = false;
   }

   return { isValid, errors };
};

const getEmailErrorMessage = (email: string) => {
   const domain = email.split('@')[1]?.toLowerCase();
   const check = PUBLIC_EMAIL_PROVIDERS.find((p) => p.mail === domain);
   if (check) {
      return `public email (${check.company} - ${check.mail}) Not Allowed`;
   }
   return 'Please enter a valid email address.';
};

const HOST_BLOCKED_EMAILS = PUBLIC_EMAIL_PROVIDERS?.map((item) => item?.mail);

export const ValidateStepOneOfSignUpForm = ({
   value,
}: {
   value: signUpFormFormDataInterface;
}): ValidationResult => {
   const errors: Record<string, string> = {};
   let isValid = true;

   const organizationName = value?.organizationName?.trim();
   const primaryEmail = value?.primaryEmail?.trim();
   const portalUrl = value?.portalUrl?.trim();
   const contactNumber = value?.contactNumber?.trim();
   const countryInfo = value?.countryInfo;

   if (!organizationName) {
      errors.organizationName = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }

   if (!primaryEmail) {
      errors.primaryEmail = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }
   if (!isValidEmail(primaryEmail, HOST_BLOCKED_EMAILS)) {
      errors.primaryEmail = getEmailErrorMessage(primaryEmail);
      isValid = false;
   }
   if (!portalUrl) {
      errors.portalUrl = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }
   if (
      !verifyPhoneNumberLength(
         contactNumber,
         countryInfo ? JSON.parse(countryInfo as string)?.country_code : 'IN'
      )
   ) {
      errors.contactNumber = ERROR_MESSAGES.INVALID_PHONE_NUMBER;
      isValid = false;
   }

   return { isValid, errors };
};

const handleUrlVerificationWithDebounce = async (websiteUrl: string) => {
   const res = await URLSafetyCheckerFunction(websiteUrl);
   return res;
};

export const ValidateStepTwoOfSignUpForm = async ({
   value,
}: {
   value: signUpFormFormDataInterface;
}): Promise<ValidationResult> => {
   const errors: Record<string, string> = {};
   let isValid = true;

   const websiteUrl = value?.websiteUrl?.trim();
   const industry = value?.industry;
   const employeeCount = value?.employeeCount;
   const termsAccepted = value?.termsAccepted;

   if (websiteUrl) {
      const verifyUrlSafety =
         await handleUrlVerificationWithDebounce(websiteUrl);

      if (verifyUrlSafety.urlStatus !== 'safe') {
         errors.websiteUrl =
            WebsiteUrlSafetyCheckErrorMessages[verifyUrlSafety.urlStatus];
         isValid = false;
      }
   }

   if (!industry?.value?.trim() || !industry?.label?.trim()) {
      errors.industry = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }
   if (!employeeCount) {
      errors.employeeCount = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }
   if (!termsAccepted) {
      errors.termsAccepted = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }

   return { isValid, errors };
};
