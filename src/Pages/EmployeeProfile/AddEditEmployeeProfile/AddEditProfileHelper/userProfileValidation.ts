import { AlignableForChildInfo } from '../../../../constant/constant';
import { AddEditUserProfileInterFace } from '../../../../interface/AddEditUserProfileInterFace';

type ErrorModuleType =
  | ''
  | 'personal_info'
  | 'employee_info'
  | 'personal_contact_info'
  | 'family_info'
  | 'address_info';

export interface EmployeeFormValidatorReturnType {
  validated: boolean;
  errorModule: ErrorModuleType;
}

export const EmployeeFormValidator = (
  formData: AddEditUserProfileInterFace
): EmployeeFormValidatorReturnType => {
  const userProfileValidation: {
    validated: () => boolean;
    errorModule: ErrorModuleType;
  }[] = [
    {
      validated: () =>
        !!(
          formData?.personal_info?.first_name &&
          formData?.personal_info?.last_name &&
          formData?.personal_info?.full_name &&
          formData?.personal_info?.gender &&
          formData?.personal_info?.date_of_birth &&
          formData?.personal_info?.blood_group
        ),
      errorModule: 'personal_info',
    },
    {
      validated: () =>
        !!(
          formData?.employee_info?.status &&
          formData?.employee_info?.organization_name &&
          formData?.employee_info?.department &&
          formData?.employee_info?.designation &&
          formData?.employee_info?.reporting_to?.id !== '' &&
          formData?.employee_info?.reporting_to?.name !== '' &&
          formData?.employee_info?.employee_role?.role_id !== '' &&
          formData?.employee_info?.employee_role?.role_name !== '' &&
          formData?.employee_info?.employee_email &&
          formData?.employee_info?.employee_code &&
          formData?.employee_info?.employee_type !== '' &&
          formData?.employee_info?.joining_date
        ),
      errorModule: 'employee_info',
    },
    {
      validated: () =>
        !!(
          formData?.personal_contact_info?.personal_email &&
          formData?.personal_contact_info?.mobile_number &&
          formData?.personal_contact_info?.country_info &&
          formData?.personal_contact_info?.emergency_contacts?.every(
            (contact) =>
              contact?.emergency_contact_name &&
              contact?.emergency_contact_number &&
              contact?.emergency_contact_country_info
          )
        ),
      errorModule: 'personal_contact_info',
    },
    {
      validated: () => {
        const basicInfo =
          formData?.family_info?.father_name &&
          formData?.family_info?.mother_name &&
          formData?.family_info?.marital_status;

        let HasChildren = true;

        if (
          AlignableForChildInfo?.includes(formData?.family_info?.marital_status)
        ) {
          HasChildren = formData?.family_info?.children?.every(
            (child) => child?.child_date_of_birth && child?.child_name
          );
        } else {
          HasChildren = true;
        }

        return !!(basicInfo && HasChildren);
      },
      errorModule: 'family_info',
    },
    {
      validated: () => {
        const basicInfo =
          formData?.current_address?.address &&
          formData?.current_address?.city &&
          formData?.current_address?.country &&
          formData?.current_address?.country_code &&
          formData?.current_address?.state &&
          formData?.current_address?.zip_code;

        let hasPermanentAddress = true;

        if (!formData?.same_as_current_address) {
          const basicPermanentAddress =
            formData?.permanent_address?.address &&
            formData?.permanent_address?.city &&
            formData?.permanent_address?.country &&
            formData?.permanent_address?.country_code &&
            formData?.permanent_address?.state &&
            formData?.permanent_address?.zip_code;
          hasPermanentAddress = basicPermanentAddress ? true : false;
        } else {
          hasPermanentAddress = true;
        }

        return !!(basicInfo && hasPermanentAddress);
      },
      errorModule: 'address_info',
    },
  ];

  const inValidModule = userProfileValidation.find(
    (section) => !section.validated()
  );

  return {
    errorModule:
      inValidModule?.errorModule === undefined
        ? ''
        : inValidModule?.errorModule,

    validated: inValidModule?.errorModule === undefined ? true : false,
  };
};
