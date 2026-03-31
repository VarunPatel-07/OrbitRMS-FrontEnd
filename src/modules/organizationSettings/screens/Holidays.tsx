import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import { TableInfoHeaderInterfaceButtonArrayObject } from '@/interface/ComponentProps.interface';
import {
  HolidayFormData,
  OrganizationHolidays,
} from '@/interface/OrganizationSettings.interface';
import AccessDeniedRedirect from '@/routes/AccessDeniedRedirect';

import { useDebounce } from '@/hooks/useDebounce';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import Table from '@/components/common/table/Table';
import TableInfoHeader from '@/components/common/table/TableInfoHeader';
import TableLocalSearchBar from '@/components/common/table/TableLocalSearchBar';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';
import { ORGANIZATION_SETTINGS_BREADCRUMBS } from '@/utils/constants/breadcrumbs.constants';

import HolidayAnimation from '@/assets/lottie/HolidayAnimation.lottie';

import { ORG_HOLIDAYS_COLUMNS } from '../tableColumns/orgHolidays.columns';

const DeleteConfirmationDialog = React.lazy(
  () => import('@/components/modals/DeleteConfirmationDialog')
);

const AddEditHolidayDialog = React.lazy(
  () => import('@/components/modals/AddEditHolidayDialog')
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

  const handelClickOnDeleteButton = (data?: OrganizationHolidays) => {
    if (data) {
      setShowDeleteModal(true);
      setDeleteItemId(data?.id);
    } else {
      setShowDeleteModal(false);
      setDeleteItemId('');
    }
  };

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

  const COLUMNS = ORG_HOLIDAYS_COLUMNS({
    GlobalStateProvider,
    permissionData,
    handelEditButtonClick,
    handelClickOnDeleteButton,
  });

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
        <Breadcrumbs
          BreadcrumbsNavigationFlow={ORGANIZATION_SETTINGS_BREADCRUMBS.ORG_HOLIDAYS(
            organization
          )}
        />
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
                        columns={COLUMNS}
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
      <AddEditHolidayDialog
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
      <DeleteConfirmationDialog
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        handelOnClose={handelClickOnDeleteButton}
        handelDelete={handelDeleteItem}
        name='Holiday'
      />
    </>
  );
}

export default Holidays;
