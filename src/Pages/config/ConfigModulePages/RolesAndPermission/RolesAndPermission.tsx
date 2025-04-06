/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { MdDelete, MdModeEdit, MdOutlineRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../../../common/Breadcrumbs';
import Table from '../../../../common/Table/Table';
import TableInfoHeader from '../../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../../../Components/Loader/Table/TableSkeletonLoader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleFetchApi,
} from '../../../../Helper/api/multipleAPI';
import { formateDate } from '../../../../Helper/HelperFunctions';
import { useDebounce } from '../../../../Hooks/useDebounce';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../../interface/propsInterface';

const BreadcrumbsObjects = [
  { name: 'Home', label: 'home', link: '/home' },
  { name: 'Config', label: 'config-module', link: '/config/project-status' },
  { name: 'Roles', label: 'role-permission', link: '/config/roles-permission' },
];

function RolesAndPermission() {
  const navigate = useNavigate();
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectReference = useRef(false);

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState<Array<any>>([]);
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);

  const handelShowModal = () => {};

  const handleRolesPermissionViewButton = (data: any) => {
    console.log(data);
    navigate(`/config/roles-permission/${data?.id}`);
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Role',
      classNames:
        'font-inter text-white font-medium bg-[#3538CD] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const columns: Array<Column> = [
    {
      key: 'role_name',
      title: 'Role Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {data}
        </span>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      isSortable: false,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {data}
        </span>
      ),
    },
    {
      key: 'created_by',
      childKey: 'created_at',
      title: 'Created By',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any, childKeyData: any) => {
        return data ? (
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>{`${JSON.parse(data).first_name} ${JSON.parse(data).last_name}`}</span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(childKeyData)}
            </span>
          </div>
        ) : (
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              system
            </span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(childKeyData)}
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
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>{`${JSON.parse(data).first_name} ${JSON.parse(data).last_name}`}</span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(childKeyData)}
            </span>
          </div>
        ) : (
          <span>-</span>
        );
      },
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: any) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='roles_permission_view_button'
              data-tooltip-content='View'
              onClick={() => {
                handleRolesPermissionViewButton(data);
              }}
            >
              <MdOutlineRemoveRedEye className='text-[22px]' />
            </button>
            <button
              className='text-black/80 p-1.5'
              data-tooltip-id='roles_permission_edit_button'
              data-tooltip-content='Edit'
              //   onClick={() => handelEditButtonClick(data)}
            >
              <MdModeEdit className='text-[22px]' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='roles_permission_delete_button'
              data-tooltip-content='Delete'
              disabled={data?.source_type == 'default'}
              //   onClick={() => {
              //     setShowDeleteModal(true);
              //     setDeleteItemId(data?.id);
              //   }}
            >
              <MdDelete className='text-[22px]' />
            </button>

            <Tooltip
              id='roles_permission_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
            <Tooltip
              id='roles_permission_view_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
            {data?.source_type != 'default' && (
              <Tooltip
                id='roles_permission_delete_button'
                opacity={'100'}
                className='z-[15] bg-white'
                place='left'
              />
            )}
          </div>
        );
      },
    },
  ];

  const fetchRolesAndPermissionWithDebounce = useDebounce(async () => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: 'config/roles_permissions/fetch-all',
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);

    const res = response[0];

    if (res?.success) {
      setData(res?.data);
      setIsFetchingData(false);
    } else {
      setIsFetchingData(false);
      handelNotification(res, 'top-right');
    }
  }, 50);

  const fetchRolesAndPermission = () => {
    setIsFetchingData(true);
    fetchRolesAndPermissionWithDebounce();
  };

  useEffect(() => {
    if (useEffectReference.current) return;
    useEffectReference.current = true;
    setIsFetchingData(true);
    fetchRolesAndPermission();
  }, []);

  return (
    <div className='relative w-full h-full'>
      <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
      <div className='w-full h-full pt-10'>
        <div className='w-full h-full p-4 2xl:p-5'>
          {isFetchingData ? (
            <div className='w-full h-full overflow-hidden'>
              <TableSkeletonLoader
                tableHeaderCount={5}
                tableValueCount={13}
                maxHeight='calc(-335px + 100vh)'
              />
            </div>
          ) : (
            <>
              <TableInfoHeader
                moduleName='Roles & Permission'
                badgeValue={
                  showSearchFilterData
                    ? filterData.length?.toString()
                    : data.length?.toString()
                }
                buttonsArray={optionsButtonArray}
              />
              <TableLocalSearchBar
                setShowSearchFilterData={setShowSearchFilterData}
                data={data}
                search_key='status_name'
                setData={setFilterData}
              />

              {(data?.length > 0 && !showSearchFilterData) ||
              (showSearchFilterData && filterData?.length > 0) ? (
                <Table
                  columns={columns}
                  data={showSearchFilterData ? filterData : data}
                  tableWrapperClass={
                    'overflow-auto max-h-[calc(100vh-270px)] rounded-b-lg'
                  }
                  stickyHeaderClass='sticky top-0'
                />
              ) : (
                <TableNoDataFound
                  tableWrapperClass={'max-h-[calc(100%-140px)] rounded-b-lg'}
                  notFoundTitle={
                    showSearchFilterData
                      ? 'No Data Found For Related Search'
                      : 'You haven’t added any Projects Status yet'
                  }
                  notFoundMessage={
                    showSearchFilterData
                      ? 'No matching role & permission found. Try refining your search or adding a new role & permission.'
                      : 'Add Role manually by clicking Add Role button.'
                  }
                  notFoundOptionsButtonsArray={
                    showSearchFilterData ? [] : optionsButtonArray
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RolesAndPermission;
