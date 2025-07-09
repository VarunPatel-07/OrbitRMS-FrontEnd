import React from 'react';
import clsx from 'clsx';

import Loader from './Loader';

interface ButtonProps {
  Type: 'button' | 'submit';
  children: React.ReactElement | string;
  className: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  loader?: boolean;
  loaderText?: string;
  theme?: 'light' | 'dark';
}

function Button({
  Type = 'button',
  children,
  className,
  disabled = false,
  onClick,
  loader,
  loaderText,
  theme,
}: ButtonProps) {
  return (
    <button
      type={Type}
      className={clsx(
        'disabled:opacity-75 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled}
      onClick={onClick}
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
