/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { MdOutlineFileUpload } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import CommonDatePicker from '../../common/CommonDatePicker';
import DragAndDropFileUploader from '../../common/DragDropUploader/DragAndDropFileUploader';
import Input from '../../common/Input';
import SearchDrop from '../../common/SearchDrop';
import TextArea from '../../common/TextArea';
import {
  bloodGroupArray,
  GenderArray,
  OrganizationEmployeeStatusArray,
} from '../../constant/constant';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { AddEditUserProfileInterFace } from '../../interface/AddEditUserProfileInterFace';

type ErrorModuleType =
  | ''
  | 'personal_info'
  | 'employee_info'
  | 'contact_info'
  | 'about_info'
  | 'organization_settings'
  | 'employee_profile_info';

const initialState: AddEditUserProfileInterFace = {
  PersonalInfo: {
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    profile_picture: '',
    gender: '',
    date_of_birth: null, // or new Date() if you want to initialize with current date
    blood_group: '',
    about: '',
  },
  EmployeeInfo: {
    status: '',
    organization_name: '',
    department: '',
    designation: '',
    reporting_to: { id: '', name: '' },
    employee_role: { role_id: '', role_name: '' },
    employee_email: '',
    employee_code: '',
  },
};

export default function AddEditEmployeeProfile() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { organization } = useParams();

  const [showErrorObj, setShowErrorObj] = useState<{
    errorModule: ErrorModuleType;
    showError: boolean;
  }>({ errorModule: '', showError: false });
  const [formData, setFormData] =
    useState<AddEditUserProfileInterFace>(initialState);

  // The Function That Handel The Profile Photo Uploading
  const handelProfileUploadation = (url: string) => {
    setFormData((pervValue) => ({
      ...pervValue,
      PersonalInfo: {
        ...pervValue.PersonalInfo,
        profile_picture: url,
      },
    }));
  };

  // The Comman Function To Single Handedly Handel The Selected Drop Down Value
  const handelSearchDropSelectValue = (
    data: string | object,
    name: string,
    sectionName: 'PersonalInfo' | 'EmployeeInfo'
  ) => {
    setFormData((pervData) => ({
      ...pervData,
      [sectionName]: {
        ...pervData[sectionName],
        [name]: typeof data === 'object' ? JSON.stringify(data) : data,
      },
    }));
  };

  // The Function To Handel The Change In The Date
  const handelDateOfBirthPickUpChangeFunction = (date: Date | null) => {
    setFormData((pervValue) => ({
      ...pervValue,
      PersonalInfo: {
        ...pervValue.PersonalInfo,
        date_of_birth: date,
      },
    }));
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const keys = name.split('.');

    let filteredValue = value;

    if (name == 'EmployeeInfo.employee_code') {
      const codePrefix =
        formData?.EmployeeInfo?.status.toLocaleLowerCase() == 'intern'
          ? GlobalStateProvider?.organization?.organization_settings
              ?.intern_code_prefix
          : GlobalStateProvider?.organization?.organization_settings
              ?.employee_code_prefix;
      filteredValue = codePrefix + '-' + value.replace(/\D/g, '');
    }
    if (name == 'EmployeeInfo.employee_email') {
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

    console.log(formData);
  };

  useEffect(() => {
    if (organization) {
      setFormData((pervValue) => ({
        ...pervValue,
        EmployeeInfo: {
          ...pervValue.EmployeeInfo,
          organization_name: organization,
        },
      }));
    }
  }, [organization]);

  useEffect(() => {
    setFormData((pervValue) => ({
      ...pervValue,
      PersonalInfo: {
        ...pervValue.PersonalInfo,
        full_name:
          formData?.PersonalInfo?.first_name +
          ' ' +
          formData?.PersonalInfo?.middle_name +
          ' ' +
          formData?.PersonalInfo?.last_name,
      },
    }));
  }, [
    formData?.PersonalInfo?.first_name,
    formData?.PersonalInfo?.last_name,
    formData?.PersonalInfo?.middle_name,
  ]);

  return (
    <>
      <div className='w-full h-full relative'>
        <div className='h-[calc(100vh-135px)] overflow-auto px-6'>
          <div className='w-full pt-6'>
            <div className='flex items-start justify-start'>
              <div className='w-[30%]'>
                <div className='flex items-start flex-col justify-start gap-4 pr-5 pt-6'>
                  <h2 className='font-inter text-xl text-black font-semibold'>
                    Personal Information
                  </h2>
                  <p className='font-inter text-base text-black font-light'>
                    Please provide your basic personal details. This information
                    will help us get to know you better and ensure your profile
                    is complete.
                  </p>
                </div>
              </div>
              <div className='w-[70%] flex-grow'>
                <div className='bg-white p-6 rounded-xl max-w-[95%] ml-auto'>
                  <div className='grid grid-cols-1 gap-6'>
                    {formData?.PersonalInfo?.profile_picture?.trim() == '' ? (
                      <div className='w-full'>
                        <DragAndDropFileUploader
                          name='general_info.organization_profile_picture'
                          type='file'
                          RequiredFileTypeArray={[
                            'image/png',
                            'image/jpeg',
                            'image/webp',
                          ]}
                          showDropFileScreenInFullScreen={true}
                          cropShape='round'
                          maxCropHeight={400}
                          maxCropWidth={400}
                          setImageUrl={handelProfileUploadation}
                        />
                      </div>
                    ) : (
                      <div className='w-full pb-2'>
                        <div className='flex items-center justify-start gap-10'>
                          <div
                            className='image w-[180px] h-[180px] aspect-square rounded-full overflow-hidden border
                            border-black/20'
                          >
                            <img
                              src={formData?.PersonalInfo?.profile_picture}
                              alt='organization profile picture'
                              width={150}
                              height={150}
                              loading='lazy'
                              className='w-full h-full object-center rounded-full bg-cover'
                            />
                          </div>
                          <div className='flex items-center justify-start gap-4'>
                            <button
                              className='text-black bg-black/10 hover:bg-black/15 transition-all p-2.5 rounded-lg'
                              onClick={() => handelProfileUploadation('')}
                            >
                              <MdOutlineFileUpload className='w-6 h-6' />
                            </button>
                            <button
                              className='text-black bg-black/10 hover:bg-black/15 transition-all p-2.5 rounded-lg'
                              onClick={() => handelProfileUploadation('')}
                            >
                              <IoCloseSharp className='w-6 h-6' />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className='w-full'>
                      <Input
                        type='text'
                        name='PersonalInfo.full_name'
                        labelFieldName='Full Name'
                        className='border border-black/45'
                        isRequiredField={true}
                        value={formData.PersonalInfo.full_name}
                        onChange={handleOnChange}
                        disabled={true}
                        showError={
                          showErrorObj?.errorModule == 'personal_info' &&
                          showErrorObj?.showError
                        }
                        errorMessage={
                          formData?.PersonalInfo?.full_name
                            ? ''
                            : 'this field is required'
                        }
                      />
                    </div>
                    <div className='w-full'>
                      <div className='w-full grid grid-cols-3 gap-5'>
                        <div className='w-full'>
                          <Input
                            type='text'
                            name='PersonalInfo.first_name'
                            labelFieldName='First Name'
                            className='border border-black/45'
                            isRequiredField={true}
                            value={formData.PersonalInfo.first_name}
                            onChange={handleOnChange}
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.first_name
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <Input
                            type='text'
                            name='PersonalInfo.middle_name'
                            labelFieldName='Middle Name'
                            className='border border-black/45'
                            isRequiredField={false}
                            value={formData.PersonalInfo.middle_name}
                            onChange={handleOnChange}
                          />
                        </div>
                        <div className='w-full'>
                          <Input
                            type='text'
                            name='PersonalInfo.last_name'
                            labelFieldName='Last Name'
                            className='border border-black/45'
                            isRequiredField={true}
                            value={formData.PersonalInfo.last_name}
                            onChange={handleOnChange}
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.last_name
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <div className='w-full grid grid-cols-3 gap-5'>
                        <div className='w-full'>
                          <SearchDrop
                            options={GenderArray}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage=''
                            showSearchBar={false}
                            labelFieldName='Gender'
                            isRequiredField={true}
                            selectedValue={formData?.PersonalInfo?.gender}
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'gender',
                                'PersonalInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.gender
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <CommonDatePicker
                            onChange={handelDateOfBirthPickUpChangeFunction}
                            selectedValue={
                              formData?.PersonalInfo?.date_of_birth as Date
                            }
                            name='date_of_birth'
                            labelFieldName='Date Of Birth'
                            isRequiredField={true}
                            datePickerPosition={'left-start'}
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.date_of_birth
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <SearchDrop
                            options={bloodGroupArray}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage=''
                            showSearchBar={true}
                            labelFieldName='Blood Group'
                            isRequiredField={true}
                            selectedValue={formData?.PersonalInfo?.blood_group}
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'blood_group',
                                'PersonalInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.blood_group
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <TextArea
                        name='PersonalInfo.about'
                        rows={4}
                        value={formData?.PersonalInfo?.about}
                        onChange={handleOnChange}
                        isRequiredField={true}
                        labelFieldName='Address'
                        showError={
                          showErrorObj.showError ||
                          showErrorObj.errorModule === 'personal_info'
                        }
                        errorMessage={
                          formData?.PersonalInfo?.about.trim()
                            ? ''
                            : 'this field is required'
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full pt-6'>
            <div className='flex items-start justify-start'>
              <div className='w-[30%]'>
                <div className='flex items-start flex-col justify-start gap-4 pr-5 pt-6'>
                  <h2 className='font-inter text-xl text-black font-semibold'>
                    Employee Information
                  </h2>
                  <p className='font-inter text-base text-black font-light'>
                    Enter key employment details to help us manage records
                    accurately and maintain a complete employee profile.
                  </p>
                </div>
              </div>
              <div className='w-[70%] flex-grow'>
                <div className='bg-white p-6 rounded-xl max-w-[95%] ml-auto'>
                  <div className='grid grid-cols-1 gap-6'>
                    <div className='w-full'>
                      <div className='w-full grid grid-cols-3 gap-5'>
                        <div className='w-full'>
                          <SearchDrop
                            options={OrganizationEmployeeStatusArray}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage='No Status Found'
                            showSearchBar={true}
                            labelFieldName='Status'
                            isRequiredField={true}
                            selectedValue={formData?.EmployeeInfo?.status}
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'status',
                                'EmployeeInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.gender
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <Input
                            type='text'
                            name='EmployeeInfo.organization_name'
                            labelFieldName='Organization Name'
                            className='border border-black/45'
                            isRequiredField={true}
                            disabled
                            value={formData.EmployeeInfo?.organization_name}
                            onChange={handleOnChange}
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.EmployeeInfo?.organization_name
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <SearchDrop
                            options={[]}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage='No Department Found'
                            showSearchBar={true}
                            labelFieldName='Department'
                            isRequiredField={true}
                            selectedValue={formData?.EmployeeInfo?.department}
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'department',
                                'EmployeeInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.EmployeeInfo?.department
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <div className='w-full grid grid-cols-3 gap-5'>
                        <div className='w-full'>
                          <SearchDrop
                            options={[]}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage='No Designation Found'
                            showSearchBar={true}
                            labelFieldName='Designation'
                            isRequiredField={true}
                            selectedValue={formData?.EmployeeInfo?.designation}
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'designation',
                                'EmployeeInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.EmployeeInfo?.designation
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <SearchDrop
                            options={[]}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage='No Reporting Manager Found'
                            showSearchBar={true}
                            labelFieldName='Reporting To'
                            isRequiredField={true}
                            selectedValue={
                              formData?.EmployeeInfo?.reporting_to?.name
                            }
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'reporting_to',
                                'EmployeeInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'personal_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.blood_group
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                        <div className='w-full'>
                          <SearchDrop
                            options={[]}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage='No Role Found'
                            showSearchBar={true}
                            labelFieldName='Employee Role'
                            isRequiredField={true}
                            selectedValue={
                              formData?.EmployeeInfo?.employee_role?.role_name
                            }
                            onSelectValBtn={(data: string | object) =>
                              handelSearchDropSelectValue(
                                data,
                                'employee_role',
                                'EmployeeInfo'
                              )
                            }
                            showError={
                              showErrorObj?.errorModule == 'employee_info' &&
                              showErrorObj?.showError
                            }
                            errorMessage={
                              formData?.PersonalInfo?.blood_group
                                ? ''
                                : 'this field is required'
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='w-full'>
                      <div className='grid grid-cols-2 gap-5'>
                        <div className='w-full'>
                          <label
                            htmlFor=''
                            className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
                          >
                            <span className='flex gap-1'>
                              <span>Employee Code</span>
                              <FaStarOfLife className='w-1.5 text-red-700' />
                            </span>
                          </label>
                          <div className='relative w-full flex items-stretch justify-start'>
                            <div className='flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-3 whitespace-nowrap'>
                              {formData?.EmployeeInfo?.status.toLocaleLowerCase() ==
                              'intern'
                                ? GlobalStateProvider?.organization
                                    ?.organization_settings?.intern_code_prefix
                                : GlobalStateProvider?.organization
                                    ?.organization_settings
                                    ?.employee_code_prefix}
                            </div>
                            <Input
                              name='EmployeeInfo.employee_code'
                              className='border border-black/[.65] border-l-0 rounded-l-none text-black w-full'
                              type='number'
                              value={formData?.EmployeeInfo?.employee_code
                                ?.split('-')
                                .pop()}
                              onChange={handleOnChange}
                            />
                          </div>
                          {showErrorObj?.errorModule == 'employee_info' &&
                            showErrorObj?.showError && (
                              <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                                This field is required.
                              </span>
                            )}
                        </div>
                        <div className='w-full'>
                          <label
                            htmlFor=''
                            className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
                          >
                            <span className='flex gap-1'>
                              <span>Employee Code</span>
                              <FaStarOfLife className='w-1.5 text-red-700' />
                            </span>
                          </label>
                          <div className='relative w-full flex items-stretch justify-start'>
                            <Input
                              name='EmployeeInfo.employee_email'
                              className='border border-black/[.65] border-r-0 rounded-r-none text-black w-full'
                              type='text'
                              value={
                                formData?.EmployeeInfo?.employee_email?.split(
                                  '@'
                                )[0]
                              }
                              onChange={handleOnChange}
                            />
                            <div className='flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-r-lg text-[14px] px-3 whitespace-nowrap'>
                              @
                              {
                                GlobalStateProvider?.organization?.general_info?.primary_email?.split(
                                  '@'
                                )[1]
                              }
                            </div>
                          </div>
                          {showErrorObj?.errorModule == 'employee_info' &&
                            showErrorObj?.showError && (
                              <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                                This field is required.
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full bg-white px-4 py-3 mt-2 flex items-center justify-between'>
          <div className='w-fit'>
            <p className='font-inter text-xl font-medium capitalize text-black whitespace-nowrap'>
              Editing profile details -{' '}
              <span className='font-semibold text-[var(--them-orange-color)]'>
                {formData?.PersonalInfo?.full_name}
              </span>
            </p>
          </div>
          <div className='flex items-center gap-4 w-full justify-end'>
            <button className='text-[var(--them-green-color)] py-2.5 px-14 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 transition-all w-fit'>
              Cancel
            </button>
            <button className='text-white bg-[var(--them-green-color)] hover:bg-[var(--them-green-light-color)] w-fit py-2.5 px-14 rounded-lg font-inter text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed'>
              <span>Update</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
