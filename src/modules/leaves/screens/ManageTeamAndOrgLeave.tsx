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
  LeaveEmployeeData,
  ManageAppliedTeamLeavesInterface,
  ManageTeamOrgLeaveModuleInterface,
  TeamLeaveSummaryDataInterface,
} from '@/interface/LeavesModule.interface';
import { ApplyTeamOrgLeaveForm } from '@/interface/OrganizationSettings.interface';
import TeamOrgLeaveModuleHeader from '@/modules/leaves/components/TeamOrgLeaveModuleHeader';
import {
  AddEmployeeInSearchFilter,
  AddLeaveTypesInFilterArray,
} from '@/modules/leaves/LeavesModule.helper';
import { TEAMS_ORG_LEAVES_SEARCH_FILTER } from '@/modules/leaves/LeavesSearchFilter';

import { useDebounce } from '@/hooks/useDebounce';

import Table from '@/components/common/table/Table';
import TableFilterSearchBar from '@/components/common/table/TableFilterSearchBar';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TablePagination from '@/components/common/table/TablePagination';
import ApplyOrgTeamLeaveDrawer from '@/components/drawers/ApplyOrgTeamLeaveDrawer';
import ViewLeaveDetailDrawer from '@/components/drawers/ViewLeaveDetailDrawer';
import LeaveBalanceSkeleton from '@/components/loaders/LeaveBalanceSkeleton';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
  multiplePutApi,
} from '@/utils/api/multipleAPI';
import { OPTION_TYPE } from '@/utils/constants/filterOperators.constants';
import {
  dropdownMenuArray,
  INITIAL_META_DATA,
} from '@/utils/constants/global.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';
import { formatIsoDate } from '@/utils/helpers/commonHelpers';
import {
  INITIAL_MANAGE_APPLIED_TEAM_LEAVE,
  TEAM_SUMMARY_INITIAL_DATA,
} from '@/utils/initialData/leaves.initial';

import { MANAGE_TEAM_ORG_LEAVE_COLUMNS } from '../tableColumns/teamOrgLeaves.columns';

