import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { LeaveBalanceCardLoaderInterface } from '@/interface/LeavesModule.interface';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const LeaveBalanceSkeleton = ({
  totalNumberOfCards,
  className,
  size = 'xl',
}: LeaveBalanceCardLoaderInterface) => {
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div
        className={twMerge(
          clsx(
            'w-full flex items-stretch max-w-full flex-nowrap gap-4 overflow-auto hide-scrollbar',
            className
          )
        )}
      >
        {Array.from({ length: totalNumberOfCards })?.map((_, index) => (
          <div
            key={index}
            className='w-full max-w-[300px] bg-white rounded-lg overflow-hidden border border-gray-200'
            style={{ minWidth: size === 'xl' ? '300px' : 'auto' }}
          >
            <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3'>
              <div className='flex items-center justify-between'>
                <div className='w-full'>
                  <Skeleton
                    width={size === 'xl' ? 200 : 140}
                    height={size === 'xl' ? 18 : 14}
                    className='inline-block'
                  />
                </div>
              </div>
            </div>

            <div className='px-6 py-5'>
              <div className='flex items-center justify-between'>
                <Skeleton
                  width={size === 'xl' ? 120 : 60}
                  height={size === 'xl' ? 18 : 14}
                  className='inline-block'
                />
                {size == 'xl' && (
                  <Skeleton
                    width={size === 'xl' ? 40 : 25}
                    height={size === 'xl' ? 18 : 14}
                    className='inline-block'
                    borderRadius={100}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default LeaveBalanceSkeleton;
