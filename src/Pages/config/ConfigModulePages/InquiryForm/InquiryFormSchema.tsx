/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../../../common/Breadcrumbs';
import Table from '../../../../common/Table/Table';
import TableInfoHeader from '../../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../../../Components/Loader/Table/TableSkeletonLoader';
import {
  AddEditInquiryFormSchemaBreadcrumbs,
  AddEditInquiryFormSchemaInitialForm,
} from '../../../../constant/ConfigModuleConstant';
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
import {
  formateDate,
  getDataFromLocalStorage,
} from '../../../../Helper/HelperFunctions';
import { useDebounce } from '../../../../Hooks/useDebounce';
import {
  AddEditInquiryFormSchemaInterface,
  DesignationConfig,
} from '../../../../interface/interface';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../../interface/propsInterface';
import AddEditInquiryFormSchema from './AddEditInquiryFormSchema';

const DeleteModal = React.lazy(
  () => import('../../../../Components/Modal/DeleteModal')
);

function InquiryFormSchema() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [formData, setFormData] = useState<AddEditInquiryFormSchemaInterface>(
    AddEditInquiryFormSchemaInitialForm
  );
  const [data, setData] = useState<Array<DesignationConfig>>([]);
  const [filterData, setFilterData] = useState<Array<DesignationConfig>>([]);
  const [showSearchFilterData, setShowSearchFilterData] =
    useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const handelShowModal = () => {
    setModalType('add');
    setShowModal(!showModal);
  };

  const handelEditButtonClick = (data: AddEditInquiryFormSchemaInterface) => {
    setModalType('edit');
    setShowModal(!showModal);
    setFormData(data);
  };

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = AddEditInquiryFormSchemaBreadcrumbs(organization);

  const fetchClientFormFieldsWithDebounce = useDebounce(async () => {
    const endPointArr: Array<endpointObject> = [
      {
        endPoint: 'config/inquiry_form_schema/fetch',
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

  const fetchClientFormFields = () => {
    setIsFetchingData(true);
    fetchClientFormFieldsWithDebounce();
  };

  const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> = [
    {
      buttonTitle: 'Add Form',
      classNames:
        'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
      onclickFunction: handelShowModal,
    },
  ];

  const handelFormSubmitWithDebounce = useDebounce(
    async (data: AddEditInquiryFormSchemaInterface) => {
      let endPoint = `config/inquiry_form_schema/add-edit`;

      if (modalType === 'edit') {
        endPoint += `?type=edit&id=${formData?.id}`;
      } else {
        endPoint += `?type=add`;
      }

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
        setFormData(AddEditInquiryFormSchemaInitialForm);
      } else {
        setLoading(false);
        handelNotification(res, 'top-right');
      }
    },
    200
  );

  const handelFormSubmitFunction = (
    data: AddEditInquiryFormSchemaInterface
  ) => {
    setLoading(true);
    handelFormSubmitWithDebounce(data);
  };

  const handelDeleteItemWithDebounce = useDebounce(async () => {
    try {
      const response = await multipleDeleteApi([
        {
          endPoint: `config/inquiry_form_schema/delete?id=${deleteItemId}`,
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
      key: 'form_id',
      title: 'Form Id',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {data || '-'}
        </span>
      ),
    },
    {
      key: 'form_name',
      title: 'Form Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {data || '-'}
        </span>
      ),
    },
    {
      key: 'description',
      title: 'Description',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
        <div className='line-clamp-4 overflow-hidden min-w-[250px] text-ellipsis'>
          <span className='w-fit font-inter text-sm font-medium inline-block'>
            {data || '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
        <div className='w-full'>
          {data ? (
            <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-full'>
              Active
            </span>
          ) : (
            <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-full'>
              Inactive
            </span>
          )}
        </div>
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
      renderContent: (data: AddEditInquiryFormSchemaInterface) => {
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
            <Link
              to={`/${GlobalStateProvider?.organization?.general_info?.portal_slug}/config/inquiry-forms/${data?.id}/fields`}
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='Edit'
            >
              <IoEye className='text-[22px]' />
            </Link>
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
                  moduleName='Inquiry Forms'
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
                  search_key='form_id'
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
                        : 'Add Form manually by clicking Add Form button.'
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

      <AddEditInquiryFormSchema
        modalTitle={modalType == 'add' ? 'Add Form' : 'Edit Form'}
        showModal={showModal}
        setShowModal={setShowModal}
        loading={loading}
        handelFormSubmitFunction={handelFormSubmitFunction}
        formData={formData}
        setFormData={setFormData}
        modalType={modalType}
      />
      <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Form Field'
      />
    </>
  );
}

export default InquiryFormSchema;
