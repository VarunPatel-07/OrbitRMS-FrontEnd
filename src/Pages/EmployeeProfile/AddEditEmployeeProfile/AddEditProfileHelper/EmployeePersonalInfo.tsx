import React, { useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { MdOutlineFileUpload } from 'react-icons/md';

import Button from '../../../../common/Button';
import CommonDatePicker from '../../../../common/CommonDatePicker';
import DragAndDropFileUploader from '../../../../common/DragDropUploader/SingleFileUploader/DragAndDropFileUploader';
import Input from '../../../../common/Input';
import SearchDrop from '../../../../common/SearchDrop';
import TextArea from '../../../../common/TextArea';
import { bloodGroupArray, GenderArray } from '../../../../constant/constant';
import { EmployeePersonalInfoComponentProps } from '../../../../interface/AddEditUserProfileInterFace';

const EmployeePersonalInfo = React.memo(function EmployeePersonalInfo(
  props: EmployeePersonalInfoComponentProps
) {
  const {
    formData,
    setFormData,
    showEmptyFieldError,
    handleOnChange,
    handelSearchDropSelectValue,
    formSubmitLoader,
    disabled,
  } = props;

  const handelProfileUploadation = (url: string) => {
    setFormData((pervValue) => ({
      ...pervValue,
      personal_info: {
        ...pervValue.personal_info,
        profile_picture: url,
      },
    }));
  };

  const handelDateOfBirthPickUpChangeFunction = (date: Date | null) => {
    setFormData((pervValue) => ({
      ...pervValue,
      personal_info: {
        ...pervValue.personal_info,
        date_of_birth: date,
      },
    }));
  };

  useEffect(() => {
    setFormData((pervValue) => ({
      ...pervValue,
      personal_info: {
        ...pervValue.personal_info,
        full_name:
          formData?.personal_info?.first_name +
          ' ' +
          formData?.personal_info?.middle_name +
          ' ' +
          formData?.personal_info?.last_name,
      },
    }));
  }, [
    formData?.personal_info?.first_name,
    formData?.personal_info?.last_name,
    formData?.personal_info?.middle_name,
  ]);

  return (
    <div className='bg-white rounded-xl border border-black/15'>
      <div className='flex items-start flex-col justify-start gap-1 p-6 border-b border-b-black/20'>
        <h2 className='font-inter text-xl text-black font-semibold capitalize'>
          Personal Information
        </h2>
        <p className='font-inter text-sm text-black font-light w-[70%]'>
          Please provide your basic personal details. This information will help
          us get to know you better and ensure your profile is complete.
        </p>
      </div>
      <div className='p-6 w-full'>
        <label
          htmlFor=''
          className='text-sm font-inter font-normal text-black/65 pb-2.5 inline-block'
        >
          <span className='flex gap-1'>
            <span className='font-inter'>Profile Picture (Max: 2MB)</span>
          </span>
        </label>
        <div className='grid grid-cols-1 gap-6'>
          {formData?.personal_info?.profile_picture?.trim() == '' ? (
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
                disabled={disabled}
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
                    src={formData?.personal_info?.profile_picture}
                    alt='organization profile picture'
                    width={150}
                    height={150}
                    loading='lazy'
                    className='w-full h-full object-center rounded-full bg-cover'
                  />
                </div>
                <div className='flex items-center justify-start gap-4'>
                  <Button
                    type='button'
                    className='text-black bg-black/10 enabled:hover:bg-black/15 transition-all p-2.5 rounded-lg'
                    disabled={disabled}
                    onClick={() => handelProfileUploadation('')}
                  >
                    <MdOutlineFileUpload className='w-6 h-6' />
                  </Button>
                  <Button
                    type='button'
                    className='text-black bg-black/10 enabled:hover:bg-black/15 transition-all p-2.5 rounded-lg'
                    disabled={disabled}
                    onClick={() => handelProfileUploadation('')}
                  >
                    <IoCloseSharp className='w-6 h-6' />
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className='w-full'>
            <Input
              type='text'
              name='personal_info.full_name'
              labelFieldName='Full Name'
              className='border border-black/45'
              isRequiredField={true}
              value={formData.personal_info.full_name}
              onChange={handleOnChange}
              disabled={true}
              showError={showEmptyFieldError}
              errorMessage={
                formData?.personal_info?.full_name?.trim()
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
                  name='personal_info.first_name'
                  labelFieldName='First Name'
                  className='border border-black/45'
                  isRequiredField={true}
                  value={formData.personal_info.first_name}
                  onChange={handleOnChange}
                  showError={showEmptyFieldError}
                  disabled={disabled ? disabled : formSubmitLoader}
                  errorMessage={
                    formData?.personal_info?.first_name
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <Input
                  type='text'
                  name='personal_info.middle_name'
                  labelFieldName='Middle Name'
                  className='border border-black/45'
                  isRequiredField={false}
                  value={formData.personal_info.middle_name}
                  onChange={handleOnChange}
                  disabled={disabled ? disabled : formSubmitLoader}
                />
              </div>
              <div className='w-full'>
                <Input
                  type='text'
                  name='personal_info.last_name'
                  labelFieldName='Last Name'
                  className='border border-black/45'
                  isRequiredField={true}
                  value={formData.personal_info.last_name}
                  onChange={handleOnChange}
                  showError={showEmptyFieldError}
                  disabled={disabled ? disabled : formSubmitLoader}
                  errorMessage={
                    formData?.personal_info?.last_name
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
                  disabled={disabled ? disabled : formSubmitLoader}
                  selectedValue={formData?.personal_info?.gender}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(data, 'gender', 'personal_info')
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.personal_info?.gender
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <CommonDatePicker
                  disabled={disabled ? disabled : formSubmitLoader}
                  onChange={handelDateOfBirthPickUpChangeFunction}
                  selectedValue={formData?.personal_info?.date_of_birth as Date}
                  name='date_of_birth'
                  labelFieldName='Date Of Birth'
                  isRequiredField={true}
                  datePickerPosition={'left-start'}
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.personal_info?.date_of_birth
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
              <div className='w-full'>
                <SearchDrop
                  disabled={disabled ? disabled : formSubmitLoader}
                  options={bloodGroupArray}
                  searchKey=''
                  position='bottom'
                  emptyDataMessage=''
                  showSearchBar={true}
                  labelFieldName='Blood Group'
                  isRequiredField={true}
                  selectedValue={formData?.personal_info?.blood_group}
                  onSelectValBtn={(data: string | object) =>
                    handelSearchDropSelectValue(
                      data,
                      'blood_group',
                      'personal_info'
                    )
                  }
                  showError={showEmptyFieldError}
                  errorMessage={
                    formData?.personal_info?.blood_group
                      ? ''
                      : 'this field is required'
                  }
                />
              </div>
            </div>
          </div>
          <div className='w-full'>
            <TextArea
              disabled={disabled ? disabled : formSubmitLoader}
              name='personal_info.about'
              rows={4}
              value={formData?.personal_info?.about}
              onChange={handleOnChange}
              labelFieldName='About'
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default EmployeePersonalInfo;
