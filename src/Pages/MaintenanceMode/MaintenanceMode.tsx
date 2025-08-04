import { MAINTENANCE_MODE_LOCAL_STORAGE_KEY } from '../../constant/constant';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';

function MaintenanceMode() {
  const MaintenanceModeData = getDataFromLocalStorage(
    MAINTENANCE_MODE_LOCAL_STORAGE_KEY
  );
  return (
    <div className='w-full h-screen bg-white'>
      <div className='text-black'
        dangerouslySetInnerHTML={{ __html: MaintenanceModeData?.message }}
      ></div>
    </div>
  );
}

export default MaintenanceMode;
