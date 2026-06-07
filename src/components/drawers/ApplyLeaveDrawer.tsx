/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';
import { IoClose, IoInformationCircleOutline } from 'react-icons/io5';

import { SelectedFileArrayObjInterface } from '@/interface/Global.interface';
import { LeaveEmployeeData } from '@/interface/LeavesModule.interface';
import {
  ApplyLeaveForm,
  ApplyLeaveModalProps,
} from '@/interface/OrganizationSettings.interface';

import Button from '@/components/common/Button';
import CommonDatePicker from '@/components/common/CommonDatePicker';
import MultipleDragAndDropFileUploader from '@/components/common/dragDropUploader/MultipleFileUploader/MultipleDragDropFileUploader';
import Loader from '@/components/common/Loader';
import SearchDrop from '@/components/common/SearchDrop';
import TextArea from '@/components/common/TextArea';
import {
  CalculateNumberOfDays,
  getMaxEndDate,
} from '@/utils/helpers/commonHelpers';
import { LeavesHalfToggleButton } from '@/utils/helpers/helpers';
import { LeaveFormValidation } from '@/utils/validation/leaves.validation';

import CommonDrawerContainer from '../common/CommonDrawerContainer';
import MultiSelectSearchDrop from '../common/MultiSelectSearchDrop';

const initialForm: ApplyLeaveForm = {
  leave_type: null,
  start_date: null,
  start_half: 'first_half',
  end_date: null,
  end_half: 'second_half',
  current_date: new Date().toISOString(),
  description: '',
  documents: [],
  reporting_to_employee: [],
};

