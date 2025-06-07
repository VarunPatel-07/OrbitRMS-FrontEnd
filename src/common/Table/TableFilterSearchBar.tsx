import { SearchBarFilterOptionsInterface } from '../../interface/propsInterface';
import FilterInput, { FilterObjectInterface } from './FilterInput';

interface TableFilterSearchBarInterface {
  filterColumnsArray: SearchBarFilterOptionsInterface[];
  handelApplyFilterFunc: (filterArray: FilterObjectInterface[]) => void;
}

export default function TableFilterSearchBar(
  props: TableFilterSearchBarInterface
) {
  const { filterColumnsArray, handelApplyFilterFunc } = props;
  return (
    <div className='p-2 bg-gray-200 w-full border border-black/5 border-t-0 border-b-0'>
      <div className='flex items-start justify-between gap-2'>
        <div className='w-full'>
          <FilterInput
            filterColumnsArray={filterColumnsArray}
            handelApplyFilterFunc={handelApplyFilterFunc}
          />
        </div>
        <div className=''>
          <button className='font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize'>
            filter
          </button>
        </div>
      </div>
    </div>
  );
}
