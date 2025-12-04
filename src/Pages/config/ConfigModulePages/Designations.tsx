/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../../common/Breadcrumbs';
import Button from '../../../common/Button';
import Table from '../../../common/Table/Table';
import TableInfoHeader from '../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../common/Table/TableNoDataFound';
import AccessDeniedRedirect from '../../../Components/AccessDeniedRedirect';
import TableSkeletonLoader from '../../../Components/Loader/Table/TableSkeletonLoader';
import { MetaTitleDescription } from '../../../constant/MetaTitleDescription';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
  // multipleFetchApi,
  multiplePostApi,
} from '../../../Helper/api/multipleAPI';
import HelmetSeo from '../../../Helper/HelmetSeo';
import {
  formateDate,
  getDataFromLocalStorage,
} from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import {
  DesignationConfig,
  PermissionObjectInterface,
} from '../../../interface/interface';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../interface/propsInterface';

const AddModal = React.lazy(() => import('../../../Components/Modal/AddModal'));
const DeleteModal = React.lazy(
  () => import('../../../Components/Modal/DeleteModal')
);

function Designations({
  permissions,
}: {
  permissions?: PermissionObjectInterface[];
}) {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string>('');
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');
  const [data, setData] = useState<Array<DesignationConfig>>([]);
  const [filterData, setFilterData] = useState<Array<DesignationConfig>>([]);
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const handelShowModal = () => {
    setModalType('add');
    setEditId('');
    setShowModal(!showModal);
  };

  const handelEditButtonClick = (data: any) => {
    setModalType('edit');
    setShowModal(!showModal);
    setValue(data?.designations_name);
    setEditId(data?.id);
  };

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
    {
      name: 'Config',
      label: 'config-module',
      link: `/${organization}/config/project-status`,
    },
    {
      name: 'Designations',
      label: 'designations',
      link: `/${organization}/config/designations`,
    },
  ];

  const fetchDesignationsTypesWithDebounce = useDebounce(async () => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: 'config/designations/fetch',
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);

    const res = response[0];

    if (res?.success) {
      setData(res?.data);
      setFilterData([]);
      setShowSearchFilterData(false);
      setIsFetchingData(false);
    } else {
      setIsFetchingData(false);
      handelNotification(res, 'top-right');
    }
  }, 50);

  const fetchDesignationsTypes = () => {
    setIsFetchingData(true);
    fetchDesignationsTypesWithDebounce();
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Designations',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const handelFormSubmitWithDebounce = useDebounce(async (value: string) => {
    let endPoint = `config/designations/add-edit`;

    if (modalType === 'edit') {
      endPoint += `?type=edit&id=${editId}`;
    } else {
      endPoint += `?type=add`;
    }

    const data = {
      designations_name: value,
    };

    const endPointArr: Array<endpointObject> = [
      {
        endPoint: endPoint,
        protected: true,
        data,
      },
    ];

    const response = await multiplePostApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setLoading(false);
      setShowModal(false);
      setIsFetchingData(true);
      handelNotification(res, 'top-right');
      fetchDesignationsTypes();
      setValue('');
    } else {
      setLoading(false);
      handelNotification(res, 'top-right');
    }
  }, 200);

  const handelFormSubmitFunction = (value: string) => {
    setLoading(true);
    handelFormSubmitWithDebounce(value);
  };

  const handelDeleteItemWithDebounce = useDebounce(async () => {
    try {
      const response = await multipleDeleteApi([
        {
          endPoint: `config/designations/delete?id=${deleteItemId}`,
          protected: true,
        },
      ]);

      const res = response[0];
      if (res?.success) {
        setDeleteItemId('');
        setShowDeleteModal(false);
        setIsDeleteLoading(false);
        setIsFetchingData(true);
        handelNotification(res, 'top-right');
        fetchDesignationsTypes();
      } else {
        setDeleteItemId('');
        setShowDeleteModal(false);
        setIsDeleteLoading(false);
        handelNotification(res, 'top-right');
      }
    } catch (error) {
      console.error('Error fetching project status:', error);
    }
  }, 50);

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    handelDeleteItemWithDebounce();
  };

  const columns: Array<Column> = [
    {
      key: 'designations_name',
      title: 'Designation Name',
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
      renderContent: (data: any) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <Button
              type='button'
              className='text-black/80 p-1.5'
              dataTooltipId='project_status_edit_button'
              dataTooltipContent='Edit'
              onClick={() => handelEditButtonClick(data)}
              disabled={
                permissions &&
                permissions.some(
                  (perm) => perm.label === 'edit' && !perm.is_allowed
                )
              }
            >
              <MdModeEdit className='text-[22px]' />
            </Button>
            <Button
              type='button'
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              dataTooltipId='project_status_delete_button'
              dataTooltipContent='Delete'
              disabled={
                data?.source_type == 'default' ||
                (permissions &&
                  permissions.some(
                    (perm) => perm.label === 'delete' && !perm.is_allowed
                  ))
              }
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteItemId(data?.id);
              }}
            >
              <MdDelete className='text-[22px]' />
            </Button>
            <Tooltip
              id='project_status_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
            {data?.source_type != 'default' && (
              <Tooltip
                id='project_status_delete_button'
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

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    setIsFetchingData(true);
    fetchDesignationsTypes();
  }, []);

  if (
    !permissions ||
    !permissions.some((perm) => perm.label === 'view' && perm.is_allowed)
  )
    return (
      <AccessDeniedRedirect
        message="You don't have permission For Designations Module."
        isAccessDenied={
          !permissions ||
          !permissions.some((perm) => perm.label === 'view' && perm.is_allowed)
        }
      />
    );
  return (
    <>
      <HelmetSeo
        Title={MetaTitleDescription.designation.title}
        Content={MetaTitleDescription.designation.description}
      />
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
                  moduleName='Designations'
                  badgeValue={
                    showSearchFilterData
                      ? filterData.length?.toString()
                      : data.length?.toString()
                  }
                  buttonsArray={
                    permissions.some(
                      (perm) => perm.label === 'edit' && perm.is_allowed
                    )
                      ? optionsButtonArray
                      : []
                  }
                />
                <TableLocalSearchBar
                  setShowSearchFilterData={setShowSearchFilterData}
                  data={data}
                  search_key='designations_name'
                  setData={setFilterData}
                />
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
                    tableWrapperClass={'max-h-[calc(100%-140px)] rounded-b-lg'}
                    notFoundTitle={
                      showSearchFilterData
                        ? 'No Data Found For Related Search'
                        : 'You haven’t added any Projects Status yet'
                    }
                    notFoundMessage={
                      showSearchFilterData
                        ? 'No matching designation found. Try refining your search or adding a new designation.'
                        : 'Add Designation manually by clicking Add Designation button.'
                    }
                    notFoundOptionsButtonsArray={
                      showSearchFilterData
                        ? []
                        : permissions.some(
                              (perm) => perm.label === 'edit' && perm.is_allowed
                            )
                          ? optionsButtonArray
                          : []
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        {showModal && (
          <AddModal
            modalTitle={
              modalType == 'add' ? 'Add Designations' : 'Edit Designations'
            }
            labelFieldName='Designations Name'
            showColorPicker={false}
            showPreview={false}
            showModal={showModal}
            setShowModal={setShowModal}
            loading={loading}
            handelFormSubmitFunction={handelFormSubmitFunction}
            value={value}
            setValue={setValue}
            modalType={modalType}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            loading={isDeleteLoading}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handelDelete={handelDeleteItem}
            name='Designation'
          />
        )}
      </Suspense>
    </>
  );
}

export default Designations;
