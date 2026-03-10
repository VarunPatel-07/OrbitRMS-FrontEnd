import React, { useContext, useEffect, useRef, useState } from 'react';

import {
  HiOutlineDeviceMobile,
  HiOutlineLogout,
  HiOutlineUserCircle,
} from 'react-icons/hi';
import { Link } from 'react-router-dom';

import OrbitRMSLogo from '../../assets/Images/orbitrms-final-logo-transperent.webp';
import Loader from '../../common/Loader';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { handelClickLogoutBtn } from '../../Helper/api/api';
import {
  classNames,
  getDataFromLocalStorage,
} from '../../Helper/HelperFunctions';
import EmployeeProfilePicture from '../EmployeeProfilePicture';

interface NavbarProfileDropDownInterface {
  label: string;
  name: string;
  link: string;
  icon: React.ReactElement;
  className: string;
  type: 'link' | 'button';
}

function Navbar() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const dropDownModalRef = useRef<HTMLDivElement>(null);

  const [showNavBarDropDown, setShowNavBarDropDown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const handelClickOnLogoutButton = () => {
    setLoading(true);
    handelClickLogoutBtn(setLoading);
  };

  const NavbarProfileDropDown: NavbarProfileDropDownInterface[] = [
    {
      icon: <HiOutlineUserCircle className='text-2xl' />,
      label: 'my-profile',
      name: 'My Profile',
      link: `/${organization}/employees/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}/employee-details`,
      className: '',
      type: 'link',
    },
    {
      icon: <HiOutlineDeviceMobile className='text-2xl' />,
      label: 'logged-in-devices',
      name: 'Logged In Devices',
      link: `/${organization}/employees/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}/logged-in-device`,
      className: '',
      type: 'link',
    },
    {
      icon: <HiOutlineLogout className='text-2xl' />,
      label: 'log-out',
      name: 'Log Out',
      link: `/${organization}/employee-profile/${GlobalStateProvider?.user?.employee_info?.user_id}`,
      className: 'text-red-600',
      type: 'button',
    },
  ];

  useEffect(() => {
    const handelClickOutSide = (event: MouseEvent) => {
      if (
        dropDownModalRef.current &&
        !dropDownModalRef.current.contains(event.target as Node)
      ) {
        setShowNavBarDropDown(false);
      }
    };
    document.addEventListener('mousedown', handelClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSide);
    };
  });

  return (
    <div className='w-full min-h-14 bg-white flex items-center justify-between border-b border-b-black/20'>
      <div className='h-full flex w-fit gap-3'>
        <div className='w-fit pl-4 flex items-center justify-center'>
          <img
            src={OrbitRMSLogo}
            width={150}
            className='w-36 h-10 object-cover'
            alt='OrbitRMS Logo'
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
          ref={dropDownModalRef}
        >
          <ul className='w-full h-full bg-white border border-black/15 shadow-xl rounded-lg overflow-hidden'>
            {NavbarProfileDropDown.map((item, index) => (
              <li className='w-full' key={index}>
                {item?.type == 'link' ? (
                  <Link
                    className={classNames(
                      'text-black inline-block whitespace-nowrap px-3 py-2 hover:bg-slate-50 w-full',
                      {
                        'border-b border-b-black/15':
                          index + 1 != NavbarProfileDropDown.length,
                      }
                    )}
                    to={item?.link}
                    onClick={() => setShowNavBarDropDown(!showNavBarDropDown)}
                  >
                    <span
                      className={`flex items-center justify-start gap-3 ${item?.className}`}
                    >
                      {item?.icon}
                      <span className='font-inter text-sm font-medium'>
                        {item?.name}
                      </span>
                    </span>
                  </Link>
                ) : (
                  <button
                    className={classNames(
                      'text-black inline-block whitespace-nowrap px-3 py-2 hover:bg-slate-50 w-full disabled:opacity-65',
                      {
                        'border-b border-b-black/15':
                          index + 1 != NavbarProfileDropDown.length,
                      }
                    )}
                    onClick={handelClickOnLogoutButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className={`w-fit flex items-start justify-start ${item?.className}`}
                      >
                        <Loader loaderText='Logging Out...' theme='dark' />
                      </span>
                    ) : (
                      <span
                        className={`flex items-center justify-start gap-3 ${item?.className}`}
                      >
                        {item?.icon}
                        <span className='font-inter text-sm font-medium'>
                          {item?.name}
                        </span>
                      </span>
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
