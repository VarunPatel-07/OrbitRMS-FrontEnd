import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { classNames } from '../../../../Helper/HelperFunctions';

function RolesAndPermissionLoader() {
  const handleRenderTableRows = (
    hierarchyLevel: number,
    isSubModule: boolean = true,
    _index: number
  ) => {
    return (
      <tr className='group back' key={_index}>
        <td
          className={classNames(
            `bg-white px-6 py-3 text-black cursor-pointe min-w-[300px]  border-b border-b-black/15 text-center`,
            {
              'bg-[#E9ECF0]': isSubModule,
              'group-hover:bg-gray-50': !isSubModule,
            }
          )}
          style={{
            paddingLeft:
              hierarchyLevel == 0 ? '20px' : `${hierarchyLevel * 30}px`,
          }}
        >
          <span className='flex items-center justify-start'>
            {hierarchyLevel != 0 && (
              <span className='pr-1.5'>
                <Skeleton width={22} height={22} className='inline-block' />
              </span>
            )}

            <Skeleton width={150} height={22} className='inline-block' />
          </span>
        </td>
        <td
          className={classNames(
            'bg-white px-6 py-3 text-black cursor-pointe border-l border-l-black/15 border-b border-b-black/15 text-center',
            {
              'bg-[#E9ECF0]': isSubModule,
              'group-hover:bg-gray-50': !isSubModule,
            }
          )}
        >
          <span>
            <Skeleton
              width={80}
              height={22}
              className='inline-block text-center'
            />
          </span>
        </td>
        {Array.from({ length: 3 }).map((_, index) => (
          <td
            className={classNames(
              'bg-white px-6 py-3 text-black cursor-pointe border-l border-l-black/15 border-b border-b-black/15 text-center',
              {
                'bg-[#E9ECF0]': isSubModule,
                'group-hover:bg-gray-50': !isSubModule,
              }
            )}
            key={index * _index}
          >
            <Skeleton width={25} height={25} circle className='inline-block' />
          </td>
        ))}
      </tr>
    );
  };

  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full p-6 bg-white rounded-t-lg'>
        <div className='w-full flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <p className='text-slate-950 font-semibold capitalize text-xl font-inter'>
              <Skeleton width={200} height={22} className='inline-block' />
            </p>
          </div>
          <div className='flex items-center justify-end gap-3'>
            <Skeleton width={100} height={26} className='inline-block' />
          </div>
        </div>
      </div>
      <div className='overflow-auto hide-scrollbar max-h-[calc(100vh-210px)] rounded-b-lg'>
        <table className='table-auto border-collapse w-full relative'>
          <thead>
            <tr className='shadow sticky top-0 z-30'>
              <th
                className={classNames(
                  'px-6 py-2.5 text-left bg-[#eef0f4] text-black ',
                  {}
                )}
              >
                <Skeleton width={200} height={22} className='inline-block' />
              </th>
              <th
                className={classNames(
                  'px-6 py-2.5 bg-[#eef0f4] text-black text-center',
                  {}
                )}
              >
                <Skeleton width={100} height={22} className='inline-block' />
              </th>
              <th
                className={classNames(
                  'px-6 py-2.5 text-center bg-[#eef0f4] text-black ',
                  {}
                )}
              >
                <Skeleton width={100} height={22} className='inline-block' />
              </th>
              <th
                className={classNames(
                  'px-6 py-2.5 text-center bg-[#eef0f4] text-black ',
                  {}
                )}
              >
                <Skeleton width={100} height={22} className='inline-block' />
              </th>
              <th
                className={classNames(
                  'px-6 py-2.5 text-center bg-[#eef0f4] text-black ',
                  {}
                )}
              >
                <Skeleton width={100} height={22} className='inline-block' />
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 4 }).map((_, index) => {
              const RandomInt = Math.random();
              return (
                <React.Fragment key={index}>
                  {handleRenderTableRows(0, false, RandomInt * 100)}
                  {Array.from({ length: 4 }).map((_, innerIndex) => {
                    return (
                      <React.Fragment key={innerIndex}>
                        {handleRenderTableRows(2, false, (RandomInt + 2) * 44)}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </SkeletonTheme>
  );
}

export default RolesAndPermissionLoader;
