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
    <div
      className={`overflow-auto ${tableWrapperClass} hide-scrollbar border border-black/10 border-t-0`}
    >
      <table className='table-auto border-collapse w-full relative'>
        <thead>
          <tr className={`${stickyHeaderClass} shadow z-30`}>
            {columns.map((column, index) => (
              <th
                key={`${Math.random()}-row-${index}`}
                className={classNames(
                  'px-6 py-2.5 text-left bg-[#eef0f4] text-black',
                  {
                    'min-w-fit sticky right-0 shadow-2xl':
                      column?.key == 'action' && column?.isSticky,
                  }
                )}
              >
                <span className='flex items-center justify-start gap-1'>
                  <span className='font-inter text-[15px] text-black/80 font-medium'>
                    {column.title}
                  </span>
                  {column.isSortable && (
                    <span className='flex flex-col items-center justify-center w-3.5'>
                      <button className='h-3.5 flex items-center justify-center relative'>
                        <FaSortUp className='h-3.5 w-3.5 absolute bottom-[-7px] text-gray-500' />
                      </button>
                      <button className='h-3.5 flex items-center justify-center relative'>
                        <FaSortDown className='h-3.5 w-3.5 absolute top-[-6px] text-gray-500' />
                      </button>
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, index: number) => (
            <tr key={Math.random() * index} className='group relative'>
              {columns.map((column) => {
                return (
                  <td
                    key={`row-${Math.random() * Math.random()}`}
                    className={classNames(
                      'bg-white px-6 py-3 text-black group-hover:bg-gray-50 cursor-pointe min-w-[220px]',
                      {
                        'border-b border-b-black/10':
                          data?.length === 1 || data?.length !== index + 1,
                        'min-w-fit sticky right-0 shadow-2xl bg-white border-0':
                          column?.key == 'action' && column?.isSticky,
                        'min-w-fit relative border-0':
                          column?.key == 'action' && !column?.isSticky,
                      }
                    )}
                  >
                    {column?.key == 'action' && (
                      <>
                        <span className='w-[1px] h-full bg-black/15 inline-block top-0 left-0 absolute'></span>
                      </>
                    )}
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
