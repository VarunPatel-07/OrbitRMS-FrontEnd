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
import { formateDate } from '../../../Helper/HelperFunctions';
import { useDebounce } from '../../../Hooks/useDebounce';
import { DesignationConfig } from '../../../interface/interface';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../interface/propsInterface';

function ClientFormSchema() {
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

  const [fieldType, setFieldType] = useState<string>('');
  const [isRequiredField, setIsRequiredField] = useState<string>('');

  const handelShowModal = () => {
    setModalType('add');
    setEditId('');
    setShowModal(!showModal);
  };

  const handelEditButtonClick = (data: any) => {
    setModalType('edit');
    setShowModal(!showModal);
    setValue(data?.field_name);
    setFieldType(data?.type);
    setIsRequiredField(data?.is_required_field ? 'true' : 'false');
    setEditId(data?.id);
  };

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: '/home' },
    {
      name: 'Config',
      label: 'config-module',
      link: `${organization}/config/project-status`,
    },
    {
      name: 'Client Form Fields',
      label: 'client-form-field',
      link: `/${organization}/config/client-form`,
    },
  ];

  const fetchClientFormFieldsWithDebounce = useDebounce(async () => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: 'config/client_form_schema/fetch',
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

  const fetchClientFormFields = () => {
    setIsFetchingData(true);
    fetchClientFormFieldsWithDebounce();
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Form Field',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const handelFormSubmitWithDebounce = useDebounce(async (value: string) => {
    let endPoint = `config/client_form_schema/add-edit`;

    if (modalType === 'edit') {
      endPoint += `?type=edit&id=${editId}`;
    } else {
      endPoint += `?type=add`;
    }

    const data = {
      field_name: value,
      is_required_field:
        isRequiredField.toLocaleLowerCase() == 'true' ? true : false,
      type: fieldType,
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
      fetchClientFormFields();
      setValue('');
      setIsRequiredField('');
      setFieldType('');
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
          endPoint: `config/client_form_schema/delete?id=${deleteItemId}`,
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
        fetchClientFormFields();
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
      key: 'field_name',
      title: 'Field Name',
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
      key: 'type',
      title: 'Field Type',
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
      key: 'is_required_field',
      title: 'Required',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) =>
        data ? (
          <span className='px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium border border-green-500'>
            Required
          </span>
        ) : (
          <span className='px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium border border-gray-500'>
            Optional
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
    fetchClientFormFields();
  }, []);
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
                  moduleName='Client Form Fields'
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
                        : 'You haven’t added any Form Field yet'
                    }
                    notFoundMessage={
                      showSearchFilterData
                        ? 'No matching Form Field found. Try refining your search or adding a new Form Field.'
                        : 'Add Form Field manually by clicking Add Form Field button.'
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
        modalTitle={modalType == 'add' ? 'Add Form Field' : 'Edit Form Field'}
        labelFieldName='Field Name'
        showColorPicker={false}
        showPreview={false}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        handelFormSubmitFunction={handelFormSubmitFunction}
        value={value?.replace(/[\s-]/g, '_')}
        setValue={setValue}
        modalType={modalType}
        fieldType={fieldType}
        setFieldType={setFieldType}
        isRequiredField={isRequiredField}
        setIsRequiredField={setIsRequiredField}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
      />
    </>
  );
}

export default ClientFormSchema;