function ApplyLeaveDrawer({
  showModal,
  loading,
  leaveTypes,
  employeesData,
  setShowModal,
  onApply,
}: ApplyLeaveModalProps) {
  const [formData, setFormData] = useState<ApplyLeaveForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRangeChange = (
    date: Date | null,
    name: 'start_date' | 'end_date'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handelClickOnStartEndHalf = (
    name: 'start_half' | 'end_half',
    type: 'first_half' | 'second_half'
  ) => {
    setFormData((prev) => ({ ...prev, [name]: type }));
  };

  const handleSelectLeaveType = (val: string | object) => {
    if (typeof val === 'object' && val !== null) {
      setFormData((prev) => ({ ...prev, leave_type: val as any }));
    }
  };

  const handleSave = () => {
    const { isValid, errors } = LeaveFormValidation({ values: formData });

    if (!isValid) {
      setErrors(errors);
      return;
    } else {
      setErrors(null);
    }

    onApply(formData, () => setFormData(initialForm));
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData(initialForm);
    setErrors(null);
  };

  const handelUploadImage = (data: SelectedFileArrayObjInterface[]) => {
    setFormData((perv) => ({ ...perv, documents: data }));
  };

  const handleSelectValButton = (data: string | object, index?: number) => {
    if (index !== undefined && index >= 0) {
      setFormData((prev) => ({
        ...prev,
        reporting_to_employee: prev.reporting_to_employee.filter(
          (_, i) => i !== index
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        reporting_to_employee: [
          ...prev.reporting_to_employee,
          data as LeaveEmployeeData,
        ],
      }));
    }
  };

  const renderEmployeeProfile = (data: LeaveEmployeeData) => {
    return (
      <div className='flex items-start'>
        <span className='font-inter text-sm text-black font-normal capitalize'>
          {data?.full_name}{' '}
          <span className='text-xs text-blue-600'>({data?.employee_code})</span>
        </span>
      </div>
    );
  };

  return (
    <CommonDrawerContainer
      show={showModal}
      onClose={handleClose}
      closeOnOutsideClick
      direction='RIGHT'
      className='h-full flex flex-col relative'
      maxWidth='550px'
      minWidth='500px'
    >
      <div className='flex justify-between items-center px-8 py-5 border-b border-gray-100'>
        <div>
          <h2 className='text-[1.35rem] font-bold tracking-tight text-gray-900'>
            Apply Leave
          </h2>
          <p className='text-xs text-gray-400 mt-0.5 font-medium'>
            Fill in the details below to submit your request
          </p>
        </div>

        <Button
          type='button'
          onClick={handleClose}
          disabled={loading}
          className='p-1.5 rounded-lg text-black border border-gray-300  hover:bg-gray-300 transition-colors'
        >
          <IoClose />
        </Button>
      </div>

      <div className='flex-1 overflow-y-auto px-8 py-6 space-y-7'>
        <div className='w-full'>
          <SearchDrop
            emptyDataMessage=''
            position='bottom'
            searchKey='leave_code'
            labelFieldName='Leave Type'
            placeHolderName='Select Leave Type'
            options={leaveTypes}
            selectedValue={formData.leave_type?.leave_code}
            onSelectValBtn={(val) => handleSelectLeaveType(val)}
            isRequiredField
            showError={!!errors?.leave_type}
            errorMessage={errors?.leave_type}
            disabled={loading}
          />
        </div>
        {formData.leave_type?.available_leaves === 0 && (
          <span className='text-rose-500 font-normal text-sm !mt-1.5 pl-0.5 block'>
            No Sufficient leaves form the leave type
            <span className='pl-1 font-bold'>
              {formData?.leave_type?.leave_code}
            </span>
          </span>
        )}

        {/* Divider label */}
        <div className='flex items-center gap-3'>
          <span className='text-[11px] font-semibold uppercase tracking-widest text-gray-400'>
            Duration
          </span>
          <div className='flex-1 h-px bg-gray-100' />
        </div>

        {/* Start Date Row */}
        <div className='space-y-2'>
          <label className='text-sm font-inter font-normal text-black/65 flex gap-1'>
            <span>Start Date</span>
            <span className='flex gap-1'>
              <FaStarOfLife className='w-1.5 text-red-700' />
            </span>
          </label>
          <div className='flex items-stretch gap-3'>
            <div className='flex-1'>
              <CommonDatePicker
                selectedValue={
                  formData?.start_date ? new Date(formData.start_date) : null
                }
                name='start_date_picker'
                selectsStart
                datePickerPosition='top'
                onChange={(date) => handleRangeChange(date, 'start_date')}
                startDate={
                  formData?.start_date ? new Date(formData.start_date) : null
                }
                endDate={
                  formData?.end_date ? new Date(formData.end_date) : null
                }
                disabled={
                  loading ||
                  !formData.leave_type?.leave_code ||
                  formData.leave_type?.available_leaves === 0
                }
              />
            </div>
            <LeavesHalfToggleButton
              value={formData.start_half}
              name='start_half'
              onSelect={handelClickOnStartEndHalf}
              disabled={
                loading ||
                !formData.leave_type?.leave_code ||
                formData?.leave_type?.available_leaves === 0
              }
            />
          </div>
        </div>

        {/* End Date Row */}
        <div className='space-y-2'>
          <label className='text-sm font-inter font-normal text-black/65 flex gap-1'>
            <span>End Date</span>
            <span className='flex gap-1'>
              <FaStarOfLife className='w-1.5 text-red-700' />
            </span>
          </label>
          <div className='flex items-stretch gap-3'>
            <div className='flex-1'>
              <CommonDatePicker
                name='end_date_picker'
                selectedValue={
                  formData?.end_date ? new Date(formData.end_date) : null
                }
                onChange={(date) => handleRangeChange(date, 'end_date')}
                minDate={
                  formData?.start_date
                    ? new Date(formData.start_date)
                    : undefined
                }
                datePickerPosition='bottom'
                maxDate={getMaxEndDate(
                  formData.start_date,
                  formData?.leave_type?.available_leaves || 0
                )}
                disabled={
                  loading ||
                  !formData.leave_type?.leave_code ||
                  formData.leave_type?.available_leaves === 0
                }
                selectsEnd
                startDate={
                  formData?.start_date ? new Date(formData.start_date) : null
                }
                endDate={
                  formData?.end_date ? new Date(formData.end_date) : null
                }
              />
            </div>
            <LeavesHalfToggleButton
              value={formData.end_half}
              name='end_half'
              onSelect={handelClickOnStartEndHalf}
              disabled={
                loading ||
                !formData.leave_type?.leave_code ||
                formData?.leave_type?.available_leaves === 0
              }
            />
          </div>
        </div>
        <span className='text-black/70 !mt-2 text-sm font-normal block'>
          Leave request for
          <span className='px-1 font-bold'>
            {CalculateNumberOfDays({
              startDate: formData?.start_date,
              startHalf: formData?.start_half,
              endDate: formData.end_date,
              endHalf: formData?.end_half,
            })}
          </span>
          days
        </span>
        {(errors?.start_date ||
          errors?.start_half ||
          errors?.end_date ||
          errors?.end_half) && (
          <div className='flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
            <IoInformationCircleOutline className='text-red-500 text-lg mt-0.5 flex-shrink-0' />
            <p className='text-sm text-red-700 font-medium'>
              Invalid date or half-day selection. Please review your selection.
            </p>
          </div>
        )}

        {/* Divider label */}
        <div className='flex items-center gap-3'>
          <span className='text-[11px] font-semibold uppercase tracking-widest text-gray-400'>
            Details
          </span>
          <div className='flex-1 h-px bg-gray-100' />
        </div>

        {/* Description */}
        <TextArea
          name='description'
          isRequiredField
          labelFieldName='Reason'
          value={formData.description}
          onChange={handleChange}
          disabled={
            loading ||
            !formData.leave_type?.leave_code ||
            formData?.leave_type?.available_leaves === 0
          }
          showError={!!errors?.description}
          errorMessage={errors?.description}
        />

        {/* Attachment */}
        <div>
          <p className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'>
            Supporting Documents ( If Any )
          </p>
          <div className='transition-colors duration-150'>
            <MultipleDragAndDropFileUploader
              name='general_info.organization_profile_picture'
              type='file'
              RequiredFileTypeArray={[
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ]}
              showDropFileScreenInFullScreen={true}
              cropShape='rect'
              maxCropHeight={350}
              maxCropWidth={350}
              handelUploadImage={handelUploadImage}
              maxSize={100 * 1024 * 1024}
              enableCropping={false}
              disabled={
                loading ||
                !formData.leave_type?.leave_code ||
                formData?.leave_type?.available_leaves === 0
              }
            />
          </div>
          <p className='text-[11px] text-gray-400 mt-1.5'>
            Accepted: PDF, DOC, DOCX — Max 100MB
          </p>
        </div>

        {/* Select Notify To Employee */}
        <div className='w-full'>
          <MultiSelectSearchDrop
            emptyDataMessage='No Reporting Manager Found'
            position='top'
            searchKey='full_name'
            options={employeesData}
            labelFieldName='Refill Start From'
            selectedValue={formData.reporting_to_employee}
            onSelectValBtn={handleSelectValButton}
            disabled={
              loading ||
              !formData.leave_type?.leave_code ||
              formData?.leave_type?.available_leaves === 0
            }
            CustomElement={({ data }) => renderEmployeeProfile(data)}
          />
        </div>
      </div>

      <div className='px-8 py-5 border-t border-gray-100 bg-gray-50/60 flex gap-3'>
        <Button
          type='button'
          onClick={handleClose}
          disabled={loading}
          className='flex-1 border border-black/45 text-gray-600 bg-white hover:bg-gray-50 rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 shadow-sm'
        >
          Cancel
        </Button>
        <Button
          type='button'
          onClick={handleSave}
          disabled={
            formData?.leave_type?.available_leaves === 0 ||
            !formData.leave_type?.leave_code ||
            loading
          }
          className='flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
          style={{
            background: loading ? '#9ca3af' : 'var(--them-green-color)',
          }}
        >
          {loading ? <Loader loaderText='Applying...' /> : 'Apply Leave'}
        </Button>
      </div>
    </CommonDrawerContainer>
  );
}

export default ApplyLeaveDrawer;
