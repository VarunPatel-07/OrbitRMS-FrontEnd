import React, { useEffect, useRef, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

import Button from '../../common/Button';
import ColorPicker from '../../common/ColorPicker';
import Input from '../../common/Input';
import Loader from '../../common/Loader';
import SearchDrop from '../../common/SearchDrop';
import { formFieldAllowedFieldType } from '../../constant/constant';
import { classNames, hexToRgb } from '../../Helper/HelperFunctions';
import { CommanAddModalPropsInterface } from '../../interface/interface';

function AddModal(props: CommanAddModalPropsInterface) {
  const {
    modalTitle,
    showColorPicker,
    showPreview,
    labelFieldName,
    loading,
    showModal,
    setShowModal,
    handelFormSubmitFunction,
    value,
    setValue,
    modalType,
    color,
    setColor,
    fieldType,
    setFieldType,
    isRequiredField,
    setIsRequiredField,
    dummyValue,
    dummyColor,
    dummyFieldType,
  } = props;

  const modalBoxRef = useRef<HTMLDivElement>(null);

  const [showError, setShowError] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const handelSubmitButton = async () => {
    if (value?.trim() == '') {
      setShowError(true);
      return;
    }
    if (fieldType !== undefined && setFieldType) {
      if (fieldType?.trim() == '') {
        setShowError(true);
        return;
      }
    }
    handelFormSubmitFunction(value, color);
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
    setValue('');
    if (
      fieldType !== undefined &&
      setFieldType &&
      typeof setIsRequiredField === 'function'
    ) {
      setFieldType('');
      setIsRequiredField('');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node) &&
        !loading
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
                <Button
                  type='button'
                  className=''
                  disabled={loading}
                  onClick={handelCancelButton}
                >
                  <IoCloseOutline className='text-2xl text-black' />
                </Button>
              </div>
              <div
                className='px-5 py-10 mx-auto flex flex-col items-start justify-start w-full'
                onKeyDown={handelKeyPress}
              >
                <label
                  htmlFor=''
                  className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
                >
                  <span className='flex gap-1'>
                    <span>{labelFieldName}</span>
                    <FaStarOfLife className='w-1.5 text-red-700' />
                  </span>
                </label>
                <div className='relative w-full'>
                  <Input
                    name='text'
                    type='text'
                    className='border border-black/45'
                    isRequiredField={true}
                    value={value}
                    setValue={setValue}
                    disabled={loading}
                  />
                  {showColorPicker && color && setColor && (
                    <div className='absolute top-1/2 -translate-y-1/2 right-3.5 mt-[-1.5px]'>
                      <ColorPicker color={color} setColor={setColor} />
                    </div>
                  )}
                </div>
                {showError && value?.trim().length == 0 && (
                  <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
                    this is a required field
                  </span>
                )}

                {showPreview && color && (
                  <div
                    className='px-2.5 py-0.5 rounded-full inline-block w-fit mt-2.5'
                    style={{
                      color: color,
                      border: `1px solid ${color}`,
                      backgroundColor: `rgba(${hexToRgb(color)}, 0.15)`,
                    }}
                  >
                    <span className='text-xs'>{value || 'Project'}</span>
                  </div>
                )}
                {fieldType !== undefined &&
                  setFieldType &&
                  typeof setIsRequiredField === 'function' && (
                    <div className='w-full mt-3.5'>
                      <div className='w-full flex flex-col items-start justify-start gap-3.5'>
                        <div className='w-full'>
                          <SearchDrop
                            options={formFieldAllowedFieldType}
                            searchKey=''
                            position='bottom'
                            emptyDataMessage=''
                            showSearchBar={false}
                            labelFieldName='Type'
                            isRequiredField
                            selectedValue={fieldType}
                            setSelectedValue={setFieldType}
                            showError={showError}
                            errorMessage={
                              fieldType ? '' : 'this field is required'
                            }
                            disabled={loading}
                          />
                        </div>
                        <div className='flex items-center justify-start gap-1.5'>
                          <Input
                            type='checkbox'
                            name='termsAccepted'
                            value={isRequiredField}
                            setValue={setIsRequiredField}
                          />
                          <span className='text-black font-light text-sm font-inter'>
                            Required Field
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                <button
                  className='text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                  disabled={
                    loading || showColorPicker
                      ? Boolean(value == dummyValue && color == dummyColor)
                      : fieldType !== undefined && setFieldType
                        ? Boolean(
                            fieldType == dummyFieldType && value == dummyValue
                          )
                        : Boolean(value == dummyValue)
                  }
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

export default AddModal;
