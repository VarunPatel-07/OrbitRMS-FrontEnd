import React, { useEffect, useRef, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

import { FilterFieldsTypeEnums } from '../../enums/enums';
import { classNames } from '../../Helper/HelperFunctions';
import {
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';



function FilterInput({
  filterColumnsArray,
  handelApplyFilterFunc,
  urlDecodedFilterQuery,
}: {
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  handelApplyFilterFunc: (filterArray: FilterObjectInterface[]) => void;
  urlDecodedFilterQuery?: UrlEncodedFilterQueryInterface[];
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const inputFieldRef = useRef<HTMLInputElement>(null);

  const useEffectRef = useRef(false);

  const filterDropDownInputRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  const [showFilterDropDownMenu, setShowFilterDropDownMenu] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState('');

  const [showCurrentOperatorDropdown, setShowCurrentOperatorDropdown] =
    useState<boolean>(false);
  const [showCurrentOptionDropdown, setShowCurrentOptionDropdown] =
    useState<boolean>(false);

  const [inputValue, setInputValue] = useState<string>('');
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

  const handelClick = (id: string, type: string, value: string) => {
    setShowFilterDropDownMenu(true);
    setCurrentFilterId(id);
    const newItem: ModuleValueInterface = { label: id, value: value, type };
    setFilterObject((pervArray) => {
      const exist = pervArray?.find((item) => item?.id === id);
      if (exist) {
        return pervArray.map((item) =>
          item?.id === id
            ? { ...item, moduleValue: [...item.moduleValue, newItem] }
            : item
        );
      } else {
        return [...pervArray, { id, moduleValue: [newItem] }];
      }
    });
    setShowCurrentOperatorDropdown(true);
  };

  const handelOperatorClick = (data: ModuleValueInterface) => {
    setShowCurrentOperatorDropdown(false);
    setShowCurrentOptionDropdown(true);

    updateFilterObject(
      { label: data.label, value: data.value, type: data?.type },
      currentFilterId
    );

    if (
      filterColumnsArray.find((val) => val.id === currentFilterId)?.options
        ?.length == 0
    ) {
      inputFieldRef.current?.focus();
    }
  };

  const handelOptionsClick = (data: ModuleValueInterface) => {
    setShowCurrentOperatorDropdown(false);
    setShowCurrentOptionDropdown(true);

    const currentModule = filterColumnsArray.find(
      (val) => val.id === currentFilterId
    );

    if (currentModule?.optionType === 'multi-select') {
      const isExist = Boolean(
        filterObject.find((object) =>
          object?.moduleValue?.find(
            (entity) =>
              entity?.label?.toLocaleLowerCase() ===
              data.label?.toLocaleLowerCase()
          )
        )
      );
      if (!isExist) {
        updateFilterObject(
          { label: data.label, value: data.value, type: data?.type },
          currentFilterId
        );
      } else {
        setFilterObject((pervArray) => {
          return pervArray?.map((arrayObj) => {
            if (arrayObj?.id === currentFilterId) {
              const updatedModuleValue = arrayObj?.moduleValue?.filter(
                (moduleValue) =>
                  moduleValue?.label?.toLocaleLowerCase() !==
                  data?.label?.toLocaleLowerCase()
              );

              return { ...arrayObj, moduleValue: updatedModuleValue };
            }
            return arrayObj;
          });
        });
      }
    } else if (currentModule?.optionType === 'select') {
      updateFilterObject(
        { label: data.label, value: data.value, type: data?.type },
        currentFilterId,
        (updatedArray) => {
          updateFinalFilterQuery(updatedArray);
          setInputValue('');
        }
      );
    }
  };

  const handelOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      if (inputValue !== '') {
        const newObject = {
          label: 'input_value',
          value: inputValue.trim(),
          type: FilterFieldsTypeEnums[2],
        };
        updateFilterObject(newObject, currentFilterId, (updatedArray) => {
          updateFinalFilterQuery(updatedArray);
          setInputValue('');
        });
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
        }
      }
    }
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

  const convertToTitleCase = (field_name: string) => {
    return field_name
      ?.split('_')
      .map(
        (word) =>
          word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLocaleLowerCase()
      )
      .join(' ');
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

        modelValueArray.push({
          label: arrayItem?.value,
          value: arrayItem?.value,
          type: FilterFieldsTypeEnums[2],
        });

        const obj: FilterObjectInterface = {
          id: arrayItem?.field_name,
          moduleValue: modelValueArray,
        };
        filteredFieldArray.push(obj);
      });

      setSelectedFilterObject(filteredFieldArray);
    }
  }, []);

  return (
    <div className='w-full relative' ref={boxRef}>
      <div className='flex items-stretch flex-wrap justify-start rounded-lg relative bg-white pr-7'>
        {selectedFilterObject.length > 0 && (
          <div className='w-fit py-1 pl-1 flex flex-wrap gap-2 h-full'>
            {selectedFilterObject.map((arrayQuery, index) => (
              <div
                key={`${arrayQuery?.id}-${index}`}
                className='bg-gray-300 p-1 flex items-center justify-center rounded-md gap-2'
              >
                <div className='flex items-center gap-1 h-full'>
                  {arrayQuery?.moduleValue?.map((query, id) => (
                    <span
                      key={`query-${id}`}
                      className={classNames(
                        'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center',
                        {
                          'font-medium text-black':
                            query?.type === FilterFieldsTypeEnums[0],
                          'text-black/80':
                            query?.type !== FilterFieldsTypeEnums[0],
                        }
                      )}
                    >
                      {query.value}
                    </span>
                  ))}
                </div>
                <button onClick={() => handelClickOnDeleteBtn(arrayQuery)}>
                  <IoClose className='w-5 h-5 text-black' />
                </button>
              </div>
            ))}
          </div>
        )}
        {filterObject.length > 0 && (
          <div className='w-fit py-1 pl-1 flex flex-wrap gap-2 h-full'>
            {filterObject.map((arrayQuery) => (
              <div
                key={arrayQuery?.id}
                className='bg-gray-100 h-full p-1 flex items-center justify-center rounded-md gap-2'
              >
                <div className='flex items-center gap-1 h-full'>
                  {arrayQuery?.moduleValue?.map((query, idx) => (
                    <span
                      key={`query-${idx}`}
                      className={classNames(
                        'bg-white border border-slate-300 text-black rounded-md px-2 text-sm h-full flex items-center justify-center',
                        {
                          'font-medium text-black':
                            query?.type === FilterFieldsTypeEnums[0],
                          'text-black/80':
                            query?.type !== FilterFieldsTypeEnums[0],
                        }
                      )}
                    >
                      {query.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* This Section Is Used To Render The InputField With The DropDown Section */}
        <div
          className='flex-grow w-fit relative focus:outline-none focus:ring-0'
          tabIndex={0}
          ref={filterDropDownInputRef}
          onKeyDown={handelOnKeyDown}
        >
          <div className='flex items-center justify-start flex-grow'>
            {filterObject.length === 0 && selectedFilterObject.length == 0 && (
              <span className='w-fit relative pl-2 pr-0.5'>
                <FiSearch className='text-black text-xl' />
              </span>
            )}
            <div className='w-full flex-grow'>
              <input
                ref={inputFieldRef}
                type='text'
                value={inputValue}
                className='bg-transparent caret-black w-full h-full text-base focus:outline-none focus:ring-0 py-2.5 pl-1.5 pr-4 autofill:!bg-black autofill:text-black'
                style={{ border: 0, color: 'black' }}
                placeholder={
                  filterObject.length === 0 ? 'Filter Search...' : ''
                }
                onFocus={() => setShowFilterDropDownMenu(true)}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
          <div
            className={classNames('drop-down absolute z-50 top-full mt-1', {
              'scale-y-0 opacity-0': !showFilterDropDownMenu,
              'scale-y-100 opacity-100': showFilterDropDownMenu,
            })}
          >
            <div className='flex items-start justify-start gap-2'>
              {/* Filter Dropdown */}
              <div
                className={classNames(
                  'shadow-xl rounded-md overflow-hidden origin-top transition-all border border-black/15',
                  {
                    'scale-y-0 opacity-0': !showFilterDropDownMenu,
                    'scale-y-100 opacity-100': showFilterDropDownMenu,
                  }
                )}
              >
                {currentFilterId === '' &&
                  filterColumnsArray
                    .filter(
                      (item) =>
                        !selectedFilterObject.some(
                          (filter) => filter?.id === item?.id
                        )
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className='dropdown-item py-2.5 pl-5 pr-10 text-black bg-white hover:bg-gray-100 cursor-pointer border-b border-b-black/10'
                        onClick={() =>
                          handelClick(
                            item.id,
                            FilterFieldsTypeEnums[0],
                            item?.value
                          )
                        }
                      >
                        {item.label}
                      </div>
                    ))}
              </div>
              {/* Operator Dropdown */}
              {showCurrentOperatorDropdown && (
                <div
                  className={classNames(
                    'shadow-xl rounded-md overflow-hidden origin-top transition-all border border-black/15',
                    {
                      'scale-y-0 opacity-0': !showCurrentOperatorDropdown,
                      'scale-y-100 opacity-100': showCurrentOperatorDropdown,
                    }
                  )}
                >
                  {filterColumnsArray
                    .find((val) => val.id === currentFilterId)
                    ?.operator?.map((item) => (
                      <div
                        key={item.label}
                        className='dropdown-item py-2.5 pl-5 pr-10 text-black bg-white hover:bg-gray-100 cursor-pointer border-b border-b-black/10'
                        onClick={() => handelOperatorClick(item)}
                      >
                        <span className='font-inter text-base inline-block'>
                          {' '}
                          {item.value}
                        </span>
                      </div>
                    ))}
                </div>
              )}
              {/* Options Dropdown */}
              <div
                className={classNames(
                  'shadow-xl rounded-md overflow-hidden origin-top transition-all relative border border-black/15',
                  {
                    'scale-y-0 opacity-0': !showCurrentOptionDropdown,
                    'scale-y-100 opacity-100': showCurrentOptionDropdown,
                  }
                )}
                ref={optionsDropdownRef}
              >
                {filterColumnsArray
                  .find((val) => val.id === currentFilterId)
                  ?.options?.map((item) => {
                    const isExist = Boolean(
                      filterObject.find((object) =>
                        object?.moduleValue?.find(
                          (entity) =>
                            entity?.label?.toLocaleLowerCase() ===
                            item.label?.toLocaleLowerCase()
                        )
                      )
                    );
                    return (
                      <div
                        key={item.label}
                        className={classNames(
                          'dropdown-item py-2.5 pl-5 pr-10 text-black cursor-pointer border-b border-b-black/10',
                          {
                            'bg-white hover:bg-gray-50': !isExist,
                            'bg-gray-100': isExist,
                          }
                        )}
                        onClick={() => handelOptionsClick(item)}
                      >
                        <span className='font-inter text-base inline-block'>
                          {' '}
                          {item.value}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
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
    </div>
  );
}

export default FilterInput;
