import { useState } from "react";
import { SidebarMenuItemInterface, SidebarMenuItems } from "./SidebarMenuItems";
import { RiArrowLeftDoubleFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "react-tooltip";

function SideBar() {
  const navigation = useLocation();
  const [collapsed, setCollapsed] = useState(true as boolean);

  const handelSidebarCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={`h-full bg-[#3538CD] text-white flex flex-col  transition-all duration-300  ${
        collapsed ? "max-w-[57px] min-w-[57px]" : "min-w-[240px] max-w-[250px]"
      }`}>
      <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full">
          <ul className="relative flex flex-col gap-2 px-[5px] pt-3">
            {SidebarMenuItems.map((item: SidebarMenuItemInterface) => (
              <li
                key={item.id}
                className={`w-full group relative rounded-md ${
                  item.link == navigation.pathname ? "bg-[#444CE7]" : "hover:bg-[#444CE7]"
                }`}>
                <Link
                  to={item.link}
                  className={`w-full overflow-hidden flex gap-3 py-2.5 transition-all font-inter ${
                    collapsed ? "px-[12px]" : "px-4"
                  }`}
                  data-tooltip-id={item.label}
                  data-tooltip-content={item.ToolTipValue}>
                  <span className="font-medium">{item.icon}</span>
                  <span
                    className={`transition-all inline-block text-nowrap ${
                      collapsed ? "px-4 opacity-0" : "px-0 opacity-100 text-base font-medium"
                    }`}>
                    {item.name}
                  </span>
                </Link>
                {/* Tooltip */}
                {item.showToolTip && <Tooltip id={item.label} opacity={"100"} className="z-[15] bg-white" />}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full">
          <button
            className={`w-full flex items-center border-t-[1px] border-t-slate-500 backdrop-blur bg-[#00000029] hover:bg-[#00000050] transition-all duration-500  py-3 flex-nowrap overflow-hidden ${
              collapsed ? "px-4 justify-start" : "px-6 justify-center"
            }`}
            onClick={handelSidebarCollapse}>
            <RiArrowLeftDoubleFill
              className={`w-6 h-6 min-w-6 min-h-6 transition-all duration-500 ${collapsed ? "rotate-180" : "rotate-0"}`}
            />

            <span
              className={`capitalize font-medium transition-all duration-300 ${
                collapsed ? "px-6 opacity-0" : "px-2 opacity-100"
              }`}>
              collapse
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