function ManageTeamAndOrgLeave({
  tab,
  setShowAddLeaveModal,
  showAddLaveModal,
}: ManageTeamOrgLeaveModuleInterface) {
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
  const [metaData, setMetaData] =
    useState<MetaDataInterface>(INITIAL_META_DATA);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [leaveDetailData, setLeaveDetailData] =
    useState<ManageAppliedTeamLeavesInterface>(
      INITIAL_MANAGE_APPLIED_TEAM_LEAVE
    );
  const [showLeaveDetailModal, setShowLeaveDetailModal] =
    useState<boolean>(false);
  const [searchFilterArray, setsSearchFilterArray] = useState<
    SearchBarFilterOptionsInterface[]
  >(TEAMS_ORG_LEAVES_SEARCH_FILTER);
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [updateLeaveLoader, setUpdateLeaveLoader] = useState<
    'pending' | 'approved' | 'rejected' | 'cancelled' | null
  >(null);
  const [employeesData, setEmployeesData] = useState<LeaveEmployeeData[]>([]);
  const [fetchingEmplyeeData, setFetchingEmployeeData] =
    useState<boolean>(false);

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
      const selectedTab = tab === 'organization' ? 'organization' : 'team';
      const endPointArr: endpointObject[] = [
        {
          endPoint: filterQuery
            ? `attendance/leaves/${selectedTab}/fetch?page=${page}&limit=${limit}&${filterQuery}`
            : `attendance/leaves/${selectedTab}/fetch?page=${page}&limit=${limit}`,
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
      setLoading(false);
    },
    100
  );

  const fetchAllTheLeaveTypesWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `attendance/leaves/types/fetch`,
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

  const fetchNotifyingEmployeeWithDebounce = useDebounce(async () => {
    const endPointObjectArr: endpointObject[] = [
      {
        endPoint:
          tab === 'team'
            ? 'employee/fetch/employee/all?scope=team'
            : 'employee/fetch/employee/all?scope=organization',
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointObjectArr);
    const res = response[0];
    if (res?.success) {
      setEmployeesData(res?.data);
    }
    setFetchingEmployeeData(false);
  }, 100);

  const updateTheLeaveRequestWithDebounce = useDebounce(
    async (
      leave_id: string,
      leave_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
    ) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `attendance/leaves/request/update?id=${leave_id}&status=${leave_status}`,
          protected: true,
        },
      ];

      const response = await multiplePutApi(endPointArr);
      const res = response[0];
      handelNotification(res, 'top-right');
      if (res?.success) {
        setIsFetchingData(true);
        setShowLeaveDetailModal(false);
        setLeaveDetailData(INITIAL_MANAGE_APPLIED_TEAM_LEAVE);
        fetchAllLeavesWithDebounce({
          page: selectedPage,
          limit: recordsPerPage,
        });
      }

      setUpdateLeaveLoader(null);
    },
    100
  );
  const handelApplyLeaveFilter = async (
    filterArray: FilterObjectInterface[]
  ) => {
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
    if (queryParameter.get('filter')) {
      setLoading(true);
      fetchAllLeavesWithDebounce({
        page: 1,
        limit: 10,
        filterQuery: queryString,
      });

      const selectedTab = tab === 'organization' ? 'Organization' : 'Team';

      setTimeout(() => {
        if (queryString === '') {
          navigate(`/${organization}/leaves?tab=${selectedTab}`);
        } else {
          navigate(`/${organization}/leaves?tab=${selectedTab}&${queryString}`);
        }
      }, 0);
    }
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

  const addLeaveTypeWithDebounce = useDebounce(
    async (data: ApplyTeamOrgLeaveForm, callback?: () => void) => {
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
      data?.reporting_to_employee?.map((item) =>
        multipartFormData.append('notify_to', item.id)
      );
      // if(data?.reporting_to_employee){

      // }
      const endPointArr: endpointObject[] = [
        {
          endPoint: `attendance/leave/apply?employee-id${data?.selectedEmployee?.id}`,
          protected: true,
          data: multipartFormData,
          header: {
            'Content-Type': 'multipart/form-data',
          },
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      setLoading(false);
      if (res?.success) {
        if (callback) callback();

        setShowAddLeaveModal(false);
        const filterQuery = queryParameter.get('filter');
        let queryString = '';
        if (filterQuery) {
          const decodeQuery = decodeURIComponent(filterQuery);
          const parsedFilter = JSON.parse(decodeQuery);

          setUrlDecodedFilterQuery(parsedFilter);
          queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
        }
        fetchAllLeavesWithDebounce({
          page: selectedPage,
          limit: recordsPerPage,
          filterQuery: queryString,
        });
      }
      handelNotification(res, 'center');
    },
    100
  );

  const onApply = (formData: ApplyTeamOrgLeaveForm, callBack: () => void) => {
    setLoading(true);
    addLeaveTypeWithDebounce(formData, callBack);
  };

  const toggleViewLeaveDetails = (
    leaveData?: ManageAppliedTeamLeavesInterface
  ) => {
    if (leaveData) {
      setLeaveDetailData(leaveData);
      setShowLeaveDetailModal(true);
    } else {
      setLeaveDetailData(INITIAL_MANAGE_APPLIED_TEAM_LEAVE);
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

  useEffect(() => {
    if (showAddLaveModal) {
      setFetchingEmployeeData(true);
      fetchNotifyingEmployeeWithDebounce();
    }
  }, [showAddLaveModal]);

  return (
    <>
      <div className='w-full h-full flex flex-col max-h-[calc(100vh-215px)] overflow-auto rounded-b-lg hide-scrollbar'>
        <div className='w-full p-4 bg-white border border-black/10 border-y-0'>
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
        <div className='bg-white h-fit grow flex flex-col rounded-b-lg relative'>
          {isFetchingData ? (
            <TableSkeletonLoader
              tableHeaderCount={5}
              tableValueCount={13}
              maxHeight='calc(-350px + 100vh)'
              showFilterLoader={true}
              showHeaderLoader={false}
            />
          ) : (
            <>
              <div className='relative grow'>
                <div className='sticky top-0 bg-white z-50'>
                  <TableFilterSearchBar
                    filterColumnsArray={searchFilterArray}
                    handelApplyFilterFunc={handelApplyLeaveFilter}
                    urlDecodedFilterQuery={urlDecodedFilterQuery || ''}
                  />
                </div>
                {appliedLeaves?.length > 0 ? (
                  <>
                    {loading ? (
                      <TableSkeletonLoader
                        tableHeaderCount={5}
                        tableValueCount={13}
                        maxHeight='calc(-350px + 100vh)'
                        showFilterLoader={false}
                        showHeaderLoader={false}
                      />
                    ) : (
                      <Table
                        columns={TABLE_COLUMNS}
                        data={appliedLeaves}
                        tableWrapperClass={'h-fit overflow-auto'}
                        stickyHeaderClass=''
                      />
                    )}
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
              </div>
              <div className='bg-white sticky bottom-0 left-0 w-full'>
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
          )}
        </div>
      </div>

      <ApplyOrgTeamLeaveDrawer
        title={
          tab === 'organization'
            ? 'Apply Leave For Org Member'
            : 'Apply Leave For Team Member'
        }
        setShowModal={setShowAddLeaveModal}
        showModal={showAddLaveModal}
        employeesData={employeesData}
        loading={fetchingEmplyeeData}
        onApply={onApply}
      />

      <ViewLeaveDetailDrawer
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
    </>
  );
}

export default ManageTeamAndOrgLeave;
