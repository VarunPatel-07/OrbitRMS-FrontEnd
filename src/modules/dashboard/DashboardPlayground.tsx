import { DashboardPlaygroundPropsInterface } from '@/interface/Dashboard.interface';

import NoHolidayAnimationCard from '@/components/animations/NoHolidayAnimation';
import HolidayCard from '@/components/HolidayCard';
import HolidayCardSkeleton from '@/components/loaders/HolidayCardSkeleton';

function DashboardPlayground(props: DashboardPlaygroundPropsInterface) {
  const { holidayData, GlobalStateProvider, isLoadingHoliday } = props;
  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
        <div className='w-full bg-white border border-black/15 rounded-lg h-auto min-h-[230px] overflow-hidden max-h-[230px]'>
          {isLoadingHoliday ? (
            <HolidayCardSkeleton />
          ) : (
            <>
              {holidayData?.length == 0 ? (
                <NoHolidayAnimationCard
                  portalSlug={
                    GlobalStateProvider?.organization?.general_info?.portal_slug
                  }
                />
              ) : (
                <HolidayCard
                  holidayData={holidayData}
                  GlobalStateProvider={GlobalStateProvider}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPlayground;
