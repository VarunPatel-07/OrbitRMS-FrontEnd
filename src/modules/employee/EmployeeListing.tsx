import { useContext, useEffect, useRef, useState } from 'react';

import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoCloseCircleOutline, IoEye } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  Column,
  FilterObjectInterface,
  MetaDataInterface,
  TableInfoHeaderInterfaceButtonArrayObject,
  UrlEncodedFilterQueryInterface,
} from '@/interface/ComponentProps.interface';
import {
  EmployeeEmployeeInfo,
  EmployeeFieldInterface,
  EmployeePersonalInfo,
  EmployeeStatusInterface,
} from '@/interface/EmployeeModule.interface';
import { EmployeeListingFiltersArray } from '@/modules/employee/EmployeeListingFiltersArray';

import { useDebounce } from '@/hooks/useDebounce';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import Button from '@/components/common/Button';
import Table from '@/components/common/table/Table';
import TableFilterSearchBar from '@/components/common/table/TableFilterSearchBar';
import TableInfoHeader from '@/components/common/table/TableInfoHeader';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TablePagination from '@/components/common/table/TablePagination';
import EmployeeProfilePicture from '@/components/EmployeeProfilePicture';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import { endpointObject, multipleFetchApi } from '@/utils/api/multipleAPI';
import { dropdownMenuArray } from '@/utils/constants/global.constants';
import { META_TITLE_DESCRIPTION } from '@/utils/constants/seo.constants';
import { FilterFieldsTypeEnums } from '@/utils/enums/enums';
import { getDataFromLocalStorage } from '@/utils/helpers/commonHelpers';
import HelmetSeo from '@/utils/helpers/HelmetSeo';
import { BeautifulAccountStatusRenderer } from '@/utils/helpers/helpers';

const initialMetadata: MetaDataInterface = {
  total_data: 0,
  total_pages: 1,
  current_page: 1,
  record_per_page: 10,
};

