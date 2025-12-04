import React, { SetStateAction, useEffect, useRef } from 'react';


import Loader from '../../common/Loader';
import { classNames } from '../../Helper/HelperFunctions';
import { IoMdAlert } from 'react-icons/io';

function CommonAlertModal({
  showDeleteModal,
  setShowDeleteModal,
  loading,
  handelDelete,
  title,
  ExtraErrorMessage,
  minHeight,
  description,
  secondaryButtonTitle,
}: {
  showDeleteModal: boolean;
  setShowDeleteModal: React.Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  handelDelete: () => void;
  title?: string;
  ExtraErrorMessage?: React.ReactElement;
  minHeight?: number;
  description?: string;
  secondaryButtonTitle?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowDeleteModal(false);
      }
    };
    if (!loading) {
      document.addEventListener('mousedown', handelClickOutSideTheBox);
    }
    return () => {
      document.addEventListener('mouseup', handelClickOutSideTheBox);
    };
  }, [loading, setShowDeleteModal]);
  return (
    <div
      className={classNames(
        'w-full h-full absolute top-0 left-0 bg-[rgba(0,0,0,0.4)] z-50 transition-all',
        {
          'invisible opacity-0': !showDeleteModal,
          'visible opacity-100': showDeleteModal,
        }
      )}
    >
      <div className='w-full h-full flex items-center justify-center'>
        <div
          className={classNames(
            `delete-modal bg-white min-w-[400px] max-w-[700px] transition-all px-8 rounded-lg relative overflow-hidden flex flex-col items-start justify-end`,
            {
              'scale-50 opacity-0': !showDeleteModal,
              'scale-100 opacity-100': showDeleteModal,
            }
          )}
          style={{ minHeight: `${minHeight || 300}px` }}
          ref={boxRef}
        >
          <div className='delete absolute -top-[15%]  -left-[10%]'>
            <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-orange-200'>
              <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-orange-200'>
                <span className='p-4 flex items-center justify-center overflow-hidden rounded-full border border-orange-300'>
                  <span className='p-6 flex items-center justify-center overflow-hidden rounded-full border border-orange-400'>
                    <IoMdAlert className='text-orange-500 text-3xl' />
                  </span>
                </span>
              </span>
            </span>
          </div>
          <div className='relative z-10 w-full h-full flex flex-col items-start justify-end pb-5 gap-7'>
            <div
              className={classNames('w-full', {
                'flex flex-col items-start justify-start gap-5':
                  !!ExtraErrorMessage,
              })}
            >
              <div className='flex flex-col items-start justify-start gap-1'>
                <h4 className='text-[26px] text-slate-950 font-bold font-inter'>
                  {title}
                </h4>
                <p className='text-base text-slate-950 font-inter'>
                  {description}
                </p>
              </div>
              {ExtraErrorMessage && ExtraErrorMessage}
            </div>
            <div className='grid grid-cols-2 w-full gap-x-2'>
              <button
                className='text-[var(--them-green-color)] w-full py-2.5 rounded-lg font-inter border border-[var(--them-green-color)] text-base font-semibold hover:bg-gray-800/5 hover:text-black transition-all'
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className='text-white bg-yellow-600 hover:bg-yellow-600 w-full py-2.5 rounded-lg font-inter text-base font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed'
                disabled={loading}
                onClick={handelDelete}
              >
                {loading ? (
                  <Loader loaderText='Loading...' />
                ) : (
                  <span>{secondaryButtonTitle}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommonAlertModal;
