import NoHolidayAnimationCard from '../../Components/Animation/NoHolidayAnimationCard';
import HolidayCard from '../../Components/HolidayCard';
import HolidayCardLoader from '../../Components/Loader/HolidayCardLoader';
import { DashboardPlaygroundPropsInterface } from '../../interface/Dashboard';

function DashboardPlayground(props: DashboardPlaygroundPropsInterface) {
  const { holidayData, GlobalStateProvider, isLoadingHoliday } = props;
  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
        <div className='w-full bg-white border border-black/15 rounded-lg h-auto min-h-[230px] overflow-hidden max-h-[230px]'>
          {isLoadingHoliday ? (
            <HolidayCardLoader />
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
