/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';
import { MdDelete, MdModeEditOutline } from 'react-icons/md';

import { EmployeePersonalContactInformationInterface } from '@/interface/AddEditUserProfile.interface';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { defaultEmergencyContactInfo } from '@/utils/constants/addEditEmployeeForm.constants';
import { ERROR_MESSAGES } from '@/utils/constants/errorMessages.consatants';
import { formateAndVerifyPhoneNumber } from '@/utils/helpers/commonHelpers';

const EmployeePersonalContactInformation = React.memo(
  function EmployeePersonalContactInformation(
    props: EmployeePersonalContactInformationInterface
  ) {
    const {
      formData,
      setFormData,
      handleOnChange,
      showEmptyFieldError,
      handelSearchDropSelectValue,
      countryOptionsDataArray,
      filteredCountry,
      formSubmitLoader,
      disabled,
    } = props;

    const [showError, setShowError] = useState<boolean>(false);

    const handelInputFieldChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      name: string,
      sectionName: 'personal_info' | 'employee_info' | 'personal_contact_info'
    ) => {
      const { value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setFormData((pervData) => ({
        ...pervData,
        [sectionName]: {
          ...pervData[sectionName],
          [name]: value,
        },
      }));
    };

    const handleEmergencyContactField = (
      index: number,
      name: string,
      ParentSectionName: 'personal_contact_info' | 'family_info',
      SubSectionName: 'emergency_contacts' | 'children',
      dateOfBirth?: Date | null,
      e?: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value =
        name == 'child_date_of_birth' ? dateOfBirth : e?.target?.value;
      if (value == undefined) return;
      setFormData((prevData) => {
        const ParentSection = prevData[ParentSectionName];
        const SubSection = ParentSection[
          SubSectionName as keyof typeof ParentSection
        ] as any;

        if (!Array.isArray(SubSection)) return prevData;

        const UpdatedSubSectionInfo = SubSection.map(
          (data: object, i: number) =>
            i === index ? { ...data, [name]: value } : data
        );

        return {
          ...prevData,
          [ParentSectionName]: {
            ...ParentSection,
            [SubSectionName]: UpdatedSubSectionInfo,
          },
        };
      });
    };

    const handleEmergencyContactCountryInfo = (data: string, index: number) => {
      setFormData((prevData) => ({
        ...prevData,
        personal_contact_info: {
          ...prevData.personal_contact_info,
          emergency_contacts:
            prevData.personal_contact_info.emergency_contacts.map(
              (contact, i) =>
                i == index
                  ? {
                      ...contact,
                      emergency_contact_country_info: data,
                    }
                  : contact
            ),
        },
      }));
    };

    const handelAddNewContact = () => {
      if (
        formData.personal_contact_info.emergency_contacts.every(
          (eachContact) =>
            eachContact?.emergency_contact_name !== '' &&
            eachContact?.emergency_contact_number !== ''
        )
      ) {
        setShowError(false);

        setFormData((prevData) => ({
          ...prevData,
          personal_contact_info: {
            ...prevData.personal_contact_info,
            emergency_contacts: [
              ...(prevData.personal_contact_info?.emergency_contacts || []),
              defaultEmergencyContactInfo(filteredCountry),
            ],
          },
        }));
      } else {
        setShowError(true);
      }
    };

    const removeContactInfo = (index: number) => {
      setFormData((prevData) => ({
        ...prevData,
        personal_contact_info: {
          ...prevData.personal_contact_info,
          emergency_contacts:
            prevData.personal_contact_info.emergency_contacts.filter(
              (_, i) => i !== index
            ),
        },
      }));
    };

    return (
      <div className='w-full bg-white rounded-xl border border-black/15'>
        <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
          <h2 className='font-inter text-xl text-black font-semibold capitalize'>
            Personal contact information
          </h2>
          <p className='font-inter text-base text-black font-light w-[70%]'>
            Enter your personal contact information to help us maintain accurate
            records and ensure seamless communication.
          </p>
        </div>
        <div className='p-6 w-full'>
          <div className='grid grid-cols-1 gap-6'>
            <div className='w-full'>
              <div className='w-full grid grid-cols-2 gap-5'>
                <div className='w-full'>
                  <Input
                    type='email'
                    name='personal_contact_info.personal_email'
                    labelFieldName='Personal Email'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={formData.personal_contact_info.personal_email}
                    disabled={disabled ? disabled : formSubmitLoader}
                    onChange={handleOnChange}
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_contact_info.personal_email
                        ? ''
                        : 'this field is required'
                    }
                  />
                </div>
                <div className='w-full'>
                  <Input
                    type='number'
                    name='personal_contact_info.mobile_number'
                    className='border border-black/[.65] text-black rounded-lg rounded-l-none'
                    labelFieldName='Contact Number'
                    isRequiredField={true}
                    disabled={disabled ? disabled : formSubmitLoader}
                    value={formateAndVerifyPhoneNumber(
                      formData?.personal_contact_info?.mobile_number,
                      formData?.personal_contact_info?.country_info
                        ? JSON.parse(
                            formData?.personal_contact_info
                              ?.country_info as string
                          )?.country_code
                        : 'IN'
                    )}
                    onChange={(e) =>
                      handelInputFieldChange(
                        e,
                        'mobile_number',
                        'personal_contact_info'
                      )
                    }
                    showError={showEmptyFieldError}
                    errorMessage={
                      formData?.personal_contact_info?.mobile_number
                        ? ''
                        : 'this field is required'
                    }
                    dropDownSelectedValue={
                      formData?.personal_contact_info?.country_info
                        ? JSON.parse(
                            formData?.personal_contact_info
                              ?.country_info as string
                          )?.country_number_code
                        : '+91'
                    }
                    setDropDownSelectedValue={(data) =>
                      handelSearchDropSelectValue(
                        data as string,
                        'country_info',
                        'personal_contact_info'
                      )
                    }
                    countryDropDownPosition='top'
                    countryOptionsData={countryOptionsDataArray}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full'>
            <h2 className='font-inter text-base text-black font-medium pt-7 pb-3 border-b border-b-black/30'>
              Emergency Contact Information
            </h2>
            <div className='flex w-full gap-2 items-center pb-2 pt-6'>
              <div className='grid grid-cols-2 w-full gap-2.5'>
                <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                  <span className='flex gap-1'>
                    <span>Emergency Contact Name</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </p>
                <p className='text-sm font-inter font-normal text-black/65 inline-block'>
                  <span className='flex gap-1'>
                    <span>Emergency Contact Number</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </p>
              </div>
              <div className='min-w-[100px]'></div>
            </div>
            <div className='grid grid-cols-1 gap-6'>
              {formData?.personal_contact_info?.emergency_contacts?.map(
                (eachContact, index) => (
                  <div
                    className='w-full flex items-stretch justify-start gap-5'
                    key={eachContact?.contact_id + index}
                  >
                    <div className='w-full grid grid-cols-2 gap-5'>
                      <div className='w-full'>
                        <Input
                          type='text'
                          name='emergency_contact_name'
                          className='border border-black/45'
                          isRequiredField={true}
                          disabled={disabled ? disabled : formSubmitLoader}
                          value={eachContact?.emergency_contact_name}
                          onChange={(e) =>
                            handleEmergencyContactField(
                              index,
                              'emergency_contact_name',
                              'personal_contact_info',
                              'emergency_contacts',
                              undefined,
                              e
                            )
                          }
                          showError={showEmptyFieldError || showError}
                          errorMessage={
                            showError
                              ? ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE
                              : eachContact?.emergency_contact_name
                                ? ''
                                : ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE
                          }
                        />
                      </div>
                      <div className='w-full'>
                        <Input
                          type='number'
                          name='emergency_contact_number'
                          className='border border-black/[.65] text-black rounded-lg rounded-l-none'
                          isRequiredField={true}
                          disabled={disabled ? disabled : formSubmitLoader}
                          value={formateAndVerifyPhoneNumber(
                            eachContact?.emergency_contact_number,
                            eachContact?.emergency_contact_country_info
                              ? JSON.parse(
                                  eachContact?.emergency_contact_country_info as string
                                )?.country_code
                              : 'IN'
                          )}
                          onChange={(e) =>
                            handleEmergencyContactField(
                              index,
                              'emergency_contact_number',
                              'personal_contact_info',
                              'emergency_contacts',
                              undefined,
                              e
                            )
                          }
                          showError={showEmptyFieldError || showError}
                          errorMessage={
                            showError
                              ? ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE
                              : eachContact?.emergency_contact_number
                                ? ''
                                : ERROR_MESSAGES.REQUIRED_FIELD_MESSAGE
                          }
                          dropDownSelectedValue={
                            eachContact?.emergency_contact_country_info
                              ? JSON.parse(
                                  eachContact?.emergency_contact_country_info as string
                                )?.country_number_code
                              : '+91'
                          }
                          setDropDownSelectedValue={(data) =>
                            handleEmergencyContactCountryInfo(
                              data as string,
                              index
                            )
                          }
                          countryDropDownPosition='top'
                          countryOptionsData={countryOptionsDataArray}
                        />
                      </div>
                    </div>
                    <div className='min-w-[100px] grid grid-cols-2 gap-2.5 max-h-[41px]'>
                      {index ==
                        formData.personal_contact_info?.emergency_contacts
                          .length -
                          1 && (
                        <Button
                          type='button'
                          className='bg-green-100 h-full w-full rounded-[4px] flex items-center justify-center border border-green-600 text-black text-xl'
                          onClick={handelAddNewContact}
                          disabled={disabled}
                        >
                          <MdModeEditOutline />
                        </Button>
                      )}
                      {formData.personal_contact_info?.emergency_contacts
                        .length > 1 && (
                        <Button
                          type='button'
                          className='bg-rose-100 h-full w-full rounded-[4px] flex items-center justify-center border border-rose-500 text-black text-xl'
                          onClick={() => removeContactInfo(index)}
                          disabled={disabled}
                        >
                          <MdDelete />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default EmployeePersonalContactInformation;
