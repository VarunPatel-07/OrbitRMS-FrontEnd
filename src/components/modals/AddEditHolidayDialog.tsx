import React, { useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';

import { AddEditHolidayDialogInterface } from '@/interface/ComponentProps.interface';

import Button from '@/components/common/Button';
import CommonDatePicker from '@/components/common/CommonDatePicker';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import { compareTwoNestedObject } from '@/utils/helpers/commonHelpers';

import DialogModalContainer from '../common/DialogModalContainer';

function AddEditHolidayDialog({
  formData,
  setFormData,
  modalTitle,
  loading,
  showModal,
  setShowModal,
  handelFormSubmitFunction,
  modalType,
  year,
  dummyFormData,
}: AddEditHolidayDialogInterface) {
  const [showError, setShowError] = useState<boolean>(false);

  const handelSubmitButton = async () => {
    if (
      formData?.holiday_name?.trim() == '' &&
      formData?.date == null &&
      formData?.year
    ) {
      setShowError(true);
      return;
    }
    handelFormSubmitFunction(formData);
    setShowError(false);
  };

  const handelKeyPress = (e: React.KeyboardEvent) => {
    if (!showModal) return;

    if (e.key === 'Enter') {
      handelSubmitButton();
    }
  };

  const handelCancelButton = () => {
    setShowModal(false);
    setShowError(false);
    setFormData({
      date: null,
      holiday_name: '',
      year: new Date()?.getFullYear(),
    });
  };
  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((pervValue) => ({
      ...pervValue,
      holiday_name: e.target.value,
    }));
  };

  const handleDatePickerOnChangeFunction = (date: Date | null) => {
    if (date) {
      const year = new Date(date)?.getFullYear();
      setFormData((perValue) => ({
        ...perValue,
        date: date,
        year: year,
      }));
    }
  };

  return (
    <DialogModalContainer
      show={showModal}
      onClose={handelCancelButton}
      className='rounded-lg overflow-hidden'
      maxWidth='600px'
      loading={loading}
      modalTitle={modalTitle}
    >
      <div className='w-full'>
        <div
          className='px-5 py-8 mx-auto flex flex-col items-start justify-start w-full gap-5'
          onKeyDown={handelKeyPress}
        >
          <div className='w-full'>
            <Input
              name='holiday_name'
              type='text'
              labelFieldName='Holiday Name'
              className='border border-black/45'
              isRequiredField={true}
              value={formData.holiday_name}
              onChange={handelOnChange}
              showError={showError}
              disabled={loading}
              errorMessage={
                showError
                  ? formData.holiday_name?.trim() == ''
                    ? 'this is an required field'
                    : ''
                  : ''
              }
            />
          </div>
          <div className='w-full'>
            <CommonDatePicker
              onChange={handleDatePickerOnChangeFunction}
              selectedValue={formData?.date ? new Date(formData?.date) : null}
              name='date'
              labelFieldName='Date'
              isRequiredField={true}
              showError={showError}
              errorMessage={formData?.date ? '' : 'this field is required'}
              datePickerPosition='top'
              year={year}
              disabled={loading}
            />
          </div>
          <div className='w-full'>
            <span className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'>
              <span className='flex gap-1'>
                <span>Year</span>
                <FaStarOfLife className='w-1.5 text-red-700' />
              </span>
            </span>
            <p className='inline-block bg-[#7fab98]/15 rounded-lg border border-[#7fab98] w-full text-black font-inter text-base px-4 py-[7px]'>
              {formData?.year}
            </p>
          </div>
        </div>
        <div className='px-5 pb-6 w-full grid grid-cols-2 gap-2.5'>
          <Button
            type='button'
            className='text-black bg-transparent py-2 rounded-lg border border-black/45 hover:bg-gray-800/5'
            onClick={handelCancelButton}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
            disabled={
              loading || compareTwoNestedObject(formData, dummyFormData)
            }
            onClick={handelSubmitButton}
          >
            {loading ? (
              <Loader
                loaderText={modalType == 'add' ? 'Adding...' : 'Updating...'}
              />
            ) : modalType == 'add' ? (
              <span>Add</span>
            ) : (
              <span>Update</span>
            )}
          </Button>
        </div>
      </div>
    </DialogModalContainer>
  );
}

export default AddEditHolidayDialog;
