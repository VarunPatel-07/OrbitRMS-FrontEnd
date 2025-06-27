import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function OrganizationSettingLoader() {
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='class="w-full flex flex-col gap-6 pb-5"'>
        <div className='bg-white rounded-xl border border-black/15'>
          <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
            <Skeleton height={28} width={180} />
          </div>
          <div className='p-6 w-full'>
            <div className='grid grid-cols-1 gap-6'>
              <div className='w-fit'>
                <Skeleton height={120} width={120} borderRadius={500} />
              </div>
              <div className='w-full grid grid-cols-3 gap-5'>
                {[...Array(9)].map((_, index) => (
                  <div key={index} className='w-full'>
                    <Skeleton height={14} width={90} />
                    <Skeleton height={18} width={200} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='border border-gray-200 rounded-lg shadow-sm bg-white'>
          <div className='flex items-start flex-col justify-start gap-1 px-6 py-4 border-b border-b-black/20'>
            <Skeleton height={28} width={180} />
          </div>
          <div className='p-6 w-full'>
            <div className='w-full grid grid-cols-3 gap-5'>
              {[...Array(4)].map((_, index) => (
                <div key={index} className='w-full'>
                  <Skeleton height={14} width={90} />
                  <Skeleton height={18} width={200} />
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
            <div className='w-full grid grid-cols-3 gap-5'>
              {[...Array(6)].map((_, index) => (
                <div key={index} className='w-full'>
                  <Skeleton height={14} width={90} />
                  <Skeleton height={18} width={200} />
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
            <div className='w-full grid grid-cols-3 gap-5'>
              {[...Array(3)].map((_, index) => (
                <div key={index} className='w-full'>
                  <Skeleton height={14} width={90} />
                  <Skeleton height={18} width={200} />
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
            <div className='w-full grid grid-cols-3 gap-5'>
              {[...Array(6)].map((_, index) => (
                <div key={index} className='w-full'>
                  <Skeleton height={14} width={90} />
                  <Skeleton height={18} width={200} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default OrganizationSettingLoader;
