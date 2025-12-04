import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

import { classNames } from '../../../Helper/HelperFunctions';

function TableSkeletonLoader({
  showHeaderLoader = true,
  showFilterLoader = true,
  showTableHeader = true,
  tableHeaderCount,
  tableValueCount,
  showPaginationLoader = true,
  maxHeight,
}: {
  showHeaderLoader?: boolean;
  showFilterLoader?: boolean;
  showTableHeader?: boolean;
  tableHeaderCount: number;
  tableValueCount: number;
  showPaginationLoader?: boolean;
  maxHeight?: string;
}) {
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      {showHeaderLoader && (
        <div
          className='w-full p-6 bg-white rounded-t-lg border border-black/10 border-b-0'
          aria-hidden='true'
        >
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center justify-start gap-2'>
              <p className='text-gray-800 font-semibold capitalize text-xl font-inter'>
                <Skeleton width={220} height={28} className='inline-block' />
              </p>
              <span className='text-sm font-inter font-medium'>
                <Skeleton
                  width={120}
                  height={28}
                  className='inline-block mt-1'
                  borderRadius={30}
                />{' '}
              </span>
            </div>
            <div className='flex items-center justify-end gap-3'>
              <Skeleton width={35} height={35} className='inline-block' />{' '}
              <Skeleton width={35} height={35} className='inline-block' />
            </div>
          </div>
        </div>
      )}
      {showFilterLoader && (
        <div
          aria-hidden='true'
          className='p-2 bg-gray-200 w-full relative border border-black/10 border-b-0'
        >
          <div className='flex items-stretch justify-between h-10 -translate-y-1 gap-3'>
            <div className='w-full'>
              <Skeleton
                width={'100%'}
                height={'100%'}
                className='inline-block'
              />
            </div>
            <div className='min-w-20'>
              <Skeleton
                width={'100%'}
                height={'100%'}
                className='inline-block'
              />
            </div>
          </div>
        </div>
      )}
      <div
        aria-hidden='true'
        className='w-full overflow-auto overflow-x-hidden relative hide-scrollbar border border-black/10 border-b-0 border-t-0'
        style={{ maxHeight: maxHeight || 'calc(100vh - 345px)' }}
      >
        {showTableHeader && (
          <div className='bg-[#eef0f4] flex items-center justify-start sticky top-0 z-10'>
            {Array.from({ length: tableHeaderCount }).map((_, index) => (
              <div
                className={classNames(
                  'px-3 py-3 flex-grow flex items-start justify-start',
                  {}
                )}
                key={index}
                aria-hidden='true'
              >
                <Skeleton width={180} height={22} className='inline-block' />
              </div>
            ))}
          </div>
        )}
        {Array.from({ length: tableValueCount }).map((_, parentIndex) => (
          <div
            className='bg-white flex items-center justify-start'
            key={parentIndex}
          >
            {Array.from({ length: tableHeaderCount }).map((_, index) => (
              <div
                className={classNames(
                  'px-3 py-3 flex-grow flex items-start justify-start',
                  {}
                )}
                key={index}
                aria-hidden='true'
              >
                <Skeleton width={180} height={22} className='inline-block' />
              </div>
            ))}
          </div>
        ))}
      </div>
      {showPaginationLoader && (
        <div
          aria-hidden='true'
          className='w-full bg-white border-t border border-black/10 px-4 py-3 rounded-b-lg'
        >
          <div className='w-full flex items-center justify-between'>
            <div className='flex items-center justify-start gap-2'>
              <p>
                <Skeleton width={130} height={20} className='inline-block' />
              </p>
              <div>
                <Skeleton width={50} height={34} className='inline-block' />
              </div>
            </div>
            <div>
              <Skeleton width={430} height={34} className='inline-block' />
            </div>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
}

export default TableSkeletonLoader;
