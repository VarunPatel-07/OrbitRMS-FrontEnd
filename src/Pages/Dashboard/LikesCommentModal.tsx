import { useEffect, useRef, useState } from 'react';

import { classNames } from '../../Helper/HelperFunctions';
import { LikesCommentsModalInterface } from '../../interface/propsInterface';

function LikesCommentModal(props: LikesCommentsModalInterface) {
  const { type, showModal, setShowModal } = props;

  const [isVisible, setIsVisible] = useState<boolean>(showModal);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalBoxRef.current &&
        !modalBoxRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowModal, showModal]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 50);
      setTimeout(() => {
        setIsMounted(false);
      }, 500);
    }
  }, [showModal]);

  if (!isMounted) return null;
  if (isMounted)
    return (
      <div
        className={classNames(
          'absolute bottom-0 left-0 bg-black/50 w-full h-full z-40 backdrop-blur-sm flex items-end justify-end transition-all duration-500',
          {
            'pointer-events-auto opacity-100 visible': isVisible,
            'pointer-events-none opacity-0 invisible': !isVisible,
          }
        )}
      >
        <div
          className={classNames(
            'w-full h-full max-h-[70%] bg-white rounded-t-3xl transition-all duration-300',
            { 'translate-y-full opacity-0 invisible': !isVisible, 'translate-y-0 opacity-100 visible': isVisible }
          )}
          ref={modalBoxRef}
        >
          <div className='w-full h-full flex flex-col items-start justify-start gap-3'>
            <div className='w-full flex flex-col items-center justify-center border-b border-b-black/10 px-5 pt-3'>
              <span className='block w-16 h-1 rounded-full bg-gray-300'></span>
              <p className='font-inter text-black font-semibold text-lg py-3 capitalize'>
                {type}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}

export default LikesCommentModal;
