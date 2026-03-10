import React, { useEffect, useRef, useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';
import { FiFileText, FiUser, FiUsers } from 'react-icons/fi';
import { IoCloseOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { MdOutlineCalendarMonth, MdOutlineDescription } from 'react-icons/md';

import Button from '../../common/Button';
import Input from '../../common/Input';
import Loader from '../../common/Loader';
import MultiSelectSearchDrop from '../../common/MultiSelectSearchDrop';
import SearchDrop from '../../common/SearchDrop';
import TextArea from '../../common/TextArea';
import {
  GENDER_ARRAY,
  initialLeavePolicy,
  MARITAL_STATUS,
  MONTH_INDEX,
  ORG_EMPLOYEE_STATUS_ARRAY,
  QUARTER_REFILE_MONTHS,
} from '../../constant/constant';
import { compareTwoNestedObject } from '../../Helper/HelperFunctions';
import { AddEditLeavesTypePropsInterface } from '../../interface/interface';
import { AddEditLeavesTypesInterface } from '../../interface/OrganizationSettings';

function AddEditLeavesTypesModal({
  showModal,
  loading,
  modalType,
  editLeaveData,
  setShowModal,
  onSave,
}: AddEditLeavesTypePropsInterface) {
  const modalBoxRef = useRef(null);
  const [formData, setFormData] =
    useState<AddEditLeavesTypesInterface>(initialLeavePolicy);
  const [dummyFormData, setDummyFormData] =
    useState<AddEditLeavesTypesInterface>(initialLeavePolicy);
  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  function getAllowedRefileMonths() {
    const currentIndex = new Date().getMonth(); // 0–11

    if (currentIndex > MONTH_INDEX.October) {
      return QUARTER_REFILE_MONTHS;
    }

    return QUARTER_REFILE_MONTHS.filter(
      (month) => MONTH_INDEX[month] > currentIndex
    );
  }

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectValButton = (data: string | object) => {
    if (typeof data === 'string') {
      setFormData((pervData) => ({
        ...pervData,
        refill_from: data as 'January' | 'April' | 'July' | 'October',
      }));
    }
  };

  const handelClickMultiSelect = (
    data: string | object,
    index: number | undefined,
    name: 'gender' | 'employee_status' | 'marital_status'
  ) => {
    if (index !== undefined && index >= 0) {
      setFormData((prvData) => ({
        ...prvData,
        [name]: prvData[name].filter((_, i) => i !== index),
      }));
    } else {
      if (typeof data === 'string') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: [data, ...prevData[name]],
        }));
      }
    }
  };

  const toggleSwitchHandler = (
    name: 'refill_quarterly' | 'status' | 'is_paid'
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: !prevData[name],
    }));
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData(initialLeavePolicy);
  };

  const handleSave = () => {
    if (
      formData?.leave_name?.trim() === '' ||
      formData?.leave_code?.trim() === '' ||
      formData?.max_number_of_leave === 0 ||
      formData?.gender?.length === 0 ||
      formData?.marital_status?.length === 0 ||
      formData?.employee_status?.length === 0
    ) {
      setShowError(true);
      return;
    }
    if (formData?.refill_quarterly && formData?.refill_from?.trim() === '') {
      setShowError(true);
      return;
    }

    setShowError(false);
    onSave(formData, () => {
      setFormData(initialLeavePolicy);
    });
  };

  useEffect(() => {
    if (editLeaveData) {
      setFormData(editLeaveData);
      setDummyFormData(editLeaveData);
    }
  }, [editLeaveData]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [showModal]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white w-full max-w-[650px] h-full shadow-2xl transform transition-all duration-300 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={modalBoxRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800'>Add Leave Type</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Configure new leave policy for your organization
            </p>
          </div>
          <Button
            type='button'
            onClick={handleClose}
            className='p-2 hover:bg-gray-200 rounded-lg transition-colors'
          >
            <IoCloseOutline className='text-2xl text-gray-600' />
          </Button>
        </div>

        {/* Body */}
        <div className='overflow-y-auto h-[calc(100vh-180px)] px-6 py-6 hide-scrollbar'>
          <div className='space-y-6'>
            {/* Basic Information Section */}
            <div className='bg-gradient-to-br from-blue-50/20 to-indigo-50/20 rounded-xl p-5 border border-blue-100/50'>
              <div className='flex items-center gap-2 mb-6'>
                <FiFileText className='text-blue-600 text-xl' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  Basic Information
                </h3>
              </div>
              <div className='space-y-6'>
                <div className='w-full'>
                  <Input
                    name='leave_name'
                    type='text'
                    labelFieldName='Leave Name'
                    placeHolder='e.g., Annual Leave'
                    isRequiredField={true}
                    onChange={handleOnChange}
                    value={formData.leave_name}
                    className='border border-black/45'
                    showError={showError}
                    disabled={loading}
                    errorMessage={
                      showError && formData?.leave_name?.trim() === ''
                        ? 'This is an Required Field'
                        : ''
                    }
                  />
                </div>

                <div className='w-full flex flex-col items-start justify-start gap-5'>
                  <div className='w-full'>
                    <div className='flex items-center justify-center gap-10'>
                      <label
                        htmlFor=''
                        className='text-sm font-inter font-normal text-black/65 flex items-center justify-start gap-2 w-fit text-nowrap'
                      >
                        <span className='flex gap-1'>
                          <span>Leave Code</span>
                          <FaStarOfLife className='w-1.5 text-red-700' />
                        </span>
                      </label>
                      <div className='grow'>
                        <Input
                          name='leave_code'
                          type='text'
                          placeHolder='e.g., AL'
                          isRequiredField={true}
                          onChange={handleOnChange}
                          value={formData.leave_code}
                          className='border border-black/45 grow'
                          showError={showError}
                          disabled={loading}
                          errorMessage={
                            showError && formData?.leave_code?.trim() === ''
                              ? 'This is an Required Field'
                              : ''
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className='w-full'>
                    <div className='flex items-center justify-center gap-11'>
                      <label
                        htmlFor=''
                        className='text-sm font-inter font-normal text-black/65 flex items-center justify-start gap-2 w-fit text-nowrap'
                      >
                        <span className='flex gap-1'>
                          <span>Total Leave</span>
                          <FaStarOfLife className='w-1.5 text-red-700' />
                        </span>
                      </label>
                      <div className='grow'>
                        <Input
                          name='max_number_of_leave'
                          type='number'
                          placeHolder='e.g., 12'
                          isRequiredField={true}
                          onChange={handleOnChange}
                          value={String(formData.max_number_of_leave)}
                          className='border border-black/45'
                          showError={showError}
                          disabled={loading}
                          errorMessage={
                            showError && formData?.max_number_of_leave == 0
                              ? 'Please Enter Valid Number Of Leave'
                              : ''
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='w-full'>
                  <TextArea
                    name='description'
                    labelFieldName='Leave Description'
                    onChange={handleOnChange}
                    value={formData.description}
                    className='border border-black/45'
                  />
                </div>
              </div>
            </div>

            {/* Eligibility Criteria Section */}
            <div className='bg-gradient-to-br from-purple-50/20 to-pink-50/20 rounded-xl p-5 border border-purple-100/50'>
              <div className='flex items-center gap-2 mb-6'>
                <FiUsers className='text-purple-600 text-xl' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  Eligibility Criteria
                </h3>
              </div>
              <div className='space-y-6'>
                <MultiSelectSearchDrop
                  emptyDataMessage=''
                  position='bottom'
                  searchKey=''
                  options={GENDER_ARRAY}
                  labelFieldName='Gender'
                  isRequiredField={true}
                  selectedValue={formData.gender}
                  disabled={loading}
                  onSelectValBtn={(data, index) =>
                    handelClickMultiSelect(data, index, 'gender')
                  }
                  showError={showError}
                  errorMessage={
                    showError && formData?.gender?.length === 0
                      ? 'This is an required filed'
                      : ''
                  }
                />

                <MultiSelectSearchDrop
                  emptyDataMessage=''
                  position='bottom'
                  searchKey=''
                  options={ORG_EMPLOYEE_STATUS_ARRAY}
                  labelFieldName='Employee Status'
                  isRequiredField={true}
                  selectedValue={formData.employee_status}
                  disabled={loading}
                  onSelectValBtn={(data, index) =>
                    handelClickMultiSelect(data, index, 'employee_status')
                  }
                  showError={showError}
                  errorMessage={
                    showError && formData?.employee_status?.length === 0
                      ? 'This is an required filed'
                      : ''
                  }
                />

                <MultiSelectSearchDrop
                  emptyDataMessage=''
                  position='bottom'
                  searchKey=''
                  options={MARITAL_STATUS}
                  labelFieldName='Marital Status'
                  isRequiredField={true}
                  selectedValue={formData.marital_status}
                  disabled={loading}
                  onSelectValBtn={(data, index) =>
                    handelClickMultiSelect(data, index, 'marital_status')
                  }
                  showError={showError}
                  errorMessage={
                    showError && formData?.marital_status?.length === 0
                      ? 'This is an required filed'
                      : ''
                  }
                />
              </div>
            </div>

            {/* Refill Settings Section */}
            <div className='bg-gradient-to-br from-green-50/20 to-emerald-50/20 rounded-xl p-5 border border-green-100/50'>
              <div className='flex items-center gap-2 mb-6'>
                <MdOutlineCalendarMonth className='text-green-600 text-xl' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  Refill Settings
                </h3>
              </div>
              <div className='space-y-6'>
                <div className='bg-white rounded-lg p-4 border border-green-200'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-lg ${formData.refill_quarterly ? 'bg-green-100' : 'bg-gray-100'}`}
                      >
                        <MdOutlineCalendarMonth
                          className={`text-xl ${formData.refill_quarterly ? 'text-green-600' : 'text-gray-400'}`}
                        />
                      </div>
                      <div>
                        <p className='font-medium text-gray-800'>
                          Quarterly Refill
                        </p>
                        <p className='text-xs text-gray-500'>
                          Enable quarterly leave refills
                        </p>
                      </div>
                    </div>
                    <Button
                      type='button'
                      className={`w-12 h-[22px] rounded-full relative transition-all duration-200 ${formData.refill_quarterly ? 'bg-green-500' : 'bg-red-500'}`}
                      onClick={() => toggleSwitchHandler('refill_quarterly')}
                      disabled={loading || modalType === 'edit'}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.refill_quarterly ? 'left-7' : 'left-1'}`}
                      ></span>
                    </Button>
                  </div>
                </div>

                <SearchDrop
                  emptyDataMessage=''
                  position='bottom'
                  searchKey=''
                  options={getAllowedRefileMonths()}
                  labelFieldName='Refill Start From'
                  isRequiredField={formData.refill_quarterly}
                  selectedValue={formData.refill_from}
                  onSelectValBtn={handleSelectValButton}
                  disabled={
                    !formData.refill_quarterly ||
                    loading ||
                    modalType === 'edit'
                  }
                  showError={showError && formData.refill_quarterly}
                  errorMessage={
                    showError &&
                    formData?.refill_quarterly &&
                    formData?.refill_from?.trim() === ''
                      ? 'This is an required field'
                      : ''
                  }
                />

                {formData?.refill_quarterly && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3'>
                    <IoInformationCircleOutline className='text-blue-600 text-xl flex-shrink-0 mt-0.5' />
                    <p className='text-sm text-blue-700'>
                      Leaves will be refilled quarterly starting from{' '}
                      {formData.refill_from || 'selected month'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className='bg-gradient-to-br from-orange-50/20 to-yellow-50/20 rounded-xl p-5 border border-orange-100/50'>
              <div className='flex items-center gap-2 mb-4'>
                <FiUser className='text-orange-600 text-xl' />
                <h3 className='text-lg font-semibold text-gray-800'>
                  Leave Configuration
                </h3>
              </div>
              <div className='space-y-3'>
                <div className='bg-white rounded-lg p-4 border border-orange-200'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-lg ${formData.is_paid ? 'bg-green-100' : 'bg-red-100'}`}
                      >
                        <MdOutlineDescription
                          className={`text-xl ${formData.is_paid ? 'text-green-600' : 'text-red-600'}`}
                        />
                      </div>
                      <div>
                        <p className='font-medium text-gray-800'>Leave Type</p>
                        <p
                          className={`text-sm font-semibold ${formData.is_paid ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {formData.is_paid ? 'Paid Leave' : 'Unpaid Leave'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type='button'
                      className={`w-12 h-[22px] rounded-full relative transition-all duration-200 ${formData.is_paid ? 'bg-green-500' : 'bg-red-500'}`}
                      onClick={() => toggleSwitchHandler('is_paid')}
                      disabled={loading}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.is_paid ? 'left-7' : 'left-1'}`}
                      ></span>
                    </Button>
                  </div>
                </div>
                <div className='bg-white rounded-lg p-4 border border-orange-200'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`p-2 rounded-lg ${formData.status ? 'bg-green-100' : 'bg-red-100'}`}
                      >
                        <FiUser
                          className={`text-xl ${formData.status ? 'text-green-600' : 'text-red-600'}`}
                        />
                      </div>
                      <div>
                        <p className='font-medium text-gray-800'>
                          Leave Type Status
                        </p>
                        <p
                          className={`text-sm font-semibold ${formData.status ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {formData.status ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <Button
                      type='button'
                      className={`w-12 h-[22px] rounded-full relative transition-all duration-200 ${formData.status ? 'bg-green-500' : 'bg-red-500'}`}
                      onClick={() => toggleSwitchHandler('status')}
                      disabled={loading}
                    >
                      <span
                        className={`w-4 h-4 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${formData.status ? 'left-7' : 'left-1'}`}
                      ></span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-gray-200 bg-white'>
          <div className='grid grid-cols-2 gap-3'>
            <Button
              type='button'
              onClick={handleClose}
              className='px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors'
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleSave}
              className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
              disabled={
                Boolean(
                  formData?.leave_name?.trim() === '' ||
                  formData?.leave_code?.trim() === '' ||
                  formData?.max_number_of_leave === 0 ||
                  formData?.gender?.length === 0 ||
                  formData?.marital_status?.length === 0 ||
                  formData?.employee_status?.length === 0
                ) ||
                loading ||
                compareTwoNestedObject(formData, dummyFormData)
              }
            >
              {loading ? (
                <Loader loaderText={'Saving Leave Type...'} />
              ) : (
                <span>Save Leave Type</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditLeavesTypesModal;
