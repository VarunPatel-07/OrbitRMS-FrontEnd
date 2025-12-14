/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

import {
  employeeFormDropdownsInitial,
  fetchingDesignationsDepartmentsLoadingFlag,
} from '../../../../constant/AddEditEmployeeForm';
import {
  endpointObject,
  multipleFetchApi,
} from '../../../../Helper/api/multipleAPI';
import {
  AddEditComponentListingPropsInterface,
  employeeFormDropdownsInterface,
  fetchingDesignationsDepartmentsLoadingFlagInterface,
} from '../../../../interface/AddEditUserProfileInterFace';
import AddEditEmployeeSocialLink from './AddEditEmployeeSocialLink';
import EmployeeAddress from './EmployeeAddress/EmployeeAddress';
import EmployeeFamilyInfo from './EmployeeFamilyInfo';
import EmployeeInformation from './EmployeeInformation';
import EmployeePersonalContactInformation from './EmployeePersonalContactInformation';
import EmployeePersonalInfo from './EmployeePersonalInfo';

const AddEditComponentListing = React.memo(function AddEditComponentListing(
  props: AddEditComponentListingPropsInterface
) {
  const {
    formData,
    setFormData,
    GlobalStateProvider,
    showEmptyFieldError,
    countryOptionsDataArray,
    filteredCountry,
    isFetchingCountryData,
    countryData,
    selectedCountryInfoForCurrentAddress,
    setSelectedCountryInfoForCurrentAddress,
    formSubmitLoader,
    permissionData,
    isEditingCurrentEmployee,
  } = props;

  const DesignationsDepartmentsRef = useRef(false);

  const [employeeFormDropdowns, setEmployeeFormDropdowns] =
    useState<employeeFormDropdownsInterface>(employeeFormDropdownsInitial);

  const [fetchingDesignationsDepartments, setFetchingDesignationsDepartments] =
    useState<fetchingDesignationsDepartmentsLoadingFlagInterface>(
      fetchingDesignationsDepartmentsLoadingFlag
    );

  // This Function Is To Handel The OnChange For The Input And TextArea
  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    let filteredValue = value;

    if (name == 'employee_info.employee_code') {
      const codePrefix =
        formData?.employee_info?.status.toLocaleLowerCase() == 'intern'
          ? GlobalStateProvider?.organization?.organization_settings
              ?.intern_code_prefix
          : GlobalStateProvider?.organization?.organization_settings
              ?.employee_code_prefix;
      filteredValue = codePrefix + '-' + value.replace(/\D/g, '');
    }
    if (name == 'employee_info.employee_email') {
      filteredValue =
        value +
        '@' +
        GlobalStateProvider?.organization?.general_info?.primary_email?.split(
          '@'
        )[1];
    }
    setFormData((previous) => {
      const updatedData = { ...previous };
      let nested: any = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!nested[keys[i]]) {
          nested[keys[i]] = {}; // Ensure the nested object exists
        }
        nested = nested[keys[i]];
      }

      nested[keys[keys.length - 1]] = filteredValue;

      return { ...updatedData };
    });
  };

  const handelSearchDropSelectValue = (
    data: string | object,
    name: string,
    sectionName:
      | 'personal_info'
      | 'employee_info'
      | 'personal_contact_info'
      | 'family_info'
  ) => {
    setFormData((pervData) => ({
      ...pervData,
      [sectionName]: {
        ...pervData[sectionName],
        [name]: typeof data === 'object' ? JSON.stringify(data) : data,
      },
    }));
  };

  const FetchDepartmentAndDesignation = async () => {
    setFetchingDesignationsDepartments({
      departments: true,
      designations: true,
      employee_role: true,
      reporting_to: true,
    });
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: 'config/department/fetch',
        protected: true,
      },
      {
        endPoint: 'config/designations/fetch',
        protected: true,
      },
      {
        endPoint: 'organization/fetch-reporting-manager',
        protected: true,
      },
      {
        endPoint: 'config/roles_permissions/fetch-all',
        protected: true,
      },
    ];
    const response = await multipleFetchApi(endPointArr);
    if (response) {
      if (response[0]?.success) {
        setEmployeeFormDropdowns((pervData) => ({
          ...pervData,
          departmentOptions: response[0]?.data,
        }));
        setFetchingDesignationsDepartments((perValue) => ({
          ...perValue,
          departments: false,
        }));
      }
      if (response[1]?.success) {
        setEmployeeFormDropdowns((pervData) => ({
          ...pervData,
          designationOptions: response[1]?.data,
        }));
        setFetchingDesignationsDepartments((perValue) => ({
          ...perValue,
          designations: false,
        }));
      }
      if (response[2]?.success) {
        setEmployeeFormDropdowns((pervData) => ({
          ...pervData,
          reportingManagerOptions: response[2]?.data,
        }));
        setFetchingDesignationsDepartments((perValue) => ({
          ...perValue,
          reporting_to: false,
        }));
      }
      if (response[3]?.success) {
        setEmployeeFormDropdowns((pervData) => ({
          ...pervData,
          employeeRoleOptions: response[3]?.data,
        }));
        setFetchingDesignationsDepartments((perValue) => ({
          ...perValue,
          employee_role: false,
        }));
      }
    }
  };

  const personalInfoPermissions = permissionData?.sub_modules?.find(
    (item) => item?.module_label == 'personal_information'
  );
  const employeeInfoPermissions = permissionData?.sub_modules?.find(
    (item) => item?.module_label == 'employee_information'
  );
  const personalContactInfoPermissions = permissionData?.sub_modules?.find(
    (item) => item?.module_label == 'personal_contact_information'
  );
  const familyInfoPermissions = permissionData?.sub_modules?.find(
    (item) => item?.module_label == 'family_information'
  );
  const employeeAddressPermissions = permissionData?.sub_modules?.find(
    (item) => item?.module_label == 'employee_address'
  );

  console.log(employeeAddressPermissions);

  useEffect(() => {
    if (DesignationsDepartmentsRef.current) return;
    DesignationsDepartmentsRef.current = true;
    FetchDepartmentAndDesignation();
  }, []);
  return (
    <>
      <EmployeePersonalInfo
        formData={formData}
        setFormData={setFormData}
        handleOnChange={handleOnChange}
        showEmptyFieldError={showEmptyFieldError}
        handelSearchDropSelectValue={handelSearchDropSelectValue}
        formSubmitLoader={formSubmitLoader}
        disabled={
          isEditingCurrentEmployee
            ? !isEditingCurrentEmployee
            : !personalInfoPermissions?.is_active ||
              personalInfoPermissions?.permissions?.some(
                (item) => item?.label == 'edit' && !item?.is_allowed
              )
        }
      />
      <EmployeeInformation
        formData={formData}
        setFormData={setFormData}
        showEmptyFieldError={showEmptyFieldError}
        handelSearchDropSelectValue={handelSearchDropSelectValue}
        GlobalStateProvider={GlobalStateProvider}
        handleOnChange={handleOnChange}
        employeeFormDropdowns={employeeFormDropdowns}
        fetchingDesignationsDepartments={fetchingDesignationsDepartments}
        formSubmitLoader={formSubmitLoader}
        disabled={
          !employeeInfoPermissions?.is_active ||
          employeeInfoPermissions?.permissions?.some(
            (item) => item?.label == 'edit' && !item?.is_allowed
          )
        }
      />
      <EmployeePersonalContactInformation
        formData={formData}
        setFormData={setFormData}
        showEmptyFieldError={showEmptyFieldError}
        handelSearchDropSelectValue={handelSearchDropSelectValue}
        handleOnChange={handleOnChange}
        countryOptionsDataArray={countryOptionsDataArray}
        filteredCountry={filteredCountry}
        formSubmitLoader={formSubmitLoader}
        disabled={
          isEditingCurrentEmployee
            ? !isEditingCurrentEmployee
            : !personalContactInfoPermissions?.is_active ||
              personalContactInfoPermissions?.permissions?.some(
                (item) => item?.label == 'edit' && !item?.is_allowed
              )
        }
      />
      <EmployeeFamilyInfo
        formData={formData}
        setFormData={setFormData}
        handelSearchDropSelectValue={handelSearchDropSelectValue}
        handleOnChange={handleOnChange}
        showEmptyFieldError={showEmptyFieldError}
        formSubmitLoader={formSubmitLoader}
        disabled={
          isEditingCurrentEmployee
            ? !isEditingCurrentEmployee
            : !familyInfoPermissions?.is_active ||
              familyInfoPermissions?.permissions?.some(
                (item) => item?.label == 'edit' && !item?.is_allowed
              )
        }
      />
      <EmployeeAddress
        formData={formData}
        formSubmitLoader={formSubmitLoader}
        handleOnChange={handleOnChange}
        setFormData={setFormData}
        showEmptyFieldError={showEmptyFieldError}
        isFetchingCountryData={isFetchingCountryData}
        countryData={countryData}
        selectedCountryInfoForCurrentAddress={
          selectedCountryInfoForCurrentAddress
        }
        setSelectedCountryInfoForCurrentAddress={
          setSelectedCountryInfoForCurrentAddress
        }
        disabled={
          isEditingCurrentEmployee
            ? !isEditingCurrentEmployee
            : !employeeAddressPermissions?.is_active ||
              employeeAddressPermissions?.permissions?.some(
                (item) => item?.label == 'edit' && !item?.is_allowed
              )
        }
      />
      <AddEditEmployeeSocialLink
        formData={formData}
        formSubmitLoader={formSubmitLoader}
        setFormData={setFormData}
        showEmptyFieldError={showEmptyFieldError}
        disabled={
          isEditingCurrentEmployee
            ? !isEditingCurrentEmployee
            : !personalInfoPermissions?.is_active ||
              personalInfoPermissions?.permissions?.some(
                (item) => item?.label == 'edit' && !item?.is_allowed
              )
        }
      />
    </>
  );
});

export default AddEditComponentListing;
