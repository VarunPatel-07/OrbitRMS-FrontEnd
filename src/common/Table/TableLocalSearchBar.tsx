/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { SetStateAction, startTransition, useState } from 'react';

import SearchInput from './SearchInput';

function TableLocalSearchBar({
  setShowSearchFilterData,
  data,
  search_key,
  setData,
}: {
  setShowSearchFilterData: React.Dispatch<SetStateAction<boolean>>;
  data: Array<any>;
  search_key: string;
  setData: React.Dispatch<SetStateAction<Array<any>>>;
}) {
  const [searchValue, setSearchValue] = useState<string>('');

  const handelOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = e.target.value;
    setSearchValue(val);
    if (val.length <= 0) {
      setSearchValue('');
      startTransition(() => {
        setShowSearchFilterData(false);
        setData([]);
      });
    }
  };

  const handelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handelSearchButtonClick();
    }
  };

  const handelSearchButtonClick = () => {
    if (searchValue?.trim().length <= 0) return;
    const filterData = data.filter((item) =>
      item[search_key]
        ?.toLocaleLowerCase()
        .includes(searchValue?.toLocaleLowerCase())
    );

    startTransition(() => {
      setShowSearchFilterData(true);
      setData(filterData);
    });
  };

  const handelCancelButton = () => {
    setSearchValue('');

    startTransition(() => {
      setShowSearchFilterData(false);
      setData([]);
    });
  };
  return (
    <div className='w-ful p-2 bg-gray-200 border-x border-x-black/5'>
      <div className='flex items-stretch justify-between gap-2'>
        <div className='w-full'>
          <SearchInput
            value={searchValue}
            handelOnChange={handelOnChange}
            handelCancelButton={handelCancelButton}
            handelKeyDown={handelKeyDown}
          />
        </div>
        <div className=''>
          <button
            className='font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize'
            onClick={handelSearchButtonClick}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableLocalSearchBar;
