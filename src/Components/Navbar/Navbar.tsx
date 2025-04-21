import React, { useContext, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import OrbitRMSLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { classNames } from '../../Helper/HelperFunctions';

interface NavbarProfileDropDownInterface {
  label: string;
  name: string;
  link: string;
  icon: React.ReactElement;
}

function Navbar() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const [showNavBarDropDown, setShowNavBarDropDown] = useState<boolean>(false);
  const NavbarProfileDropDown: NavbarProfileDropDownInterface[] = [
    {
      icon: <FiPlus />,
      label: 'my-profile',
      name: 'My Profile',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_url.split('https://orbitrms.com/')[1]}/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}`,
    },
  ];

  return (
    <div className='w-full min-h-14 flex items-center justify-between border-b border-b-black/15'>
      <div className='h-full flex w-fit gap-3'>
        <div className='w-fit pl-4 flex items-center justify-center'>
          <img
            src={OrbitRMSLogo}
            width={150}
            className='w-36 h-10 object-cover'
            alt=''
          />
        </div>
      </div>
      <div className='w-fit relative'>
        <div className='profile-picture pr-4'>
          <button
            className='w-10 h-10 bg-blue-500 rounded-full flex'
            onClick={() => setShowNavBarDropDown(!showNavBarDropDown)}
          ></button>
        </div>

        <div className='absolute top-full right-0 z-50 mr-4 mt-2'>
          <ul
            className={classNames(
              'w-full h-full bg-gray-200 shadow-lg rounded-lg overflow-hidden transition-all duration-150 origin-top',
              {
                'scale-y-0 opacity-0': !showNavBarDropDown,
                'scale-y-100 opacity-100': showNavBarDropDown,
              }
            )}
          >
            {NavbarProfileDropDown.map((item, index) => (
              <li className='w-full' key={index}>
                <Link
                  className='text-black inline-block whitespace-nowrap pl-3 pr-5 py-2 hover:bg-slate-50'
                  to={item?.link}
                  onClick={() => setShowNavBarDropDown(!showNavBarDropDown)}
                >
                  <span className='flex items-center justify-between gap-3'>
                    {item?.icon}
                    <span>{item?.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
