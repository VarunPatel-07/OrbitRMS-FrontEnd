/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import HolidayAnimation from '../../../../assets/lottie/HolidayAnimation.lottie';
import Breadcrumbs from '../../../../common/Breadcrumbs';
import Button from '../../../../common/Button';
import Table from '../../../../common/Table/Table';
import TableInfoHeader from '../../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../../common/Table/TableNoDataFound';
import AccessDeniedRedirect from '../../../../Components/AccessDeniedRedirect';
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
  multiplePostApi,
} from '../../../../Helper/api/multipleAPI';
import { formateDate } from '../../../../Helper/HelperFunctions';
import { useDebounce } from '../../../../Hooks/useDebounce';
import {
  HolidayFormData,
  OrganizationHolidays,
} from '../../../../interface/OrganizationSettings';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../../interface/propsInterface';

const DeleteModal = React.lazy(
  () => import('../../../../Components/Modal/DeleteModal')
);

const AddEditHoliday = React.lazy(
  () => import('../../../../Components/Modal/AddEditHoliday')
);
const DotLottieReact = React.lazy(() =>
  import('@lottiefiles/dotlottie-react').then((mod) => ({
    default: mod.DotLottieReact,
  }))
);

function Holidays() {
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
      name: 'Holiday',
      label: 'holiday',
      link: `/${organization}/organization-settings/holiday`,
    },
  ];

  //   Defining All The Relevant UseRef

  const useEffectRef = useRef(false);

  //   Defining All The State
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [data, setData] = useState<OrganizationHolidays[]>([]);
  const [filterData, setFilterData] = useState<OrganizationHolidays[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [formData, setFromData] = useState<HolidayFormData>({
    date: null,
    holiday_name: '',
    year: new Date()?.getFullYear(),
  });
  const [dummyFormData, setDummyFromData] = useState<HolidayFormData>({
    date: null,
    holiday_name: '',
    year: new Date()?.getFullYear(),
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [reFetchingData, setReFetchingData] = useState<boolean>(false);

  const fetchAllTheHolidayWithDebounce = useDebounce(async (year?: number) => {
    let current_year;
    if (year) {
      current_year = year;
    } else {
      const date = new Date();
      current_year = date.getFullYear();
    }
    const endPointArr: endpointObject[] = [
      {
        endPoint: `org-setting/holiday/fetch?year=${current_year}&order=desc&field_name=date`,
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

  const handelYearButton = (type: 'increment' | 'decrement') => {
    setReFetchingData(true);
    setYear((prevYear) => {
      const newYear = type === 'increment' ? prevYear + 1 : prevYear - 1;
      setFromData((pervVal) => ({ ...pervVal, year: newYear }));
      setDummyFromData((pervVal) => ({ ...pervVal, year: newYear }));
      fetchAllTheHolidayWithDebounce(newYear); // use the new year here
      return newYear;
    });
  };

  const handelEditButtonClick = (data: OrganizationHolidays) => {
    setModalType('edit');
    setShowModal(!showModal);
    setFromData({
      date: data?.date,
      holiday_name: data?.holiday_name,
      year: data?.year,
    });
    setDummyFromData({
      date: data?.date,
      holiday_name: data?.holiday_name,
      year: data?.year,
    });
    setEditId(data?.id);
  };

  const columns: Array<Column> = [
    {
      key: 'holiday_name',
      title: 'Holiday Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
        <span className='w-fit font-inter text-sm font-medium inline-block text-nowrap text-ellipsis overflow-hidden max-w-[300px]'>
          {data}
        </span>
      ),
    },
    {
      key: 'date',
      title: 'Date',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {formateDate(
            data,
            GlobalStateProvider?.organization?.organization_settings
              ?.default_dateformat,
            false
          )}
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
      renderContent: (data: OrganizationHolidays) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
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

  const editHolidayWithDebounce = useDebounce(
    async (modal_type: 'add' | 'edit', data: HolidayFormData, id?: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            modal_type == 'add'
              ? `org-setting/holiday/add-edit?type=${modal_type}`
              : `org-setting/holiday/add-edit?type=${modal_type}&id=${id}`,
          protected: true,
          data: data,
        },
      ];
      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      if (res?.success) {
        setIsFetchingData(true);
        setLoading(false);
        setShowModal(false);
        setFromData({
          date: null,
          holiday_name: '',
          year: year ? year : new Date()?.getFullYear(),
        });
        fetchAllTheHolidayWithDebounce(year);
      } else {
        setLoading(false);
        handelNotification(res, 'top-right');
      }
    },
    100
  );

  const handelFormSubmitFunction = () => {
    setLoading(true);

    editHolidayWithDebounce(modalType, formData, editId);
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
      fetchAllTheHolidayWithDebounce(year);
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

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Holiday',
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

  const hasNoViewHolidayPermission =
    !permissionData ||
    !permissionData.is_active ||
    !permissionData?.permissions?.some(
      (item) => item.label == 'view' && item.is_allowed
    );

  if (hasNoViewHolidayPermission)
    return (
      <AccessDeniedRedirect
        message="You don't have permission For Holidays."
        isAccessDenied={hasNoViewHolidayPermission}
      />
    );
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
                  moduleName='Holiday'
                  badgeValue={
                    showSearchFilterData
                      ? filterData.length?.toString()
                      : data.length?.toString()
                  }
                  buttonsArray={
                    permissionData?.permissions?.some(
                      (item) => item.label == 'edit' && item.is_allowed
                    )
                      ? optionsButtonArray
                      : []
                  }
                  renderDateSelector
                  year={year}
                  handelYearButton={handelYearButton}
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
                            : 'Start by adding holidays manually using the Add Holiday button.'
                        }
                        notFoundOptionsButtonsArray={
                          showSearchFilterData
                            ? []
                            : permissionData?.permissions?.some(
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
      <AddEditHoliday
        modalTitle='Add Holiday'
        formData={formData}
        dummyFormData={dummyFormData}
        setFormData={setFromData}
        showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        handelFormSubmitFunction={handelFormSubmitFunction}
        loading={loading}
        year={year}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Holiday'
      />
    </>
  );
}

export default Holidays;
