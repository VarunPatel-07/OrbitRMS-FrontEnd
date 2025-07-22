/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import ClientInquirySliderModal from '../../Components/Modal/ClientInquirySliderModal';
import { dropdownMenuArray } from '../../constant/constant';
import {
  Contains,
  EndsWith,
  Equals,
  Is,
  StartsWith,
} from '../../constant/FilterOperator';
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
import { ClientInquiryFormSchemaInterface } from '../../interface/ClientInquiryInterFace';
import {
  Column,
  FilterObjectInterface,
  MetaDataInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';

const DeleteModal = React.lazy(
  () => import('../../Components/Modal/DeleteModal')
);

const initialMetadata: MetaDataInterface = {
  total_data: 0,
  total_pages: 1,
  current_page: 1,
  record_per_page: 10,
};

function ClientInquiry() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = [
    { name: 'Home', label: 'home', link: `/${organization}/dashboard` },
    {
      name: 'Client Inquiry',
      label: 'client-inquiry',
      link: `/${organization}/client-inquiry`,
    },
  ];

  const useEffectRef = useRef(false);

  const navigate = useNavigate();

  const [queryParameter] = useSearchParams();

  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingClientData, setLoadingClientData] = useState(true);
  const [data, setData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
  const [clientFormSchema, setClientFormSchema] = useState<
    ClientInquiryFormSchemaInterface[]
  >([]);
  const [isDeletingClientInquiry, setIsDeletingClientInquiry] =
    useState<boolean>(false);
  const [deleteClientInquiryId, setDeleteClientInquiryId] =
    useState<string>('');

  const [clientInquiryData, setClientInquiryData] = useState<any>({});
  const [showClientInquiryDetail, setShowClientInquiryDetail] =
    useState<boolean>(false);

  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);

  const [clientInquiryFiltersArray, setClientInquiryFiltersArray] = useState<
    SearchBarFilterOptionsInterface[]
  >([]);

  const [columns, setColumns] = useState<Column[]>([
    {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='client_inquiry_view_button'
              data-tooltip-content='View Inquiry'
              onClick={() => handelClickOnViewInquiryButton(data)}
            >
              <IoEye className='text-[22px]' />
            </button>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='client_inquiry_view_button'
              data-tooltip-content='Delete Inquiry'
              onClick={() => handelClickOnDeleteButton(data)}
            >
              <MdDelete className='text-[22px]' />
            </button>
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

  const handelClickOnViewInquiryButton = (data: any) => {
    setShowClientInquiryDetail(true);
    setClientInquiryData(data);
  };
  const handelClickOnDeleteButton = (data: any) => {
    setDeleteClientInquiryId(data?.id);
    setShowDeleteModal(true);
  };

  const fetchClientFormSchema = async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: 'config/client_form_schema/fetch',
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);

    const res = response[0];
    if (res?.success) return { success: true, data: res?.data };
    return { success: false, data: [] };
  };

  const handelGeneratingDynamicClientColumn = (
    columnData: ClientInquiryFormSchemaInterface[]
  ) => {
    const columnsArray: Array<Column> = [];

    const clientFilterArray: SearchBarFilterOptionsInterface[] = [];

    columnData?.map((data: ClientInquiryFormSchemaInterface) => {
      if (['string', 'number'].includes(data?.type)) {
        const columnObject: Column = {
          key: data?.field_name,
          title: data?.field_name
            ?.replace(/_/g, ' ')
            ?.split(' ')
            .map(
              (item) =>
                item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
            )
            ?.join(' '),
          isSortable: true,
          isSticky: false,
          canToggleVisibility: true,
          renderContent: (data: any) => (
            <div className='w-fit'>
              <span className='font-inter text-sm font-medium text-nowrap text-black'>
                {data || <span>-</span>}
              </span>
            </div>
          ),
        };
        columnsArray.push(columnObject);
      }
      if (['string', 'number', 'boolean'].includes(data?.type)) {
        const FilterObject: SearchBarFilterOptionsInterface = {
          id: data?.field_name,
          value: data?.field_name
            ?.replace(/_/g, ' ')
            ?.split(' ')
            .map(
              (item) =>
                item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
            )
            ?.join(' '),
          label: (
            <div className='flex items-start'>
              <span className='icon-mail-05 text-gray-600 text-lg pe-2' />
              <span>
                {data?.field_name
                  ?.replace(/_/g, ' ')
                  ?.split(' ')
                  .map(
                    (item) =>
                      item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
                  )
                  ?.join(' ')}
              </span>
            </div>
          ),
          optionType: data?.type == 'boolean' ? 'select' : 'text',
          operator:
            data?.type == 'boolean'
              ? [Is]
              : [Equals, Contains, StartsWith, EndsWith],
          options:
            data?.type == 'boolean'
              ? [
                  {
                    label: 'active',
                    value: 'Active',
                    type: FilterFieldsTypeEnums[2],
                  },
                  {
                    label: 'inactive',
                    value: 'Inactive',
                    type: FilterFieldsTypeEnums[2],
                  },
                ]
              : [], // No options for text filters
        };
        clientFilterArray.push(FilterObject);
      }
    });

    setColumns((perValue) => [...columnsArray, ...perValue]);
    setClientInquiryFiltersArray(clientFilterArray);
  };

  const fetchAllClientInquiryWithDebounce = useDebounce(
    async (queryString: string, page: number = 1, limit: number = 10) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `client-inquires/fetch?page=${page}&limit=${limit}`
              : `client-inquires/fetch?page=${page}&limit=${limit}&${queryString}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);

      const res = response[0];

      if (clientFormSchema.length == 0) {
        const data = await fetchClientFormSchema();
        if (data?.success) {
          setClientFormSchema(data?.data);
          handelGeneratingDynamicClientColumn(data?.data);
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
      setLoadingClientData(false);
    },
    100
  );

  const handelClickOnRecordPerPage = (value: string | number) => {
    setIsFetchingData(true);
    setRecordsPerPage(value);
    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(queryString, 1, value);
  };

  const handelClickOnPaginationButtons = (value: number) => {
    setIsFetchingData(true);
    setSelectedPage(value);

    const filterQuery = queryParameter.get('filter');
    let queryString = '';
    if (filterQuery) {
      const decodeQuery = decodeURIComponent(filterQuery);
      const parsedFilter = JSON.parse(decodeQuery);
      queryString = `filter=${encodeURIComponent(JSON.stringify(parsedFilter))}`;
    }

    fetchAllClientInquiryWithDebounce(queryString, value, recordsPerPage);
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
      setLoadingClientData(true);
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

    // Then navigate after the state updates are complete
    setTimeout(() => {
      navigate(`/${organization}/client-inquiry?${queryString}`);
    }, 0);
  };

  useEffect(() => {
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
  }, [fetchAllClientInquiryWithDebounce, queryParameter]);

  return (
    <>
      <HelmetSeo Title='Client Inquires | OrbitRMS' />
      <div className='relative w-full h-full'>
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className='w-full h-full pt-9'>
          <div className='w-full h-full p-6'>
            {loadingClientData ? (
              <TableSkeletonLoader
                tableHeaderCount={5}
                tableValueCount={10}
                maxHeight='calc(-350px + 100vh)'
              />
            ) : (
              <div className='w-full h-full'>
                <TableInfoHeader
                  moduleName='Client Inquiry'
                  badgeValue={`${(metaData?.current_page - 1) * Number(metaData?.record_per_page) + 1} - ${Math.min(metaData?.current_page * metaData?.record_per_page, metaData?.total_data)} of  ${metaData?.total_data}  Inquiry`}
                />
                <TableFilterSearchBar
                  filterColumnsArray={clientInquiryFiltersArray}
                  handelApplyFilterFunc={handelApplyFilterClientInquiry}
                  urlDecodedFilterQuery={urlDecodedFilterQuery}
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
                          'max-h-[calc(100%-150px)] rounded-b-lg'
                        }
                        notFoundTitle={'No Inquiry Found'}
                        notFoundMessage={
                          'We couldn’t find any inquiries that match your criteria. Please try adjusting your filters or search terms.'
                        }
                        notFoundOptionsButtonsArray={[]}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        handelDelete={handelDelete}
        loading={isDeletingClientInquiry}
        name='Inquiry'
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
