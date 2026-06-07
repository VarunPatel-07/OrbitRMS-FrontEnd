import { useRef, useState } from 'react';

import DatePicker from 'react-datepicker';

import { FilterInputDateSelectorInterface } from '@/interface/ComponentProps.interface';

import { FilterFieldsTypeEnums } from '@/utils/enums/enums';
import { classNames, getLocalDateString } from '@/utils/helpers/commonHelpers';

function FilterInputDateSelector(props: FilterInputDateSelectorInterface) {
  const {
    showCurrentOptionDropdown,
    filterObject,
    currentFilterId,
    updateFilterObject,
    updateFinalFilterQuery,
    setInputValue,
  } = props;

  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedValue, setSelectedValue] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const operator = filterObject
    ?.find((obj) => obj.id == currentFilterId)
    ?.moduleValue?.find((item) => item.type === 'Operator')
    ?.label?.toLowerCase();

  const onChange = (date: Date | null) => {
    if (date) {
      if (operator == 'is') {
        setSelectedValue(date);

        updateFilterObject(
          {
            label: 'date',
            value: getLocalDateString(date),
            type: FilterFieldsTypeEnums[2],
          },
          currentFilterId,
          (updatedArray) => {
            updateFinalFilterQuery(updatedArray);
            setInputValue('');
          }
        );
      }
    }
  };

  const rangeSelectHandler = (range: [Date | null, Date | null]) => {
    if (operator == 'between') {
      setDateRange(range);
      const rangeObject = {
        start_date: getLocalDateString(range[0]),
        end_date: getLocalDateString(range[1]),
      };
      if (range[0] !== null && range[1] !== null) {
        updateFilterObject(
          {
            label: 'date',
            value: JSON.stringify(rangeObject),
            type: FilterFieldsTypeEnums[2],
          },
          currentFilterId,
          (updatedArray) => {
            updateFinalFilterQuery(updatedArray);
            setInputValue('');
          }
        );
      }
    }
  };

  return (
    <div
      className={classNames(
        'shadow-xl rounded-md overflow-hidden origin-top transition-all relative border border-black/15 max-h-[320px] overflow-y-auto hide-scrollbar focus:ring-0 focus:outline-none',
        {
          'scale-y-0 opacity-0': !showCurrentOptionDropdown,
          'scale-y-100 opacity-100': showCurrentOptionDropdown,
        }
      )}
      ref={optionsDropdownRef}
      tabIndex={0}
      // onKeyDown={handelOnKeyDown}
    >
      {operator == 'between' ? (
        <div className='w-full'>
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={rangeSelectHandler}
            className='w-full bg-transparent h-full text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0 rounded-lg py-2 px-4 cursor-pointer border-0'
            wrapperClassName='w-full bg-transparent text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0 h-full border-0'
            calendarClassName='!border-0 shadow-none'
            popperPlacement={'top'}
            showYearDropdown
            scrollableYearDropdown={true}
            yearDropdownItemNumber={50}
            dateFormat='dd/MM/yyyy h:mm aa'
            inline
          />
        </div>
      ) : (
        <div className='w-full'>
          <DatePicker
            selected={selectedValue}
            onChange={onChange}
            className='w-full bg-transparent h-full text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0 rounded-lg py-2 px-4 cursor-pointer border-0'
            wrapperClassName='w-full bg-transparent text-black focus-within:ring-0 focus:shadow-none ring-0 focus:outline-none focus:ring-0 h-full border-0'
            calendarClassName='!border-0 shadow-none'
            popperPlacement={'top'}
            showYearDropdown
            scrollableYearDropdown={true}
            yearDropdownItemNumber={50}
            dateFormat='dd/MM/yyyy h:mm aa'
            inline
          />
        </div>
      )}
    </div>
  );
}

export default FilterInputDateSelector;
