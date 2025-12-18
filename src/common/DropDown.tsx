import React, { SetStateAction, useEffect, useRef, useState } from 'react';

import { IoIosArrowDown } from 'react-icons/io';
import { FixedSizeList as VirtualList } from 'react-window';

import clsx from 'clsx';

import { countryObject } from '../Helper/countryDataHelper';
import { classNames } from '../Helper/HelperFunctions';

interface DropDownProps {
  dropDownSelectedValue?: string | number;
  setDropDownSelectedValue?: React.Dispatch<SetStateAction<string | number>>;
  dropdownMenuArray: Array<string | number | countryObject>;
  styleDropdownButton?: string;
  children?: React.ReactNode;
  dropdownPosition?: 'top' | 'bottom'; // New prop for dropdown position
  maxHeight: number;
  minWidth?: number;
  disabled?: boolean;
}

function DropDown({
  dropDownSelectedValue,
  setDropDownSelectedValue,
  dropdownMenuArray,
  styleDropdownButton,
  children,
  dropdownPosition = 'bottom',
  maxHeight,
  minWidth = 200,
  disabled = false,
}: DropDownProps) {
  const refBox = useRef<HTMLDivElement>(null);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const handelDropdownValueChange = (
    value:
      | string
      | number
      | {
          country_flag: string;
          country_name: string;
          country_number_code: string;
          country_code: string | number;
        }
  ) => {
    if (typeof value === 'object') {
      if (setDropDownSelectedValue)
        setDropDownSelectedValue(JSON.stringify(value));
    } else {
      if (setDropDownSelectedValue) setDropDownSelectedValue(value);
    }
    setShowDropDownMenu(false); // Hide the dropdown after selection
  };

  useEffect(() => {
    if (showDropDownMenu) {
      // Find the index of the selected country
      const selectedIndex = dropdownMenuArray.findIndex((item) => {
        if (typeof item === 'object' && item !== null) {
          return item.country_code === dropDownSelectedValue;
        } else {
          return item === dropDownSelectedValue;
        }
      });

      // Scroll the selected <li> into view
      if (selectedIndex !== -1 && itemRefs.current[selectedIndex]) {
        itemRefs.current[selectedIndex]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // Scroll to center
        });
      }
    }
  }, [showDropDownMenu, dropDownSelectedValue, dropdownMenuArray]);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (refBox.current && !refBox.current.contains(event.target as Node)) {
        setShowDropDownMenu(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, []);

  const handelOnClick = () => {
    setShowDropDownMenu(!showDropDownMenu);
  };

  const renderMenuItem = (
    value: string | number | countryObject,
    index: number,
    style: React.CSSProperties
  ) => {
    if (typeof value === 'object' && 'country_code' in value) {
      return (
        <li
          key={index}
          className='w-full'
          ref={(el) => (itemRefs.current[index] = el)}
          style={style}
        >
          <button
            className={classNames(
              'w-full text-left text-sm px-3 py-1  flex items-center gap-2',
              {
                'bg-gray-200': dropDownSelectedValue == value?.country_code,
                'hover:bg-gray-100':
                  dropDownSelectedValue != value?.country_code,
              }
            )}
            onClick={() => handelDropdownValueChange(value)}
          >
            <span>{value?.country_flag}</span>
            <span className='text-nowrap text-ellipsis overflow-hidden'>
              {value.country_name}
            </span>
            <span className='text-black/[0.5] font-medium'>
              ({value.country_code})
            </span>
          </button>
        </li>
      );
    } else {
      return (
        <li
          key={index}
          className='w-full'
          ref={(el) => (itemRefs.current[index] = el)}
          style={style}
        >
          <button
            className={classNames('w-full text-left text-sm px-3 py-1', {
              'bg-gray-200': dropDownSelectedValue == value,
              'hover:bg-gray-100': dropDownSelectedValue != value,
            })}
            onClick={() => handelDropdownValueChange(value)}
          >
            {value}
          </button>
        </li>
      );
    }
  };

  return (
    <div className='relative' ref={refBox}>
      <div
        className={classNames(
          `absolute text-black bg-[#f5f3f3] min-w-16 transition-all rounded-md overflow-auto hide-scrollbar z-50 shadow-md`,
          {
            'scale-y-100 opacity-100': showDropDownMenu,
            'scale-y-0 opacity-0': !showDropDownMenu,
            'bottom-full mb-1 origin-bottom': dropdownPosition === 'top', // Position on top
            'top-full mt-1 origin-top': dropdownPosition === 'bottom', // Position on bottom
          }
        )}
        style={{ maxHeight: `${maxHeight + 50}px` }}
      >
        <ul className='w-full flex flex-col py-1'>
          <VirtualList
            height={maxHeight + 50 || 200}
            itemCount={dropdownMenuArray?.length}
            itemSize={35}
            width={minWidth}
            className='hide-scrollbar w-full flex flex-col py-1'
          >
            {({ index, style }) => {
              const value = dropdownMenuArray[index];

              return renderMenuItem(value, index, style);
            }}
          </VirtualList>
        </ul>
      </div>

      {/* Dropdown button */}
      {children ? (
        <div onClick={handelOnClick}>{children}</div>
      ) : (
        <button
          className={clsx(
            'px-2.5 pr-8 py-1 bg-white border border-[#D0D5DD] rounded-lg relative min-w-16 h-full disabled:bg-[#7fab98]/15 disabled:cursor-not-allowed',
            styleDropdownButton
          )}
          onClick={handelOnClick}
          disabled={disabled}
        >
          <span className='text-black font-inter text-sm'>
            {dropDownSelectedValue}
          </span>
          <span className='absolute right-1 top-1/2 -translate-y-1/2'>
            <IoIosArrowDown className='text-gray-600 text-base' />
          </span>
        </button>
      )}
    </div>
  );
}

export default DropDown;
