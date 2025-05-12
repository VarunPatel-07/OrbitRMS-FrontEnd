import { useContext, useEffect, useRef, useState } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import Breadcrumbs from '../../common/Breadcrumbs';
import EmployeeProfilePicture from '../../Components/EmployeeProfilePicture';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import { endpointObject, multipleFetchApi } from '../../Helper/api/multipleAPI';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import { useDebounce } from '../../Hooks/useDebounce';
import { UserProfileInformationInterface } from '../../interface/AddEditUserProfileInterFace';
import EmployeeDetails from './EmployeeDetails';
import EmployeeProfileSkeletonLoader from '../../Components/Loader/EmployeeProfileSkeletonLoader';

// The initialState Of The Data
const initialState: UserProfileInformationInterface = {
  personal_info: {
    first_name: '',
    middle_name: '',
    last_name: '',
    full_name: '',
    profile_picture: '',
    gender: '',
    date_of_birth: '',
    blood_group: '',
    about: '',
  },
  employee_info: {
    status: '',
    organization_name: '',
    department: '',
    designation: '',
    reporting_manager: {
      id: '',
      first_name: '',
      last_name: '',
      middle_name: '',
      full_name: '',
      gender: '',
      profile_picture: '',
      profile_picture_bg: '',
    },
    employee_role: {
      role_id: '',
      role_name: '',
    },
    employee_email: '',
    employee_code: '',
  },
  personal_contact_info: {
    personal_email: '',
    mobile_number: '',
    country_info: '',
    emergency_contacts: [
      {
        emergency_contact_name: '',
        emergency_contact_number: '',
        emergency_contact_country_info: '',
      },
    ],
  },
  family_info: {
    father_name: '',
    mother_name: '',
    marital_status: '',
    children: [
      {
        child_date_of_birth: '',
        child_name: '',
      },
    ],
  },
  current_address: {
    address: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
    country_code: '',
  },
  same_as_current_address: true,
  permanent_address: {
    address: '',
    country: '',
    city: '',
    state: '',
    zip_code: '',
    country_code: '',
  },
  social_link: [
    {
      icon: '',
      link: '',
      name: '',
      target_blank: true,
      id: '',
    },
  ],
};

function EmployeeProfile() {
  const { id: employee_id } = useParams();
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const [loading, setLoading] = useState<boolean>(false);

  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug;

  const BreadcrumbsObjects = [
    {
      name: 'Home',
      label: 'home',
      link: `/${organization}/dashboard`,
    },
    {
      name: 'Employees',
      label: 'employees',
      link: `/${organization}/config/project-status`,
    },
    {
      name: 'Employee Profile',
      label: 'employee-profile',
      link: `/${organization}/employee-profile/${employee_id}`,
    },
  ];

  // * ------- Some Of The Reference That Are Used In This Page ---------------
  //
  //
  const useEffectRef = useRef(false);

  //
  // * ----- The Definition Of The State Start From Here
  //

  const [data, setData] =
    useState<UserProfileInformationInterface>(initialState);

  //
  // * ----- The Definition Of The State  END  From Here
  //

  // This are The Bunch Of Function That are Used For Fetching The Data With Debounce
  // * ------ Start Of The Function With Debounce Used For The Data Fetching -----
  //
  const fetchTheUsersProfileInfoWithDebounce = useDebounce(
    async (id: string) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `employee/fetch-profile?employee_id=${id}`,
          protected: true,
        },
      ];

      const response = await multipleFetchApi(endPointArr);
      const res = response[0];

      if (res?.success) {
        setData(res?.data);
      }
      setLoading(false);
    },
    100
  );
  //
  //* ------ Ending Of The Function With Debounce Used For The Data Fetching -----
  //

  useEffect(() => {
    if (!useEffectRef.current) {
      useEffectRef.current = true;
      setLoading(true);
      fetchTheUsersProfileInfoWithDebounce(employee_id);
    }
  }, []);

  return (
    <div className='w-full h-full'>
      <div className='w-full h-full flex items-stretch justify-start'>
        <div className='w-[30%] max-w-[300px] bg-white border-r border-r-black/20'>
          <div className='w-full h-full pt-10 pb-4'>
            <div className='w-full h-full flex flex-col items-center justify-between gap-7'>
              <div className='flex flex-col items-center justify-start gap-5 w-full px-2'>
                <EmployeeProfilePicture width={160} height={160} />
                <div className='flex flex-col items-center justify-start gap-2 w-full'>
                  <p className='text-base text-black font-inter font-medium max-w-[90%] text-ellipsis overflow-hidden text-center m-auto'>
                    {data?.personal_info?.full_name}
                  </p>
                  <p className='text-sm text-black/60 font-inter font-medium max-w-[90%] text-ellipsis overflow-hidden text-center m-auto'>
                    {data?.employee_info?.designation}
                  </p>
                  <p className='text-xs text-black bg-slate-50 py-1 px-3 border border-black/15 font-inter font-medium w-fit rounded-lg max-w-[90%] text-ellipsis overflow-hidden text-center m-auto mt-1'>
                    {data?.employee_info?.department}
                  </p>
                </div>
                <button className='font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize'>
                  Send Reset Instructions
                </button>
              </div>
              <div className='w-full py-4 border-t border-t-black/20 px-2'>
                <p className='text-sm text-black/60 font-inter font-medium pb-2'>
                  Social Links
                </p>
                <div className='flex flex-wrap items-stretch'>
                  {data?.social_link?.map((link) => (
                    <a
                      href={link?.link}
                      target={link?.target_blank ? '_blank' : '_self'}
                      className='p-2 border border-black/20 flex rounded-md hover:bg-black/10 transition-all'
                    >
                      <span
                        className='text-black w-5 h-5 inline-block full-width-svg'
                        dangerouslySetInnerHTML={{ __html: link?.icon }}
                      ></span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-[70%] flex-grow'>
          <div className='w-full  h-full relative '>
            <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
            {loading ? (
              <EmployeeProfileSkeletonLoader />
            ) : (
              <>
                <div className='w-full'></div>
                <div className='w-full h-[calc(100vh-60px)] pt-16 overflow-auto px-6 hide-scrollbar'>
                  <Routes>
                    {['/', '/employee-details'].map((eachPath, index) => (
                      <Route
                        path={eachPath}
                        key={index}
                        element={
                          <ProtectedRoute
                            element={<EmployeeDetails data={data} />}
                          />
                        }
                      />
                    ))}
                  </Routes>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
