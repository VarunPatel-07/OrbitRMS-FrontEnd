import { FaHome } from "react-icons/fa";
import { GoChevronRight } from "react-icons/go";
import { Link, useLocation } from "react-router-dom";
import { BreadcrumbsProps } from "../interface/propsInterface";

function Breadcrumbs({ BreadcrumbsNavigationFlow }: { BreadcrumbsNavigationFlow: Array<BreadcrumbsProps> }) {
  const navigation = useLocation();
  return (
    <div className="w-full bg-white py-2 px-3 absolute z-10">
      <div className="w-full flex items-center gap-2">
        {BreadcrumbsNavigationFlow.map((items, index) => (
          <div key={index} className="text-xl flex items-center justify-start gap-2">
            {items.name.toLocaleLowerCase() == "home" ? (
              <Link to={items.link} className="text-black">
                <FaHome />
              </Link>
            ) : (
              <Link
                to={items.link}
                className={`${
                  navigation.pathname === items.link ? "text-blue-700 font-medium" : "text-black font-medium"
                } text-base`}>
                {items.name}
              </Link>
            )}
            {BreadcrumbsNavigationFlow.length !== index + 1 && (
              <span className="text-black">
                {" "}
                <GoChevronRight />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Breadcrumbs;
