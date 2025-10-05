import React, { SetStateAction } from 'react';

import {
  FilterObjectInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';
import Button from '../Button';
import FilterInput from './FilterInput/FilterInput';

interface TableFilterSearchBarInterface {
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  handelApplyFilterFunc: (filterArray: FilterObjectInterface[]) => void;
  urlDecodedFilterQuery?: UrlEncodedFilterQueryInterface[];
  setUrlDecodedFilterQuery?: React.Dispatch<
    SetStateAction<UrlEncodedFilterQueryInterface[]>
  >;
}

export default function TableFilterSearchBar(
  props: TableFilterSearchBarInterface
) {
  const {
    filterColumnsArray,
    handelApplyFilterFunc,
    urlDecodedFilterQuery,
    setUrlDecodedFilterQuery,
  } = props;
  return (
    <div className='p-2 bg-gray-200 w-full border border-black/5 border-t-0 border-b-0'>
      <div className='flex items-start justify-between gap-2'>
        <div className='w-full'>
          <FilterInput
            filterColumnsArray={filterColumnsArray}
            handelApplyFilterFunc={handelApplyFilterFunc}
            urlDecodedFilterQuery={urlDecodedFilterQuery}
            setUrlDecodedFilterQuery={setUrlDecodedFilterQuery}
          />
        </div>
        <div className=''>
          <Button
            type='button'
            className='font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize'
            disabled
          >
            filter
          </Button>
        </div>
      </div>
    </div>
  );
}
