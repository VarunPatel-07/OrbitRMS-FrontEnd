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
import TableFilterSearchBar from '@/components/common/table/TableFilterSearchBar';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TablePagination from '@/components/common/table/TablePagination';
import ApplyLeaveDrawer from '@/components/drawers/ApplyLeaveDrawer';
import ViewLeaveDetailDrawer from '@/components/drawers/ViewLeaveDetailDrawer';
import LeaveBalanceSkeleton from '@/components/loaders/LeaveBalanceSkeleton';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';
import { OPTION_TYPE } from '@/utils/constants/filterOperators.constants';
import {
  dropdownMenuArray,
  INITIAL_META_DATA,
} from '@/utils/constants/global.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';
import { formatIsoDate } from '@/utils/helpers/commonHelpers';
import { INITIAL_MANAGE_APPLIED_SELF_LEAVE } from '@/utils/initialData/leaves.initial';

import { AddLeaveTypesInFilterArray } from '../LeavesModule.helper';
import { SELF_LEAVES_SEARCH_FILTER } from '../LeavesSearchFilter';
import { MANAGE_SELF_LEAVE_COLUMNS } from '../tableColumns/selfLeave.columns';

function ManageSelfLeave({
  setShowAddLeaveModal,
  showAddLaveModal,
}: ManageSelfLeaveModuleInterface) {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const [queryParameter] = useSearchParams();

  const navigate = useNavigate();

  const useEffectRef = useRef(false);

  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [leavesBalanceData, setLeavesBalanceData] = useState<
    LeaveBalanceInterface[]
  >([]);
  const [appliedLeaves, setAppliedLeaves] = useState<
    ManageAppliedSelfLeavesInterface[]
  >([]);
  const [metaData, setMetaData] =
    useState<MetaDataInterface>(INITIAL_META_DATA);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [leaveDetailData, setLeaveDetailData] =
    useState<ManageAppliedSelfLeavesInterface>(
      INITIAL_MANAGE_APPLIED_SELF_LEAVE
    );
  const [showLeaveDetailModal, setShowLeaveDetailModal] =
    useState<boolean>(false);
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);
  const [searchFilterArray, setsSearchFilterArray] = useState<
    SearchBarFilterOptionsInterface[]
  >(SELF_LEAVES_SEARCH_FILTER);

  const [employeesData, setEmployeesData] = useState<LeaveEmployeeData[]>([]);

  const fetchAllAppliedLeaveWithDebounce = useDebounce(
    async ({
      page = Number(selectedPage),
      limit = Number(recordsPerPage),
      filterQuery,
    }: {
      page?: number;
      limit?: number;
      filterQuery?: string | null;
    }) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: filterQuery
            ? `attendance/fetch/leaves?page=${page}&limit=${limit}&${filterQuery}`
            : `attendance/fetch/leaves?page=${page}&limit=${limit}`,
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

        const leaveTypeData = leaveBalance?.data?.map(
          (item: LeaveBalanceInterface) => item?.leave_code
        );

        const structuredArray = AddLeaveTypesInFilterArray(
          'Leave Type',
          leaveTypeData
        );

        setsSearchFilterArray((perv) => [...perv, structuredArray]);
      }
      setIsFetchingData(false);
    },
    100
  );

  const fetchAllLeavesWithDebounce = useDebounce(
    async ({
      page = Number(selectedPage),
      limit = Number(recordsPerPage),
      filterQuery,
    }: {
      page?: number;
      limit?: number;
      filterQuery?: string | null;
    }) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: filterQuery
            ? `attendance/fetch/leaves?page=${page}&limit=${limit}&${filterQuery}`
            : `attendance/fetch/leaves?page=${page}&limit=${limit}`,
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

  const fetchNotifyingEmployeeWithDebounce = useDebounce(async () => {
    const endPointObjectArr: endpointObject[] = [
      {
        endPoint: 'employee/fetch/employee/all?scope=organization',
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointObjectArr);
    const res = response[0];
    if (res?.success) {
      setEmployeesData(res?.data);
    }
  }, 100);

  const handelClickOnRecordPerPage = (value: string | number) => {
    setRecordsPerPage(value);
    setSelectedPage(1);
    setIsFetchingData(true);
    fetchAllLeavesWithDebounce({ page: 1, limit: value });
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
      data?.reporting_to_employee?.map((item) =>
        multipartFormData.append('notify_to', item.id)
      );
      // if(data?.reporting_to_employee){

      // }
      const endPointArr: endpointObject[] = [
        {
          endPoint: `attendance/apply/leave`,
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
        fetchAllAppliedLeaveWithDebounce({
          page: selectedPage,
          limit: recordsPerPage,
          filterQuery: queryString,
        });
      }
      handelNotification(res, 'center');
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

      setTimeout(() => {
        if (queryString === '') {
          navigate(`/${organization}/leaves?tab=Self`);
        } else {
          navigate(`/${organization}/leaves?tab=Self&${queryString}`);
        }
      }, 0);
    }
  };

  const onApply = (formData: ApplyLeaveForm, callBack: () => void) => {
    setLoading(true);
    addLeaveTypeWithDebounce(formData, callBack);
  };

  const toggleViewLeaveDetails = (
    leaveData?: ManageAppliedSelfLeavesInterface
  ) => {
    if (leaveData) {
      setLeaveDetailData(leaveData);
      setShowLeaveDetailModal(true);
    } else {
      setLeaveDetailData(INITIAL_MANAGE_APPLIED_SELF_LEAVE);
      setShowLeaveDetailModal(false);
    }
  };

  const TABLE_COLUMNS = MANAGE_SELF_LEAVE_COLUMNS({
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

    fetchAllAppliedLeaveWithDebounce({
      page: 1,
      limit: 10,
      filterQuery: queryString,
    });

    fetchNotifyingEmployeeWithDebounce();
  }, [fetchAllAppliedLeaveWithDebounce, queryParameter]);

  return (
    <>
      <div className='w-full h-full flex flex-col max-h-[calc(100vh-215px)] overflow-auto rounded-b-lg'>
        <div className='w-full p-4 border-x border-black/10'>
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

        <div className='bg-white h-fit grow flex flex-col rounded-b-lg relative'>
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
              <div className='relative grow'>
                <div className='sticky top-0 bg-gray-50 z-50'>
                  <TableFilterSearchBar
                    filterColumnsArray={searchFilterArray}
                    handelApplyFilterFunc={handelApplyLeaveFilter}
                    urlDecodedFilterQuery={urlDecodedFilterQuery || ''}
                  />
                </div>
                {appliedLeaves?.length > 0 ? (
                  <>
                    <Table
                      columns={TABLE_COLUMNS}
                      data={appliedLeaves}
                      tableWrapperClass={'h-fit overflow-auto'}
                      stickyHeaderClass=''
                    />
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

      <ApplyLeaveDrawer
        showModal={showAddLaveModal}
        setShowModal={setShowAddLeaveModal}
        leaveTypes={leavesBalanceData}
        employeesData={employeesData}
        loading={loading}
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
      />
    </>
  );
}

export default ManageSelfLeave;
