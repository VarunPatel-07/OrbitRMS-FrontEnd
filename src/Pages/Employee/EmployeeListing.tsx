/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoCloseCircleOutline, IoEye } from 'react-icons/io5';
import { MdModeEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import { FilterObjectInterface } from '../../common/Table/FilterInput';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import EmployeeProfilePicture from '../../Components/EmployeeProfilePicture';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  EmployeeEmployeeInfo,
  EmployeeFieldInterface,
  EmployeePersonalInfo,
} from '../../interface/EmployeeInterface';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../interface/propsInterface';
import { EmployeeListingFiltersArray } from './EmployeeListingFiltersArray';

function EmployeeListing() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const navigate = useNavigate();

  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  const useEffectRef = useRef(false);
  const [data, setData] = useState<EmployeeFieldInterface[]>([]);
  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const BreadcrumbsObjects = [
    {
      name: 'dashboard',
      label: 'dashboard',
      link: `/${organization}/dashboard`,
    },

    {
      name: 'Employee Listing',
      label: 'employee-listing',
      link: `/${organization}/employee/employee-listing`,
    },
  ];

  const handelShowModal = () => {
    navigate(`/${organization}/employee/add`);
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
      key: 'account_status',
      title: 'Status',
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
              <span className='flex items-center justify-start gap-1'>
                <span className='font-inter text-sm font-medium text-nowrap text-black'>
                  {data?.reporting_manager?.full_name ||
                    data?.reporting_manager?.first_name +
                      ' ' +
                      data?.reporting_manager?.middle_name +
                      ' ' +
                      data?.reporting_manager?.last_name}
                </span>
                <span className='font-inter text-sm font-medium text-nowrap text-black'>
                  ({data?.reporting_manager?.employee_code})
                </span>
              </span>
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
            <button
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='Edit'
              onClick={() => {
                navigate(
                  `/${organization}/employee/edit/${data?.personal_info?.user_id}`
                );
              }}
            >
              <MdModeEdit className='text-[22px]' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='project_status_view_profile_button'
              data-tooltip-content='View Profile'
              onClick={() => {
                navigate(
                  `/${organization}/employee-profile/${data?.personal_info?.user_id}/employee-details`
                );
              }}
            >
              <IoEye className='text-[22px]' />
            </button>
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
    async (queryString: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `employee/fetch-all`
              : `employee/fetch-all?${queryString}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];
      if (res?.success) {
        setData(res?.data);
        setIsInitialFetching(false);
        setIsFetchingData(false);
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
    let queryString = '';
    if (filterArray?.length > 0) {
      const queryFilterArray = filterArray?.map((queryObj) => {
        const obj = { field_name: '', operator: '', value: '' };
        queryObj?.moduleValue?.forEach((moduleValue) => {
          if (moduleValue?.type === FilterFieldsTypeEnums[0]) {
            obj.field_name = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[1]) {
            obj.operator = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[2]) {
            obj.value = moduleValue?.value;
          }
        });
        return obj;
      });

      queryString = `filter=${encodeURIComponent(JSON.stringify(queryFilterArray))}`;
    }
    setIsFetchingData(true);
    fetchAllEmployeeWithDebounce(queryString);
  };

  //
  // ? This UseEffect Which Is Being Render For Only One Time
  //
  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchAllEmployeeWithDebounce();
  });
  return (
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
                badgeValue={data.length?.toString()}
                buttonsArray={optionsButtonArray}
              />
              <TableFilterSearchBar
                filterColumnsArray={EmployeeListingFiltersArray}
                handelApplyFilterFunc={handelApplyFilterEmployeeListing}
              />
              {isFetchingData ? (
                <TableSkeletonLoader
                  tableHeaderCount={5}
                  tableValueCount={13}
                  maxHeight='calc(-350px + 100vh)'
                  showFilterLoader={false}
                  showHeaderLoader={false}
                  // showPaginationLoader={false}
                />
              ) : (
                <>
                  {data?.length > 0 ? (
                    <Table
                      columns={columns}
                      data={data}
                      tableWrapperClass={
                        'overflow-auto max-h-[calc(100vh-280px)] rounded-b-lg'
                      }
                      stickyHeaderClass='sticky top-0'
                    />
                  ) : (
                    <TableNoDataFound
                      tableWrapperClass={
                        'max-h-[calc(100%-150px)] rounded-b-lg'
                      }
                      notFoundTitle={'No Data Found For Related Search'}
                      notFoundMessage={
                        'No matching Department found. Try refining your search or adding a new Department.'
                      }
                      notFoundOptionsButtonsArray={[]}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeListing;
