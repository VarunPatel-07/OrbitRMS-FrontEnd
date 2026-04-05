import { useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import LeavesTabs from '@/components/LeavesTabs';
import PageNotFound from '@/components/PageNotFound';
import {
  DEFAULT_LEAVE_TAB,
  LEAVE_MODULE_TAB_TYPE,
  LEAVE_MODULE_TAB_TYPE_OBJECT,
} from '@/utils/constants/global.constants';

import ManageSelfAttendance from './screens/ManageSelfAttendance';

function AttendanceModule() {
  const [searchParam, setSearchParams] = useSearchParams();

  const tabType = searchParam.get('tab');
  const getLeaveModuleOnTabType = (type: string | null) => {
    if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.SELF) {
      return <ManageSelfAttendance />;
    } else {
      return (
        <div className='w-full h-full flex items-center justify-center'>
          <PageNotFound />
        </div>
      );
    }
  };

  useEffect(() => {
    if (!tabType || !LEAVE_MODULE_TAB_TYPE.includes(tabType)) {
      const params = new URLSearchParams(searchParam);
      params.set('tab', DEFAULT_LEAVE_TAB);
      setSearchParams(params);
    }
  }, []);
  return (
    <div className='p-4 2xl:p-5 h-full pt-14'>
      <div className='bg-white rounded-xl h-full flex flex-col'>
        <div className='bg-white rounded-t-xl border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-semibold text-gray-900'>
                Manage Attendance
              </h1>
            </div>
            <div className='flex flex-row items-stretch justify-end gap-10'>
              <LeavesTabs RenderTabsObjects={LEAVE_MODULE_TAB_TYPE_OBJECT} />
              {/* <Button
              type='button'
              className='text-white bg-[var(--them-green-color)] py-2 px-6 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
              onClick={handelClickOnAddLeave}
            >
              Add Leave
            </Button> */}
            </div>
          </div>
        </div>
        <div className='px-3 py-4 grow'>{getLeaveModuleOnTabType(tabType)}</div>
      </div>
    </div>
  );
}

export default AttendanceModule;
