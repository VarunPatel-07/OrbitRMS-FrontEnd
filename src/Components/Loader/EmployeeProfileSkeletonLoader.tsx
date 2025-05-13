import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const EmployeeProfileSkeletonLoader = () => {
  return (
    <SkeletonTheme>
      <div className='class="w-full flex flex-col gap-6 pb-5"'>
      <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
        <div className=' w-full grid grid-cols-3 '>
          <div className='w-full border-r border-r-black/40'>
            <div className='w-full h-full flex  items-center p-6'>
              <div className='w-full'>
                <Skeleton height={40} width={40} className='mb-3' />
                <Skeleton height={22} width={92} />
              </div>
            </div>
          </div>
          <div className='w-full border-r border-r-black/40'>
            <div className='w-full h-full flex  items-center p-6'>
              <div className='w-full'>
                <Skeleton height={40} width={40} className='mb-3' />
                <Skeleton height={22} width={92} />
              </div>
            </div>
          </div>
          <div className='w-full '>
            <div className='w-full h-full flex  items-center p-6'>
              <div className='w-full'>
                <Skeleton height={40} width={40} className='mb-3' />
                <Skeleton height={22} width={92} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <Skeleton height={28} width={180} />
        </div>
        <div className='p-6 w-full'>
            <div className="w-full grid grid-cols-3 gap-5">
            {[...Array(9)].map((_, index) => (
              <div key={index} className='w-full'>
                <Skeleton height={22} width={90} className='mb-1' />
                <Skeleton height={22} width={150} />
              </div>
            ))}
            </div>
        </div>
      </div>

      <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <Skeleton height={28} width={180} />
        </div>
        <div className='p-6 w-full'>
            <div className="w-full grid grid-cols-3 gap-5">
            {[...Array(6)].map((_, index) => (
              <div key={index} className='w-full'>
                <Skeleton height={22} width={90} className='mb-1' />
                <Skeleton height={22} width={150} />
              </div>
            ))}
            </div>
        </div>
      </div>

      <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <Skeleton height={28} width={180} />
        </div>
        <div className='p-6 w-full'>
            <div className="w-full grid grid-cols-2 gap-5">
            {[...Array(4)].map((_, index) => (
              <div key={index} className='w-full'>
                <Skeleton height={22} width={90} className='mb-1' />
                <Skeleton height={22} width={150} />
              </div>
            ))}
            </div>
        </div>
      </div>

      <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <Skeleton height={28} width={180} />
        </div>
        <div className='p-6 w-full'>
            <div className="w-full grid grid-cols-2 gap-5">
            {[...Array(4)].map((_, index) => (
              <div key={index} className='w-full'>
                <Skeleton height={22} width={90} className='mb-1' />
                <Skeleton height={22} width={150} />
              </div>
            ))}
            </div>
        </div>
      </div>

      <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
        <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
          <Skeleton height={28} width={180} />
        </div>
        <div className='p-6 w-full'>
        <div  className='w-full'>
                <Skeleton height={22} width={90} className='mb-1' />
                <Skeleton height={22} width={150}  className='mb-5'/>
              </div>
            <div className="w-full grid grid-cols-2 gap-5">
            {[...Array(4)].map((_, index) => (
              <div key={index} className='w-full'>
                <Skeleton height={22} width={90} className='mb-1' />
                <Skeleton height={22} width={150} />
              </div>
            ))}
            </div>
        </div>
      </div>
      </div>
  </SkeletonTheme>
  );
};

export default EmployeeProfileSkeletonLoader;
