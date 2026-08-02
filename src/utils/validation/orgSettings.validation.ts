import { ValidationResult } from '@/interface/Global.interface';
import { OrgLocationConfigDataArrayInterface } from '@/interface/OrganizationSettings.interface';

import { ERROR_MESSAGES } from '../constants/errorMessages.constants';

export const OrgLocationConfigValidation = ({
   values,
}: {
   values: OrgLocationConfigDataArrayInterface;
}): ValidationResult => {
   const errors: Record<string, string> = {};
   let isValid = true;

   const location_name = values?.location_name;
   const allowed_radius_meters = values?.allowed_radius_meters;
   const location_coordinates = values?.location_coordinates;

   if (!location_name) {
      errors.location_name = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }
   if (!allowed_radius_meters) {
      errors.allowed_radius_meters = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
      isValid = false;
   }
   if (allowed_radius_meters < 500) {
      errors.allowed_radius_meters = ERROR_MESSAGES.MINIMUM_ALLOWED_RADIUS;
      isValid = false;
   }
   if (allowed_radius_meters > 1500) {
      errors.allowed_radius_meters = ERROR_MESSAGES.MAXIMUM_ALLOWED_RADIUS;
      isValid = false;
   }
   if (!location_coordinates) {
      errors.location_coordinates = ERROR_MESSAGES.LOCATION_COORDINATE_REQUIRED;
      isValid = false;
   }

   return { isValid, errors };
};
