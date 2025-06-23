/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import { FilterObjectInterface } from '../../common/Table/FilterInput';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import DeleteModal from '../../Components/Modal/DeleteModal';
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
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import HelmetSeo from '../../Helper/HelmetSeo';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { ClientInquiryFormSchemaInterface } from '../../interface/ClientInquiryInterFace';
import {
  Column,
  MetaDataInterface,
  SearchBarFilterOptionsInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';

// import { clientInquiryFiltersArray } from './ClientInquiryFilters';

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
    { name: 'Home', label: 'home', link: '/home' },
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
      renderContent: () => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <button
              className='text-black/80 p-1.5 disabled:opacity-50 disabled:cursor-not-allowed'
              data-tooltip-id='project_status_view_profile_button'
              data-tooltip-content='View Profile'
            >
              <IoEye className='text-[22px]' />
            </button>
            <Tooltip
              id='project_status_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />

            <Tooltip
              id='project_status_view_profile_button'
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

      // if (columns.length == 1 || clientInquiryFiltersArray.length == 0) {
        console.log(columns, clientInquiryFiltersArray);

      //   handelGeneratingDynamicClientColumn(clientFormSchema);
      // }

      if (res?.success) {
        setData(res?.data);
        setMetaData(res?.metadata);
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

  const handelDelete = () => {};

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
                  badgeValue={`${(selectedPage - 1) * Number(recordsPerPage) + 1} - ${data?.length * selectedPage} of  ${metaData?.total_data}  Inquiry`}
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
        loading={false}
      />
    </>
  );
}

export default ClientInquiry;
