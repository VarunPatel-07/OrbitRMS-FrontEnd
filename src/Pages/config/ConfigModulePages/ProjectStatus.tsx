/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../../common/Breadcrumbs';
import Table from '../../../common/Table/Table';
import TableInfoHeader from '../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../../Components/Loader/Table/TableSkeletonLoader';
import AddModal from '../../../Components/Modal/AddModal';
import DeleteModal from '../../../Components/Modal/DeleteModal';
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
  multiplePostApi,
} from '../../../Helper/api/multipleAPI';
import { formateDate, hexToRgb } from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../interface/propsInterface';

function ProjectStatus() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const useEffectRef = useRef(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [data, setData] = useState<Array<any>>([]);
  const [filterData, setFilterData] = useState<Array<any>>([]);
  const [value, setValue] = useState<string>('');
  const [editId, setEditId] = useState<string>('');
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [statusColor, setStatusColor] = useState<string>('#ff0000');

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_url.split(
      'https://orbitrms.com/'
    )[1];

  const handelShowModal = () => {
    setModalType('add');
    setEditId('');
    setShowModal(!showModal);
    setStatusColor('#ff0000');
  };

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
    { name: 'Config', label: 'config-module', link: `/${organization}/config` },
    {
      name: 'Project Status',
      label: 'project-status',
      link: `/${organization}/config/project-status`,
    },
  ];

  const handelFormSubmitWithDebounce = useDebounce(
    async (value: string, color?: string) => {
      let endPoint = `config/project_status/add-edit`;

      if (modalType === 'edit') {
        endPoint += `?type=edit&id=${editId}`;
      } else {
        endPoint += `?type=add`;
      }

      const data = {
        status_name: value,
        status_color: color,
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
        setEditId('');
        setModalType('add');
        setShowModal(false);
        setIsFetchingData(true);
        setLoading(false);
        handelNotification(res, 'top-right');
        fetchProjectStatus();
        setStatusColor('#ff0000');
        setValue('');
      } else {
        setLoading(false);
        handelNotification(res, 'top-right');
      }
    },
    200
  );

  const handelFormSubmitFunction = (value: string, color?: string) => {
    setLoading(true);
    handelFormSubmitWithDebounce(value, color);
  };

  const handelDeleteItemWithDebounce = useDebounce(async () => {
    try {
      const response = await multipleDeleteApi([
        {
          endPoint: `config/project_status/delete?id=${deleteItemId}`,
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
        fetchProjectStatus();
      } else {
        setDeleteItemId('');
        setShowDeleteModal(false);
        setIsDeleteLoading(false);
        handelNotification(res, 'top-right');
      }
    } catch (error) {
      console.error('Error fetching project status:', error);
    }
  }, 200);

  const handelDeleteItem = () => {
    setIsDeleteLoading(true);
    handelDeleteItemWithDebounce();
  };

  const fetchProjectStatus = useDebounce(async () => {
    try {
      const response = await multipleFetchApi([
        { endPoint: 'config/project_status/fetch', protected: true },
      ]);

      const res = response[0];
      if (res?.success) {
        setData(res?.data);
        setIsFetchingData(false);
      } else {
        setIsFetchingData(false);
        handelNotification(res, 'top-right');
      }
    } catch (error) {
      console.error('Error fetching project status:', error);
    }
  }, 50);

  const handelEditButtonClick = (data: any) => {
    setShowModal(true);
    setModalType('edit');
    setValue(data?.status_name);
    setStatusColor(data?.status_color);
    setEditId(data?.id);
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Project Status',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const columns: Array<Column> = [
    {
      key: 'status_name',
      childKey: 'status_color',
      title: 'Project Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any, childKeyData) => (
        <span
          className='w-fit font-inter text-sm font-medium inline-block px-2.5 py-0.5 rounded-full'
          style={{
            color: childKeyData,
            border: `1px solid ${childKeyData}`,
            backgroundColor: `rgba(${hexToRgb(childKeyData)}, 0.15)`,
          }}
        >
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
            <button
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='Edit'
              onClick={() => handelEditButtonClick(data)}
            >
              <MdModeEdit className='text-[22px]' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='project_status_delete_button'
              data-tooltip-content='Delete'
              disabled={data?.source_type == 'default'}
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteItemId(data?.id);
              }}
            >
              <MdDelete className='text-[22px]' />
            </button>
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
    fetchProjectStatus();
  }, []);

  return (
    <>
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
                  moduleName='Project Status'
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
                (showSearchFilterData && filterData.length > 0) ? (
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
                        ? 'No matching project status found. Try refining your search or adding a new project status.'
                        : 'Add Projects Status manually by clicking Add Projects Status button.'
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

      <AddModal
        modalTitle={
          modalType == 'add' ? 'Add Project Status' : 'Edit Project Status'
        }
        labelFieldName='Project Status'
        showColorPicker={true}
        showPreview={true}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        handelFormSubmitFunction={handelFormSubmitFunction}
        value={value}
        setValue={setValue}
        modalType={modalType}
        color={statusColor}
        setColor={setStatusColor}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Project Status'
      />
    </>
  );
}

export default ProjectStatus;
