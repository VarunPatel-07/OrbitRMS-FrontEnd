import { useContext, useState } from 'react';

import { RiArrowLeftDoubleFill } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '@/contexts/globalState/GlobalStateContectApi';
import { SidebarMenuItemInterface } from '@/interface/Global.interface';

import { SidebarMenuItems } from '@/components/sideBar/SidebarMenuItems';

function SideBar() {
  const navigation = useLocation();
  const [collapsed, setCollapsed] = useState(true as boolean);

  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  const handelSidebarCollapse = () => {
    setCollapsed(!collapsed);
  };

  const SidebarMenuItemsArray = SidebarMenuItems(organization || '');

  const renderModuleIcon = (data: SidebarMenuItemInterface) => {
    return (
      <li
        key={data.id}
        className={`w-full group relative rounded-md transition-all ${
          navigation.pathname.includes(
            data?.name.toLocaleLowerCase() == 'config' ? '/config' : data?.link
          )
            ? 'bg-[#4f7a63] text-white'
            : 'hover:bg-[#4f7a63] text-black hover:text-white'
        }`}
      >
        <Link
          to={data?.queryString ? data.link + data?.queryString : data.link}
          className={`w-full overflow-hidden flex gap-3 py-2.5 font-inter ${
            collapsed ? 'px-[12px]' : 'px-4'
          }`}
          data-tooltip-id={data.label}
          data-tooltip-content={data.ToolTipValue}
        >
          <span className='font-medium min-w-6 w-6 h-6 flex items-center justify-center'>
            {data.icon}
          </span>
          <span
            className={`inline-block text-nowrap transition-opacity ${
              collapsed
                ? 'px-4 opacity-0'
                : 'px-0 opacity-100 text-base font-medium'
            }`}
          >
            {data.name}
          </span>
        </Link>
        {collapsed && (
          <>
            {/* Tooltip */}
            {data.showToolTip && (
              <Tooltip
                id={data.label}
                opacity={'100'}
                className='z-[100000] bg-white'
              />
            )}
          </>
        )}
      </li>
    );
  };

  return (
    <div
      className={`h-full bg-gradient-to-r from-blue-100/70 to-purple-100/70 text-white flex flex-col  transition-all duration-300 border-r border-r-black/20  ${
        collapsed ? 'max-w-[60px] min-w-[60px]' : 'min-w-[240px] max-w-[250px]'
      }`}
    >
      <div className='w-full h-full flex flex-col justify-between'>
        <div className='w-full'>
          <ul className='relative flex flex-col gap-2 px-[5px] pt-3'>
            {SidebarMenuItemsArray.map((data: SidebarMenuItemInterface) => {
              if (data?.id === 'employees') {
                const employeeModule =
                  GlobalStateProvider?.roles_permissions?.permissions
                    ?.find((module) => module.module_label === 'employees')
                    ?.sub_modules?.find(
                      (sub) => sub.module_label === 'employee_listing'
                    );

                const hasViewPermission = employeeModule?.permissions?.some(
                  (perm) => perm.label === 'view' && perm.is_allowed
                );

                if (
                  !employeeModule ||
                  !employeeModule.is_active ||
                  !hasViewPermission
                )
                  return null;

                return renderModuleIcon(data);
              } else {
                const module =
                  GlobalStateProvider?.roles_permissions?.permissions?.find(
                    (item) => item.module_label === data.id
                  );

                if (!module || !module.is_active) return null;

                return renderModuleIcon(data);
              }
            })}
          </ul>
        </div>
        <div className='w-full relative z-50'>
          <button
            className={`w-full flex items-center border-t border-t-black/20 backdrop-blur bg-gradient-to-r from-blue-200 to-purple-200 transition-all duration-500  py-3 flex-nowrap overflow-hidden text-black ${
              collapsed ? 'px-4 justify-start' : 'px-6 justify-center'
            }`}
            onClick={handelSidebarCollapse}
          >
            <RiArrowLeftDoubleFill
              className={`w-6 h-6 min-w-6 min-h-6 transition-all duration-500 ${collapsed ? 'rotate-180' : 'rotate-0'}`}
            />

            <span
              className={`capitalize font-medium transition-all duration-300 ${
                collapsed ? 'px-6 opacity-0' : 'px-2 opacity-100'
              }`}
            >
              collapse
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
