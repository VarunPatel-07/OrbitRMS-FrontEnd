/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IoEye } from 'react-icons/io5';
import {
  MdDelete,
  MdModeEdit,
  MdNotificationsActive,
  MdNotificationsOff,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../../../common/Breadcrumbs';
import Button from '../../../../common/Button';
import Table from '../../../../common/Table/Table';
import TableInfoHeader from '../../../../common/Table/TableInfoHeader';
import TableLocalSearchBar from '../../../../common/Table/TableLocalSearchBar';
import TableNoDataFound from '../../../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../../../Components/Loader/Table/TableSkeletonLoader';
import CommonAlertModal from '../../../../Components/Modal/CommonAlertModal';
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
  multiplePutApi,
} from '../../../../Helper/api/multipleAPI';
import { NavigateToTheLogInScreen } from '../../../../Helper/Helper';
import {
  formateDate,
  getDataFromLocalStorage,
} from '../../../../Helper/HelperFunctions';
import { useDebounce } from '../../../../Hooks/useDebounce';
import {
  AddEditInquiryFormSchemaInterface,
  DesignationConfig,
  PermissionObjectInterface,
} from '../../../../interface/interface';
import {
  Column,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '../../../../interface/propsInterface';
import AddEditInquiryFormSchema from './AddEditInquiryFormSchema';

const DeleteModal = React.lazy(
  () => import('../../../../Components/Modal/DeleteModal')
);

function InquiryFormSchema({
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
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [emailNotificationStatus, setEmailNotificationStatus] = useState<
    'active' | 'inactive'
  >('inactive');
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
      const responseData: DesignationConfig[] = [];
      res?.data?.forEach((data: DesignationConfig) => {
        responseData.push({
          ...data,
          authorized_recipient_emails: data?.authorized_recipient_emails
            ? JSON.parse(data.authorized_recipient_emails)
            : [''],

          email_notification: data?.email_notification || false,
        });
      });

      setData(responseData);
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
  const handelToggleEmailNotificationWithDebounce = useDebounce(async () => {
    try {
      const response = await multiplePutApi([
        {
          endPoint: `config/inquiry_form_schema/toggle/email-notification?id=${deleteItemId}`,
          protected: true,
        },
      ]);

      const res = response[0];
      if (res?.success) {
        setDeleteItemId('');
        setShowDeleteModal(false);
        setShowAlertModal(false);
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
  const handelToggleEmailNotification = () => {
    setIsDeleteLoading(true);
    handelToggleEmailNotificationWithDebounce();
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
      key: 'email_notification',
      title: 'Email Notification',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
        <div className='w-full'>
          {data ? (
            <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
              Active
            </span>
          ) : (
            <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
              Inactive
            </span>
          )}
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
            <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
              Active
            </span>
          ) : (
            <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
              Inactive
            </span>
          )}
        </div>
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
            <Link
              to={`/${GlobalStateProvider?.organization?.general_info?.portal_slug}/config/inquiry-forms/${data?.id}/fields`}
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='View Form'
            >
              <IoEye className='text-[22px]' />
            </Link>
            <Button
              type='button'
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              dataTooltipId='email_notification-toggler_button'
              dataTooltipContent={
                data?.email_notification
                  ? 'Turn Off Email Notification'
                  : 'Turn On Email Notification'
              }
              onClick={() => {
                setShowAlertModal(true);
                setDeleteItemId(data?.id);
                setEmailNotificationStatus(
                  data?.email_notification ? 'active' : 'inactive'
                );
              }}
              disabled={
                permissions &&
                permissions.some(
                  (perm) => perm.label === 'edit' && !perm.is_allowed
                )
              }
            >
              {data?.email_notification ? (
                <MdNotificationsOff className='text-[22px] text-rose-600' />
              ) : (
                <MdNotificationsActive className='text-[22px] text-green-600' />
              )}
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
            {data?.email_notification ? (
              <Tooltip
                id='email_notification-toggler_button'
                opacity={'100'}
                className='z-[15] bg-white'
                place='left'
              />
            ) : (
              <Tooltip
                id='email_notification-toggler_button'
                opacity={'100'}
                className='z-[15] bg-white'
                place='left'
              />
            )}
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

  if (
    !permissions ||
    !permissions.some((perm) => perm.label === 'view' && perm.is_allowed)
  )
    return <NavigateToTheLogInScreen />;
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
        )}
        {showDeleteModal && (
          <DeleteModal
            loading={isDeleteLoading}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handelDelete={handelDeleteItem}
            name='Form Field'
          />
        )}
        {showAlertModal && (
          <CommonAlertModal
            loading={isDeleteLoading}
            showDeleteModal={showAlertModal}
            setShowDeleteModal={setShowAlertModal}
            handelDelete={handelToggleEmailNotification}
            title='Turn Off Email Notifications?'
            description='You will no longer receive email updates or alerts. Are you sure you want to disable this feature?'
            secondaryButtonTitle={
              emailNotificationStatus == 'active'
                ? 'Turn Off Notification'
                : 'Turn On Notification'
            }
          />
        )}
      </Suspense>
    </>
  );
}

export default InquiryFormSchema;
