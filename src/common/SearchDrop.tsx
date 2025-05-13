import React, { useEffect, useRef, useState } from 'react';
import { FaStarOfLife } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import clsx from 'clsx';

import { classNames } from '../Helper/HelperFunctions';
import { SearchDropProps } from '../interface/propsInterface';

export default function SearchDrop(props: SearchDropProps) {
  const {
    labelFieldName,
    isRequiredField,
    className,
    selectedValue,
    placeHolderName,
    options,
    searchKey,
    setSelectedValue,
    onSelectValBtn,
    position,
    emptyDataMessage,
    loading,
    showSearchBar = true,
    showError,
    errorMessage,
  } = props;

  const boxRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const dropDownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [dynamicPosition, setDynamicPosition] = useState<'bottom' | 'top'>(
    position || 'bottom'
  );

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTimeout(() => inputFieldRef.current?.focus(), 0); // Auto-focus input when opening
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFilteredOptions(
      options.filter((option) => {
        if (typeof option === 'object' && option !== null && searchKey) {
          return (option as Record<string, string>)[searchKey]
            ?.toLowerCase()
            .includes(value?.trim()?.toLowerCase());
        }
        return (
          typeof option === 'string' &&
          option.toLowerCase().includes(value.toLowerCase())
        );
      })
    );
  };

  const handleOnClick = (data: string | object) => {
    if (setSelectedValue) {
      setSelectedValue(
        typeof data === 'object'
          ? (data as Record<string, string>)[searchKey]
          : data
      );
    }
    if (onSelectValBtn) {
      onSelectValBtn(data);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const adjustPosition = () => {
      if (dropDownRef.current && buttonRef.current) {
        const pickerHeight = dropDownRef.current.offsetHeight;
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;

        // If not enough space below but enough space above, move picker to top
        if (spaceBelow < pickerHeight && spaceAbove > pickerHeight) {
          setDynamicPosition('top');
        } else {
          setDynamicPosition('bottom');
        }
      }
    };

    adjustPosition();
    window.addEventListener('resize', adjustPosition);
    return () => window.removeEventListener('resize', adjustPosition);
  }, []);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredOptions(options);
    }
  }, [options, searchTerm]);

  const handelKeyPress = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((perv) =>
        Math.min(perv + 1, filteredOptions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((perv) => Math.max(perv - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex !== -1) {
      handleOnClick(filteredOptions[highlightIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (listRef.current && highlightIndex !== -1) {
      const highlightItem = listRef.current.children[
        highlightIndex
      ] as HTMLElement;
      if (highlightItem) {
        highlightItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [highlightIndex]);

  return (
    <div className='w-full' ref={boxRef}>
      {labelFieldName && (
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
      <div className='w-full relative'>
        <button
          onClick={handleToggle}
          onKeyDown={handelKeyPress}
          ref={buttonRef}
          className={clsx(
            'px-2.5 py-2.5 bg-white border border-black/45 rounded-lg w-full flex justify-between items-center',
            className
          )}
          style={{ border: showError && errorMessage ? '1px solid red' : '' }}
        >
          <span className='text-black font-inter text-sm capitalize'>
            {selectedValue
              ? selectedValue
              : placeHolderName
                ? placeHolderName
                : 'Select Value'}
          </span>
          <IoIosArrowDown
            className={`text-gray-600 text-base transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            ref={dropDownRef}
            className={classNames('absolute w-full z-50 transition-all', {
              'bottom-0': dynamicPosition == 'top',
              'top-0': dynamicPosition == 'bottom',
            })}
          >
            <div
              className={classNames(
                'flex items-center justify-center gap-1.5',
                {
                  'flex-col-reverse': dynamicPosition == 'top',
                  'flex-col': dynamicPosition == 'bottom',
                }
              )}
            >
              {showSearchBar && (
                <input
                  ref={inputFieldRef}
                  type='text'
                  className='w-full py-2 px-3 border-b border-gray-200 focus:outline-none bg-white rounded-lg border border-black/45 text-black focus:border-black/45'
                  placeholder='Search...'
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyDown={handelKeyPress}
                />
              )}

              <ul
                ref={listRef}
                className='max-h-[150px] h-full overflow-auto py-1 w-full bg-gray-100 shadow-md rounded-lg hide-scrollbar'
              >
                {!loading ? (
                  filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => {
                      const val =
                        typeof option === 'object'
                          ? (option as Record<string, string>)[searchKey]
                          : option;
                      return (
                        <li
                          key={index}
                          className={classNames(
                            'px-3 py-2 cursor-pointer w-full text-black',
                            {
                              'bg-gray-300/70': selectedValue == val,
                              'hover:bg-gray-200/70':
                                selectedValue != val || highlightIndex != index,
                              'bg-gray-200/70': highlightIndex == index,
                            }
                          )}
                          onClick={() => handleOnClick(option)}
                        >
                          {typeof option === 'object'
                            ? (option as Record<string, string>)[searchKey]
                            : option}
                        </li>
                      );
                    })
                  ) : (
                    <li className='px-3 py-2 text-gray-500 text-sm'>
                      {options.length == 0
                        ? emptyDataMessage
                        : 'No results found'}
                    </li>
                  )
                ) : (
                  <div className='w-full px-2'>
                    <SkeletonTheme baseColor='#d4d4d8' highlightColor='#e4e4e7'>
                      {Array(4)
                        .fill(null)
                        .map((_, index) => (
                          <Skeleton
                            width={'100%'}
                            height={24}
                            className='inline-block'
                            key={index}
                          />
                        ))}
                    </SkeletonTheme>
                  </div>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      {showError && errorMessage && (
        <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
