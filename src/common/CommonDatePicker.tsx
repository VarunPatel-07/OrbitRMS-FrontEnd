import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import { forwardRef } from 'react';
import { FaCalendarAlt, FaStarOfLife } from 'react-icons/fa';
import clsx from 'clsx';

import { commonDatePickerProps } from '../interface/propsInterface';

function CommonDatePicker(props: commonDatePickerProps) {
  const {
    onChange,
    selectedValue,
    className,
    labelFieldName,
    isRequiredField,
    datePickerPosition = 'left-start',
    showError,
    errorMessage,
    year,
    disabled = false,
  } = props;

  const CustomInput = forwardRef(
    (
      { value, onClick }: { value?: string; onClick?: () => void },
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref} // Attach the ref here
        className={clsx(
          `relative w-full cursor-pointer border border-black/45 rounded-lg bg-transparent flex items-center max-h-[41.5px]`,
          className
        )}
        onClick={onClick}
        style={{
          border: disabled
            ? '1px solid #7fab98'
            : showError && errorMessage
              ? '1px solid red'
              : '',
        }}
      >
        <input
          type='text'
          value={value}
          readOnly
          className='w-full bg-transparent text-black focus:ring-0 focus:shadow-none focus:outline-none cursor-pointer text-base disabled:bg-[#7fab98]/15 disabled:cursor-not-allowed py-2 px-4'
          disabled={disabled}
        />
        <FaCalendarAlt className='absolute right-3 text-black/60' />
      </div>
    )
  );

  return (
    <div className='w-full'>
      {labelFieldName?.trim() != '' && (
        <label
          htmlFor=''
          className='text-sm font-inter font-normal text-black/65 pb-2 inline-block'
        >
          <span className='flex gap-1'>
            <span>{labelFieldName}</span>
            {isRequiredField && <FaStarOfLife className='w-1.5 text-red-700' />}
          </span>
        </label>
      )}
      <DatePicker
        selected={selectedValue}
        onChange={onChange}
        className='w-full bg-transparent text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0 border border-black/45 rounded-lg py-2 px-4 cursor-pointer'
        wrapperClassName='w-full bg-transparent text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0'
        popperPlacement={datePickerPosition}
        showYearDropdown
        scrollableYearDropdown={true}
        yearDropdownItemNumber={50}
        dateFormat='dd/MM/yyyy'
        disabled={disabled}
        customInput={<CustomInput />}
        openToDate={
          year
            ? new Date(new Date().setFullYear(year))
            : selectedValue
              ? new Date(selectedValue)
              : new Date()
        }
      />
      {showError && errorMessage && (
        <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
          {errorMessage}
        </span>
      )}
    </div>
  );
}

export default CommonDatePicker;
