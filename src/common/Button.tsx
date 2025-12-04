import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import Loader from './Loader';

interface ButtonProps {
  type: 'button' | 'submit';
  children: React.ReactElement | string;
  className: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loader?: boolean;
  loaderText?: string;
  theme?: 'light' | 'dark';
  dataTooltipId?: string;
  dataTooltipContent?: string;
}

function Button({
  type = 'button',
  children,
  className,
  disabled = false,
  onClick,
  loader,
  loaderText,
  theme,
  dataTooltipId,
  dataTooltipContent,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={twMerge(
        clsx(
          'disabled:opacity-75 disabled:cursor-not-allowed  cursor-pointer',
          className
        )
      )}
      disabled={disabled}
      onClick={onClick}
      data-tooltip-id={dataTooltipId}
      data-tooltip-content={dataTooltipContent}
    >
      {loader ? (
        <span className='flex items-center justify-start'>
          <span className='inline-block'>
            <Loader
              loaderText={loaderText || 'loading...'}
              theme={theme || 'light'}
            />
          </span>
        </span>
      ) : (
        <>{children}</>
      )}
    </button>
  );
}

export default Button;
