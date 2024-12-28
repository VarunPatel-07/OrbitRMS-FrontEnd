/* eslint-disable @typescript-eslint/no-explicit-any */
import Breadcrumbs from "../../common/Breadcrumbs";
import Table from "../../common/Table";
import TableInfoHeader from "../../Components/TableInfoHeader";
import HelmetSeo from "../../Helper/HelmetSeo";

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

function ClientInquiry() {
  return (
    <>
      <HelmetSeo Title="Client Inquires | OrbitRMS" />
      <div className="relative w-full h-full">
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className="w-full h-full pt-10">
          <div className="w-full h-full p-6">
            <div className="w-full h-full">
              <TableInfoHeader />
              <Table
                columns={columns}
                data={data}
                tableWrapperClass={"overflow-auto h-[calc(100vh-300px)] rounded-b-lg"}
                stickyHeaderClass="sticky top-0"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientInquiry;
