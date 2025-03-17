import { RiArrowRightSLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';

import {
  ConfigModuleSidebarInterface,
  ConfigSidebarMenuList,
} from './ConfigModuleSidebarList';

function ConfigSidebar() {
  const navigation = useLocation();
  return (
    <div className='w-full h-full bg-white'>
      <div className='w-full h-full flex flex-col items-start justify-start'>
        <div className='w-full bg-[#7fab98]/15 px-3.5 py-6 border-b border-b-black/15'>
          <h2 className='text-xl text-black font-inter font-semibold'>
            Config Module
          </h2>
        </div>
        <ul className='w-full h-full overflow-hidden'>
          {ConfigSidebarMenuList?.map((item: ConfigModuleSidebarInterface) => (
            <li
              key={item?.id}
              className={`border-b border-b-black/15 transition-all group ${
                navigation.pathname.includes(item?.link)
                  ? 'bg-[#7fab98]/45'
                  : 'hover:bg-[#7fab98]/10 bg-white'
              }`}
            >
              <Link
                to={item?.link}
                className={`flex items-center justify-between px-3.5 py-4 transition-all text-base ${navigation.pathname.includes(item?.link) ? 'text-black' : 'text-black/70 group-hover:text-black'}`}
              >
                <span className='font-medium font-inter'>{item?.name}</span>
                <span>
                  <RiArrowRightSLine className='text-2xl text-black/70' />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ConfigSidebar;
