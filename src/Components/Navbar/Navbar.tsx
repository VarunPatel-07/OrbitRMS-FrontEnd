import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import OrbitRMSLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';

import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { classNames } from '../../Helper/HelperFunctions';
import EmployeeProfilePicture from '../EmployeeProfilePicture';

interface NavbarProfileDropDownInterface {
  label: string;
  name: string;
  link: string;
  icon: React.ReactElement | null;
}

function Navbar() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const [showNavBarDropDown, setShowNavBarDropDown] = useState<boolean>(false);
  const NavbarProfileDropDown: NavbarProfileDropDownInterface[] = [
    {
      icon: null,
      label: 'my-profile',
      name: 'My Profile',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}/employee-details`,
    },
    {
      icon: null,
      label: 'logged-in-devices',
      name: 'Logged In Devices',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}`,
    },
    {
      icon: null,
      label: 'raise-issue',
      name: 'Raise Issue',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}`,
    },
  ];

  return (
    <div className='w-full min-h-14 flex items-center justify-between border-b border-b-black/20'>
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
            className='flex'
            onClick={() => setShowNavBarDropDown(!showNavBarDropDown)}
          >
            <EmployeeProfilePicture
              width={40}
              height={40}
              profilePicture={
                GlobalStateProvider?.user?.personal_info?.profile_picture
              }
            />
          </button>
        </div>

        <div
          className={classNames(
            'absolute top-full right-0 z-50 mr-4 mt-2.5 transition-all duration-150 origin-top',
            {
              'scale-y-0 opacity-0': !showNavBarDropDown,
              'scale-y-100 opacity-100': showNavBarDropDown,
            }
          )}
        >
          <ul className='w-full h-full bg-white border border-black/15 shadow-xl rounded-lg overflow-hidden'>
            {NavbarProfileDropDown.map((item, index) => (
              <li className='w-full' key={index}>
                <Link
                  className={classNames(
                    'text-black inline-block whitespace-nowrap pl-5 pr-5 py-2 hover:bg-slate-50 w-full',
                    {
                      'border-b border-b-black/15':
                        index + 1 != NavbarProfileDropDown.length,
                    }
                  )}
                  to={item?.link}
                  onClick={() => setShowNavBarDropDown(!showNavBarDropDown)}
                >
                  <span className='flex items-center justify-between gap-3'>
                    {item?.icon}
                    <span className='font-inter text-sm'>{item?.name}</span>
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
