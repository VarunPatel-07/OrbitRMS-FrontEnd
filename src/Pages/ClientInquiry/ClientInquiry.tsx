import Breadcrumbs from "../../Components/common/Breadcrumbs";

const BreadcrumbsObjects = [{ name: "Home", label: "Home", link: "/home" }];

function ClientInquiry() {
  return (
    <>
      <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
    </>
  );
}

export default ClientInquiry;
