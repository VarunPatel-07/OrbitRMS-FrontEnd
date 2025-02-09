/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Breadcrumbs from "../../common/Breadcrumbs";
import Table from "../../common/Table/Table";
import TableFilterSearchBar from "../../common/Table/TableFilterSearchBar";
import TableInfoHeader from "../../common/Table/TableInfoHeader";
import TablePagination from "../../common/Table/TablePagination";
import HelmetSeo from "../../Helper/HelmetSeo";
import DeleteModal from "../../Components/Modal/DeleteModal";
import TableSkeletonLoader from "../../Components/Loader/Table/TableSkeletonLoader";

const BreadcrumbsObjects = [
  { name: "Home", label: "home", link: "/home" },
  { name: "Client Inquiry", label: "client-inquiry", link: "/client-inquiry" },
];

const columns = [
  {
    key: "name",
    title: "Name",
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: any) => <span>{data}</span>,
  },
  {
    key: "age",
    title: "Age",
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: any) => <span>{data}</span>,
  },
  {
    key: "email",
    title: "Email",
    isSortable: true,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: any) => <span>{data}</span>,
  },
  {
    key: "action",
    title: "Action",
    isSortable: false,
    isSticky: false,
    canToggleVisibility: true,
    renderContent: (data: any) => <span>{data || "helooo"}</span>,
  },
];
const data = [
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
  { name: "John Doe", age: 25, email: "john.doe@example.com" },
  { name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
  { name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
];
const dropdownMenuArray = [10, 25, 50, 100];

function ClientInquiry() {
  const [recordsPerPage, setRecordsPerPage] = useState<string | number>(10);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingClientData] = useState(false);

  return (
    <>
      <HelmetSeo Title="Client Inquires | OrbitRMS" />
      <div className="relative w-full h-full">
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className="w-full h-full pt-10">
          <div className="w-full h-full p-6">
            {loadingClientData ? (
              <TableSkeletonLoader tableHeaderCount={5} tableValueCount={10} />
            ) : (
              <div className="w-full h-full">
                <TableInfoHeader />
                <TableFilterSearchBar />
                <Table
                  columns={columns}
                  data={data}
                  tableWrapperClass={"overflow-auto max-h-[calc(100vh-345px)]"}
                  stickyHeaderClass="sticky top-0"
                />
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
      <DeleteModal showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal} />
    </>
  );
}

export default ClientInquiry;
