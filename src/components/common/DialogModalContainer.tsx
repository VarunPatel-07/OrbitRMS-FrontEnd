import { useEffect, useRef, useState } from 'react';

import { MdClose } from 'react-icons/md';

import { DialogModalContainerInterface } from '@/interface/Global.interface';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { classNames } from '@/utils/helpers/commonHelpers';

function DialogModalContainer({
  show,
  onClose,
  children,
  loading = false,
  parentWrapper = '',
  className = '',
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  modalTitle,
  showDefaultModelHeder = true,
}: DialogModalContainerInterface) {
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(show);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node) &&
        !loading
      ) {
        if (onClose) onClose();
      }
    };

    if (show && !loading) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [loading, onClose, show]);

  useEffect(() => {
    if (show) {
      setIsMounted(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setTimeout(() => setIsMounted(false), 250);
    }
  }, [show]);

  if (!isMounted) return null;
  return (
    <div
      className={clsx(
        twMerge(
          classNames(
            'fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out bg-black/30',
            {
              'opacity-0': !isVisible,
              'opacity-100': isVisible,
            }
          ),
          parentWrapper
        )
      )}
    >
      <div
        ref={modalBoxRef}
        style={{ minWidth, maxWidth, minHeight, maxHeight }}
        className={clsx(
          twMerge(
            classNames(
              'bg-white rounded-lg w-full transform transition-all duration-300 ease-out overflow-hidden',
              {
                'scale-95 opacity-0 translate-y-3': !isVisible,
                'scale-100 opacity-100 translate-y-0': isVisible,
              }
            ),
            className
          )
        )}
      >
        {showDefaultModelHeder && (
          <div className='bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-fit'>
                <h2 className='text-xl font-bold text-black'>{modalTitle}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className='text-black border border-transparent hover:bg-white hover:border hover:border-gray-400 rounded-full p-1.5 transition-all'
            >
              <MdClose size={24} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default DialogModalContainer;
