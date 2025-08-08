import React, { useContext, useEffect, useRef, useState } from 'react';
import { IoEye } from 'react-icons/io5';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import Breadcrumbs from '../../common/Breadcrumbs';
import Table from '../../common/Table/Table';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TableNoDataFound from '../../common/Table/TableNoDataFound';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import { AddEditInquiryFormSchemaBreadcrumbs } from '../../constant/ConfigModuleConstant';
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
import { getDataFromLocalStorage } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import { AddEditInquiryFormSchemaInterface } from '../../interface/interface';
import {
  Column,
  FilterObjectInterface,
  UrlEncodedFilterQueryInterface,
} from '../../interface/propsInterface';
import { ClientInquiryFilterArray } from './ClientInquiryFilterArray';

const DeleteModal = React.lazy(
  () => import('../../Components/Modal/DeleteModal')
);

// const initialMetadata: MetaDataInterface = {
//   total_data: 0,
//   total_pages: 1,
//   current_page: 1,
//   record_per_page: 10,
// };

function ClientInquiry() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const navigate = useNavigate();
  const useEffectRef = useRef(false);
  const [queryParameter] = useSearchParams();

  const [isInitialFetching, setIsInitialFetching] = useState<boolean>(true);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(false);

  const [data, setData] = useState<Array<AddEditInquiryFormSchemaInterface>>(
    []
  );

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<string>('');
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [urlDecodedFilterQuery, setUrlDecodedFilterQuery] = useState<
    UrlEncodedFilterQueryInterface[]
  >([]);

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = AddEditInquiryFormSchemaBreadcrumbs(organization);

  const fetchClientFormFieldsWithDebounce = useDebounce(
    async (queryString: string, page: number = 1, limit: number = 10) => {
      const endPointArr: Array<endpointObject> = [
        {
          endPoint:
            queryString == undefined || queryString?.trim() == ''
              ? `config/inquiry_form_schema/fetch?page=${page}&limit=${limit}`
              : `config/inquiry_form_schema/fetch?page=${page}&limit=${limit}&${queryString}`,

          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);

      const res = response[0];

      if (res?.success) {
        setData(res?.data);
      } else {
        handelNotification(res, 'top-right');
      }
      setIsInitialFetching(false);
      setIsFetchingData(false);
    },
    50
  );

  const fetchClientFormFields = () => {
    setIsFetchingData(true);
    fetchClientFormFieldsWithDebounce();
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
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: AddEditInquiryFormSchemaInterface) => {
        return (
          <div className='w-full h-full flex items-center justify-start gap-2'>
            <Link
              to={`/${GlobalStateProvider?.organization?.general_info?.portal_slug}/config/inquiry-forms/${data?.id}/fields`}
              className='text-black/80 p-1.5'
              data-tooltip-id='project_status_edit_button'
              data-tooltip-content='View'
            >
              <IoEye className='text-[22px]' />
            </Link>

            <Tooltip
              id='project_status_edit_button'
              opacity={'100'}
              className='z-[15] bg-white'
              place='left'
            />
          </div>
        );
      },
    },
  ];

  const handelApplyFilterEmployeeListing = async (
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
            if (queryObj?.optionType == 'multi-select') {
              const MultiSelectArr: string[] = [];
              queryObj?.moduleValue
                ?.filter((tem) => tem.type === FilterFieldsTypeEnums[2])
                ?.map((data) => MultiSelectArr.push(data?.value));

              obj.value = JSON.stringify(MultiSelectArr);
            } else {
              obj.value = moduleValue?.value;
            }
          }
        });
        return obj;
      });

      queryString = `filter=${encodeURIComponent(JSON.stringify(queryFilterArray))}`;
    }

    // First update the state and fetch data
    await fetchClientFormFieldsWithDebounce(queryString);

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

    fetchClientFormFieldsWithDebounce(queryString);
  }, [fetchClientFormFieldsWithDebounce, queryParameter]);
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
                  moduleName='Inquiry Forms'
                  badgeValue={data.length?.toString()}
                  buttonsArray={[]}
                />
                <TableFilterSearchBar
                  filterColumnsArray={ClientInquiryFilterArray}
                  handelApplyFilterFunc={handelApplyFilterEmployeeListing}
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
                      <Table
                        columns={columns}
                        data={data}
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

export default ClientInquiry;
