import HolidayCard from '../../Components/HolidayCard';
import { DashboardPlaygroundPropsInterface } from '../../interface/Dashboard';

function DashboardPlayground(props: DashboardPlaygroundPropsInterface) {
  const { holidayData, GlobalStateProvider } = props;
  return (
    <div className='p-4'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-2'>
        <HolidayCard
          holidayData={holidayData}
          GlobalStateProvider={GlobalStateProvider}
        />
      </div>
    </div>
  );
}

export default DashboardPlayground;
