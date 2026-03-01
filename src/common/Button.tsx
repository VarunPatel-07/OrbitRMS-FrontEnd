import { forwardRef } from 'react';

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { ButtonProps } from '../interface/interface';
import Loader from './Loader';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      children,
      className = '',
      disabled = false,
      onClick,
      loader,
      loaderText,
      theme,
      ...args
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={twMerge(
          clsx(
            'disabled:opacity-75 disabled:cursor-not-allowed  cursor-pointer',
            className
          )
        )}
        disabled={disabled}
        onClick={onClick}
        {...args}
      >
        {loader ? (
          <span className='flex items-center justify-center'>
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
);
Button.displayName = 'Button';
export default Button;
