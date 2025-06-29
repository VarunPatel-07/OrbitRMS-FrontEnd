import { useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineDashboard } from 'react-icons/md';

import AddEditPostModal from '../../Components/Modal/AddEditPostModal';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import { generateTimeBasedGreeting } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { OrganizationHolidays } from '../../interface/OrganizationSettings';
import DashboardPlayground from './DashboardPlayground';
import Feed from './Feed';

function Dashboard() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const useEffectReference = useRef(false);

  const [holidayData, setHolidayData] = useState<OrganizationHolidays[]>([]);
  const [showClientInquiryDetail, setShowClientInquiryDetail] =
    useState<boolean>(false);

  const fetchInitialDataWithDebounce = useDebounce(async () => {
    const date = new Date();
    const current_year = date.getFullYear();
    const endPointArr: endpointObject[] = [
      {
        endPoint: `org-setting/holiday/fetch?year=${current_year}&order=desc&field_name=date`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setHolidayData(res?.data);
    } else {
      //   handelNotification(res, 'top-right');
    }
  }, 100);

  useEffect(() => {
    if (useEffectReference.current) return;
    useEffectReference.current = true;
    fetchInitialDataWithDebounce();
  }, [fetchInitialDataWithDebounce]);

  return (
    <>
      <div className='w-full h-full bg-[var(--main-white-color)]'>
        <div className='w-full h-full flex items-stretch justify-between'>
          <div className='flex-grow w-1/2'>
            <div className='w-full  flex items-stretch justify-between px-3.5 py-3 border-b border-b-black/15 h-[60px] bg-white'>
              <p className='text-base text-wrap text-black font-inter font-semibold flex items-center justify-start gap-1'>
                <span>{generateTimeBasedGreeting()},</span>
                <span>
                  {GlobalStateProvider?.user?.personal_info?.full_name
                    ? GlobalStateProvider?.user?.personal_info?.full_name
                    : GlobalStateProvider?.user?.personal_info?.first_name +
                      ' ' +
                      GlobalStateProvider?.user?.personal_info?.middle_name +
                      ' ' +
                      GlobalStateProvider?.user?.personal_info?.last_name}
                </span>
              </p>
              <button className='text-black text-base px-2 border border-black/15 rounded-md hover:bg-gray-100'>
                <MdOutlineDashboard className='text-2xl' />
              </button>
            </div>
            <DashboardPlayground
              holidayData={holidayData}
              GlobalStateProvider={GlobalStateProvider}
            />
          </div>
          <div className='w-1/2 max-w-[500px] min-w-[200px] border-l border-l-black/15'>
            <Feed />
          </div>
        </div>
      </div>
      <AddEditPostModal
        showClientInquiryDetail={showClientInquiryDetail}
        setShowClientInquiryDetail={setShowClientInquiryDetail}
      />
    </>
  );
}

export default Dashboard;
