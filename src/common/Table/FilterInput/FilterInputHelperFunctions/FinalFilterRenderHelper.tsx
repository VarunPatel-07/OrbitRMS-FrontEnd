import { useContext } from 'react';

import { IoClose } from 'react-icons/io5';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../../../Context/globalState/GlobalStateContectApi';
import { FilterFieldsTypeEnums } from '../../../../enums/enums';
import { classNames, formatIsoDate } from '../../../../Helper/HelperFunctions';
import {
  FilterObjectInterface,
  ModuleValueInterface,
} from '../../../../interface/propsInterface';

function FinalFilterRenderHelper({
  filterArray,
  background = 'bg-gray-100',
  handelClickOnDeleteBtn,
}: {
  filterArray: FilterObjectInterface[];
  background?: string;
  handelClickOnDeleteBtn?: (data: FilterObjectInterface) => void;
}) {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const dateRangDateAndString = (
    queryEntity: ModuleValueInterface | undefined,
    queryOperator: ModuleValueInterface | undefined,
    queryValue: ModuleValueInterface | undefined
  ) => {
    if (
      queryEntity !== undefined ||
      queryOperator !== undefined ||
      queryValue !== undefined
    ) {
      if (queryEntity?.label === 'date') {
        if (queryOperator?.label === 'between') {
          const value = queryValue?.value
            ? JSON.parse(queryValue?.value)
            : { start_date: '', end_date: '' };
          return `${formatIsoDate(
            value?.start_date,
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat
          )} - ${formatIsoDate(
            value?.end_date,
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat
          )}`;
        }
        if (queryOperator?.label === 'is') {
          return queryValue?.value
            ? formatIsoDate(
                queryValue?.value,
                GlobalStateProvider?.organization?.organization_settings
                  ?.default_dateformat
              )
            : '';
        }
      } else {
        return queryValue?.value;
      }
    } else {
      return '-';
    }
  };

  const renderQueryOptions = (
    query: ModuleValueInterface,
    id: number,
    queryArray: FilterObjectInterface
  ) => {
    const queryEntity = queryArray?.moduleValue?.find(
      (item) => item?.type === 'Entity'
    );
    const queryOperator = queryArray?.moduleValue?.find(
      (item) => item?.type === 'Operator'
    );
    const queryDateValue = queryArray?.moduleValue?.find(
      (item) => item?.label === 'date' && item?.type === 'Options'
    );

    return (
      <span
        key={`query-${id}`}
        className={classNames(
          'bg-white border border-slate-300 rounded-md px-2 text-sm h-full flex items-center justify-center',
          {
            'font-medium text-black': query?.type === FilterFieldsTypeEnums[0],
            'text-black/80': query?.type !== FilterFieldsTypeEnums[0],
          }
        )}
      >
        {query?.type === 'Options' ? (
          <>
            {queryDateValue
              ? dateRangDateAndString(
                  queryEntity,
                  queryOperator,
                  queryDateValue
                )
              : query?.customLayout
                ? query?.customLayout
                : query.value}
          </>
        ) : (
          query.value
        )}
      </span>
    );
  };
  return (
    <div className='w-fit py-1 pl-1 flex flex-wrap gap-2 h-full'>
      {filterArray.map((arrayQuery, index) => (
        <div
          key={`${arrayQuery?.id}-${index}`}
          className={`${background} p-1 flex items-center justify-center rounded-md gap-2`}
        >
          <div className='flex items-center gap-1 h-full'>
            {arrayQuery?.moduleValue?.map((query, id) =>
              renderQueryOptions(query, id, arrayQuery)
            )}
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
