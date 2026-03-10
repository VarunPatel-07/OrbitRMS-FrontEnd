import { useContext, useEffect, useState } from 'react';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import { MetaDataInterface } from '@/interface/ComponentProps.interface';
import {
  ManageAppliedSelfLeavesInterface,
  ManageSelfLeaveModuleInterface,
} from '@/interface/LeavesModule.interface';
import {
  ApplyLeaveForm,
  LeaveBalanceInterface,
} from '@/interface/OrganizationSettings.interface';
import { LeaveBalanceCard } from '@/modules/leaves/components/LeavesBalanceCard';

import { useDebounce } from '@/hooks/useDebounce';

import Table from '@/components/common/table/Table';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TablePagination from '@/components/common/table/TablePagination';
import LeaveBalanceSkeleton from '@/components/loaders/LeaveBalanceSkeleton';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import ApplyLeaveDialog from '@/components/modals/ApplyLeaveDialog';
import ViewLeaveDetailModal from '@/components/modals/ViewLeaveDetailModal';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';
import {
  dropdownMenuArray,
  initialMetadata,
} from '@/utils/constants/global.constants';
import { formatIsoDate } from '@/utils/helpers/commonHelpers';

import { MANAGE_SELF_LEAVE_COLUMNS } from '../tableColumns/selfLeave.columns';

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

  const TABLE_COLUMNS = MANAGE_SELF_LEAVE_COLUMNS({
    GlobalStateProvider,
    toggleViewLeaveDetails,
  });

  useEffect(() => {
    fetchAllAppliedLeaveWithDebounce();
  }, []);

  return (
    <>
      <div className='w-full h-full flex flex-col'>
        <div className='w-full p-4'>
          <div className='w-full flex items-stretch max-w-full flex-nowrap gap-4 overflow-auto hide-scrollbar'>
            {isFetchingData ? (
              <LeaveBalanceSkeleton totalNumberOfCards={6} />
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
                    columns={TABLE_COLUMNS}
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
        <ApplyLeaveDialog
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
