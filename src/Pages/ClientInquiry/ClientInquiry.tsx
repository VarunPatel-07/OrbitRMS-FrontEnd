/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TablePagination from '../../common/Table/TablePagination';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import DeleteModal from '../../Components/Modal/DeleteModal';
import { dropdownMenuArray } from '../../constant/constant';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import HelmetSeo from '../../Helper/HelmetSeo';
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { ClientInquiryFormSchemaInterface } from '../../interface/ClientInquiry';
import { Column, MetaDataInterface } from '../../interface/propsInterface';
import { clientInquiryFiltersArray } from './ClientInquiryFilters';

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

  const [queryParameter] = useSearchParams();

  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [metaData, setMetaData] = useState<MetaDataInterface>(initialMetadata);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingClientData, setLoadingClientData] = useState(true);
  const [data, setData] = useState([]);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);
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

  const fetchAllClientInquiryWithDebounce = useDebounce(
    async (queryString: string, page: number = 1, limit: number = 10) => {
      const endPointArrOne: endpointObject[] = [
        {
          endPoint: 'config/client_form_schema/fetch',
          protected: true,
        },
      ];
      const endPointArr: endpointObject[] = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `client-inquires/fetch?page=${page}&limit=${limit}`
              : `client-inquires/fetch?page=${page}&limit=${limit}&${queryString}`,
          protected: true,
        },
      ];
      let formSchemaResponse;
      if (columns?.length == 1) {
        const responseOne = await multipleFetchApi(endPointArrOne);
        formSchemaResponse = responseOne[0];
      } else {
        formSchemaResponse = {
          success: true,
          data: columns?.filter((item) => item.key !== 'action'),
        };
      }

      const response = await multipleFetchApi(endPointArr);

      const res = response[0];

      if (formSchemaResponse?.success) {
        const columnsArray: Array<Column> = [];

        formSchemaResponse?.data?.map(
          (data: ClientInquiryFormSchemaInterface) => {
            if (!['string', 'number'].includes(data?.type)) return;
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
        );

        setColumns((perValue) => [...columnsArray, ...perValue]);

        if (res?.success) {
          setData(res?.data);
          setMetaData(res?.metadata);
        } else {
          console.log(res);
          handelNotification(res, 'top-right');
        }
        setIsFetchingData(false);
      }
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

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    fetchAllClientInquiryWithDebounce();
  }, [fetchAllClientInquiryWithDebounce]);

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
                  handelApplyFilterFunc={() => {}}
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
                            'overflow-auto max-h-[calc(100vh-345px)]'
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
                        notFoundTitle={'No Employees Found'}
                        notFoundMessage={
                          'No matching employee found. Try refining your search or add a new employee.'
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
