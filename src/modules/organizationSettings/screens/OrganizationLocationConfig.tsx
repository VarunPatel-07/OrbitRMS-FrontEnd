import { useContext, useEffect, useRef, useState } from 'react';

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
  LocationConfigDataInterface,
  OrgLocationConfigCoordinates,
  OrgLocationConfigDataArrayInterface,
} from '@/interface/OrganizationSettings.interface';

import { useDebounce } from '@/hooks/useDebounce';

import Breadcrumbs from '@/components/common/Breadcrumbs';
import Table from '@/components/common/table/Table';
import TableInfoHeader from '@/components/common/table/TableInfoHeader';
import TableLocalSearchBar from '@/components/common/table/TableLocalSearchBar';
import TableNoDataFound from '@/components/common/table/TableNoDataFound';
import TableSkeletonLoader from '@/components/loaders/table/TableSkeletonLoader';
import AddLocationConfig from '@/components/modals/AddLocationConfig';
import DeleteConfirmationDialog from '@/components/modals/DeleteConfirmationDialog';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
  multiplePostApi,
} from '@/utils/api/multipleAPI';
import { ORGANIZATION_SETTINGS_BREADCRUMBS } from '@/utils/constants/breadcrumbs.constants';

import { LocationConfigColumns } from '../tableColumns/locationConfig.columns';

function OrganizationLocationConfig() {
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
  const [data, setData] = useState<LocationConfigDataInterface[]>([]);
  const [filterData, setFilterData] = useState<LocationConfigDataInterface[]>(
    []
  );
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [locationData, setLocationData] =
    useState<OrgLocationConfigDataArrayInterface | null>(null);

  const [reFetchingData, setReFetchingData] = useState<boolean>(false);
  const [submitLoader, setSubmitLoader] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const fetchAllTheLeavesWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `org-setting/location-config/fetch`,
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

  const addEditLocationConfigWithDebounce = useDebounce(
    async (
      data: OrgLocationConfigDataArrayInterface,
      id: string,
      callBack?: () => void
    ) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `org-setting/location-config/add-edit?type=${locationData ? `edit&id=${id}` : 'add'}`,
          protected: true,
          data: data,
        },
      ];

      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      setSubmitLoader(false);
      if (res?.success) {
        setShowModal(false);
        setEditId('');
        if (callBack) callBack();
        setReFetchingData(true);
        fetchAllTheLeavesWithDebounce();
      }
      handelNotification(res, 'top-right');
    }
  );

  const deleteLocationConfigWithDebounce = useDebounce(
    async (data: OrgLocationConfigDataArrayInterface, id: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `org-setting/location-config/delete?id=${id}`,
          protected: true,
          data: data,
        },
      ];

      const response = await multipleDeleteApi(endPointArr);
      const res = response[0];
      setIsDeleting(false);
      if (res?.success) {
        setShowDeleteModal(false);
        setEditId('');
        setReFetchingData(true);
        fetchAllTheLeavesWithDebounce();
      }
      handelNotification(res, 'top-right');
    }
  );
  const AddEditLocation = (
    data: OrgLocationConfigDataArrayInterface,
    callBack?: () => void
  ) => {
    setSubmitLoader(true);
    addEditLocationConfigWithDebounce(data, editId, callBack);
  };

  const handelClickOnDeleteButton = (data: LocationConfigDataInterface) => {
    setShowDeleteModal(true);
    setEditId(data?.id);
  };

  const handelDeleteItem = () => {
    setIsDeleting(true);
    deleteLocationConfigWithDebounce(data, editId);
  };
  const handelOnClose = () => {
    setShowDeleteModal(false);
    setEditId('');
    setIsDeleting(false);
  };

  const handelEditButtonClick = (data: LocationConfigDataInterface) => {
    setLocationData({
      allowed_radius_meters: data?.allowed_radius_meters,
      location_name: data?.location_name,
      status: data?.status,
      location_coordinates: JSON.parse(
        data?.location_coordinates
      ) as OrgLocationConfigCoordinates,
    });
    setShowModal(true);
    setEditId(data?.id);
  };

  const toggleShowModal = (type: 'show' | 'close') => {
    if (type === 'show') {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Location Config',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: () => toggleShowModal('show'),
    },
  ];

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

  const COLUMNS = LocationConfigColumns({
    GlobalStateProvider,
    permissionData,
    handelEditButtonClick,
    handelClickOnDeleteButton,
  });
  return (
    <>
      <div className='w-full h-full relative'>
        <Breadcrumbs
          BreadcrumbsNavigationFlow={ORGANIZATION_SETTINGS_BREADCRUMBS.ORG_LOCATION_CONFIG(
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
                  moduleName='Location Config'
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
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <AddLocationConfig
        showModal={showModal}
        setShowModal={setShowModal}
        locationData={locationData}
        loading={submitLoader}
        handelFormSubmitFunction={AddEditLocation}
      />
      <DeleteConfirmationDialog
        loading={isDeleting}
        showDeleteModal={showDeleteModal}
        handelOnClose={handelOnClose}
        handelDelete={handelDeleteItem}
        name='Location Config'
      />
    </>
  );
}

export default OrganizationLocationConfig;
