import React, { useEffect, useRef, useState } from 'react';

import {
  FiltersOperatorDropdownInterface,
  ModuleValueInterface,
} from '@/interface/ComponentProps.interface';

import { classNames } from '@/utils/helpers/commonHelpers';

const FiltersOperatorDropdown = React.memo(function FiltersOperatorDropdown(
  props: FiltersOperatorDropdownInterface
) {
  const {
    showCurrentOperatorDropdown,
    filterColumnsArray,
    currentFilterId,
    updateFilterObject,
    setShowCurrentOperatorDropdown,
    setShowCurrentOptionDropdown,
    handelInputFieldFocus,
    showFilterDropDownMenu,
  } = props;

  const operatorDropDownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [focusedIndex, setFocusedIndex] = useState(0);

  const handelOperatorClick = (data: ModuleValueInterface) => {
    setShowCurrentOperatorDropdown(false);
    setShowCurrentOptionDropdown(true);

    updateFilterObject(
      { label: data.label, value: data.value, type: data?.type },
      currentFilterId
    );

    const selectedFilter = filterColumnsArray.find(
      (val) => val.id === currentFilterId
    );

    if (selectedFilter?.options?.length == 0) {
      handelInputFieldFocus();
    }
  };

  const handelOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const filteredOperator =
      filterColumnsArray.find((val) => val.id === currentFilterId)?.operator ||
      [];

    if (!showCurrentOperatorDropdown && filteredOperator.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusedIndex === filteredOperator?.length - 1) {
        setFocusedIndex(0);
        return;
      }
      setFocusedIndex((perv) =>
        Math.min(perv + 1, filteredOperator.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusedIndex === 0) {
        setFocusedIndex(filteredOperator?.length - 1);
        return;
      }
      setFocusedIndex((perv) => Math.max(perv - 1, 0));
    } else if (e.key === ' ' && focusedIndex !== -1) {
      e.preventDefault();
      const item = filteredOperator[focusedIndex];
      if (item) {
        handelOperatorClick(item);
      }
    } else if (e.key === 'Escape') {
      setShowCurrentOperatorDropdown(true);
    }
  };

  useEffect(() => {
    if (showCurrentOperatorDropdown && operatorDropDownRef.current) {
      operatorDropDownRef.current.focus();
    }
  }, [showFilterDropDownMenu, showCurrentOperatorDropdown]);

  useEffect(() => {
    const el = itemRefs.current[focusedIndex];
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  return (
    <div
      className={classNames(
        'shadow-xl rounded-md overflow-hidden origin-top transition-all border border-black/15 max-h-[320px] overflow-y-auto hide-scrollbar focus:ring-0 focus:outline-none',
        {
          'scale-y-0 opacity-0': !showCurrentOperatorDropdown,
          'scale-y-100 opacity-100': showCurrentOperatorDropdown,
        }
      )}
      ref={operatorDropDownRef}
      tabIndex={0}
      onKeyDown={handelOnKeyDown}
    >
      {filterColumnsArray
        .find((val) => val.id === currentFilterId)
        ?.operator?.map((item, index) => (
          <div
            key={item.label}
            className={classNames(
              'dropdown-item py-2.5 pl-5 pr-10 text-black  cursor-pointer border-b border-b-black/10',
              {
                'bg-gray-200': index === focusedIndex,
                'bg-white hover:bg-gray-100': index !== focusedIndex,
              }
            )}
            onClick={() => handelOperatorClick(item)}
          >
            <span className='font-inter text-base inline-block'>
              {' '}
              {item.value}
            </span>
          </div>
        ))}
    </div>
  );
});

export default FiltersOperatorDropdown;
