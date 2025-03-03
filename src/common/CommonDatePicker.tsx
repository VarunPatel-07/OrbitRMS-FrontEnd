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
  } = props;

  const CustomInput = forwardRef(
    (
      { value, onClick }: { value?: string; onClick?: () => void },
      ref: React.Ref<HTMLDivElement>
    ) => (
      <div
        ref={ref} // Attach the ref here
        className={clsx(
          'relative w-full cursor-pointer border border-black/45 rounded-lg py-2 px-4 bg-transparent flex items-center max-h-[41.5px]',
          className
        )}
        onClick={onClick}
      >
        <input
          type='text'
          value={value}
          readOnly
          className='w-full bg-transparent text-black focus:ring-0 focus:shadow-none focus:outline-none'
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
        className='w-full bg-transparent text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0 border border-black/45 rounded-lg py-2 px-4'
        wrapperClassName='w-full bg-transparent text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0'
        popperPlacement='left-start'
        showYearDropdown
        scrollableYearDropdown={true}
        yearDropdownItemNumber={50}
        dateFormat='dd/MM/yyyy'
        customInput={<CustomInput />}
      />
    </div>
  );
}

export default CommonDatePicker;
