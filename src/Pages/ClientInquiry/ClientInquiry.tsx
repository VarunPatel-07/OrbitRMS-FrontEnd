 
import { useState } from 'react';

import Breadcrumbs from '../../common/Breadcrumbs';
import TableFilterSearchBar from '../../common/Table/TableFilterSearchBar';
import TableInfoHeader from '../../common/Table/TableInfoHeader';
import TablePagination from '../../common/Table/TablePagination';
import TableSkeletonLoader from '../../Components/Loader/Table/TableSkeletonLoader';
import DeleteModal from '../../Components/Modal/DeleteModal';
import HelmetSeo from '../../Helper/HelmetSeo';

const BreadcrumbsObjects = [
  { name: 'Home', label: 'home', link: '/home' },
  { name: 'Client Inquiry', label: 'client-inquiry', link: '/client-inquiry' },
];

const dropdownMenuArray = [10, 25, 50, 100];

function ClientInquiry() {
  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingClientData] = useState(false);

  const handelDelete = () => {};

  return (
    <>
      <HelmetSeo Title='Client Inquires | OrbitRMS' />
      <div className='relative w-full h-full'>
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className='w-full h-full pt-10'>
          <div className='w-full h-full p-6'>
            {loadingClientData ? (
              <TableSkeletonLoader tableHeaderCount={5} tableValueCount={10} />
            ) : (
              <div className='w-full h-full'>
                <TableInfoHeader
                  moduleName='Client Inquiry'
                  badgeValue='1-10 of 14 Inquiries'
                />
                <TableFilterSearchBar />
                {/* <Table
                  columns={columns}
                  data={data}
                  tableWrapperClass={'overflow-auto max-h-[calc(100vh-345px)]'}
                  stickyHeaderClass='sticky top-0'
                /> */}
                <TablePagination
                  paginationDropDownArray={dropdownMenuArray}
                  recordsPerPage={recordsPerPage}
                  setRecordsPerPage={setRecordsPerPage}
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                  totalPage={10}
                />
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
