import { FaHome } from "react-icons/fa";

interface BreadcrumbsProps {
  label: string;
  name: string;
  link: string;
  target?: string;
  customIcon?: React.ReactNode;
}
function Breadcrumbs({ BreadcrumbsNavigationFlow }: { BreadcrumbsNavigationFlow: Array<BreadcrumbsProps> }) {
  return (
    <div className="w-full bg-white py-2">
      {BreadcrumbsNavigationFlow.map((items, index) => (
        <div key={index}>
          {items.name.toLocaleLowerCase() == "home" ? (
            <span className="text-black">
              <FaHome />
            </span>
          ) : (
            ""
          )}
          {BreadcrumbsNavigationFlow.length === index + 1 && <span></span>}
        </div>
      ))}
    </div>
  );
}

export default Breadcrumbs;
