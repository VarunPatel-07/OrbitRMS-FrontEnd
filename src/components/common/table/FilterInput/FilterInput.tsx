import React, { SetStateAction, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';

import {
  FilterObjectInterface,
  ModuleValueInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '@/interface/ComponentProps.interface';

import FilterInputDateSelector from '@/components/common/table/FilterInput/FilterInputHelperFunctions/FilterInputDateSelector';
import FilterInputMainFilterDropdown from '@/components/common/table/FilterInput/FilterInputHelperFunctions/FilterInputMainFilterDropdown';
import FiltersOperatorDropdown from '@/components/common/table/FilterInput/FilterInputHelperFunctions/FiltersOperatorDropdown';
import FiltersOptionsDropdown from '@/components/common/table/FilterInput/FilterInputHelperFunctions/FiltersOptionsDropdown';
import FinalFilterRenderHelper from '@/components/common/table/FilterInput/FilterInputHelperFunctions/FinalFilterRenderHelper';
import HandleMultiInputChange from '@/components/common/table/FilterInput/FilterInputHelperFunctions/HandleMultiInputChange';
import { OPTION_TYPE } from '@/utils/constants/filterOperators.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';
import { classNames, convertToTitleCase } from '@/utils/helpers/commonHelpers';
import { IsStringArrayString } from '@/utils/helpers/helpers';

function FilterInput({
  filterColumnsArray,
  handelApplyFilterFunc,
  urlDecodedFilterQuery,
  setUrlDecodedFilterQuery,
}: {
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  handelApplyFilterFunc: (filterArray: FilterObjectInterface[]) => void;
  urlDecodedFilterQuery?: UrlEncodedFilterQueryInterface[];
  setUrlDecodedFilterQuery?: React.Dispatch<
    SetStateAction<UrlEncodedFilterQueryInterface[]>
  >;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const useEffectRef = useRef(false);

  const filterDropDownInputRef = useRef<HTMLDivElement>(null);

  const [showFilterDropDownMenu, setShowFilterDropDownMenu] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState('');

  const [showCurrentOperatorDropdown, setShowCurrentOperatorDropdown] =
    useState<boolean>(false);
  const [showCurrentOptionDropdown, setShowCurrentOptionDropdown] =
    useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [selectedFilterObject, setSelectedFilterObject] = useState<
    FilterObjectInterface[]
  >([]);
  const [filterObject, setFilterObject] = useState<FilterObjectInterface[]>([]);

  // Utility function to update the filterObject state
  const updateFilterObject = (
    newItem: ModuleValueInterface,
    id: string,
    callback?: (updatedArray: FilterObjectInterface[]) => void
  ) => {
    setFilterObject((pervArray) => {
      let updatedArray: FilterObjectInterface[];
      const exist = pervArray?.find((item) => item?.id === id);
      if (exist) {
        updatedArray = pervArray.map((item) =>
          item?.id === id
            ? { ...item, moduleValue: [...item.moduleValue, newItem] }
            : item
        );
      } else {
        updatedArray = [...pervArray, { id, moduleValue: [newItem] }];
      }
      if (callback) {
        callback(updatedArray);
      }
      return updatedArray;
    });
  };

  const updateFinalFilterQuery = (newData: FilterObjectInterface[]) => {
    setSelectedFilterObject((pervArray) => {
      const updatedArray = [...pervArray, ...newData];

      return updatedArray;
    });

    const updatedArray = [...selectedFilterObject, ...newData];

    // Then call the filter function after state updates
    setTimeout(() => {
      if (handelApplyFilterFunc) {
        setFilterObject([]);
        handelApplyFilterFunc(updatedArray);
      }
    }, 0);
    setFilterObject([]);
    setCurrentFilterId('');
    setShowFilterDropDownMenu(false);
    setShowCurrentOperatorDropdown(false);
    setShowCurrentOptionDropdown(false);
    inputFieldRef.current?.blur();
  };

  const handelClickOnDeleteBtn = (data: FilterObjectInterface) => {
    const filterData = selectedFilterObject.filter(
      (item) => item.id != data.id
    );
    setSelectedFilterObject(filterData);
    setCurrentFilterId('');
    setShowFilterDropDownMenu(false);
    setShowCurrentOperatorDropdown(false);
    setShowCurrentOptionDropdown(false);

    if (handelApplyFilterFunc) {
      handelApplyFilterFunc(filterData);
    }
  };

  const handelClearFilterQueryBtn = () => {
    if (setUrlDecodedFilterQuery) setUrlDecodedFilterQuery([]);
    setSelectedFilterObject([]);
    setFilterObject([]);
    setShowFilterDropDownMenu(false);
    setShowCurrentOperatorDropdown(false);
    setShowCurrentOptionDropdown(false);
    setCurrentFilterId('');
    setInputValue('');

    if (handelApplyFilterFunc) {
      handelApplyFilterFunc([]);
    }
  };

  const handelInputFieldFocus = () => {
    inputFieldRef.current?.focus();
  };

  const handelSelectedFilterOnClickOfEnter = () => {
    const selectedFilter = filterColumnsArray.find(
      (val) => val.id === currentFilterId
    );

    if (selectedFilter?.optionType == OPTION_TYPE.TEXT) {
      if (inputValue !== '') {
        const newObject = {
          label: 'input_value',
          value: inputValue.trim(),
          type: FilterFieldsTypeEnums[2],
        };
        updateFilterObject(newObject, currentFilterId, (updatedArray) => {
          updateFinalFilterQuery(updatedArray);
          setInputValue('');
          setSearchInputValue('');
        });
      }
    } else {
      const isExist = Boolean(
        filterObject?.find((arrayObj) =>
          arrayObj.moduleValue?.find(
            (item) => item?.type === FilterFieldsTypeEnums[2]
          )
        )
      );

      if (isExist) {
        updateFinalFilterQuery(filterObject);
        setInputValue('');
        setSearchInputValue('');
      }
    }
  };

  const handelOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      handelSelectedFilterOnClickOfEnter();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropDownInputRef.current &&
        !filterDropDownInputRef.current.contains(event.target as Node)
      ) {
        setShowFilterDropDownMenu(false);

        const isExist = Boolean(
          filterObject?.find((arrayObj) =>
            arrayObj.moduleValue?.find(
              (item) => item?.type === FilterFieldsTypeEnums[2]
            )
          )
        );

        if (isExist) {
          updateFinalFilterQuery(filterObject);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    if (urlDecodedFilterQuery) {
      const modelValueArray: ModuleValueInterface[] = [];

      const filteredFieldArray: FilterObjectInterface[] = [];

      urlDecodedFilterQuery?.forEach((arrayItem) => {
        modelValueArray.push({
          label: arrayItem?.field_name,
          value: convertToTitleCase(arrayItem?.field_name),
          type: FilterFieldsTypeEnums[0],
        });

        modelValueArray.push({
          label: arrayItem?.operator,
          value: convertToTitleCase(arrayItem?.operator),
          type: FilterFieldsTypeEnums[1],
        });
        if (IsStringArrayString(arrayItem?.value)) {
          JSON.parse(arrayItem.value)?.map((item: string) =>
            modelValueArray.push({
              label: item?.toLocaleLowerCase(),
              value: item,
              type: FilterFieldsTypeEnums[2],
            })
          );
        } else {
          modelValueArray.push({
            label: arrayItem?.value,
            value: arrayItem?.value,
            type: FilterFieldsTypeEnums[2],
          });
        }

        const obj: FilterObjectInterface = {
          id: arrayItem?.field_name,
          moduleValue: modelValueArray,
        };
        filteredFieldArray.push(obj);
      });

      setSelectedFilterObject(filteredFieldArray);
    }
  }, []);

  useEffect(() => {
    const handelClickForTheSearchKeyCombination = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowFilterDropDownMenu(true);
        if (showFilterDropDownMenu) {
          const inputElement = inputFieldRef?.current;
          const isInputFocused = document.activeElement === inputElement;
          if (!isInputFocused) {
            handelInputFieldFocus();
          }
        }
      }
    };
    window.addEventListener('keydown', handelClickForTheSearchKeyCombination);

    return () => {
      window.removeEventListener(
        'keydown',
        handelClickForTheSearchKeyCombination
      );
    };
  }, [showFilterDropDownMenu]);

  const RenderFilterDropDownFunction = () => {
    return (
      <div
        className={classNames('drop-down absolute z-50 top-full mt-1', {
          'scale-y-0 opacity-0': !showFilterDropDownMenu,
          'scale-y-100 opacity-100': showFilterDropDownMenu,
        })}
      >
        <div className='flex items-start justify-start gap-2'>
          {/* Filter Dropdown */}
          {currentFilterId?.trim() === '' && (
            <FilterInputMainFilterDropdown
              currentFilterId={currentFilterId}
              filterColumnsArray={filterColumnsArray}
              selectedFilterObject={selectedFilterObject}
              setCurrentFilterId={setCurrentFilterId}
              setFilterObject={setFilterObject}
              setShowCurrentOperatorDropdown={setShowCurrentOperatorDropdown}
              setShowFilterDropDownMenu={setShowFilterDropDownMenu}
              showFilterDropDownMenu={showFilterDropDownMenu}
            />
          )}

          {/* Operator Dropdown */}
          {currentFilterId?.trim() !== '' && showCurrentOperatorDropdown && (
            <FiltersOperatorDropdown
              currentFilterId={currentFilterId}
              filterColumnsArray={filterColumnsArray}
              showCurrentOperatorDropdown={showCurrentOperatorDropdown}
              updateFilterObject={updateFilterObject}
              setShowCurrentOperatorDropdown={setShowCurrentOperatorDropdown}
              setShowCurrentOptionDropdown={setShowCurrentOptionDropdown}
              handelInputFieldFocus={handelInputFieldFocus}
              showFilterDropDownMenu={showFilterDropDownMenu}
            />
          )}

          {/* Options Dropdown */}
          {currentFilterId?.trim() !== '' &&
            (
              filterColumnsArray?.find((item) => item?.id === currentFilterId)
                ?.options || []
            )?.length > 0 && (
              <FiltersOptionsDropdown
                currentFilterId={currentFilterId}
                filterColumnsArray={filterColumnsArray}
                showCurrentOptionDropdown={showCurrentOptionDropdown}
                filterObject={filterObject}
                setShowCurrentOperatorDropdown={setShowCurrentOperatorDropdown}
                setShowCurrentOptionDropdown={setShowCurrentOptionDropdown}
                updateFilterObject={updateFilterObject}
                setFilterObject={setFilterObject}
                updateFinalFilterQuery={updateFinalFilterQuery}
                setInputValue={setInputValue}
                showFilterDropDownMenu={showFilterDropDownMenu}
                searchInputValue={searchInputValue}
                enterClickHandler={handelSelectedFilterOnClickOfEnter}
              />
            )}

          {currentFilterId?.trim() !== '' &&
            filterColumnsArray?.find((item) => item?.id === currentFilterId)
              ?.optionType === OPTION_TYPE.DATE && (
              <FilterInputDateSelector
                setShowCurrentOptionDropdown={setShowCurrentOptionDropdown}
                showCurrentOptionDropdown={showCurrentOptionDropdown}
                currentFilterId={currentFilterId}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                updateFilterObject={updateFilterObject}
                updateFinalFilterQuery={updateFinalFilterQuery}
                setInputValue={setInputValue}
              />
            )}
        </div>
      </div>
    );
  };

  console.log('selectedFilterObject', 'parsedFilter', selectedFilterObject);

  return (
    <div className='w-full relative' ref={boxRef}>
      <div
        className='rounded-lg relative w-full bg-white pr-7'
        ref={filterDropDownInputRef}
        onKeyDown={handelOnKeyDown}
      >
        <div className='flex items-stretch flex-nowrap justify-start overflow-auto  hide-scrollbar'>
          {selectedFilterObject.length > 0 && (
            <FinalFilterRenderHelper
              filterArray={selectedFilterObject}
              background='bg-gray-300'
              handelClickOnDeleteBtn={handelClickOnDeleteBtn}
            />
          )}
          {filterObject.length > 0 && (
            <FinalFilterRenderHelper filterArray={filterObject} />
          )}

          {/* This Section Is Used To Render The InputField With The DropDown Section */}
          <div
            className='flex-grow w-fit relative focus:outline-none focus:ring-0'
            tabIndex={0}
          >
            {/* We Will Render The Input That Handel Multiple Input That Will Handel The Field Like text ,select ,multi-select */}
            <HandleMultiInputChange
              filterObject={filterObject}
              inputFieldRef={inputFieldRef}
              inputValue={inputValue}
              selectedFilterObject={selectedFilterObject}
              setInputValue={setInputValue}
              setShowFilterDropDownMenu={setShowFilterDropDownMenu}
              searchInputValue={searchInputValue}
              setSearchInputValue={setSearchInputValue}
              optionType={
                filterColumnsArray?.find((item) => item?.id == currentFilterId)
                  ?.optionType
              }
            />
          </div>
        </div>

        {/* This Button Is Used When Clicked All The Module is Removed */}

        {(selectedFilterObject?.length > 0 || filterObject?.length > 0) && (
          <button
            className='absolute top-1/2 -translate-y-1/2 right-1'
            onClick={handelClearFilterQueryBtn}
          >
            <IoClose className='text-black text-xl' />
          </button>
        )}
      </div>

      {filterDropDownInputRef.current &&
        createPortal(
          RenderFilterDropDownFunction(),
          filterDropDownInputRef.current
        )}
    </div>
  );
}

export default FilterInput;
