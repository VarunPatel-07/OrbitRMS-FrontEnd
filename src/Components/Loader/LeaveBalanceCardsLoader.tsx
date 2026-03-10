import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { LeaveBalanceCardLoaderInterface } from '../../interface/LeavesModule';

const LeaveBalanceCardLoader = ({
  totalNumberOfCards,
}: LeaveBalanceCardLoaderInterface) => {
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full flex items-stretch max-w-full flex-nowrap gap-4 overflow-auto hide-scrollbar'>
        {Array.from({ length: totalNumberOfCards })?.map((_, index) => (
          <div
            key={index}
            className='min-w-[300px] w-full max-w-[300px] bg-white rounded-lg overflow-hidden border border-gray-200'
          >
            <div className='bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-3'>
              <div className='flex items-center justify-between'>
                <div className='w-full'>
                  <Skeleton
                    width={200}
                    height={18}
                    className='inline-block'
                  />
                </div>
              </div>
            </div>

            <div className='px-6 py-5'>
              <div className='flex items-center justify-between'>
                <Skeleton width={120} height={18} className='inline-block' />
                <Skeleton
                  width={40}
                  height={18}
                  className='inline-block'
                  borderRadius={100}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

export default LeaveBalanceCardLoader;
