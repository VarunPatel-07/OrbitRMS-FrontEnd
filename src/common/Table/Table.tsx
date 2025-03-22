/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaSortDown, FaSortUp } from 'react-icons/fa';

import { classNames } from '../../Helper/HelperFunctions';

import '../../css/common.css';

import { Column } from '../../interface/propsInterface';

function Table({
  columns,
  data,
  tableWrapperClass,
  stickyHeaderClass,
}: {
  columns: Array<Column>;
  data: any;
  tableWrapperClass?: string;
  stickyHeaderClass?: string;
}) {
  // Example data

  return (
    <div className={`overflow-auto ${tableWrapperClass} hide-scrollbar`}>
      <table className='table-auto border-collapse w-full relative'>
        <thead>
          <tr className={`${stickyHeaderClass} shadow`}>
            {columns.map((column) => (
              <th
                key={column.key}
                className={classNames(
                  'px-6 py-2 text-left bg-[#eef0f4] text-black',
                  {}
                )}
              >
                <span className='flex items-center justify-start gap-1'>
                  <span>{column.title}</span>
                  {column.isSortable && (
                    <span className='flex flex-col items-center justify-center w-4'>
                      <button className='h-4 flex items-center justify-center relative'>
                        <FaSortUp className='h-4 w-4 absolute bottom-[-8px] text-gray-500' />
                      </button>
                      <button className='h-4 flex items-center justify-center relative'>
                        <FaSortDown className='h-4 w-4 absolute top-[-8px] text-gray-500' />
                      </button>
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id} className='group'>
              {columns.map((column) => {
                return (
                  <td
                    key={column.key}
                    className={classNames(
                      'bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointer',
                      {}
                    )}
                  >
                    {column?.key == 'action'
                      ? column.renderContent(row)
                      : column.renderContent(
                          row[column.key],
                          column.childKey ? row[column.childKey] : null
                        )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
