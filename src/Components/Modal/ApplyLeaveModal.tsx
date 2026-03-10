/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

import { FaStarOfLife } from 'react-icons/fa';
import { IoClose, IoInformationCircleOutline } from 'react-icons/io5';

import Button from '../../common/Button';
import CommonDatePicker from '../../common/CommonDatePicker';
import MultipleDragAndDropFileUploader from '../../common/DragDropUploader/MultipleFileUploader/MultipleDragDropFileUploader';
import Loader from '../../common/Loader';
import SearchDrop from '../../common/SearchDrop';
import TextArea from '../../common/TextArea';
import { LeavesHalfToggleButton } from '../../Helper/Helper';
import { getMaxEndDate } from '../../Helper/HelperFunctions';
import { SelectedFileArrayObjInterface } from '../../interface/interface';
import {
  ApplyLeaveForm,
  ApplyLeaveModalProps,
} from '../../interface/OrganizationSettings';

const initialForm: ApplyLeaveForm = {
  leave_type: null,
  start_date: null,
  start_half: 'first_half',
  end_date: null,
  end_half: 'second_half',
  current_date: new Date().toISOString(),
  description: '',
  documents: [],
};

function ApplyLeaveModal({
  showModal,
  loading,
  leaveTypes,
  setShowModal,
  onApply,
}: ApplyLeaveModalProps) {
  const modalRef = useRef(null);
  const [formData, setFormData] = useState<ApplyLeaveForm>(initialForm);
  const [showError, setShowError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  const isInvalidDateRange = () => {
    if (!formData.start_date || !formData.end_date) return false;
    if (formData.end_date < formData.start_date) return true;
    if (
      formData.start_date === formData.end_date &&
      formData.start_half === 'second_half' &&
      formData.end_half === 'first_half'
    ) {
      return true;
    }
    return false;
  };

  const handleSave = () => {
    if (
      !formData.leave_type ||
      !formData.start_date ||
      !formData.start_half ||
      !formData.end_date ||
      !formData.end_half ||
      isInvalidDateRange()
    ) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onApply(formData, () => setFormData(initialForm));
  };

  const handleClose = () => {
    setShowModal(false);
    setFormData(initialForm);
    setShowError(false);
  };

  const handelUploadImage = (data: SelectedFileArrayObjInterface[]) => {
    setFormData((perv) => ({ ...perv, documents: data }));
  };

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
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
      }}
      onClick={handleClose}
    >
      {/* Panel */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white w-full max-w-[620px] h-full flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
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

        {/* Body */}
        <div className='flex-1 overflow-y-auto px-8 py-6 space-y-7'>
          {/* Leave Type */}
          <div>
            <SearchDrop
              emptyDataMessage=''
              position='bottom'
              searchKey='leave_code'
              labelFieldName='Leave Type'
              options={leaveTypes}
              selectedValue={formData.leave_type?.leave_code}
              onSelectValBtn={(val) => handleSelectLeaveType(val)}
              isRequiredField
              showError={showError && !formData.leave_type}
              errorMessage='Leave type is required'
              disabled={loading}
            />
          </div>

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
                  onChange={(date) => handleRangeChange(date, 'start_date')}
                  startDate={
                    formData?.start_date ? new Date(formData.start_date) : null
                  }
                  endDate={
                    formData?.end_date ? new Date(formData.end_date) : null
                  }
                  disabled={loading || !formData.leave_type?.leave_code}
                />
              </div>
              <LeavesHalfToggleButton
                value={formData.start_half}
                name='start_half'
                onSelect={handelClickOnStartEndHalf}
                disabled={loading || !formData.leave_type?.leave_code}
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
                  maxDate={getMaxEndDate(
                    formData.start_date,
                    formData?.leave_type?.available_leaves || 0
                  )}
                  disabled={loading || !formData.leave_type?.leave_code}
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
                disabled={loading || !formData.leave_type?.leave_code}
              />
            </div>
          </div>

          {/* Date error */}
          {isInvalidDateRange() && (
            <div className='flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3'>
              <IoInformationCircleOutline className='text-red-500 text-lg mt-0.5 flex-shrink-0' />
              <p className='text-sm text-red-700 font-medium'>
                Invalid date or half-day selection. Please review your
                selection.
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
            disabled={loading}
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
              />
            </div>
            <p className='text-[11px] text-gray-400 mt-1.5'>
              Accepted: PDF, DOC, DOCX — Max 100MB
            </p>
          </div>
        </div>

        {/* Footer */}
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
            disabled={loading || isInvalidDateRange()}
            className='flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
            style={{
              background:
                loading || isInvalidDateRange()
                  ? '#9ca3af'
                  : 'var(--them-green-color)',
            }}
          >
            {loading ? <Loader loaderText='Applying...' /> : 'Apply Leave'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ApplyLeaveModal;
