/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';

import { IoEye } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import {
  Column,
  MetaDataInterface,
} from '@/interface/ComponentProps.interface';
import { LeavesReportingManagerModuleInterface } from '@/interface/Global.interface';
import {
  ManageAppliedTeamLeavesInterface,
  TeamLeaveSummaryDataInterface,
} from '@/interface/LeavesModule.interface';
import TeamOrgLeaveModuleHeader from '@/modules/leaves/TeamOrgLeaveModuleHeader';

import { useDebounce } from '@/hooks/useDebounce';

import Button from '@/components/common/Button';
import Table from '@/components/common/table/Table';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TablePagination from '@/components/common/table/TablePagination';
import EmployeeProfilePicture from '@/components/EmployeeProfilePicture';
import LeaveBalanceSkeleton from '@/components/loaders/LeaveBalanceSkeleton';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import ViewLeaveDetailModal from '@/components/modals/ViewLeaveDetailModal';
import {
  endpointObject,
  multipleFetchApi,
  multiplePutApi,
} from '@/utils/api/multipleAPI';
import {
  dropdownMenuArray,
  initialMetadata,
  LEAVE_STATUS_CONFIG,
  TEAM_SUMMARY_INITIAL_DATA,
} from '@/utils/constants/global.constants';
import { formateDate, formatIsoDate } from '@/utils/helpers/commonHelpers';

function ManageOrgTeamLeaves() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const [appliedLeaves, setAppliedLeaves] = useState<
    ManageAppliedTeamLeavesInterface[]
  >([]);
  const [teamSummaryDetails, setTeamSummaryDetails] =
    useState<TeamLeaveSummaryDataInterface>(TEAM_SUMMARY_INITIAL_DATA);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [leaveDetailData, setLeaveDetailData] =
    useState<ManageAppliedTeamLeavesInterface | null>(null);
  const [showLeaveDetailModal, setShowLeaveDetailModal] =
    useState<boolean>(false);

  const [updateLeaveLoader, setUpdateLeaveLoader] = useState<
    'pending' | 'approved' | 'rejected' | 'cancelled' | null
  >(null);
  const fetchAllLeavesWithDebounce = useDebounce(
    async ({
      page = Number(selectedPage),
      limit = Number(recordsPerPage),
    }: {
      page?: number;
      limit?: number;
    }) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `attendance/fetch/team/leaves?page=${page}&limit=${limit}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setAppliedLeaves(res?.data?.applied_leaves);
        setTeamSummaryDetails(res?.data?.team_summary);
        setMetaData(res?.metadata);
        setRecordsPerPage(res?.metadata?.record_per_page);
      }
      setIsFetchingData(false);
    },
    100
  );

  const updateTheLeaveRequestWithDebounce = useDebounce(
    async (
      leave_id: string,
      leave_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
    ) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `attendance/leave-request/update?id=${leave_id}&status=${leave_status}`,
          protected: true,
        },
      ];

      const response = await multiplePutApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setIsFetchingData(true);
        setShowLeaveDetailModal(false);
        setLeaveDetailData(null);
        fetchAllLeavesWithDebounce(selectedPage, recordsPerPage);
      } else {
        handelNotification(res, 'top-right');
      }
      setUpdateLeaveLoader(null);
    },
    100
  );

  const updateTheLeaveRequest = (
    leave_id: string,
    leave_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  ) => {
    setUpdateLeaveLoader(leave_status);
    updateTheLeaveRequestWithDebounce(leave_id, leave_status);
  };

  const handelClickOnRecordPerPage = (value: string | number) => {
    setRecordsPerPage(value);
    setIsFetchingData(true);
    fetchAllLeavesWithDebounce({ limit: value });
  };

  const handelClickOnPaginationButtons = (value: number) => {
    setSelectedPage(value);
    setIsFetchingData(true);
    fetchAllLeavesWithDebounce({ page: value });
  };

  const toggleViewLeaveDetails = (
    leaveData?: ManageAppliedTeamLeavesInterface
  ) => {
    if (leaveData) {
      setLeaveDetailData(leaveData);
      setShowLeaveDetailModal(true);
    } else {
      setLeaveDetailData(null);
      setShowLeaveDetailModal(false);
    }
  };

  const columns: Array<Column> = [
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
      renderContent: (data: any, childKeyData: any) => {
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
      renderContent: (data: any, childKeyData: any) => {
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

  useEffect(() => {
    if (useEffectRef?.current) return;
    useEffectRef.current = true;
    fetchAllLeavesWithDebounce(selectedPage, recordsPerPage);
  }, []);

  return (
    <>
      <div className='w-full h-full flex flex-col'>
        <div className='w-full p-4'>
          <div className='w-full flex items-stretch max-w-full flex-nowrap gap-4 overflow-auto hide-scrollbar'>
            {isFetchingData ? (
              <LeaveBalanceSkeleton totalNumberOfCards={6} />
            ) : (
              <TeamOrgLeaveModuleHeader
                GlobalStateProvider={GlobalStateProvider}
                data={teamSummaryDetails}
              />
            )}
          </div>
        </div>
        <div className='bg-white overflow-hidden grow rounded-b-lg'>
          {isFetchingData ? (
            <TableSkeletonLoader
              tableHeaderCount={5}
              tableValueCount={13}
              maxHeight='calc(-350px + 100vh)'
              showFilterLoader={false}
              showHeaderLoader={false}
            />
          ) : (
            <>
              {appliedLeaves?.length > 0 ? (
                <>
                  <Table
                    columns={columns}
                    data={appliedLeaves}
                    tableWrapperClass={
                      'overflow-auto max-h-[calc(100vh-415px)] h-full'
                    }
                    stickyHeaderClass='sticky top-0 bg-gray-50'
                  />
                  <div className='bg-white'>
                    <TablePagination
                      paginationDropDownArray={dropdownMenuArray}
                      recordsPerPage={recordsPerPage}
                      handelClickOnDroDownVal={handelClickOnRecordPerPage}
                      clickOnPaginationVal={handelClickOnPaginationButtons}
                      selectedPage={selectedPage}
                      totalPage={metaData?.total_pages}
                    />
                  </div>
                </>
              ) : (
                <TableNoDataFound
                  tableWrapperClass={'border-0 h-full'}
                  notFoundTitle={'No Leave Applications Found'}
                  notFoundMessage={
                    'You haven\'t applied for any leaves yet. Click "Add Leave" to submit a new leave request.'
                  }
                  notFoundOptionsButtonsArray={[]}
                />
              )}
            </>
          )}
        </div>
      </div>

      {leaveDetailData && showLeaveDetailModal && (
        <ViewLeaveDetailModal
          leaveDetails={leaveDetailData}
          defaultDateFormate={
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat
          }
          showModal={showLeaveDetailModal}
          toggleViewLeaveDetails={toggleViewLeaveDetails}
          updateTheLeaveRequest={updateTheLeaveRequest}
          updateLeaveLoader={updateLeaveLoader}
        />
      )}
    </>
  );
}

export default ManageOrgTeamLeaves;
