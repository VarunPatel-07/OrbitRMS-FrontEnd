import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FixedSizeList as VirtualList } from 'react-window';

import { classNames } from '../../../../Helper/HelperFunctions';
import {
  FiltersOptionsDropdownInterface,
  ModuleValueInterface,
} from '../../../../interface/propsInterface';

const FiltersOptionsDropdown = React.memo(function FiltersOptionsDropdown(
  props: FiltersOptionsDropdownInterface
) {
  const {
    filterColumnsArray,
    showCurrentOptionDropdown,
    currentFilterId,
    filterObject,
    setShowCurrentOperatorDropdown,
    setShowCurrentOptionDropdown,
    updateFilterObject,
    setFilterObject,
    updateFinalFilterQuery,
    setInputValue,
    showFilterDropDownMenu,
    searchInputValue,
    enterClickHandler,
  } = props;
  const virtualListRef = useRef<VirtualList>(null);

  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  const [focusedIndex, setFocusedIndex] = useState(0);

  const memoizedCurrentOptions = useMemo(() => {
    return (
      filterColumnsArray.find((val) => val.id === currentFilterId)?.options ||
      []
    );
  }, [filterColumnsArray, searchInputValue]);

  const memoizedFilteredOptions = useMemo(() => {
    const selectedLabels = new Set(
      filterObject
        .flatMap((object) => object?.moduleValue || [])
        .map((entity) => entity.label?.toLowerCase())
    );

    return memoizedCurrentOptions.filter(
      (item) =>
        item?.value?.toLowerCase().includes(searchInputValue?.toLowerCase()) &&
        !selectedLabels.has(item.label?.toLowerCase())
    );
  }, [memoizedCurrentOptions, searchInputValue, filterObject]);

  const handelOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!showCurrentOptionDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (focusedIndex === memoizedFilteredOptions?.length - 1) {
        return;
      }
      setFocusedIndex((perv) =>
        Math.min(perv + 1, memoizedFilteredOptions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (focusedIndex === 0) {
        setFocusedIndex(memoizedFilteredOptions?.length - 1);
        return;
      }
      setFocusedIndex((perv) => Math.max(perv - 1, 0));
    } else if (e.key === ' ' && focusedIndex !== -1) {
      e.preventDefault();
      const item = memoizedFilteredOptions[focusedIndex];
      if (item) {
        handelOptionsClick(item);
      }
    } else if (e.key === 'Escape') {
      setShowCurrentOptionDropdown(false);
    } else if (e.key === 'Enter') {
      enterClickHandler();
    }
  };

  const handelOptionsClick = useCallback(
    (data: ModuleValueInterface) => {
      setShowCurrentOperatorDropdown(false);
      setShowCurrentOptionDropdown(true);

      const currentModule = filterColumnsArray.find(
        (val) => val.id === currentFilterId
      );

      if (currentModule?.optionType === 'multi-select') {
        if (memoizedFilteredOptions?.length === 1) {
          updateFilterObject(
            { label: data.label, value: data.value, type: data?.type },
            currentFilterId,
            (updatedArray) => {
              updateFinalFilterQuery(updatedArray);
              setInputValue('');
            }
          );
        } else {
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
    },
    [
      filterColumnsArray,
      currentFilterId,
      filterObject,
      updateFilterObject,
      setFilterObject,
      updateFinalFilterQuery,
      setInputValue,
      setShowCurrentOperatorDropdown,
      setShowCurrentOptionDropdown,
    ]
  );

  const renderOptionsDropdown = () => {
    const height =
      memoizedFilteredOptions.length >= 8
        ? 320
        : memoizedFilteredOptions.length * 45;

    if (memoizedFilteredOptions.length === 0) return null;

    const Row = React.memo(
      ({
        index,
        style,
        data,
      }: {
        index: number;
        style: React.CSSProperties;
        data: {
          items: ModuleValueInterface[];
          focusedIndex: number;
          onClick: (item: ModuleValueInterface) => void;
        };
      }) => {
        const item = data.items[index];
        const { focusedIndex, onClick } = data;

        return (
          <div
            key={item.label}
            style={style}
            className={classNames(
              'dropdown-item py-2.5 pl-5 pr-10 text-black cursor-pointer border-b border-b-black/10 whitespace-nowrap text-ellipsis overflow-hidden',
              {
                'bg-gray-200': index === focusedIndex, // focused option (highlighted)

                'bg-white hover:bg-gray-50': index !== focusedIndex, // normal
              }
            )}
            onClick={() => onClick(item)}
          >
            <span className='font-inter text-base inline-block whitespace-nowrap w-full text-ellipsis overflow-hidden'>
              {item.value}
            </span>
          </div>
        );
      }
    );

    return (
      <div
        className='bg-white w-max min-w-[300px] max-w-[400px]'
        style={{ height }}
      >
        <VirtualList
          ref={virtualListRef}
          height={height}
          itemCount={memoizedFilteredOptions.length}
          itemSize={45}
          width='100%'
          className='hide-scrollbar w-full'
          itemData={{
            items: memoizedFilteredOptions,
            focusedIndex,
            onClick: handelOptionsClick,
          }}
        >
          {Row}
        </VirtualList>
      </div>
    );
  };

  useEffect(() => {
    if (showCurrentOptionDropdown && optionsDropdownRef.current) {
      optionsDropdownRef.current.focus();
    }
  }, [showCurrentOptionDropdown, showFilterDropDownMenu]);

  useEffect(() => {
    if (
      showCurrentOptionDropdown &&
      virtualListRef.current &&
      focusedIndex !== -1
    ) {
      virtualListRef.current.scrollToItem(focusedIndex, 'smart');
    }
  }, [focusedIndex, showCurrentOptionDropdown]);

  useEffect(() => {
    const handelKeyboardNavigation = (e: KeyboardEvent) => {
      if (!showCurrentOptionDropdown) return;

      const dropdownEl = optionsDropdownRef?.current;
      const isDropdownFocused = document.activeElement === dropdownEl;

      if (!isDropdownFocused) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          if (optionsDropdownRef?.current) {
            setFocusedIndex(0);
            optionsDropdownRef.current?.focus();
          }
        }
        if (e.key === ' ' && focusedIndex !== -1) {
          e.preventDefault();
          const item = memoizedFilteredOptions[focusedIndex];

          if (item) {
            handelOptionsClick(item);
          }
        }
      }
    };
    if (showCurrentOptionDropdown)
      window.addEventListener('keydown', handelKeyboardNavigation);

    return () => {
      window.removeEventListener('keydown', handelKeyboardNavigation);
    };
  }, [
    showCurrentOptionDropdown,
    focusedIndex,
    currentFilterId,
    filterColumnsArray,
    searchInputValue,
    handelOptionsClick,
  ]);

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
      onKeyDown={handelOnKeyDown}
    >
      {renderOptionsDropdown()}
    </div>
  );
});

export default FiltersOptionsDropdown;
