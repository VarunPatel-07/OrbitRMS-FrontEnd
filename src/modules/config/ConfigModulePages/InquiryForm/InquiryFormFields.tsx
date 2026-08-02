import React, { useContext, useEffect, useRef, useState } from 'react';

import { MdDelete, MdModeEdit } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

// import DeleteConfirmationDialog from '../../../Components/Modal/DeleteConfirmationDialog';
import {
   GlobalStateContext,
   GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import {
   NotificationContext,
   NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import {
   Column,
   TableInfoHeaderInterfaceButtonArrayObject,
} from '@/interface/ComponentProps.interface';
import {
   InquiryFormFieldInterface,
   InquiryFormFieldsDataInterface,
} from '@/interface/Global.interface';

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
import { AddEditInquiryFormFields } from '@/utils/constants/configModule.constants';
import { META_TITLE_DESCRIPTION } from '@/utils/constants/seo.constants';
import {
   formateDate,
   getDataFromLocalStorage,
} from '@/utils/helpers/commonHelpers';
import HelmetSeo from '@/utils/helpers/HelmetSeo';

const AddModal = React.lazy(
   () => import('../../../../components/modals/AddModal')
);
const DeleteConfirmationDialog = React.lazy(
   () => import('../../../../components/modals/DeleteConfirmationDialog')
);

const initialData: InquiryFormFieldsDataInterface = {
   form_id: '',
   form_name: '',
   form_fields: [],
};

export default function InquiryFormFields() {
   const { id: form_schema_id } = useParams();
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
   const [dummyValue, setDummyValue] = useState<string>('');
   const [data, setData] =
      useState<InquiryFormFieldsDataInterface>(initialData);
   const [filterData, setFilterData] = useState<InquiryFormFieldInterface[]>(
      []
   );
   const [showSearchFilterData, setShowSearchFilterData] =
      useState<boolean>(false);
   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
   const [deleteItemId, setDeleteItemId] = useState<string>('');
   const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
   const [fieldType, setFieldType] = useState<string>('');
   const [dummyFieldType, setDummyFieldType] = useState<string>('');
   const [isRequiredField, setIsRequiredField] = useState<string>('');

   const { GlobalStateProvider } = useContext(
      GlobalStateContext
   ) as GlobalStateContextApiProps;

   const localStorageData = getDataFromLocalStorage('organization-info');
   const organization =
      GlobalStateProvider?.organization?.general_info?.portal_slug ||
      JSON.parse(localStorageData)?.portal_slug;

   const BreadcrumbsObjects = AddEditInquiryFormFields(
      organization,
      form_schema_id || '',
      data?.form_name
   );

   const handelShowModal = () => {
      setModalType('add');
      setEditId('');
      setShowModal(!showModal);
   };

   const handelEditButtonClick = (data: InquiryFormFieldInterface) => {
      setModalType('edit');
      setShowModal(!showModal);
      setValue(data?.field_name);
      setDummyValue(data?.field_name);
      setEditId(data?.id);
      setFieldType(data?.type);
      setDummyFieldType(data?.type);
      setIsRequiredField(data?.is_required_field ? 'true' : 'false');
   };

   const fetchAttachmentTypesWithDebounce = useDebounce(async () => {
      const endPointArr: Array<endpointObject> = [
         {
            endPoint: `config/inquiry_form_fields/fetch?form_schema_id=${form_schema_id}`,
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

   const fetchAttachmentTypes = () => {
      setIsFetchingData(true);
      fetchAttachmentTypesWithDebounce();
   };

   const optionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject> =
      [
         {
            buttonTitle: 'Add Field',
            classNames:
               'font-inter text-white font-medium bg-[var(--them-green-color)] px-4 py-1.5 text-base rounded-lg',
            onclickFunction: handelShowModal,
         },
      ];

   const handelFormSubmitWithDebounce = useDebounce(async (value: string) => {
      let endPoint = `config/inquiry_form_fields/add-edit`;

      if (modalType === 'edit') {
         endPoint += `?type=edit&id=${editId}&form_schema_id=${form_schema_id}`;
      } else {
         endPoint += `?type=add&form_schema_id=${form_schema_id}`;
      }

      const data = {
         field_name: value,
         is_required_field: isRequiredField ? 'true' : 'false',
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
         fetchAttachmentTypes();
         setValue('');
         setDummyValue('');
         setFieldType('');
         setDummyFieldType('');
         setIsRequiredField('');
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
               endPoint: `config/inquiry_form_fields/delete?id=${deleteItemId}&form_schema_id=${form_schema_id}`,
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
            fetchAttachmentTypes();
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

   const handelClickOnDeleteButton = (data?: InquiryFormFieldInterface) => {
      if (data) {
         setShowDeleteModal(true);
         setDeleteItemId(data?.id);
      } else {
         setShowDeleteModal(false);
         setDeleteItemId('');
      }
   };

   const columns: Array<Column> = [
      {
         key: 'field_name',
         title: 'Field Name',
         isSortable: true,
         isSticky: false,
         canToggleVisibility: true,
         renderContent: (data: string) => (
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
         renderContent: (data: string) => (
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
         renderContent: (data: boolean) =>
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
         renderContent: (data: string, childKeyData: string) => {
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
         renderContent: (data: string, childKeyData: string) => {
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
         renderContent: (data: InquiryFormFieldInterface) => {
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
                     disabled={data?.source_type == 'default'}
                     data-tooltip-content='Delete'
                     onClick={() => handelClickOnDeleteButton(data)}
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
      fetchAttachmentTypes();
   }, []);

   return (
      <>
         <HelmetSeo
            Title={META_TITLE_DESCRIPTION.INQUIRY_FORM_FIELDS.title}
            Content={META_TITLE_DESCRIPTION.INQUIRY_FORM_FIELDS.description}
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
                           moduleName={data?.form_name}
                           badgeValue={
                              showSearchFilterData
                                 ? filterData?.length?.toString()
                                 : data?.form_fields?.length?.toString()
                           }
                           buttonsArray={optionsButtonArray}
                        />
                        <TableLocalSearchBar
                           setShowSearchFilterData={setShowSearchFilterData}
                           data={data?.form_fields}
                           search_key='field_name'
                           setData={setFilterData}
                        />
                        {(data?.form_fields?.length > 0 &&
                           !showSearchFilterData) ||
                        (showSearchFilterData && filterData?.length > 0) ? (
                           <Table
                              columns={columns}
                              data={
                                 showSearchFilterData
                                    ? filterData
                                    : data?.form_fields
                              }
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
                                    ? 'No Data Found For Related Search'
                                    : 'You haven’t added any Department yet'
                              }
                              notFoundMessage={
                                 showSearchFilterData
                                    ? 'No matching Department found. Try refining your search or adding a new Department.'
                                    : 'Add Fields manually by clicking Add Field button.'
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
               modalType == 'add' ? 'Add Form Field' : 'Edit Form Field'
            }
            labelFieldName='Field Name'
            showColorPicker={false}
            showPreview={false}
            showModal={showModal}
            setShowModal={setShowModal}
            loading={loading}
            handelFormSubmitFunction={handelFormSubmitFunction}
            value={value?.replace(/[\s-]/g, '_').toLocaleLowerCase()}
            setValue={setValue}
            modalType={modalType}
            fieldType={fieldType}
            setFieldType={setFieldType}
            isRequiredField={isRequiredField}
            setIsRequiredField={setIsRequiredField}
            dummyValue={dummyValue}
            dummyFieldType={dummyFieldType}
         />
         <DeleteConfirmationDialog
            loading={isDeleteLoading}
            showDeleteModal={showDeleteModal}
            handelOnClose={handelClickOnDeleteButton}
            handelDelete={handelDeleteItem}
            name='Department'
         />
      </>
   );
}
