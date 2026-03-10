import { useContext, useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import { BreadcrumbsProps } from '@/interface/ComponentProps.interface';
import ManageOrgTeamLeaves from '@/modules/leaves/screens/ManageOrganizationTeamLeaves';
import ManageSelfLeave from '@/modules/leaves/screens/ManageSelfLeave';
import ManageTeamLeaves from '@/modules/leaves/screens/ManageTeamLeave';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import LeavesTabs from '@/components/LeavesTabs';
import PageNotFound from '@/components/PageNotFound';
import {
  DEFAULT_LEAVE_TAB,
  LEAVE_MODULE_TAB_TYPE,
  LEAVE_MODULE_TAB_TYPE_OBJECT,
} from '@/utils/constants/global.constants';

function Leaves() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const [searchParam, setSearchParams] = useSearchParams();
  const tabType = searchParam.get('tab');

  // Some Coman State For All The Type
  const [showModal, setShowModal] = useState<boolean>(false);

  const handelClickOnAddLeave = () => {
    setShowModal(true);
  };

  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  const BreadcrumbsObjects: BreadcrumbsProps[] = [
    {
      name: 'dashboard',
      label: 'dashboard',
      link: `/${organization}/dashboard`,
    },

    {
      name: 'Leaves Manager',
      label: 'leaves-manager',
      link: `/${organization}/leaves`,
    },
    ...(tabType && LEAVE_MODULE_TAB_TYPE.includes(tabType)
      ? [
          {
            name: tabType,
            label: `leaves-manager-${tabType?.toLocaleLowerCase()}`,
            link: `/${organization}/leaves?tab=${tabType}`,
          },
        ]
      : []),
  ];

  const getLeaveModuleOnTabType = (type: string | null) => {
    if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.SELF) {
      return (
        <ManageSelfLeave showModal={showModal} setShowModal={setShowModal} />
      );
    } else if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.TEAM) {
      return <ManageTeamLeaves />;
    } else if (type === LEAVE_MODULE_TAB_TYPE_OBJECT.ORGANIZATION) {
      return <ManageOrgTeamLeaves />;
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
    <div className='w-full h-full bg-transparent relative'>
      <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
      <div className='p-4 2xl:p-5 h-full pt-14'>
        <div className='bg-white rounded-xl h-full flex flex-col'>
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
