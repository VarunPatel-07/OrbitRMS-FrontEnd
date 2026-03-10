/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';

import { IoEye } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import Button from '../../common/Button';
import Table from '../../common/Table/Table';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import EmployeeProfilePicture from '../../Components/EmployeeProfilePicture';
import LeaveBalanceCardLoader from '../../Components/Loader/LeaveBalanceCardsLoader';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import ApplyLeaveModal from '../../Components/Modal/ApplyLeaveModal';
import ViewLeaveDetailModal from '../../Components/Modal/ViewLeaveDetailModal';
import {
  dropdownMenuArray,
  initialMetadata,
  LEAVE_STATUS_CONFIG,
} from '../../constant/constant';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '../../Helper/api/multipleAPI';
import { formateDate, formatIsoDate } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { LeavesReportingManagerModuleInterface } from '../../interface/interface';
import {
  ManageAppliedSelfLeavesInterface,
  ManageSelfLeaveModuleInterface,
} from '../../interface/LeavesModule';
import {
  ApplyLeaveForm,
  LeaveBalanceInterface,
} from '../../interface/OrganizationSettings';
import { Column, MetaDataInterface } from '../../interface/propsInterface';
import { LeaveBalanceCard } from './LeavesBalanceCard';

function ManageSelfLeave({
  setShowModal,
  showModal,
}: ManageSelfLeaveModuleInterface) {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [leavesBalanceData, setLeavesBalanceData] = useState<
    LeaveBalanceInterface[]
  >([]);
  const [appliedLeaves, setAppliedLeaves] = useState<
    ManageAppliedSelfLeavesInterface[]
  >([]);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [leaveDetailData, setLeaveDetailData] =
    useState<ManageAppliedSelfLeavesInterface | null>(null);
  const [showLeaveDetailModal, setShowLeaveDetailModal] =
    useState<boolean>(false);

  const fetchAllAppliedLeaveWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `attendance/fetch/leaves?page=1&limit=10`,
        protected: true,
      },
      {
        endPoint: `attendance/fetch/leave-balance`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];
    const leaveBalance = response[1];

    if (res?.success) {
      setAppliedLeaves(res?.data);
      setMetaData(res?.metadata);
      setRecordsPerPage(res?.metadata?.record_per_page);
    }

    if (leaveBalance?.success) {
      setLeavesBalanceData(leaveBalance?.data);
    }
    setIsFetchingData(false);
  }, 100);

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
          endPoint: `attendance/fetch/leaves?page=${page}&limit=${limit}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setAppliedLeaves(res?.data);
        setMetaData(res?.metadata);
        setRecordsPerPage(res?.metadata?.record_per_page);
      }
      setIsFetchingData(false);
    },
    100
  );

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

  const addLeaveTypeWithDebounce = useDebounce(
    async (data: ApplyLeaveForm, callback?: () => void) => {
      if (!data?.leave_type) return;
      const multipartFormData = new FormData();
      multipartFormData.append(
        'leave_type_id',
        data?.leave_type?.leave_type_id
      );
      if (data?.start_date) {
        multipartFormData.append(
          'start_date',
          formatIsoDate(data?.start_date, 'YYYY-MM-DD')
        );
      }
      multipartFormData.append('start_half', data.start_half);
      if (data?.end_date) {
        multipartFormData.append(
          'end_date',
          formatIsoDate(data?.end_date, 'YYYY-MM-DD')
        );
      }

      multipartFormData.append('end_half', data.end_half);
      multipartFormData.append('current_date', data.current_date);
      multipartFormData.append('description', data.description);
      data?.documents?.map((item) => {
        multipartFormData.append('documents', item.file);
      });
      const endPointArr: endpointObject[] = [
        {
          endPoint: `attendance/apply/leave`,
          protected: true,
          data: multipartFormData,
          header: {
            'Content-Type': 'multipart/form-data;>',
          },
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      setLoading(false);
      if (res?.success) {
        if (callback) callback();
        setShowModal(false);
        fetchAllAppliedLeaveWithDebounce();
      }
    },
    100
  );

  const onApply = (formData: ApplyLeaveForm) => {
    setLoading(true);
    addLeaveTypeWithDebounce(formData);
  };

  const toggleViewLeaveDetails = (
    leaveData?: ManageAppliedSelfLeavesInterface
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
      renderContent: (data: ManageAppliedSelfLeavesInterface) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            {data?.status?.toLocaleLowerCase() === 'pending' && (
              <>
                <Button
                  type='button'
                  className='text-gray-600 hover:bg-gray-100  p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  data-tooltip-id='edit_leave_button'
                  data-tooltip-content='Edit Leave'
                >
                  <MdModeEdit className='text-[20px]' />
                </Button>
                <Tooltip
                  id='view_leave_button'
                  opacity={'100'}
                  className='z-[15] !bg-gray-900 !text-white text-xs !px-3 !py-1.5 !rounded-lg'
                  place='left'
                />
              </>
            )}

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
              id='edit_leave_button'
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
    fetchAllAppliedLeaveWithDebounce();
  }, []);

  return (
    <>
      <div className='w-full h-full flex flex-col'>
        <div className='w-full p-4'>
          <div className='w-full flex items-stretch max-w-full flex-nowrap gap-4 overflow-auto hide-scrollbar'>
            {isFetchingData ? (
              <LeaveBalanceCardLoader totalNumberOfCards={6} />
            ) : (
              <>
                {leavesBalanceData?.map((item) => (
                  <LeaveBalanceCard leaveData={item} key={item?.id} />
                ))}
              </>
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

      {showModal && (
        <ApplyLeaveModal
          showModal={showModal}
          setShowModal={setShowModal}
          leaveTypes={leavesBalanceData}
          loading={loading}
          onApply={onApply}
        />
      )}

      {leaveDetailData && showLeaveDetailModal && (
        <ViewLeaveDetailModal
          leaveDetails={leaveDetailData}
          defaultDateFormate={
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat
          }
          showModal={showLeaveDetailModal}
          toggleViewLeaveDetails={toggleViewLeaveDetails}
        />
      )}
    </>
  );
}

export default ManageSelfLeave;
