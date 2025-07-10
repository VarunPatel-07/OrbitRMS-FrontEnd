import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

function HolidayCardLoader() {
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='-mt-2 w-full h-[110%]'>
        {' '}
        <Skeleton height={'100%'} width={'100%'} />
      </div>
    </SkeletonTheme>
  );
}

export default HolidayCardLoader;
