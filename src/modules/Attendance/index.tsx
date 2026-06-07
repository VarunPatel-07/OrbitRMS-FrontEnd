import { useContext, useEffect } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
   GlobalStateContext,
   GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import { BreadcrumbsProps } from '@/interface/ComponentProps.interface';
import AccessDeniedRedirect from '@/routes/AccessDeniedRedirect';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import LeavesTabs from '@/components/LeavesTabs';
import PageNotFound from '@/components/PageNotFound';
import {
   DEFAULT_LEAVE_TAB,
   LEAVE_MODULE_TAB_TYPE,
   LEAVE_MODULE_TAB_TYPE_OBJECT,
} from '@/utils/constants/global.constants';

import ManageSelfAttendance from './screens/ManageSelfAttendance';

function AttendanceModule() {
   const { GlobalStateProvider } = useContext(
      GlobalStateContext
   ) as GlobalStateContextApiProps;

   const [searchParam, setSearchParams] = useSearchParams();

   const tabType = searchParam.get('tab');

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

   const segments = location.pathname.split('/').filter(Boolean);

   const parentSection = segments[1];
   const childSection = segments[2];

   const permissionData = GlobalStateProvider.roles_permissions.permissions
      .find((item) => item.module_label == parentSection.replace('-', '_'))
      ?.sub_modules?.find((item) => item.module_label == childSection);

   const hasNoViewHolidayPermission =
      !permissionData ||
      !permissionData.is_active ||
      !permissionData?.permissions?.some(
         (item) => item.label == 'view' && item.is_allowed
      );

   if (hasNoViewHolidayPermission)
      return (
         <AccessDeniedRedirect
            message="You don't have permission For Holidays."
            isAccessDenied={hasNoViewHolidayPermission}
         />
      );
   return (
      <div className='relative w-full h-full'>
         <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
         <div className='p-4 2xl:p-5 h-full pt-14'>
            <div className='bg-white rounded-xl h-full flex flex-col border border-black/10'>
               <div className='bg-white rounded-t-xl border-b border-black/10 px-6 py-4'>
                  <div className='flex items-center justify-between'>
                     <div>
                        <h1 className='text-2xl font-semibold text-gray-900'>
                           Manage Attendance
                        </h1>
                     </div>
                     <div className='flex flex-row items-stretch justify-end gap-10'>
                        <LeavesTabs
                           RenderTabsObjects={LEAVE_MODULE_TAB_TYPE_OBJECT}
                        />
                     </div>
                  </div>
               </div>
               <div className='py-4 grow'>
                  {getLeaveModuleOnTabType(tabType)}
               </div>
            </div>
         </div>
      </div>
   );
}

export default AttendanceModule;
