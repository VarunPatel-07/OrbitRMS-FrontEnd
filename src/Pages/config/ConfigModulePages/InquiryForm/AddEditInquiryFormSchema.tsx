import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import Button from '../../../../common/Button';
import Input from '../../../../common/Input';
import Loader from '../../../../common/Loader';
import { AddEditInquiryFormSchemaInitialForm } from '../../../../constant/ConfigModuleConstant';
import { classNames, isValidEmail } from '../../../../Helper/HelperFunctions';
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
    const isEmpty =
      !formData?.form_id?.trim() ||
      !formData?.form_name?.trim() ||
      !formData?.description?.trim();

    const hasInvalidEmail = !formData?.authorized_recipient_emails?.every(
      (item) => isValidEmail(item)
    );

    if (isEmpty || hasInvalidEmail) {
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

  function formatInput(value: string) {
    if (!value) return '';

    // Capitalize first letter of each word after space
    const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());

    // Remove spaces and hyphens
    return capitalized.replace(/[\s-]/g, '');
  }

  const handelOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { value, name } = e.target;
    if (name === 'form_id') {
      const newValue = formatInput(value);
      setFormData((pervData) => ({ ...pervData, form_id: newValue }));
    } else if (name == 'authorized_recipient_emails' && index !== undefined) {
      setFormData((prevData) => {
        const updatedEmails = [...(prevData.authorized_recipient_emails || [])];
        updatedEmails[index] = value;
        return { ...prevData, authorized_recipient_emails: updatedEmails };
      });
    } else {
      setFormData((pervData) => ({ ...pervData, [name]: value }));
    }

    console.log(formData);
  };

  const handelClickOnCheckBox = (value: string) => {
    setFormData((pervData) => ({
      ...pervData,
      status: value?.trim()?.toLocaleLowerCase() == 'true' ? true : false,
    }));
  };

  const handelClickOnTheAddRecipientEmails = () => {
    if (
      formData?.authorized_recipient_emails?.every((item) => isValidEmail(item))
    ) {
      setFormData((pervData) => ({
        ...pervData,
        authorized_recipient_emails: [
          ...pervData.authorized_recipient_emails,
          '',
        ],
      }));
      setShowError(false);
    } else {
      setShowError(true);
    }
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
              <div className='w-full flex px-5 py-4 border-b border-b-black/20 items-center justify-between'>
                <span className='text-xl text-black font-inter font-semibold'>
                  {modalTitle}
                </span>
                <button onClick={handelCancelButton}>
                  <IoCloseOutline className='text-2xl text-black' />
                </button>
              </div>
              <div
                className='px-5 py-6 mx-auto flex flex-col items-start justify-start w-full overflow-auto max-h-[500px] hide-scrollbar'
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
                        showError && formData?.form_id?.length <= 0
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
                        showError && formData?.form_name?.length <= 0
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
                        showError && formData?.description?.length <= 0
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
                  <div className='w-full'>
                    <label
                      htmlFor=''
                      className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
                    >
                      <span className='flex gap-1'>
                        <span>Add Authorized Recipient Emails</span>
                        <FaStarOfLife className='w-1.5 text-red-700' />
                        <span
                          className='cursor-pointer'
                          data-tooltip-id={`info_tooltip_for_add_authorized_recipient_emails`}
                          data-tooltip-content='Add the email addresses of all authorized recipients who should be immediately notified whenever a new inquiry is submitted through this form. These recipients will receive direct email alerts, ensuring that no inquiry is ever missed. Make sure to include all relevant team members or departments responsible for handling inquiries.'
                        >
                          <BsInfoCircleFill />
                        </span>
                      </span>
                    </label>

                    <Tooltip
                      id={`info_tooltip_for_add_authorized_recipient_emails`}
                      opacity={'100'}
                      className='z-[15] bg-white max-w-[300px]'
                      place={'top'}
                    />
                    <div className='flex flex-col items-start justify-start gap-5 w-full'>
                      {formData?.authorized_recipient_emails?.map(
                        (email: string, index: number) => (
                          <div
                            key={index}
                            className='flex items-start justify-between gap-5 w-full'
                          >
                            <div className='flex-grow'>
                              <Input
                                name={`authorized_recipient_emails`}
                                type='text'
                                className='border border-black/45'
                                isRequiredField={true}
                                value={email}
                                onChange={(e) => handelOnChange(e, index)}
                                showError={showError}
                                errorMessage={
                                  showError && !isValidEmail(email)
                                    ? 'pls enter a valid email'
                                    : ''
                                }
                              />
                            </div>
                            <div className='flex items-center justify-end gap-2'>
                              <Button
                                className='p-2 border border-black/45 rounded-lg'
                                type='button'
                                onClick={handelClickOnTheAddRecipientEmails}
                              >
                                <MdModeEdit className='text-black w-6 h-6 min-w-6 min-h-6' />
                              </Button>
                              {formData?.authorized_recipient_emails?.length !==
                                index + 1 && (
                                <Button
                                  className='p-2 border border-red-400 rounded-lg'
                                  type='button'
                                >
                                  <MdDelete className='text-red-600 w-6 h-6 min-w-6 min-h-6' />
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
              <div className='px-5 py-5 w-full grid grid-cols-2 gap-2.5 border-t border-t-black/20'>
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
