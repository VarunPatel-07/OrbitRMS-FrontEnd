import { useContext, useEffect, useRef, useState } from 'react';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import { MetaDataInterface } from '@/interface/ComponentProps.interface';
import {
  ManageAppliedTeamLeavesInterface,
  TeamLeaveSummaryDataInterface,
} from '@/interface/LeavesModule.interface';
import TeamOrgLeaveModuleHeader from '@/modules/leaves/components/TeamOrgLeaveModuleHeader';

import { useDebounce } from '@/hooks/useDebounce';

import Table from '@/components/common/table/Table';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TablePagination from '@/components/common/table/TablePagination';
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
  TEAM_SUMMARY_INITIAL_DATA,
} from '@/utils/constants/global.constants';

import { MANAGE_TEAM_ORG_LEAVE_COLUMNS } from '../tableColumns/teamOrgLeaves.columns';

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
          endPoint: `attendance/fetch/organization/leaves?page=${page}&limit=${limit}`,
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

  const TABLE_COLUMNS = MANAGE_TEAM_ORG_LEAVE_COLUMNS({
    GlobalStateProvider,
    toggleViewLeaveDetails,
  });

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
