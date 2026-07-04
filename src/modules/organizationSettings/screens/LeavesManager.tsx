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
  AddEditLeavesTypesInterface,
  LeavesTypesInterface,
} from '@/interface/OrganizationSettings.interface';

import { useDebounce } from '@/hooks/useDebounce';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import Table from '@/components/common/table/Table';
import TableInfoHeader from '@/components/common/table/TableInfoHeader';
import TableLocalSearchBar from '@/components/common/table/TableLocalSearchBar';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import ViewLeaveModal from '@/components/drawers/ViewLeaveModal';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import AddEditLeavesTypesModal from '@/components/modals/AddEditLeavesTypesModal';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';
import { ORGANIZATION_SETTINGS_BREADCRUMBS } from '@/utils/constants/breadcrumbs.constants';
import { INITIAL_LEAVE_TYPE } from '@/utils/initialData/leaves.initial';

import HolidayAnimation from '@/assets/lottie/HolidayAnimation.lottie';

import { LeavesManagerColumn } from '../tableColumns/leavesManager.columns';
import AccessDeniedRedirect from '@/routes/AccessDeniedRedirect';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const [editLeaveData, setEditLeaveData] =
    useState<AddEditLeavesTypesInterface | null>(null);
  const [leaveData, setLeaveData] =
    useState<LeavesTypesInterface>(INITIAL_LEAVE_TYPE);

  const [reFetchingData, setReFetchingData] = useState<boolean>(false);

  const fetchAllTheLeavesWithDebounce = useDebounce(async () => {
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

  const addLeaveTypeWithDebounce = useDebounce(
    async (data: AddEditLeavesTypesInterface, callback?: () => void) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: editId
            ? `org-setting/leaves/leave-type/edit?id=${editId}`
            : `org-setting/leaves/leave-type/create`,
          protected: true,
          data: data,
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      if (res?.success) {
        setShowModal(false);
        if (callback) callback();
        setReFetchingData(true);
        fetchAllTheLeavesWithDebounce();
      } else {
        handelNotification(res, 'top-right');
      }
      setLoading(false);
    },
    100
  );

  const handelSaveLeave = (
    data: AddEditLeavesTypesInterface,
    callback?: () => void
  ) => {
    setLoading(true);
    addLeaveTypeWithDebounce(data, callback);
  };

  const handelEditButtonClick = (data: LeavesTypesInterface) => {
    setModalType('edit');
    setShowModal(!showModal);
    setEditId(data?.id);
    setEditLeaveData({
      description: data?.description,
      employee_status: JSON.parse(data?.employee_status),
      gender: JSON.parse(data?.gender),
      is_paid: data?.is_paid,
      leave_code: data?.leave_code,
      leave_name: data?.leave_name,
      marital_status: JSON.parse(data?.marital_status),
      max_number_of_leave: data?.max_number_of_leave,
      refill_from: data?.refill_from,
      refill_quarterly: data?.refill_quarterly,
      status: data?.status,
    });
  };

  const toggleShowModal = (type: 'show' | 'close') => {
    if (type === 'show') {
      setShowModal(true);
      setModalType('add');
    } else {
      setShowModal(false);
      setModalType('add');
    }
  };

  const handelCancel = () => {
    setShowViewModal(false);
    setLeaveData(INITIAL_LEAVE_TYPE);
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Leaves Type',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: () => toggleShowModal('show'),
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
    fetchAllTheLeavesWithDebounce();
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

  const COLUMNS = LeavesManagerColumn({
    GlobalStateProvider,
    showViewModal,
    permissionData,
    setShowViewModal,
    setLeaveData,
    handelEditButtonClick,
  });
  return (
    <>
      <div className='w-full h-full relative'>
        <Breadcrumbs
          BreadcrumbsNavigationFlow={ORGANIZATION_SETTINGS_BREADCRUMBS.ORG_LEAVES_MANAGER(
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
      <AddEditLeavesTypesModal
        showModal={showModal}
        loading={loading}
        modalType={modalType}
        editLeaveData={editLeaveData}
        onClose={() => toggleShowModal('close')}
        onSave={handelSaveLeave}
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
