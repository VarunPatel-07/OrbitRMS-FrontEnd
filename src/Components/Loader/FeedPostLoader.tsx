import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function FeedPostLoader() {
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full flex flex-col items-start justify-start gap-4 px-4 py-4'>
        {Array.from({ length: 7 })?.map((_, index) => (
          <div
            className='w-full border border-black/10 rounded-lg overflow-hidden'
            key={index}
          >
            <div className='w-full flex items-center justify-between px-3.5 py-2 bg-[var(--main-white-color)] border-b border-b-black/10'>
              <div className='flex items-center justify-start gap-3'>
                <Skeleton height={40} width={40} circle />
                <div className='flex flex-col items-start justify-start gap-0.5'>
                  <p className='text-black/70 text-xs'>
                    <Skeleton height={15} width={200} />
                  </p>
                  <p className='text-black/70 text-xs'>
                    <Skeleton height={12} width={150} className='mt-0.5' />
                  </p>
                </div>
              </div>
            </div>

            <div className='p-3.5 w-full'>
              <Skeleton height={200} width={'100%'} />
            </div>

            <div className='px-3.5 pb-3.5 text-black'>
              <Skeleton height={15} width={'100%'} />
              <Skeleton height={15} width={'90%'} />
              <Skeleton height={15} width={'80%'} />
              <Skeleton height={15} width={'70%'} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}

export default FeedPostLoader;
