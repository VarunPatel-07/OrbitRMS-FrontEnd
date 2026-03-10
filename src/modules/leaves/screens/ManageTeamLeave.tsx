import { useContext, useEffect, useRef, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import {
  FilterObjectInterface,
  MetaDataInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '@/interface/ComponentProps.interface';
import {
  ManageAppliedTeamLeavesInterface,
  TeamLeaveSummaryDataInterface,
} from '@/interface/LeavesModule.interface';
import TeamOrgLeaveModuleHeader from '@/modules/leaves/components/TeamOrgLeaveModuleHeader';
import {
  AddEmployeeInSearchFilter,
  AddLeaveTypesInFilterArray,
} from '@/modules/leaves/LeavesModule.helper';
import { TEAMS_ORG_LEAVES_SEARCH_FILTER } from '@/modules/leaves/TeamOrgLeavesSearchFilter';

import { useDebounce } from '@/hooks/useDebounce';

import Table from '@/components/common/table/Table';
import TableFilterSearchBar from '@/components/common/table/TableFilterSearchBar';
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
import { OPTION_TYPE } from '@/utils/constants/filterOperators.constants';
import {
  dropdownMenuArray,
  initialMetadata,
  TEAM_SUMMARY_INITIAL_DATA,
} from '@/utils/constants/global.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';

import { MANAGE_TEAM_ORG_LEAVE_COLUMNS } from '../tableColumns/teamOrgLeaves.columns';

function ManageTeamLeaves() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  const [queryParameter] = useSearchParams();

  const navigate = useNavigate();

  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

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
  const [searchFilterArray, setsSearchFilterArray] = useState<
    SearchBarFilterOptionsInterface[]
  >(TEAMS_ORG_LEAVES_SEARCH_FILTER);
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);

  const [updateLeaveLoader, setUpdateLeaveLoader] = useState<
    'pending' | 'approved' | 'rejected' | 'cancelled' | null
  >(null);

  const fetchAllLeavesWithDebounce = useDebounce(
    async ({
      page = Number(selectedPage),
      limit = Number(recordsPerPage),
      filterQuery,
    }: {
      page?: number;
      limit?: number;
      filterQuery: string;
    }) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: filterQuery
            ? `attendance/fetch/team/leaves?page=${page}&limit=${limit}&${filterQuery}`
            : `attendance/fetch/team/leaves?page=${page}&limit=${limit}`,
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

  const fetchAllTheLeaveTypesWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `attendance/fetch/leave-types`,
        protected: true,
      },
      { endPoint: `employee/fetch/employee/all?scope=team`, protected: true },
    ];

    const response = await multipleFetchApi(endPointArr);
    const leaveTypeData = response[0];
    const employeeData = response[1];

    if (leaveTypeData?.success && leaveTypeData?.data?.length > 0) {
      const structuredArray = AddLeaveTypesInFilterArray(
        'Leave Type',
        leaveTypeData?.data
      );

      setsSearchFilterArray((perv) => [...perv, structuredArray]);
    }

    if (employeeData?.success && employeeData?.data?.length > 0) {
      const AddedEmployeeData = AddEmployeeInSearchFilter(
        'Employee',
        employeeData?.data
      );
      setsSearchFilterArray((perv) => [...perv, AddedEmployeeData]);
    }

    setIsFetchingData(false);
  }, 100);

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
        fetchAllLeavesWithDebounce({
          page: selectedPage,
          limit: recordsPerPage,
        });
      } else {
        handelNotification(res, 'top-right');
      }
      setUpdateLeaveLoader(null);
    },
    100
  );
  const handelApplyFilterEmployeeListing = async (
    filterArray: FilterObjectInterface[]
  ) => {
    // setIsFetchingData(true);
    let queryString = '';
    if (filterArray?.length > 0) {
      const queryFilterArray = filterArray?.map((queryObj) => {
        const obj: UrlEncodedFilterQueryInterface = {
          field_name: '',
          operator: '',
          value: '',
        };
        queryObj?.moduleValue?.forEach((moduleValue) => {
          if (moduleValue?.type === FilterFieldsTypeEnums[0]) {
            obj.field_name = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[1]) {
            obj.operator = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[2]) {
            if (queryObj?.optionType == OPTION_TYPE.MULTI_SELECT) {
              const MultiSelectArr: string[] = [];
              queryObj?.moduleValue
                ?.filter((tem) => tem.type === FilterFieldsTypeEnums[2])
                ?.map((data) => MultiSelectArr.push(data?.value));

              obj.value = JSON.stringify(MultiSelectArr);
            } else {
              obj.value = moduleValue?.value;
            }
          }
        });
        return obj;
      });

      queryString = `filter=${encodeURIComponent(JSON.stringify(queryFilterArray))}`;
    }

    fetchAllLeavesWithDebounce({
      page: 1,
      limit: 10,
      filterQuery: queryString,
    });

    setTimeout(() => {
      if (queryString === '') {
        navigate(`/${organization}/leaves?tab=Team`);
      } else {
        navigate(`/${organization}/leaves?tab=Team&${queryString}`);
      }
    }, 0);
  };
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
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllLeavesWithDebounce({
      page: 1,
      limit: recordsPerPage,
      filterQuery: queryString,
    });
    fetchAllTheLeaveTypesWithDebounce();
  }, [fetchAllLeavesWithDebounce, queryParameter]);

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
              <TableFilterSearchBar
                filterColumnsArray={searchFilterArray}
                handelApplyFilterFunc={handelApplyFilterEmployeeListing}
                urlDecodedFilterQuery={urlDecodedFilterQuery || ''}
              />
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

export default ManageTeamLeaves;
