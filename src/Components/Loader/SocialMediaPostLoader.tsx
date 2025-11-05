import Skeleton from 'react-loading-skeleton';

function SocialMediaPostLoader({ length }: { length: number }) {
  return (
    <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white px-5 py-5 rounded-b-lg border border-black/20 border-t-0'>
      {Array.from({ length: length || 4 })?.map((_, index) => (
        <div
          className='w-full border border-black/10 rounded-lg overflow-hidden'
          key={index}
        >
          <div className='w-full flex items-center justify-between px-3.5 py-2 bg-[var(--main-white-color)] border-b border-b-black/10'>
            <div className='flex items-center justify-between gap-3 w-full'>
              <Skeleton height={30} width={90} />
              <div className='flex items-center justify-end gap-2'>
                <Skeleton height={35} width={35} />
                <Skeleton height={35} width={35} />
              </div>
            </div>
          </div>

          <div className='p-3.5 w-full'>
            <Skeleton height={350} width={'100%'} />
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
  );
}

export default SocialMediaPostLoader;
