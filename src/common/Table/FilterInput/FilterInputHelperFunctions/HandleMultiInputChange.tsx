import React from 'react';
import { FiSearch } from 'react-icons/fi';

import { handleMultiInputChangeInterface } from '../../../../interface/propsInterface';

const HandleMultiInputChange = React.memo(function HandleMultiInputChange(
  props: handleMultiInputChangeInterface
) {
  const {
    filterObject,
    selectedFilterObject,
    inputFieldRef,
    inputValue,
    setInputValue,
    setShowFilterDropDownMenu,
    optionType,
    searchInputValue,
    setSearchInputValue,
  } = props;

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (optionType === 'text') {
      setInputValue(e.target.value);
    } else if (optionType === 'select' || optionType === 'multi-select') {
      setSearchInputValue(e.target.value);
    }
  };

  return (
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
          value={optionType === 'text' ? inputValue : searchInputValue}
          className='bg-transparent caret-black w-full h-full text-base focus:outline-none focus:ring-0 py-2.5 pl-1.5 pr-4 autofill:!bg-black autofill:text-black'
          style={{ border: 0, color: 'black' }}
          placeholder={filterObject.length === 0 ? 'Filter Search... (⌘K / Ctrl+K to open · ↑ ↓ to navigate · Space to select · Enter to submit)' : ''}
          onFocus={() => setShowFilterDropDownMenu(true)}
          onChange={handelOnChange}
        />
      </div>
    </div>
  );
});
export default HandleMultiInputChange;
