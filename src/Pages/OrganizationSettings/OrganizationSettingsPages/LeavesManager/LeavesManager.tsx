/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdDelete, MdModeEdit, MdOutlineRemoveRedEye } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import HolidayAnimation from '../../../../assets/lottie/HolidayAnimation.lottie';
import Breadcrumbs from '../../../../common/Breadcrumbs';
import Button from '../../../../common/Button';
import Table from '../../../../common/Table/Table';
import TableInfoHeader from '../../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../../../Components/Loader/Table/TableSkeletonLoader';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
  //   multiplePostApi,
} from '../../../../Helper/api/multipleAPI';
import { formateDate } from '../../../../Helper/HelperFunctions';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { LeavesTypesInterface } from '../../../../interface/OrganizationSettings';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../../interface/propsInterface';
import ViewLeaveModal from './ViewLeaveModal';

const DeleteModal = React.lazy(
  () => import('../../../../Components/Modal/DeleteModal')
);

const DotLottieReact = React.lazy(() =>
  import('@lottiefiles/dotlottie-react').then((mod) => ({
    default: mod.DotLottieReact,
  }))
);

function LeavesManager() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const organization =
    GlobalStateProvider.organization.general_info.portal_slug;

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
    {
      name: 'Organization Settings',
      label: 'organization-settings',
      link: `/${organization}/organization-settings/general-info`,
    },
    {
      name: 'Leaves Manager',
      label: 'holiday',
      link: `/${organization}/organization-settings/holiday`,
    },
  ];

  //   Defining All The Relevant UseRef

  const useEffectRef = useRef(false);

  //   Defining All The State
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [data, setData] = useState<LeavesTypesInterface[]>([]);
  const [filterData, setFilterData] = useState<LeavesTypesInterface[]>([]);
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  //   const [loading, setLoading] = useState<boolean>(false);
  //   const [editId, setEditId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [leaveData, setLeaveData] = useState<LeavesTypesInterface | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [reFetchingData, setReFetchingData] = useState<boolean>(false);

  const fetchAllTheHolidayWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `org-setting/leaves/leave-type/fetch`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setData(res?.data);
    } else {
      handelNotification(res, 'top-right');
    }
    setIsFetchingData(false);
    setReFetchingData(false);
  }, 100);

  const handelEditButtonClick = (data: LeavesTypesInterface) => {
    setModalType('edit');
    setShowModal(!showModal);
    console.log(data);
  };

  const columns: Array<Column> = [
    {
      key: 'leave_name',
      title: 'Leave Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <span className='w-fit font-inter text-sm font-medium inline-block text-nowrap text-ellipsis overflow-hidden max-w-[300px]'>
          {data}
        </span>
      ),
    },
    {
      key: 'leave_code',
      title: 'Leave Code',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <span className='w-fit font-inter font-medium inline-block text-nowrap text-ellipsis overflow-hidden px-3 py-1 pb-0.5 bg-cyan-100 text-cyan-800 border border-cyan-600 rounded-xl text-xs'>
          {data}
        </span>
      ),
    },
    {
      key: 'max_number_of_leave',
      title: 'Total Number Of Leave',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {data}
        </span>
      ),
    },
    {
      key: 'refill_quarterly',
      title: 'Quarterly Refill',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
        <>
          {data ? (
            <span className='text-green-600 capitalize font-semibold text-sm border border-green-600 px-6 py-1.5 rounded-full bg-green-50 font-inter'>
              active
            </span>
          ) : (
            <span className='text-red-600 capitalize font-semibold text-sm border border-red-600 px-6 py-1.5 rounded-full bg-red-50 font-inter'>
              in Active
            </span>
          )}
        </>
      ),
    },
    {
      key: 'refill_from',
      title: 'Refill From',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <span className='text-black capitalize font-semibold text-sm px-2.5 py-1.5 rounded-lg bg-black/10 font-inter'>
          {data}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
        <>
          {data ? (
            <span className='text-green-600 capitalize font-semibold text-sm border border-green-600 px-6 py-1.5 rounded-full bg-green-50 font-inter'>
              active
            </span>
          ) : (
            <span className='text-red-600 capitalize font-semibold text-sm border border-red-600 px-6 py-1.5 rounded-full bg-red-50 font-inter'>
              in Active
            </span>
          )}
        </>
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
              {formateDate(
                childKeyData,
                GlobalStateProvider?.organization?.organization_settings
                  ?.default_dateformat
              )}
            </span>
          </div>
        ) : (
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              system
            </span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
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
          <div className='flex flex-col w-full'>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>{`${JSON.parse(data).first_name} ${JSON.parse(data).last_name}`}</span>
            <span className='w-full font-inter text-sm capitalize font-medium inline-block text-black/70'>
              {formateDate(
                childKeyData,
                GlobalStateProvider?.organization?.organization_settings
                  ?.default_dateformat
              )}
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
      renderContent: (data: LeavesTypesInterface) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <Button
              type='button'
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              dataTooltipId='roles_permission_view_button'
              dataTooltipContent='View'
              onClick={() => {
                setShowViewModal(!showViewModal);
                setLeaveData(data);
              }}
              //   disabled={
              //     permissions &&
              //     permissions.some(
              //       (perm) => perm.label === 'view' && !perm.is_allowed
              //     )
              //   }
            >
              <MdOutlineRemoveRedEye className='text-[22px]' />
            </Button>
            <Button
              type='button'
              className='text-black/80 p-1.5'
              dataTooltipId='holiday_edit_button'
              dataTooltipContent='Edit'
              onClick={() => handelEditButtonClick(data)}
              disabled={permissionData?.permissions?.some(
                (item) => item.label == 'edit' && !item.is_allowed
              )}
            >
              <MdModeEdit className='text-[22px]' />
            </Button>
            <Button
              type='button'
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              dataTooltipId='holiday_delete_button'
              dataTooltipContent='Delete'
              disabled={
                data?.source_type == 'default' ||
                permissionData?.permissions?.some(
                  (item) => item.label == 'delete' && !item.is_allowed
                )
              }
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteItemId(data?.id);
              }}
            >
              <MdDelete className='text-[22px]' />
            </Button>
            <Tooltip
              id='holiday_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />

            {data?.source_type != 'default' && (
              <Tooltip
                id='holiday_delete_button'
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

  const handelShowModal = () => {
    setShowModal(true);
    setModalType('add');
  };

  const handelDeleteHolidayWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `org-setting/holiday/delete?id=${deleteItemId}`,
        protected: true,
      },
    ];
    const response = await multipleDeleteApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setIsDeleteLoading(false);
      setShowDeleteModal(false);
      setIsFetchingData(true);
      setDeleteItemId('');
      fetchAllTheHolidayWithDebounce();
    } else {
      setIsDeleteLoading(false);
      setDeleteItemId('');
      handelNotification(res, 'top-right');
    }
  }, 100);

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    handelDeleteHolidayWithDebounce();
  };

  const handelCancel = () => {
    setShowViewModal(false);
    setLeaveData(null);
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Leaves Type',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const HolidayNotFoundAnimation = (
    <span className='bg-gradient-to-b from-[#f5f7f7] to-[#eaedf0] flex items-center justify-center max-w-[90px] max-h-[90px] overflow-hidden rounded-full'>
      <DotLottieReact
        src={HolidayAnimation}
        loop
        autoplay
        height={110}
        width={100}
      />
    </span>
  );

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchAllTheHolidayWithDebounce();
  }, []);

  const segments = location.pathname.split('/').filter(Boolean);

  const parentSection = segments[1];
  const childSection = segments[2];

  const permissionData = GlobalStateProvider.roles_permissions.permissions
    .find((item) => item.module_label == parentSection.replace('-', '_'))
    ?.sub_modules?.find((item) => item.module_label == childSection);

  console.log(permissionData, modalType);

  //   const hasNoViewHolidayPermission =
  //     !permissionData ||
  //     !permissionData.is_active ||
  //     !permissionData?.permissions?.some(
  //       (item) => item.label == 'view' && item.is_allowed
  //     );

  //   if (hasNoViewHolidayPermission)
  //     return (
  //       <AccessDeniedRedirect
  //         message="You don't have permission For Holidays."
  //         isAccessDenied={hasNoViewHolidayPermission}
  //       />
  //     );
  return (
    <>
      <div className='w-full h-full relative'>
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className='w-full h-full pt-9'>
          <div className='w-full h-full p-4 2xl:p-5'>
            {isFetchingData ? (
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
                  moduleName='Leaves Manager'
                  badgeValue={
                    showSearchFilterData
                      ? filterData.length?.toString()
                      : data.length?.toString()
                  }
                  buttonsArray={
                    !permissionData?.permissions?.some(
                      (item) => item.label == 'edit' && item.is_allowed
                    )
                      ? optionsButtonArray
                      : []
                  }
                />
                <TableLocalSearchBar
                  setShowSearchFilterData={setShowSearchFilterData}
                  data={data}
                  search_key='holiday_name'
                  setData={setFilterData}
                />
                {reFetchingData ? (
                  <TableSkeletonLoader
                    tableHeaderCount={5}
                    tableValueCount={13}
                    maxHeight='calc(-350px + 100vh)'
                    showFilterLoader={false}
                    showHeaderLoader={false}
                  />
                ) : (
                  <>
                    {(data?.length > 0 && !showSearchFilterData) ||
                    (showSearchFilterData && filterData?.length > 0) ? (
                      <Table
                        columns={columns}
                        data={showSearchFilterData ? filterData : data}
                        tableWrapperClass={
                          'overflow-auto max-h-[calc(100vh-280px)] rounded-b-lg'
                        }
                        stickyHeaderClass='sticky top-0'
                      />
                    ) : (
                      <TableNoDataFound
                        tableWrapperClass={
                          'max-h-[calc(100%-140px)] rounded-b-lg'
                        }
                        notFoundTitle={
                          showSearchFilterData
                            ? 'No Holidays Found For Related Search'
                            : 'No Holidays Added for This Year'
                        }
                        notFoundMessage={
                          showSearchFilterData
                            ? 'No matching holidays found. Try refining your search or adding a new holiday.'
                            : 'Start by adding holidays manually using the Add Leaves Manager button.'
                        }
                        notFoundOptionsButtonsArray={
                          showSearchFilterData
                            ? []
                            : !permissionData?.permissions?.some(
                                  (item) =>
                                    item.label == 'edit' && item.is_allowed
                                )
                              ? optionsButtonArray
                              : []
                        }
                        defaultAnimation={HolidayNotFoundAnimation}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {/* <AddEditHoliday
        modalTitle='Add Leaves Manager'
        formData={formData}
        setFormData={setFromData}
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        handelFormSubmitFunction={handelFormSubmitFunction}
        loading={loading}
        
      /> */}
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Leaves Manager'
      />

      <ViewLeaveModal
        showModal={showViewModal}
        leaveData={leaveData}
        handelCancel={handelCancel}
      />
    </>
  );
}

export default LeavesManager;
