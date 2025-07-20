import React, { ForwardedRef, forwardRef, useState } from 'react';
import { FaCheck, FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import clsx from 'clsx';

import { classNames } from '../Helper/HelperFunctions';
import { URLSafetyCheckerFunction } from '../Helper/URLSafetyCheckerFunction';
import { InputProps } from '../interface/propsInterface';
import DropDown from './DropDown';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      name,
      type,
      value,
      setValue,
      placeHolder,
      className,
      placeholderColor,
      viewPasswordBtn = false,
      showError = false,
      errorMessage = '',
      labelFieldName = '',
      isRequiredField = false,
      setUrlErrorType,
      onChange,
      countryDropDownPosition,
      dropDownSelectedValue,
      setDropDownSelectedValue,
      disabled = false,
      countryDropDownMaxHeight,
      countryOptionsData,
    } = props;

    const [isToggled, setIsToggled] = useState<boolean>(false);

    const updateValue = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const basicRegex = /^[^|+=:;?]*$/;

      if (!setValue) return;
      switch (type) {
        case 'url':
          if (val.length >= 0) {
            setValue(val);
            const result: {
              urlStatus: string;
              isError: boolean;
              isEmptyString: boolean;
            } = await URLSafetyCheckerFunction(val);
            if (setUrlErrorType) {
              setUrlErrorType(result.urlStatus);
            }
          }
          break;
        case 'email':
        case 'password':
          setValue(val);
          break;

        default:
          if (basicRegex.test(val)) {
            setValue(val);
          }
          break;
      }
    };

    const renderInputField = () => {
      return (
        <div className='flex w-full items-stretch justify-start'>
          {type == 'number' && countryOptionsData && (
            <DropDown
              dropdownMenuArray={countryOptionsData}
              dropDownSelectedValue={dropDownSelectedValue}
              setDropDownSelectedValue={setDropDownSelectedValue}
              styleDropdownButton='h-full bg-slate-100/[50] rounded-l-lg rounded-r-none border border-black/45  border-r-0'
              dropdownPosition={countryDropDownPosition}
              maxHeight={countryDropDownMaxHeight || 100}
              minWidth={300}
              disabled={disabled}
            />
          )}
          <div
            className={clsx(
              'bg-transparent rounded-lg w-full relative focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)] font-inter overflow-hidden !text-black',
              className
            )}
            style={{
              border:
                showError && errorMessage
                  ? '1px solid red'
                  : disabled
                    ? '1px solid #7fab98'
                    : '',
            }}
          >
            <input
              name={name}
              type={isToggled ? 'text' : type == 'number' ? 'text' : type}
              value={typeof value == 'string' ? value : ''}
              onChange={setValue ? updateValue : onChange}
              placeholder={placeHolder}
              className={`bg-transparent caret-black  autofill:!text-black
              !text-black  w-full h-full text-base focus:outline-none focus:ring-0 py-2.5 font-inter resize-none disabled:bg-[#7fab98]/15 disabled:cursor-not-allowed ${
                viewPasswordBtn ? 'pl-4 pr-10' : 'px-4'
              } placeholder:${placeholderColor}`}
              style={{
                border: 0,
                color: 'black',
                WebkitTextFillColor: 'black',
              }}
              ref={ref}
              disabled={disabled}
            />
            {type === 'password' && viewPasswordBtn ? (
              <span
                className='cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 inline-block text-lg z-10 text-black'
                onClick={() => setIsToggled(!isToggled)}
              >
                {isToggled ? (
                  <FaEye className='transition-all' />
                ) : (
                  <FaEyeSlash className='transition-all' />
                )}
              </span>
            ) : null}
          </div>
        </div>
      );
    };

    const renderCheckBox = () => {
      if (setValue) {
        return (
          <button
            type='button'
            className={classNames(
              'relative inline-block min-w-4 min-h-4 rounded-sm cursor-pointer focus-within:border-[var(--them-pink-color)] focus-within:outline focus-within:outline-4 focus-within:outline-[rgba(215,139,159,0.2)]',
              {
                'border border-black/[.65] bg-white': value != 'true',
                'border border-[var(--them-pink-color)] bg-[rgba(215,139,159,0.2)]':
                  value == 'true',
              }
            )}
            onClick={() => setValue(value == 'true' ? 'false' : 'true')}
          >
            {value == 'true' && (
              <span className='flex items-center justify-center w-full h-full text-[var(--them-pink-color)] absolute top-0 left-0 z-10 transition-all'>
                <FaCheck className='w-3 h-3' />
              </span>
            )}
          </button>
        );
      }
    };

    return (
      <>
        {labelFieldName?.trim() != '' && (
          <label
            htmlFor=''
            className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
          >
            <span className='flex gap-1'>
              <span>{labelFieldName}</span>
              {isRequiredField && (
                <FaStarOfLife className='w-1.5 text-red-700' />
              )}
            </span>
          </label>
        )}
        {type == 'checkbox' ? renderCheckBox() : renderInputField()}
        {showError && errorMessage && (
          <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
            {errorMessage}
          </span>
        )}
      </>
    );
  }
);

export default Input;
