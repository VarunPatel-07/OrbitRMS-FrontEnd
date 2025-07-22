import { IoClose } from 'react-icons/io5';

import { FilterFieldsTypeEnums } from '../../../../enums/enums';
import { classNames } from '../../../../Helper/HelperFunctions';
import { FilterObjectInterface } from '../../../../interface/propsInterface';

function FinalFilterRenderHelper({
  filterArray,
  background = 'bg-gray-100',
  handelClickOnDeleteBtn,
}: {
  filterArray: FilterObjectInterface[];
  background?: string;
  handelClickOnDeleteBtn?: (data: FilterObjectInterface) => void;
}) {
  return (
    <div className='w-fit py-1 pl-1 flex flex-wrap gap-2 h-full'>
      {filterArray.map((arrayQuery, index) => (
        <div
          key={`${arrayQuery?.id}-${index}`}
          className={`${background} p-1 flex items-center justify-center rounded-md gap-2`}
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
                    'text-black/80': query?.type !== FilterFieldsTypeEnums[0],
                  }
                )}
              >
                {query.value}
              </span>
            ))}
          </div>
          {handelClickOnDeleteBtn && (
            <button onClick={() => handelClickOnDeleteBtn(arrayQuery)}>
              <IoClose className='w-5 h-5 text-black' />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default FinalFilterRenderHelper;
