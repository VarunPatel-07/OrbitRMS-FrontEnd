/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { MdDelete, MdModeEdit, MdOutlineRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../../../common/Breadcrumbs';
import Button from '../../../../common/Button';
import Table from '../../../../common/Table/Table';
import TableInfoHeader from '../../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../../common/Table/TableNoDataFound';
import AccessDeniedRedirect from '../../../../Components/AccessDeniedRedirect';
import TableSkeletonLoader from '../../../../Components/Loader/Table/TableSkeletonLoader';
import { MetaTitleDescription } from '../../../../constant/MetaTitleDescription';
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
import HelmetSeo from '../../../../Helper/HelmetSeo';
import { formateDate } from '../../../../Helper/HelperFunctions';
import { useDebounce } from '../../../../Hooks/useDebounce';
import { PermissionObjectInterface } from '../../../../interface/interface';
import {
  AddRolesAndPermissionInterFace,
  Column,
  RolesPermissionInterface,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../../interface/propsInterface';

const AddEditRolePermission = React.lazy(
  () => import('./AddEditRolePermission')
);
const DeleteModal = React.lazy(
  () => import('../../../../Components/Modal/DeleteModal')
);

const initialState = {
  role_name: '',
  description: '',
  status: true,
  clone_role_info: {
    clone_role_name: '',
    clone_role_id: '',
    config_module_id: '',
  },
};

function RolesAndPermission({
  permissions,
}: {
  permissions?: PermissionObjectInterface[];
}) {
  const navigate = useNavigate();
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const useEffectReference = useRef(false);

  const [data, setData] = useState<RolesPermissionInterface[]>([]);
  const [filterData, setFilterData] = useState<Array<any>>([]);
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [editId, setEditId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] =
    useState<AddRolesAndPermissionInterFace>(initialState);
  const [dummyValue, setDummyValue] =
    useState<AddRolesAndPermissionInterFace>(initialState);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_url.split(
      'https://orbitrms.com/'
    )[1];

  const handelShowModal = () => {
    setModalType('add');
    setEditId('');
    setShowModal(true);
  };

  const handleRolesPermissionViewButton = (data: any) => {
    navigate(`/${organization}/config/roles-permission/${data?.id}`);
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Role',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
    {
      name: 'Config',
      label: 'config-module',
      link: `/${organization}/config/project-status`,
    },
    {
      name: 'Roles',
      label: 'role-permission',
      link: `/${organization}/config/roles-permission`,
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
      key: 'status',
      title: 'Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
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
      key: 'employees',
      title: 'Employee',
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
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              dataTooltipId='roles_permission_view_button'
              dataTooltipContent='View'
              onClick={() => {
                handleRolesPermissionViewButton(data);
              }}
              disabled={
                permissions &&
                permissions.some(
                  (perm) => perm.label === 'view' && !perm.is_allowed
                )
              }
            >
              <MdOutlineRemoveRedEye className='text-[22px]' />
            </Button>
            <Button
              type='button'
              className='text-black/80 p-1.5'
              dataTooltipId='roles_permission_edit_button'
              dataTooltipContent='Edit'
              onClick={() => handelEditButtonClick(data)}
              disabled={
                !data?.is_editable ||
                (permissions &&
                  permissions.some(
                    (perm) => perm.label === 'edit' && !perm.is_allowed
                  ))
              }
            >
              <MdModeEdit className='text-[22px]' />
            </Button>
            <Button
              type='button'
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              dataTooltipId='roles_permission_delete_button'
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
      setFilterData([]);
      setShowSearchFilterData(false);
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

  const handelFormSubmitWithDebounce = useDebounce(
    async (data: AddRolesAndPermissionInterFace, edit_id?: string) => {
      const endpointArr: endpointObject[] = [
        {
          endPoint:
            modalType == 'edit'
              ? `config/roles_permissions/add-edit?type=edit&edit_role_id=${edit_id}`
              : 'config/roles_permissions/add-edit?type=add',
          protected: true,
          data: data,
        },
      ];

      const response = await multiplePostApi(endpointArr);

      const res = response[0];
      if (res?.success) {
        setLoading(false);
        setShowModal(false);
        setIsFetchingData(true);
        handelNotification(res, 'top-right');
        fetchRolesAndPermissionWithDebounce();
        setValue(initialState);
        setDummyValue(initialState);
      } else {
        setLoading(false);
        handelNotification(res, 'top-right');
      }
    },
    50
  );

  const handelFormSubmitFunction = (data: AddRolesAndPermissionInterFace) => {
    if (modalType == 'add') {
      setLoading(true);
      handelFormSubmitWithDebounce(data);
    } else {
      setLoading(true);
      handelFormSubmitWithDebounce(data, editId);
    }
  };

  const handelEditButtonClick = (_data: RolesPermissionInterface) => {
    const data: AddRolesAndPermissionInterFace = {
      role_name: _data?.role_name,
      description: _data?.description,
      status: _data?.status,
      clone_role_info: {
        clone_role_name: '',
        clone_role_id: '',
        config_module_id: '',
      },
    };
    setValue(data);
    setDummyValue(data);
    setEditId(_data?.id);
    setModalType('edit');
    setShowModal(true);
  };

  const handelDeleteFunctionWithDebounce = useDebounce(
    async (delete_item_id) => {
      const endpointArr: endpointObject[] = [
        {
          endPoint: `config/roles_permissions/delete?id=${delete_item_id}`,
          protected: true,
        },
      ];

      const response = await multipleDeleteApi(endpointArr);
      const res = response[0];

      if (res?.success) {
        setDeleteItemId('');
        setIsDeleteLoading(false);
        setShowDeleteModal(false);
        setIsFetchingData(true);
        handelNotification(res, 'top-right');
        fetchRolesAndPermissionWithDebounce();
      } else {
        setIsDeleteLoading(false);
        handelNotification(res, 'top-right');
      }
    },
    50
  );

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    handelDeleteFunctionWithDebounce(deleteItemId);
  };

  useEffect(() => {
    if (useEffectReference.current) return;
    useEffectReference.current = true;
    setIsFetchingData(true);
    fetchRolesAndPermission();
  }, []);
  if (
    !permissions ||
    !permissions.some((perm) => perm.label === 'view' && perm.is_allowed)
  )
    return (
      <AccessDeniedRedirect
        message="You don't have permission For Roles & Permission."
        isAccessDenied={
          !permissions ||
          !permissions.some((perm) => perm.label === 'view' && perm.is_allowed)
        }
      />
    );
  return (
    <>
      <HelmetSeo
        Title={MetaTitleDescription.roleAndPermission.title}
        Content={MetaTitleDescription.roleAndPermission.description}
      />
      <div className='relative w-full h-full'>
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
                  moduleName='Roles & Permission'
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
                  search_key='status_name'
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
                        ? 'No matching role & permission found. Try refining your search or adding a new role & permission.'
                        : 'Add Role manually by clicking Add Role button.'
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
          <AddEditRolePermission
            modalTitle={modalType == 'add' ? 'Add Role' : 'Edit Role'}
            loading={loading}
            value={value}
            setValue={setValue}
            modalType={modalType}
            handelFormSubmitFunction={handelFormSubmitFunction}
            setShowModal={setShowModal}
            showModal={showModal}
            ActiveRolesPermissionArray={data}
            dummyValue={dummyValue}
          />
        )}
        {showDeleteModal && (
          <DeleteModal
            loading={isDeleteLoading}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handelDelete={handelDeleteItem}
            name='Role'
          />
        )}
      </Suspense>
    </>
  );
}

export default RolesAndPermission;
