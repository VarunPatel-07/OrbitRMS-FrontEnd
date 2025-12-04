import React, { useEffect, useRef, useState } from 'react';
import { MdBusiness, MdClose, MdPerson } from 'react-icons/md';

import Button from '../../common/Button';
import Input from '../../common/Input';
import Loader from '../../common/Loader';
import { classNames, isValidEmail } from '../../Helper/HelperFunctions';
import { ResetPasswordLinkModalInterface } from '../../interface/interface';

const ResetPasswordLinkModal = (props: ResetPasswordLinkModalInterface) => {
  const { isOpen, setIsOpen, handelSubmit, companyEmail, personalEmail } =
    props;
  const [selectedEmail, setSelectedEmail] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(isOpen);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const modalBoxRef = useRef<HTMLDivElement>(null);

  const handleEmailSelect = (email: string) => {
    setSelectedEmail(email);
    setUseCustom(false);
    setCustomEmail('');
  };

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseCustom(true);
    setCustomEmail(e.target.value);
  };

  const handleProceed = () => {
    if (useCustom) {
      if (customEmail == '' || !isValidEmail(customEmail)) {
        setShowError(true);
      }
    }
    setLoading(true);
    const selectedMail = useCustom ? customEmail : selectedEmail;

    handelSubmit(selectedMail, (success: boolean) => {
      setLoading(false);
      if (success) handleCancel();
    });
  };

  const handleCancel = () => {
    setSelectedEmail('');
    setCustomEmail('');
    setUseCustom(false);
    setIsOpen(!isOpen);
    setShowError(false);
  };

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!isMounted) return null;

  if (isOpen)
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
              'bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all',
              {
                'opacity-0 scale-50': !isVisible,
                'opacity-100 scale-100': isVisible,
              }
            )}
            ref={modalBoxRef}
          >
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4 rounded-t-2xl flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div>
                  <h2 className='text-xl font-bold text-black'>
                    Send Reset Password Link
                  </h2>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className='text-black border border-transparent hover:bg-white hover:border hover:border-gray-400 rounded-full p-1.5 transition-all'
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className='p-6 space-y-4 '>
              {/* Warning Section */}
              <div className='bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-5'>
                <div className='flex items-start gap-3'>
                  <div className='flex-shrink-0 mt-0.5'>
                    <svg
                      className='w-5 h-5 text-amber-600'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-sm font-semibold text-amber-800 mb-1'>
                      Important: Session Logout Warning
                    </h4>
                    <p className='text-sm text-amber-700'>
                      This action will remove access from all logged-in devices.
                      The user must create a new password and log in again to
                      regain access.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type='button'
                onClick={() => handleEmailSelect(companyEmail)}
                className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r rounded-xl transition-all group border-2 ${
                  selectedEmail === companyEmail && !useCustom
                    ? 'from-blue-200 to-blue-300 border-blue-500'
                    : 'from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 hover:border-blue-400'
                }`}
              >
                <>
                  <div className='bg-blue-600 p-3 rounded-full group-hover:scale-110 transition-transform'>
                    <MdBusiness size={24} className='text-white' />
                  </div>
                  <div className='flex-1 text-left'>
                    <p className='font-semibold text-gray-800'>Company Email</p>
                    <p className='text-sm text-gray-600'>{companyEmail}</p>
                  </div>
                  {selectedEmail === companyEmail && !useCustom && (
                    <div className='w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center'>
                      <div className='w-2 h-2 bg-white rounded-full'></div>
                    </div>
                  )}
                </>
              </Button>

              {/* Personal Email Option */}
              <Button
                type='button'
                onClick={() => handleEmailSelect(personalEmail)}
                className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r rounded-xl transition-all group border-2 ${
                  selectedEmail === personalEmail && !useCustom
                    ? 'from-purple-200 to-purple-300 border-purple-500'
                    : 'from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 hover:border-purple-400'
                }`}
              >
                <>
                  <div className='bg-purple-600 p-3 rounded-full group-hover:scale-110 transition-transform'>
                    <MdPerson size={24} className='text-white' />
                  </div>
                  <div className='flex-1 text-left'>
                    <p className='font-semibold text-gray-800'>
                      Personal Email
                    </p>
                    <p className='text-sm text-gray-600'>{personalEmail}</p>
                  </div>
                  {selectedEmail === personalEmail && !useCustom && (
                    <div className='w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center'>
                      <div className='w-2 h-2 bg-white rounded-full'></div>
                    </div>
                  )}
                </>
              </Button>

              <div className='flex items-center gap-4 my-6'>
                <div className='flex-1 h-px bg-gray-300'></div>
                <span className='text-sm text-gray-500 font-medium'>OR</span>
                <div className='flex-1 h-px bg-gray-300'></div>
              </div>

              <div className='w-full'>
                <Input
                  name='email'
                  type='email'
                  labelFieldName='Use Custom Email'
                  value={customEmail}
                  onChange={handelOnChange}
                  className='border border-black/[.65] text-black min-h-12'
                  placeHolder='Enter custom email...'
                  showError={showError}
                  errorMessage={
                    showError
                      ? customEmail.trim() === ''
                        ? 'This field is required.'
                        : !isValidEmail(customEmail)
                          ? 'Please enter a valid email address.'
                          : ''
                      : ''
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className='grid grid-cols-2 gap-3 pt-4'>
                <Button
                  type='button'
                  onClick={handleCancel}
                  className='text-[var(--them-green-color)] w-full py-2.5 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 hover:text-black transition-all'
                >
                  Cancel
                </Button>
                <Button
                  type='button'
                  onClick={handleProceed}
                  disabled={(!selectedEmail && !customEmail) || loading}
                  className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <Loader loaderText='Proceeding...' />
                  ) : (
                    <span>Proceed</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ResetPasswordLinkModal;
