/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useContext, useEffect, useRef, useState } from 'react';

import { IoEye } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import Button from '../../common/Button';
import SearchDrop from '../../common/SearchDrop';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import AccessDeniedRedirect from '../../Components/AccessDeniedRedirect';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import ClientInquirySliderModal from '../../Components/Modal/ClientInquirySliderModal';
import { AddEditInquiryFormSchemaBreadcrumbs } from '../../constant/ConfigModuleConstant';
import { dropdownMenuArray, initialMetadata } from '../../constant/constant';
import { MetaTitleDescription } from '../../constant/MetaTitleDescription';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
} from '../../Helper/api/multipleAPI';
import HelmetSeo from '../../Helper/HelmetSeo';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { AddEditInquiryFormSchemaInterface } from '../../interface/interface';
import {
  Column,
  FilterObjectInterface,
  MetaDataInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';
import { handelGeneratingDynamicClientColumn } from './ClientInquiryHelper';

const DeleteModal = React.lazy(
  () => import('../../Components/Modal/DeleteModal')
);

function ClientInquiry() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const useEffectRef = useRef(false);

  const [queryParameter] = useSearchParams();
  const navigate = useNavigate();

  // Defining The Required State
  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientInquiryData, setClientInquiryData] = useState<any>({});
  const [showClientInquiryDetail, setShowClientInquiryDetail] =
    useState<boolean>(false);
  const [clientInquiryFiltersArray, setClientInquiryFiltersArray] = useState<
    SearchBarFilterOptionsInterface[]
  >([]);
  const [inquiryFormData, setInquiryFormData] = useState<
    Array<AddEditInquiryFormSchemaInterface>
  >([]);
  const [selectedInquiryForm, setSelectedInquiryForm] = useState<{
    id: string;
    formId: string;
  }>({ id: '', formId: '' });
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);
  const [isDeletingClientInquiry, setIsDeletingClientInquiry] =
    useState<boolean>(false);
  const [deleteClientInquiryId, setDeleteClientInquiryId] =
    useState<string>('');

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = AddEditInquiryFormSchemaBreadcrumbs(organization);

  const handelClickOnViewInquiryButton = (data: any) => {
    setShowClientInquiryDetail(true);
    setClientInquiryData(data);
  };

  const handelClickOnDeleteButton = (data: any) => {
    setDeleteClientInquiryId(data?.id);
    setShowDeleteModal(true);
  };

  const initialColumns = [
    {
      key: 'form_id',
      title: 'Form Id',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {typeof data === 'object' ? JSON.stringify(data) : data || '-'}
        </span>
      ),
    },
    {
      key: 'form_name',
      title: 'Form Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: any) => (
        <span className='w-fit font-inter text-sm font-medium inline-block'>
          {typeof data === 'object' ? JSON.stringify(data) : data || '-'}
        </span>
      ),
    },
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: any) => {
        if (typeof data === 'object')
          return (
            <div className='w-full h-full flex items-center justify-start gap-2'>
              <Button
                type='button'
                className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
                dataTooltipId='client_inquiry_view_button'
                dataTooltipContent='View Inquiry'
                onClick={() => handelClickOnViewInquiryButton(data)}
                disabled={permissionData?.permissions?.some(
                  (item) => item?.label == 'view' && !item?.is_allowed
                )}
              >
                <IoEye className='text-[22px]' />
              </Button>
              <Button
                type='button'
                className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
                dataTooltipId='client_inquiry_view_button'
                dataTooltipContent='Delete Inquiry'
                onClick={() => handelClickOnDeleteButton(data)}
                disabled={permissionData?.permissions?.some(
                  (item) => item?.label == 'delete' && !item?.is_allowed
                )}
              >
                <MdDelete className='text-[22px]' />
              </Button>
              <Tooltip
                id='client_inquiry_view_button'
                opacity={'100'}
                className='z-[15] bg-white'
                place='left'
              />

              <Tooltip
                id='client_inquiry_delete_button'
                opacity={'100'}
                className='z-[15] bg-white'
                place='left'
              />
            </div>
          );
        else return <span></span>;
      },
    },
  ];

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const fetchClientFormSchema = async (form_schema_id: string) => {
    const id = queryParameter.get('id');

    const endPointArr: endpointObject[] = [
      {
        endPoint: `config/inquiry_form_fields/fetch?form_schema_id=${form_schema_id || id || selectedInquiryForm?.id}`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);

    const res = response[0];
    setIsFetchingData(false);
    setIsInitialFetching(false);
    if (res?.success) return { success: true, data: res?.data };
    return { success: false, data: [] };
  };
  const fetchAllClientInquiryWithDebounce = useDebounce(
    async (
      queryString: string,
      page: number = 1,
      limit: number = 10,
      form_id: string,
      form_schema_id: string
    ) => {
      try {
        const filter_form_id = queryParameter.get('form-id');
        const formSchemaId = form_schema_id || selectedInquiryForm.id;
        const formId = form_id || filter_form_id || selectedInquiryForm?.formId;
        const endPointArr: endpointObject[] = [
          {
            endPoint:
              queryString == undefined || queryString?.trim() == ''
                ? `client-inquires/fetch?page=${page}&limit=${limit}&form_id=${formId}`
                : `client-inquires/fetch?page=${page}&limit=${limit}&${queryString}&form_id=${formId}`,
            protected: true,
          },
        ];

        const response = await multipleFetchApi(endPointArr);

        const res = response[0];
        setColumns(initialColumns);

        const data = await fetchClientFormSchema(formSchemaId);

        if (data?.success) {
          await handelGeneratingDynamicClientColumn(
            data?.data?.form_fields,
            setClientInquiryFiltersArray,
            setColumns
          );
        } else {
          handelNotification(res, 'top-right');
        }

        if (res?.success) {
          setData(res?.data);
          setMetaData(res?.metadata);
          setSelectedPage(res?.metadata?.current_page);
          setRecordsPerPage(res?.metadata?.record_per_page);
        } else {
          handelNotification(res, 'top-right');
        }
      } catch {
        handelNotification(
          { success: false, message: 'Some Thing Went Wrong' },
          'top-right'
        );
      }
    },
    100
  );

  const fetchClientFormFieldsWithDebounce = useDebounce(
    async (queryString: string) => {
      const endPointArr: Array<endpointObject> = [
        {
          endPoint: `config/inquiry_form_schema/fetch`,

          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);

      const res = response[0];

      if (res?.success) {
        setInquiryFormData(res?.data);
        const filter_form_id = queryParameter.get('form-id');
        const id = queryParameter.get('id');
        if (res?.data?.length !== 0) {
          if (filter_form_id && id) {
            setSelectedInquiryForm({ id: id, formId: filter_form_id });
            fetchAllClientInquiryWithDebounce(
              queryString,
              1,
              10,
              filter_form_id,
              id
            );
          } else {
            setSelectedInquiryForm({
              id: res?.data[0]?.id,
              formId: res?.data[0]?.form_id,
            });
            fetchAllClientInquiryWithDebounce(
              queryString,
              1,
              10,
              res?.data[0]?.form_id,
              res?.data[0]?.id
            );
            navigate(
              `/${organization}/client-inquiry?form-id=${res?.data[0].form_id}&id=${res?.data[0].id}`
            );
          }
        }
      } else {
        handelNotification(res, 'top-right');
      }
    },
    50
  );

  const handleClickOnInquiryFormId = (data: string | object) => {
    setIsFetchingData(true);
    if (typeof data !== 'object') return;

    const FormId = (data as Record<string, string>)['form_id'];
    const form_schema_id = (data as Record<string, string>)['id'];

    setSelectedInquiryForm({ id: form_schema_id, formId: FormId });

    const formQuery = `form-id=${FormId}&id=${form_schema_id}`;

    setTimeout(() => {
      navigate(`/${organization}/client-inquiry?${formQuery}`);
      // setUrlDecodedFilterQuery([]);
    }, 0);

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(
      queryString,
      1,
      recordsPerPage,
      FormId,
      form_schema_id
    );
  };

  const handelDeleteClientInquiryWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `client-inquires/delete-inquire?id=${deleteClientInquiryId}`,
        protected: true,
      },
    ];

    const response = await multipleDeleteApi(endPointArr);

    const res = response[0];

    if (res?.success) {
      setIsDeletingClientInquiry(false);
      setShowDeleteModal(false);
      setIsFetchingData(true);
      const filterQuery = queryParameter.get('filter');
      let queryString = '';
      if (filterQuery) {
        const decodeQuery = decodeURIComponent(filterQuery);
        const parsedFilter = JSON.parse(decodeQuery);

        setUrlDecodedFilterQuery(parsedFilter);
        queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
      }
      fetchAllClientInquiryWithDebounce(queryString, 1, recordsPerPage);
    } else {
      setIsDeletingClientInquiry(false);
      handelNotification(res, 'top-right');
      setShowDeleteModal(false);
    }
  }, 100);

  const handelDelete = () => {
    setIsDeletingClientInquiry(true);
    handelDeleteClientInquiryWithDebounce();
  };

  const InquiryFormsSearchDrop = (
    data: AddEditInquiryFormSchemaInterface[]
  ) => {
    return (
      <div className='flex items-center justify-end gap-2'>
        <p className='text-base font-inter font-medium text-black text-nowrap'>
          Selected Form ID:
        </p>
        <SearchDrop
          options={data}
          searchKey='form_id'
          selectedValue={selectedInquiryForm.formId}
          onSelectValBtn={handleClickOnInquiryFormId}
          position='bottom'
          emptyDataMessage={'No Option'}
          className='min-w-[180px]'
        />
      </div>
    );
  };

  const handelApplyFilterClientInquiry = async (
    filterArray: FilterObjectInterface[]
  ) => {
    setIsFetchingData(true);
    let queryString = '';
    if (filterArray?.length > 0) {
      const queryFilterArray = filterArray?.map((queryObj) => {
        const obj: UrlEncodedFilterQueryInterface = {
          field_name: '',
          operator: '',
          value: '',
        };
        queryObj?.moduleValue?.forEach((moduleValue) => {
          if (moduleValue?.type === FilterFieldsTypeEnums[0]) {
            obj.field_name = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[1]) {
            obj.operator = moduleValue?.label;
          }
          if (moduleValue?.type === FilterFieldsTypeEnums[2]) {
            obj.value = moduleValue?.value;
          }
        });
        return obj;
      });

      queryString = `filter=${encodeURIComponent(JSON.stringify(queryFilterArray))}`;
      setUrlDecodedFilterQuery(queryFilterArray);
    }

    const FormId = queryParameter.get('form-id');
    const form_schema_id = queryParameter.get('id');
    const formQuery = `form-id=${FormId || selectedInquiryForm?.formId}&id=${form_schema_id || selectedInquiryForm?.id}`;

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(`/${organization}/client-inquiry?${queryString}&${formQuery}`);
    }, 0);
    // First update the state and fetch data
    await fetchAllClientInquiryWithDebounce(
      queryString,
      1,
      recordsPerPage,
      FormId,
      form_schema_id
    );
  };

  const handelClickOnRecordPerPage = (value: string | number) => {
    setIsFetchingData(true);
    setRecordsPerPage(value);

    const filter_form_id = queryParameter.get('form-id');
    const formId = filter_form_id || selectedInquiryForm?.formId;
    const form_schema_id = queryParameter.get('id');

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(
      queryString,
      1,
      value,
      formId,
      form_schema_id
    );
  };

  const handelClickOnPaginationButtons = (value: number) => {
    setIsFetchingData(true);
    setSelectedPage(value);

    const filter_form_id = queryParameter.get('form-id');
    const formId = filter_form_id || selectedInquiryForm?.formId;
    const form_schema_id = queryParameter.get('id');

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(
      queryString,
      value,
      recordsPerPage,
      formId,
      form_schema_id
    );
  };

  const filterQueryParam = queryParameter.get('filter');

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    let queryString = '';
    if (filterQueryParam) {
      const decodeQuery = decodeURIComponent(filterQueryParam);
      const parsedFilter = JSON.parse(decodeQuery);
      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    } else {
      setUrlDecodedFilterQuery([]);
    }

    fetchClientFormFieldsWithDebounce(queryString);
  }, [filterQueryParam]);

  useEffect(() => {
    if (filterQueryParam === null) {
      setUrlDecodedFilterQuery([]);
    }
  }, [filterQueryParam]);

  const segments = location.pathname.split('/').filter(Boolean);

  const parentSection = segments[1];

  const permissionData = GlobalStateProvider.roles_permissions.permissions.find(
    (item) => item.module_label == parentSection.replace('-', '_')
  );

  const hasNoPermissionToView =
    !permissionData ||
    !permissionData.is_active ||
    !permissionData?.permissions?.some(
      (item) => item.label == 'view' && item.is_allowed
    );

  if (hasNoPermissionToView)
    return (
      <AccessDeniedRedirect
        message="You don't have permission to View Client Inquires."
        isAccessDenied={hasNoPermissionToView}
      />
    );
  return (
    <>
      <HelmetSeo
        Title={MetaTitleDescription.clientInquiry.title}
        Content={MetaTitleDescription.clientInquiry.description}
      />
      <div className='w-full h-full relative'>
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className='w-full h-full pt-9'>
          <div className='w-full h-full p-4 2xl:p-5'>
            {isInitialFetching ? (
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
                  moduleName='Client Inquiry'
                  badgeValue={
                    data?.length === 0
                      ? `0 Inquiry`
                      : `${(metaData?.current_page - 1) * Number(metaData?.record_per_page) + 1} - ${Math.min(metaData?.current_page * metaData?.record_per_page, metaData?.total_data)} of  ${metaData?.total_data}  Inquiry`
                  }
                  buttonsArray={[]}
                  renderElement={InquiryFormsSearchDrop(inquiryFormData)}
                />

                {isFetchingData ? (
                  <TableSkeletonLoader
                    tableHeaderCount={5}
                    tableValueCount={13}
                    maxHeight='calc(-300px + 100vh)'
                    showFilterLoader={false}
                    showHeaderLoader={false}
                  />
                ) : (
                  <>
                    <TableFilterSearchBar
                      filterColumnsArray={clientInquiryFiltersArray}
                      handelApplyFilterFunc={handelApplyFilterClientInquiry}
                      urlDecodedFilterQuery={urlDecodedFilterQuery || ''}
                      setUrlDecodedFilterQuery={setUrlDecodedFilterQuery}
                    />
                    {data?.length > 0 ? (
                      <>
                        {' '}
                        <Table
                          columns={columns}
                          data={data}
                          tableWrapperClass={
                            'overflow-auto max-h-[calc(100vh-345px)] h-full bg-white'
                          }
                          stickyHeaderClass='sticky top-0'
                        />
                        <TablePagination
                          paginationDropDownArray={dropdownMenuArray}
                          recordsPerPage={recordsPerPage}
                          handelClickOnDroDownVal={handelClickOnRecordPerPage}
                          clickOnPaginationVal={handelClickOnPaginationButtons}
                          selectedPage={selectedPage}
                          totalPage={metaData?.total_pages}
                        />
                      </>
                    ) : (
                      <TableNoDataFound
                        tableWrapperClass={
                          'max-h-[calc(100%-140px)] rounded-b-lg'
                        }
                        notFoundTitle={'No Client Inquiries Found'}
                        notFoundMessage={
                          'No client inquiry found for this contact form. Try refining your search or wait for new inquiries.'
                        }
                        notFoundOptionsButtonsArray={[]}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        loading={isDeletingClientInquiry}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDelete}
        name='Form Field'
      />
      <ClientInquirySliderModal
        clientInquiryData={clientInquiryData}
        showClientInquiryDetail={showClientInquiryDetail}
        setShowClientInquiryDetail={setShowClientInquiryDetail}
      />
    </>
  );
}

export default ClientInquiry;
