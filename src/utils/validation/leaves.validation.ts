import { ValidationResult } from '@/interface/Global.interface';
import { ApplyLeaveForm } from '@/interface/OrganizationSettings.interface';

import { ERROR_MESSAGES } from '../constants/errorMessages.consatants';

export const LeaveFormValidation = ({
  values,
}: {
  values: ApplyLeaveForm;
}): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  const leave_type = values?.leave_type;
  const start_date = values?.start_date;
  const end_date = values?.end_date;
  const start_half = values?.start_half;
  const end_half = values?.end_half;
  const description = values?.description;

  // Required field validations
  if (!leave_type) {
    errors.leave_type = ERROR_MESSAGES.LEAVE_TYPE_IS_REQUIRED;
    isValid = false;
  }
  if (!description) {
    errors.description = ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE;
    isValid = false;
  }

  if (!start_date) {
    errors.start_date = ERROR_MESSAGES.INVALID_DATE;
    isValid = false;
  }

  if (!start_half) {
    errors.start_half = ERROR_MESSAGES.INVALID_DATE;
    isValid = false;
  }

  if (!end_date) {
    errors.end_date = ERROR_MESSAGES.INVALID_FORMAT;
    isValid = false;
  }

  if (!end_half) {
    errors.end_half = ERROR_MESSAGES.INVALID_FORMAT;
    isValid = false;
  }

  // Date range validation
  if (start_date && end_date) {
    if (end_date < start_date) {
      errors.end_date = 'End date cannot be before start date';
      isValid = false;
    }

    if (
      start_date === end_date &&
      start_half === 'second_half' &&
      end_half === 'first_half'
    ) {
      errors.end_half = 'Invalid half selection for same day';
      isValid = false;
    }
  }

  return { isValid, errors };
};
