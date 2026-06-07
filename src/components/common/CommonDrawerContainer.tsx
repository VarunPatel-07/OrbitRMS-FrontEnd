import { useEffect, useRef, useState } from 'react';

import { CommonDrawerContainerPropsInterface } from '@/interface/Global.interface';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  COMMON_DRAWER_ENTER_ANIMATION,
  COMMON_DRAWER_EXIT_ANIMATION,
  COMMON_DRAWER_POSITION,
} from '@/utils/constants/global.constants';
import { classNames } from '@/utils/helpers/commonHelpers';

function CommonDrawerContainer({
  show,
  onClose,
  direction = 'RIGHT',
  closeOnOutsideClick = true,
  children,
  minWidth,
  maxWidth = '600px',
  minHeight,
  maxHeight = '400px',
  //   parentWrapper,
  className,
}: CommonDrawerContainerPropsInterface) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState<boolean>(show);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!closeOnOutsideClick) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, closeOnOutsideClick, onClose]);

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
            'fixed inset-0 z-50 bg-black/30 transition-all duration-300',
            {
              'opacity-100 visible': isVisible,
              'opacity-0 invisible pointer-events-none': !isVisible,
            }
          )
        )
      )}
    >
      <div
        ref={drawerRef}
        style={{
          maxWidth:
            direction === 'LEFT' || direction === 'RIGHT' ? maxWidth : '100%',
          maxHeight:
            direction === 'TOP' || direction === 'BOTTOM' ? maxHeight : '100%',
          minWidth,
          minHeight,
        }}
        className={clsx(
          twMerge(
            'bg-white fixed transition-all duration-300 ease-in-out overflow-hidden',
            COMMON_DRAWER_POSITION[direction],
            isVisible
              ? COMMON_DRAWER_ENTER_ANIMATION[direction]
              : COMMON_DRAWER_EXIT_ANIMATION[direction],
            className
          )
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default CommonDrawerContainer;
