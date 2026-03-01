import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import Button from '../../common/Button';
import LeavesTabs from '../../Components/LeavesTabs';
import PageNotFound from '../../Components/PageNotFound';
import {
  DEFAULT_LEAVE_TAB,
  LEAVE_MODULE_TAB_TYPE,
  LEAVE_MODULE_TAB_TYPE_OBJECT,
} from '../../constant/constant';
import ManageOrgTeamLeaves from './ManageOrgTeamLeaves';
import ManageSelfLeave from './ManageSelfLeave';
import ManageTeamLeaves from './ManageTeamLeave';

function Leaves() {
  const [searchParam, setSearchParams] = useSearchParams();
  const tabType = searchParam.get('tab');

  // Some Coman State For All The Type
  const [showModal, setShowModal] = useState<boolean>(false);

  const handelClickOnAddLeave = () => {
    setShowModal(true);
  };

  const getLeaveModuleOnTabType = (type: string | null) => {
    if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.SELF) {
      return (
        <ManageSelfLeave showModal={showModal} setShowModal={setShowModal} />
      );
    } else if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.TEAM) {
      return (
        <ManageTeamLeaves showModal={showModal} setShowModal={setShowModal} />
      );
    } else if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.ORGANIZATION) {
      return (
        <ManageOrgTeamLeaves
          showModal={showModal}
          setShowModal={setShowModal}
        />
      );
    } else {
      return <PageNotFound />;
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
    <div className='w-full h-full bg-transparent'>
      <div className='p-4 2xl:p-5 h-full'>
        <div className='bg-white rounded-xl h-full flex flex-col'>
          {/* header */}
          <div className='bg-white rounded-t-xl border-b border-gray-200 px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h1 className='text-2xl font-semibold text-gray-900'>
                  {tabType === LEAVE_MODULE_TAB_TYPE_OBJECT.SELF
                    ? 'My'
                    : tabType === LEAVE_MODULE_TAB_TYPE_OBJECT.TEAM
                      ? 'Team'
                      : 'Organization'}{' '}
                  Leaves
                </h1>

                <p className='text-sm text-gray-500 mt-1'>
                  Manage{' '}
                  {tabType === LEAVE_MODULE_TAB_TYPE_OBJECT.SELF
                    ? 'your'
                    : tabType === LEAVE_MODULE_TAB_TYPE_OBJECT.TEAM
                      ? "your team's"
                      : 'organization-wide'}{' '}
                  leave requests
                </p>
              </div>
              <div className='flex flex-row items-stretch justify-end gap-10'>
                <LeavesTabs />
                <Button
                  type='button'
                  className='text-white bg-[var(--them-green-color)] py-2 px-6 rounded-lg font-inter text-base font-semibold disabled:opacity-70 disabled:cursor-not-allowed'
                  onClick={handelClickOnAddLeave}
                >
                  Add Leave
                </Button>
              </div>
            </div>
          </div>
          {/* Module Based Of The Tab Type */}
          {getLeaveModuleOnTabType(tabType)}
        </div>
      </div>
    </div>
  );
}

export default Leaves;
