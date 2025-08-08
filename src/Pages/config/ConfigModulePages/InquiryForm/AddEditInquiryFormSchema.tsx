import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import Input from '../../../../common/Input';
import Loader from '../../../../common/Loader';
import { AddEditInquiryFormSchemaInitialForm } from '../../../../constant/ConfigModuleConstant';
import { classNames } from '../../../../Helper/HelperFunctions';
import { AddEditInquiryFormSchemaInterface } from '../../../../interface/interface';

interface AddModalProps {
  modalTitle: string;
  loading: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  handelFormSubmitFunction: (
    formData: AddEditInquiryFormSchemaInterface
  ) => void;
  formData: AddEditInquiryFormSchemaInterface;
  setFormData: React.Dispatch<
    SetStateAction<AddEditInquiryFormSchemaInterface>
  >;
  modalType: 'add' | 'edit';
}

function AddEditInquiryFormSchema(props: AddModalProps) {
  const {
    modalTitle,
    loading,
    showModal,
    setShowModal,
    handelFormSubmitFunction,
    formData,
    setFormData,
    modalType,
  } = props;

  const modalBoxRef = useRef<HTMLDivElement>(null);

  const [showError, setShowError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const handelSubmitButton = async () => {
    if (
      formData?.form_id?.trim() === '' ||
      formData?.form_name?.trim() === '' ||
      formData?.description?.trim() === ''
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
    setFormData(AddEditInquiryFormSchemaInitialForm);
  };

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((pervData) => ({ ...pervData, [name]: value }));
  };

  const handelClickOnCheckBox = (value: string) => {
    setFormData((pervData) => ({
      ...pervData,
      status: value?.trim()?.toLocaleLowerCase() == 'true' ? true : false,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
        setShowError(false);
      }
    };

    if (showModal && !loading) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loading, setShowModal, showModal]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false);
      }, 300);
    }
  }, [showModal]);

  if (!isMounted) return null;

  if (showModal)
    return (
      <div
        className={classNames(
          'w-full h-screen bg-black/30 fixed z-50 top-0 left-0 overflow-hidden transition-all duration-100',
          {
            'opacity-0 invisible': !isVisible,
            'opacity-100 visible': isVisible,
          }
        )}
      >
        <div className='w-full h-full p-4 flex items-center justify-center overflow-hidden'>
          <div
            className={classNames(
              'bg-white w-full h-fit max-w-[600px] rounded-lg transition-all',
              {
                'opacity-0 scale-50': !isVisible,
                'opacity-100 scale-100': isVisible,
              }
            )}
            ref={modalBoxRef}
          >
            <div className='w-full'>
              <div className='w-full flex px-5 py-6 border-b border-b-black/20 items-center justify-between'>
                <span className='text-xl text-black font-inter font-semibold'>
                  {modalTitle}
                </span>
                <button onClick={handelCancelButton}>
                  <IoCloseOutline className='text-2xl text-black' />
                </button>
              </div>
              <div
                className='px-5 py-10 mx-auto flex flex-col items-start justify-start w-full'
                onKeyDown={handelKeyPress}
              >
                <div className='grid grid-cols-1 gap-5 w-full'>
                  <div className='w-full'>
                    <Input
                      name='form_id'
                      labelFieldName='Form Id'
                      type='text'
                      className='border border-black/45'
                      isRequiredField={true}
                      value={formData?.form_id}
                      onChange={handelOnChange}
                      showError={showError}
                      errorMessage={
                        showError && formData?.form_id
                          ? 'this is a require field'
                          : ''
                      }
                    />
                  </div>
                  <div className='w-full'>
                    <Input
                      name='form_name'
                      labelFieldName='Form Name'
                      type='text'
                      className='border border-black/45'
                      isRequiredField={true}
                      value={formData?.form_name}
                      onChange={handelOnChange}
                      showError={showError}
                      errorMessage={
                        showError && formData?.form_name
                          ? 'this is a require field'
                          : ''
                      }
                    />
                  </div>
                  <div className='w-full'>
                    <Input
                      name='description'
                      labelFieldName='Description'
                      type='text'
                      className='border border-black/45'
                      isRequiredField={true}
                      value={formData?.description}
                      onChange={handelOnChange}
                      showError={showError}
                      errorMessage={
                        showError && formData?.description
                          ? 'this is a require field'
                          : ''
                      }
                    />
                  </div>
                  <div className='w-full'>
                    <div className='flex items-center justify-between border border-black/30 py-3 px-4 rounded-lg bg-gray-100'>
                      <p className='text-black text-base font-medium font-inter'>
                        Form Status{' '}
                        <span className='font-semibold'>
                          {formData?.status ? (
                            <span className='text-green-700'>Active</span>
                          ) : (
                            <span className='text-rose-700'>Inactive</span>
                          )}
                        </span>
                      </p>
                      <Input
                        type='checkbox'
                        name='termsAccepted'
                        value={formData?.status ? 'true' : 'false'}
                        setValue={handelClickOnCheckBox}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='px-5 pb-6 w-full grid grid-cols-2 gap-2.5'>
                <button
                  className='text-black bg-transparent py-2 rounded-lg border border-black/45 hover:bg-gray-800/5'
                  onClick={handelCancelButton}
                >
                  Cancel
                </button>
                <button
                  className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                  disabled={loading}
                  onClick={handelSubmitButton}
                >
                  {loading ? (
                    <Loader
                      loaderText={
                        modalType == 'add' ? 'Adding...' : 'Updating...'
                      }
                    />
                  ) : modalType == 'add' ? (
                    <span>Add</span>
                  ) : (
                    <span>Update</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AddEditInquiryFormSchema;
