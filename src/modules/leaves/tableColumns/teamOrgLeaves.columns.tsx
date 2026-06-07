import { IoEye } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

import { Column } from '@/interface/ComponentProps.interface';
import { LeavesReportingManagerModuleInterface } from '@/interface/Global.interface';
import {
  ManageAppliedTeamLeavesInterface,
  ManageTeamOrgLeaveColumnsInterface,
} from '@/interface/LeavesModule.interface';

import Button from '@/components/common/Button';
import EmployeeProfilePicture from '@/components/EmployeeProfilePicture';
import { LEAVE_STATUS_CONFIG } from '@/utils/constants/global.constants';
import { formateDate, formatIsoDate } from '@/utils/helpers/commonHelpers';

export const MANAGE_TEAM_ORG_LEAVE_COLUMNS = ({
  GlobalStateProvider,
  toggleViewLeaveDetails,
}: ManageTeamOrgLeaveColumnsInterface): Column[] => [
  {
    key: 'employee_info',
    title: 'Employee Info',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: LeavesReportingManagerModuleInterface) => (
      <div className='w-fit min-w-[250px]'>
        <div className='w-full flex items-center gap-2' key={data?.id}>
          <EmployeeProfilePicture
            width={30}
            height={30}
            profilePicture={data?.profile_picture}
          />

          <div className='flex-1'>
            <h3 className='font-normal text-base'>
              <span className='font-medium pr-1 text-gray-900'>
                {data.full_name}
              </span>
              <span className='text-xs text-gray-700'>
                ({data?.employee_code})
              </span>
            </h3>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'start_date',
    childKey: 'end_date',
    title: 'Dates',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string, childKeyData: string) => (
      <div className='w-fit flex flex-col gap-0.5'>
        <span className='font-inter text-sm font-medium text-gray-900'>
          {formatIsoDate(
            data,
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat
          )}
        </span>
        <span className='font-inter text-sm font-medium text-gray-900'>
          {formatIsoDate(
            childKeyData,
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat
          )}
        </span>
      </div>
    ),
  },
  {
    key: 'is_planned',
    title: 'Leave Plan',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (isPlanned: boolean) => (
      <div className='w-fit'>
        <span
          className={`font-inter text-xs font-medium px-3 py-1 rounded-full ${
            isPlanned
              ? 'text-blue-500 bg-blue-400/10 border border-blue-500'
              : 'text-red-500 bg-red-400/10 border border-red-500'
          }`}
        >
          {isPlanned ? 'Planned' : 'Unplanned'}
        </span>
      </div>
    ),
  },
  {
    key: 'leave_code',
    title: 'Leave Type',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <div className='w-fit'>
        <span className='font-inter text-sm font-medium text-white bg-[#242c40] px-2 py-1 rounded'>
          {data}
        </span>
      </div>
    ),
  },
  {
    key: 'total_days',
    title: 'Total Days',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: number) => (
      <div className='w-fit'>
        <span className='font-inter text-sm font-medium text-gray-900'>
          {data} {data === 1 ? 'day' : 'days'}
        </span>
      </div>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => {
      const status =
        LEAVE_STATUS_CONFIG[data as keyof typeof LEAVE_STATUS_CONFIG] ||
        LEAVE_STATUS_CONFIG.pending;
      return (
        <div className='w-fit'>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg} ${status.text} ${status.border} capitalize`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full capitalize ${status.dot}`}
            />
            {data}
          </span>
        </div>
      );
    },
  },
  {
    key: 'description',
    title: 'Reason',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string) => (
      <div className='w-fit max-w-xs'>
        <span className='font-inter text-sm text-gray-700 line-clamp-2'>
          {data || '-'}
        </span>
      </div>
    ),
  },
  {
    key: 'reporting_manager',
    title: 'Approving Authority',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: LeavesReportingManagerModuleInterface) => (
      <div className='w-fit min-w-[250px]'>
        <div className='w-full flex items-center gap-2' key={data?.id}>
          <EmployeeProfilePicture
            width={30}
            height={30}
            profilePicture={data?.profile_picture}
          />

          <div className='flex-1'>
            <h3 className='font-normal text-base'>
              <span className='font-medium pr-1 text-gray-900'>
                {data.full_name}
              </span>
              <span className='text-xs text-gray-700'>
                ({data?.employee_code})
              </span>
            </h3>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'created_by',
    childKey: 'created_at',
    title: 'Requested On',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string, childKeyData: string) => {
      return data ? (
        <div className='flex flex-col gap-0.5'>
          <span className='font-inter text-sm text-gray-800'>
            {formateDate(
              childKeyData,
              GlobalStateProvider?.organization?.organization_settings
                ?.default_dateformat
            )}
          </span>
        </div>
      ) : (
        <div className='flex flex-col gap-0.5'>
          <span className='font-inter text-sm font-medium text-gray-900 capitalize'>
            System
          </span>
          <span className='font-inter text-xs text-gray-500'>
            {formateDate(
              childKeyData,
              GlobalStateProvider?.organization?.organization_settings
                ?.default_dateformat
            )}
          </span>
        </div>
      );
    },
  },
  {
    key: 'updated_by',
    childKey: 'updated_at',
    title: 'Updated By',
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: string, childKeyData: string) => {
      return data ? (
        <div className='flex flex-col gap-0.5'>
          <span className='font-inter text-sm font-medium text-gray-900 capitalize'>{`${JSON.parse(data).first_name} ${JSON.parse(data).last_name}`}</span>
          <span className='font-inter text-xs text-gray-500'>
            {formateDate(
              childKeyData,
              GlobalStateProvider?.organization?.organization_settings
                ?.default_dateformat
            )}
          </span>
        </div>
      ) : (
        <span className='font-inter text-sm text-gray-400'>-</span>
      );
    },
  },

  {
    key: 'action',
    title: 'Action',
    isSortable: false,
    isSticky: true,
    canToggleVisibility: true,
    renderContent: (data: ManageAppliedTeamLeavesInterface) => {
      return (
        <div className='w-full h-full flex items-center justify-start gap-2'>
          <Button
            type='button'
            className='text-gray-600 hover:bg-gray-100  p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            data-tooltip-id='view_leave_button'
            data-tooltip-content='View Leave'
            onClick={() => toggleViewLeaveDetails(data)}
          >
            <IoEye className='text-[20px]' />
          </Button>
          <Tooltip
            id='view_leave_button'
            opacity={'100'}
            className='z-[15] !bg-gray-900 !text-white text-xs !px-3 !py-1.5 !rounded-lg'
            place='left'
          />
        </div>
      );
    },
  },
];
