import { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import SearchDrop from '../../common/SearchDrop';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import { AddEditInquiryFormSchemaBreadcrumbs } from '../../constant/ConfigModuleConstant';
import { dropdownMenuArray, initialMetadata } from '../../constant/constant';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { FilterFieldsTypeEnums } from '../../enums/enums';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { ClientInquiryFormSchemaInterface } from '../../interface/ClientInquiryInterFace';
import { AddEditInquiryFormSchemaInterface } from '../../interface/interface';
import {
  Column,
  FilterObjectInterface,
  MetaDataInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';
import { handelGeneratingDynamicClientColumn } from './ClientInquiryHelper';

function ClientInquiry() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const inquiryFormUseEffectRef = useRef(false);
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
  const [clientFormSchema, setClientFormSchema] = useState<
    ClientInquiryFormSchemaInterface[]
  >([]);
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

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = AddEditInquiryFormSchemaBreadcrumbs(organization);

  const [columns, setColumns] = useState<Column[]>([
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
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: () => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='client_inquiry_view_button'
              data-tooltip-content='View Inquiry'
              // onClick={() => handelClickOnViewInquiryButton(data)}
            >
              <IoEye className='text-[22px]' />
            </button>
            {/* <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='client_inquiry_view_button'
              data-tooltip-content='Delete Inquiry'
              onClick={() => handelClickOnDeleteButton(data)}
            >
              <MdDelete className='text-[22px]' />
            </button> */}
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
      },
    },
  ]);
  const fetchClientFormSchema = async () => {
    const id = queryParameter.get('id');
    const endPointArr: endpointObject[] = [
      {
        endPoint: `config/inquiry_form_fields/fetch?form_schema_id=${selectedInquiryForm?.id || id}`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);

    const res = response[0];
    if (res?.success) return { success: true, data: res?.data };
    return { success: false, data: [] };
  };
  const fetchAllClientInquiryWithDebounce = useDebounce(
    async (
      queryString: string,
      page: number = 1,
      limit: number = 10,
      form_id: string
    ) => {
      const filter_form_id = queryParameter.get('form-id');
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

      if (clientFormSchema.length == 0) {
        const data = await fetchClientFormSchema();
        if (data?.success) {
          setClientFormSchema(data?.data);
          handelGeneratingDynamicClientColumn(
            data?.data,
            setClientInquiryFiltersArray,
            setColumns
          );
        } else {
          handelNotification(res, 'top-right');
        }
      }

      if (res?.success) {
        setData(res?.data);
        setMetaData(res?.metadata);
        setSelectedPage(res?.metadata?.current_page);
        setRecordsPerPage(res?.metadata?.record_per_page);
      } else {
        handelNotification(res, 'top-right');
      }

      setIsFetchingData(false);
      setIsInitialFetching(false);
    },
    100
  );

  const fetchClientFormFieldsWithDebounce = useDebounce(async () => {
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
        } else {
          setSelectedInquiryForm({
            id: res?.data[0]?.id,
            formId: res?.data[0]?.form_id,
          });
          navigate(
            `/${organization}/client-inquiry?form-id=${res?.data[0].form_id}&id=${res?.data[0].id}`
          );
        }
      }
    } else {
      handelNotification(res, 'top-right');
    }
    setIsInitialFetching(false);
    setIsFetchingData(false);
  }, 50);

  const handleClickOnInquiryFormId = (data: string | object) => {
    setIsFetchingData(true);
    if (typeof data !== 'object') return;

    const FormId = (data as Record<string, string>)['form_id'];
    const id = (data as Record<string, string>)['id'];

    setSelectedInquiryForm({ id: id, formId: FormId });

    const formQuery = `form-id=${FormId}&id=${id}`;

    setTimeout(() => {
      navigate(`/${organization}/client-inquiry?${formQuery}`);
    }, 0);

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(queryString, 1, recordsPerPage, FormId);
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
    }

    // First update the state and fetch data
    await fetchAllClientInquiryWithDebounce(queryString);

    const filter_form_id = queryParameter.get('form-id');
    const id = queryParameter.get('id');
    const formQuery = `form-id=${filter_form_id || selectedInquiryForm?.formId}&id=${id || selectedInquiryForm?.id}`;

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(`/${organization}/client-inquiry?${queryString}&${formQuery}`);
    }, 0);
  };

  const handelClickOnRecordPerPage = (value: string | number) => {
    setIsFetchingData(true);
    setRecordsPerPage(value);

    const filter_form_id = queryParameter.get('form-id');
    const formId = filter_form_id || selectedInquiryForm?.formId;

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(queryString, 1, value, formId);
  };

  const handelClickOnPaginationButtons = (value: number) => {
    setIsFetchingData(true);
    setSelectedPage(value);

    const filter_form_id = queryParameter.get('form-id');
    const formId = filter_form_id || selectedInquiryForm?.formId;

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
      formId
    );
  };

  useEffect(() => {
    if (inquiryFormUseEffectRef.current) return;
    inquiryFormUseEffectRef.current = true;
    fetchClientFormFieldsWithDebounce();
  }, []);

  useEffect(() => {
    if (inquiryFormData?.length == 0) return;
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);

      setUrlDecodedFilterQuery(parsedFilter);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(queryString);
  }, [
    fetchAllClientInquiryWithDebounce,
    queryParameter,
    selectedInquiryForm,
    inquiryFormData,
  ]);

  return (
    <>
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
                  badgeValue={data?.length === 0 ? `0 Inquiry`:`${(metaData?.current_page - 1) * Number(metaData?.record_per_page) + 1} - ${Math.min(metaData?.current_page * metaData?.record_per_page, metaData?.total_data)} of  ${metaData?.total_data}  Inquiry`}
                  buttonsArray={[]}
                  renderElement={InquiryFormsSearchDrop(inquiryFormData)}
                />
                <TableFilterSearchBar
                  filterColumnsArray={clientInquiryFiltersArray}
                  handelApplyFilterFunc={handelApplyFilterClientInquiry}
                  urlDecodedFilterQuery={urlDecodedFilterQuery || ''}
                />
                {isFetchingData ? (
                  <TableSkeletonLoader
                    tableHeaderCount={5}
                    tableValueCount={13}
                    maxHeight='calc(-350px + 100vh)'
                    showFilterLoader={false}
                    showHeaderLoader={false}
                  />
                ) : (
                  <>
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
                        notFoundTitle={'No Employees Found'}
                        notFoundMessage={
                          'No matching employee found. Try refining your search or add a new employee.'
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

      {/* <DeleteModal
        loading={isDeleteLoading}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDeleteItem}
        name='Form Field'
      /> */}
    </>
  );
}

export default ClientInquiry;