function EmployeeListing() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const navigate = useNavigate();

  const [queryParameter] = useSearchParams();

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const useEffectRef = useRef(false);
  const [data, setData] = useState<EmployeeFieldInterface[]>([]);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);

  // Some State That Is Used For The Table Pagination
  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);

  const BreadcrumbsObjects = [
    {
      name: 'dashboard',
      label: 'dashboard',
      link: `/${organization}/dashboard`,
    },

    {
      name: 'Employee Listing',
      label: 'employee-listing',
      link: `/${organization}/employees/employee-listing`,
    },
  ];

  const handelShowModal = () => {
    navigate(`/${organization}/employees/manage/add`);
  };
  //
  // * This Is An OptionsButton Array That Is Being Render On The Table Header
  //
  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Employee',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  //
  // ? This Are The Column Which Is Used To render The Data Dynamically From The Backend
  //
  const columns: Array<Column> = [
    {
      key: 'personal_info',
      childKey: 'employee_info',
      title: 'Employee Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (
        data: EmployeePersonalInfo,
        childKeyData: EmployeeEmployeeInfo
      ) => (
        <div className='w-fit'>
          <div className='flex items-center justify-start gap-2.5'>
            <EmployeeProfilePicture
              width={50}
              height={50}
              profilePicture={data?.profile_picture}
            />
            <div className='flex items-start flex-col justify-start gap-0.5'>
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-sm font-medium text-nowrap text-black'>
                  {data?.full_name ||
                    data?.first_name +
                      ' ' +
                      data?.middle_name +
                      ' ' +
                      data?.last_name}
                </span>
                <span className='font-inter text-sm font-medium text-nowrap text-black'>
                  ({childKeyData?.employee_code})
                </span>
              </span>
              <span className='font-inter text-xs font-normal text-nowrap text-black/65'>
                {childKeyData?.designation}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap text-black'>
            {BeautifulAccountStatusRenderer(
              data?.status as EmployeeStatusInterface
            )}
          </span>
        </div>
      ),
    },
    {
      key: 'account_status',
      title: 'Account Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
        <div className='w-fit'>
          {data ? (
            <span className='flex items-center justify-start gap-1.5'>
              <FaRegCircleCheck className='text-green-600 w-5 h-5' />
              <span className='font-inter font-medium text-sm'>Active</span>
            </span>
          ) : (
            <span className='flex items-center justify-start gap-1.5'>
              <IoCloseCircleOutline className='text-red-600 w-5 h-5' />
              <span className='font-inter font-medium text-sm'>InActive</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Department',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap text-black'>
            {data?.department}
          </span>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Employee Type',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap text-black'>
            {data?.employee_type}
          </span>
        </div>
      ),
    },
    {
      key: 'employee_info',
      title: 'Employee Role',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <span className='font-inter text-sm font-medium text-nowrap px-4 py-1.5 border bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD] rounded-full'>
            {data?.employee_role?.role_name}
          </span>
        </div>
      ),
    },
    {
      key: 'employee_info',

      title: 'Reporting To',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: EmployeeEmployeeInfo) => (
        <div className='w-fit'>
          <div className='flex items-center justify-start gap-2.5'>
            <EmployeeProfilePicture
              width={35}
              height={35}
              profilePicture={data?.reporting_manager?.profile_picture}
            />
            <div className='w-fit'>
              <Link
                to={`/${organization}/employees/employee-profile/${data?.reporting_to_id}/employee-details`}
                className='flex items-center justify-start gap-1 text-black hover:text-[#3538CD]'
                target='_blank'
              >
                <span className='font-inter text-sm font-medium text-nowrap'>
                  {data?.reporting_manager?.full_name ||
                    data?.reporting_manager?.first_name +
                      ' ' +
                      data?.reporting_manager?.middle_name +
                      ' ' +
                      data?.reporting_manager?.last_name}
                </span>
                <span className='font-inter text-sm font-medium text-nowrap'>
                  ({data?.reporting_manager?.employee_code})
                </span>
              </Link>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: EmployeeFieldInterface) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <Button
              type='button'
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='Edit'
              disabled={permissionData?.permissions?.some(
                (item) => item?.label == 'edit' && !item?.is_allowed
              )}
              onClick={() => {
                navigate(
                  `/${organization}/employees/manage/edit/${data?.personal_info?.user_id}`
                );
              }}
            >
              <MdModeEdit className='text-[22px]' />
            </Button>
            <Button
              type='button'
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='project_status_view_profile_button'
              data-tooltip-content='View Profile'
              disabled={permissionData?.permissions?.some(
                (item) => item?.label == 'view' && !item?.is_allowed
              )}
              onClick={() => {
                navigate(
                  `/${organization}/employees/employee-profile/${data?.personal_info?.user_id}/employee-details`
                );
              }}
            >
              <IoEye className='text-[22px]' />
            </Button>
            <Tooltip
              id='project_status_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />

            <Tooltip
              id='project_status_view_profile_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
          </div>
        );
      },
    },
  ];

  const fetchAllEmployeeWithDebounce = useDebounce(
    async (queryString: string, page: number = 1, limit: number = 10) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `employee/fetch-all?page=${page}&limit=${limit}`
              : `employee/fetch-all?page=${page}&limit=${limit}&${queryString}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];
      if (res?.success) {
        setData(res?.data);
        setIsInitialFetching(false);
        setIsFetchingData(false);
        setMetaData(res?.metadata);
        setSelectedPage(res?.metadata?.current_page);
        setRecordsPerPage(res?.metadata?.record_per_page);
      } else {
        setIsInitialFetching(false);
        setIsFetchingData(false);
      }
    },
    1000
  );

  const handelApplyFilterEmployeeListing = async (
    filterArray: FilterObjectInterface[]
  ) => {
    setIsFetchingData(true);
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
            if (queryObj?.optionType == 'multi-select') {
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

    // First update the state and fetch data
    await fetchAllEmployeeWithDebounce(queryString);

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(`/${organization}/employees/employee-listing?${queryString}`);
    }, 0);
  };

  const handelClickOnRecordPerPage = (value: string | number) => {
    setRecordsPerPage(value);
    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setIsFetchingData(true);
    fetchAllEmployeeWithDebounce(queryString, 1, value);
  };

  const handelClickOnPaginationButtons = (value: number) => {
    setSelectedPage(value);

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }
    setIsFetchingData(true);
    fetchAllEmployeeWithDebounce(queryString, value, recordsPerPage);
  };
  //
  // ? This UseEffect Which Is Being Render For Only One Time
  //
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

    fetchAllEmployeeWithDebounce(queryString);
  }, [fetchAllEmployeeWithDebounce, queryParameter]);

  const segments = location.pathname.split('/').filter(Boolean);

  const parentSection = segments[1];
  const childSection = segments[2];

  const permissionData = GlobalStateProvider.roles_permissions.permissions
    .find((item) => item.module_label == parentSection)
    ?.sub_modules?.find(
      (item) => item?.module_label == childSection?.replace('-', '_')
    );

  return (
    <>
      <HelmetSeo
        Title={META_TITLE_DESCRIPTION.EMPLOYEE_LISTING.title}
        Content={META_TITLE_DESCRIPTION.EMPLOYEE_LISTING.description}
      />
      <div className='w-full h-full relative'>
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className='w-full h-full pt-9'>
          <div className='w-full h-full p-4 2xl:p-5'>
            {isInitialFetching ? (
              <div className='w-full h-full overflow-hidden'>
                <TableSkeletonLoader
                  tableHeaderCount={5}
                  tableValueCount={13}
                  maxHeight='calc(-350px + 100vh)'
                />
              </div>
            ) : (
              <>
                <TableInfoHeader
                  moduleName='Employees'
                  badgeValue={
                    data?.length > 0
                      ? `${(selectedPage - 1) * Number(recordsPerPage) + 1} - ${data?.length * selectedPage} of  ${metaData?.total_data}  Employees`
                      : `0 Employee`
                  }
                  buttonsArray={
                    permissionData?.permissions?.some(
                      (item) => item?.label == 'edit' && item?.is_allowed
                    )
                      ? optionsButtonArray
                      : []
                  }
                  loading={isFetchingData}
                />
                <TableFilterSearchBar
                  filterColumnsArray={EmployeeListingFiltersArray}
                  handelApplyFilterFunc={handelApplyFilterEmployeeListing}
                  urlDecodedFilterQuery={urlDecodedFilterQuery || ''}
                />
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
                    {data?.length > 0 ? (
                      <>
                        <Table
                          columns={columns}
                          data={data}
                          tableWrapperClass={
                            'overflow-auto max-h-[calc(100vh-340px)] h-full bg-white'
                          }
                          stickyHeaderClass='sticky top-0'
                        />
                        <TablePagination
                          paginationDropDownArray={dropdownMenuArray}
                          recordsPerPage={recordsPerPage}
                          handelClickOnDroDownVal={handelClickOnRecordPerPage}
                          clickOnPaginationVal={handelClickOnPaginationButtons}
                          selectedPage={selectedPage}
                          totalPage={metaData?.total_pages}
                        />
                      </>
                    ) : (
                      <TableNoDataFound
                        tableWrapperClass={
                          'max-h-[calc(100%-150px)] rounded-b-lg'
                        }
                        notFoundTitle={'No Employees Found'}
                        notFoundMessage={
                          'No matching employee found. Try refining your search or add a new employee.'
                        }
                        notFoundOptionsButtonsArray={
                          queryParameter
                            ? []
                            : permissionData?.permissions?.some(
                                  (item) =>
                                    item?.label == 'edit' && item?.is_allowed
                                )
                              ? optionsButtonArray
                              : []
                        }
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeListing;
