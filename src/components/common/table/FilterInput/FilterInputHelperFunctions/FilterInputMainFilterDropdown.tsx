import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  FilterInputMainFilterDropdownInterface,
  FilterObjectInterface,
  ModuleValueInterface,
} from '@/interface/ComponentProps.interface';

import { FilterFieldsTypeEnums } from '@/utils/enums/enums';
import { classNames } from '@/utils/helpers/commonHelpers';

const FilterInputMainFilterDropdown = React.memo(
  function FilterInputMainFilterDropdown(
    props: FilterInputMainFilterDropdownInterface
  ) {
    const {
      showFilterDropDownMenu,
      currentFilterId,
      filterColumnsArray,
      selectedFilterObject,
      setShowFilterDropDownMenu,
      setCurrentFilterId,
      setFilterObject,
      setShowCurrentOperatorDropdown,
    } = props;

    const dropdownRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const [focusedIndex, setFocusedIndex] = useState(0);

    const memorizedFilterColumnArray = useMemo(() => {
      return filterColumnsArray.filter(
        (item) =>
          !selectedFilterObject.some((filter) => filter?.id === item?.id)
      );
    }, [filterColumnsArray, selectedFilterObject]);

    const handelClickOnFilterItem = (
      id: string,
      type: string,
      value: string,
      optionType: 'text' | 'select' | 'multi-select' | 'date'
    ) => {
      setShowFilterDropDownMenu(true);
      setCurrentFilterId(id);
      const newItem: ModuleValueInterface = { label: id, value: value, type };
      setFilterObject((pervArray) => {
        const exist = pervArray?.find((item) => item?.id === id);
        if (exist) {
          return pervArray.map((item) =>
            item?.id === id
              ? {
                  ...item,
                  moduleValue: [...item.moduleValue, newItem],
                }
              : item
          );
        } else {
          const newItemObj: FilterObjectInterface = {
            id,
            optionType,
            moduleValue: [newItem],
          };
          return [...pervArray, newItemObj];
        }
      });
      setShowCurrentOperatorDropdown(true);
    };

    const filteredItems = filterColumnsArray.filter(
      (item) => !selectedFilterObject.some((filter) => filter?.id === item?.id)
    );

    const handelOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!showFilterDropDownMenu) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (focusedIndex === filteredItems?.length - 1) {
          setFocusedIndex(0);
          return;
        }
        setFocusedIndex((perv) => Math.min(perv + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (focusedIndex === 0) {
          setFocusedIndex(filteredItems?.length - 1);
          return;
        }
        setFocusedIndex((perv) => Math.max(perv - 1, 0));
      } else if (e.key === ' ' && focusedIndex !== -1) {
        e.preventDefault();
        const item = filteredItems[focusedIndex];
        if (item) {
          handelClickOnFilterItem(
            item.id,
            FilterFieldsTypeEnums[0],
            item?.value,
            item?.optionType
          );
        }
      } else if (e.key === 'Escape') {
        setShowFilterDropDownMenu(true);
        setCurrentFilterId('');
      }
    };

    useEffect(() => {
      if (showFilterDropDownMenu && dropdownRef.current) {
        dropdownRef.current.focus();
      }
    }, [showFilterDropDownMenu]);

    useEffect(() => {
      const el = itemRefs.current[focusedIndex];
      if (el) {
        el.scrollIntoView({ block: 'nearest' });
      }
    }, [focusedIndex]);

    useEffect(() => {
      const handelKeyboardNavigation = (e: KeyboardEvent) => {
        if (!showFilterDropDownMenu) return;

        const dropdownEl = dropdownRef?.current;
        const isDropdownFocused = document.activeElement === dropdownEl;

        if (!isDropdownFocused) {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            if (dropdownRef?.current) {
              setFocusedIndex(0);
              dropdownRef.current?.focus();
            }
          }
          if (e.key === ' ' && focusedIndex !== -1) {
            e.preventDefault();
            const item = memorizedFilterColumnArray[focusedIndex];

            if (item) {
              handelClickOnFilterItem(
                item.id,
                FilterFieldsTypeEnums[0],
                item?.value,
                item?.optionType
              );
            }
          }
        }
      };
      if (showFilterDropDownMenu)
        window.addEventListener('keydown', handelKeyboardNavigation);

      return () => {
        window.removeEventListener('keydown', handelKeyboardNavigation);
      };
    }, [
      showFilterDropDownMenu,
      focusedIndex,
      currentFilterId,
      filterColumnsArray,
      handelClickOnFilterItem,
    ]);

    return (
      <div
        className={classNames(
          'shadow-xl rounded-md overflow-hidden origin-top transition-all border border-black/15 max-h-[320px] overflow-y-auto hide-scrollbar focus:ring-0 focus:outline-none',
          {
            'scale-y-0 opacity-0': !showFilterDropDownMenu,
            'scale-y-100 opacity-100': showFilterDropDownMenu,
          }
        )}
        ref={dropdownRef}
        tabIndex={0}
        onKeyDown={handelOnKeyDown}
      >
        {currentFilterId === '' &&
          memorizedFilterColumnArray.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={classNames(
                'dropdown-item py-2.5 pl-5 pr-10 text-black hover:bg-gray-100 cursor-pointer border-b border-b-black/10',
                {
                  'bg-gray-200': index === focusedIndex,
                  'bg-white hover:bg-gray-100': index !== focusedIndex,
                }
              )}
              onClick={() =>
                handelClickOnFilterItem(
                  item.id,
                  FilterFieldsTypeEnums[0],
                  item?.value,
                  item?.optionType
                )
              }
            >
              {item.label}
            </div>
          ))}
      </div>
    );
  }
);

export default FilterInputMainFilterDropdown;
