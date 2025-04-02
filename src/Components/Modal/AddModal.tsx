import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

import ColorPicker from '../../common/ColorPicker';
import Input from '../../common/Input';
import Loader from '../../common/Loader';
import { classNames, hexToRgb } from '../../Helper/HelperFunctions';

interface AddModalProps {
  modalTitle: string;
  showColorPicker: boolean;
  showPreview: boolean;
  labelFieldName: string;
  loading: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  handelFormSubmitFunction: (value: string, bgColor?: string) => void;
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
  modalType: 'add' | 'edit';
  color?: string;
  setColor?: React.Dispatch<SetStateAction<string>>;
}

function AddModal(props: AddModalProps) {
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
  } = props;

  const modalBoxRef = useRef<HTMLDivElement>(null);

  const [showError, setShowError] = useState<boolean>(false);

  const handelSubmitButton = async () => {
    if (value?.trim() == '') {
      setShowError(true);
      return;
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
    if (setColor) {
      setColor('#ff0000');
    }
    setShowModal(false);
    setShowError(false);
    setValue('');
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

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loading, setShowModal, showModal]);

  return (
    <div
      className={classNames(
        'w-full h-screen bg-black/30 fixed top-0 left-0 overflow-hidden transition-all duration-100',
        {
          'opacity-0 invisible': !showModal,
          'opacity-100 visible': showModal,
        }
      )}
    >
      <div className='w-full h-full p-4 flex items-center justify-center overflow-hidden'>
        <div
          className={classNames(
            'bg-white w-full h-fit max-w-[600px] rounded-lg transition-all',
            {
              'opacity-0 scale-50': !showModal,
              'opacity-100 scale-100': showModal,
            }
          )}
          ref={modalBoxRef}
        >
          <div className='w-full'>
            <div className='w-full flex px-3.5 py-4 border-b border-b-black/20 items-center justify-between'>
              <span className='text-xl text-black font-inter font-semibold'>
                {modalTitle}
              </span>
              <button onClick={handelCancelButton}>
                <IoCloseOutline className='text-2xl text-black' />
              </button>
            </div>
            <div
              className='px-4 py-10 max-w-[95%] mx-auto flex flex-col items-start justify-start w-full'
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
            </div>
            <div className='px-3.5 pb-4 w-full grid grid-cols-2 gap-2.5'>
              <button
                className='text-black bg-transparent py-2 rounded-lg border border-black/45'
                onClick={handelCancelButton}
              >
                Cancel
              </button>
              <button
                className='text-white bg-[#3538CD] py-2 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
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

export default AddModal;
