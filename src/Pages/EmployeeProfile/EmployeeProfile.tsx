import { useContext, useEffect, useRef, useState } from 'react';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';

import { HandelPathFunction } from '../../App';
import Breadcrumbs from '../../common/Breadcrumbs';
import Button from '../../common/Button';
import EmployeeProfilePicture from '../../Components/EmployeeProfilePicture';
import ResetPasswordLinkModal from '../../Components/Modal/ResetPasswordLinkModal';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleFetchApi,
  multiplePostApi,
} from '../../Helper/api/multipleAPI';
import {
  classNames,
  getDataFromLocalStorage,
  getTotalExperience,
} from '../../Helper/HelperFunctions';
import ProtectedRoute from '../../Helper/ProtectedRoute';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  EmployeeProfileActionArrayInterface,
  UserProfileInformationInterface,
} from '../../interface/AddEditUserProfileInterFace';
import EmployeeDetails from './EmployeeDetails';
import LoggedInDevices from './LoggedInDevices';

// The initialState Of The Data
const initialState: UserProfileInformationInterface = {
  account_status: true,
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
      id: '',
      role_name: '',
    },
    employee_email: '',
    employee_code: '',
    employee_type: '',
    joining_date: '',
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
        contact_id: '',
        id: '',
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
        family_info_id: '',
        id: '',
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
      user_id: '',
    },
  ],
};

function EmployeeProfile() {
  const { id: employee_id } = useParams();
  const navigation = useLocation();
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  // * ------- Some Of The Reference That Are Used In This Page ---------------
  //
  //
  const useEffectRef = useRef('');

  //
  // * ----- The Definition Of The State Start From Here
  //

  const [data, setData] =
    useState<UserProfileInformationInterface>(initialState);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [showResetPasswordModal, setShowResetPasswordModal] =
    useState<boolean>(false);

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
        setIsFetching(false);
      } else {
        setIsFetching(false);
      }
    },
    100
  );
  //
  //* ------ Ending Of The Function With Debounce Used For The Data Fetching -----

  const proceedSendResetLinkWithDebounce = useDebounce(
    async (mail: string, callBack: (success: boolean) => void) => {
      const endPointArr: endpointObject[] = [
        {
          endPoint: `auth/employee/password/reset-instructions?user-id=${employee_id}`,
          protected: true,
          data: { email: mail },
        },
      ];
      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      callBack(res?.success);
      handelNotification(res, 'top-right');
    }
  );

  const handelClickOnProceedButton = (
    mail: string,
    callBack: (success: boolean) => void
  ) => {
    proceedSendResetLinkWithDebounce(mail, callBack);
  };

  useEffect(() => {
    if (employee_id && useEffectRef.current !== employee_id) {
      useEffectRef.current = employee_id;
      setIsFetching(true);
      fetchTheUsersProfileInfoWithDebounce(employee_id);
    }
  }, [employee_id, fetchTheUsersProfileInfoWithDebounce]);

  const segments = location.pathname.split('/').filter(Boolean);

  const parentSection = segments[1];
  const childSection = segments[2];

  const permissionData = GlobalStateProvider.roles_permissions.permissions
    .find((item) => item.module_label == parentSection)
    ?.sub_modules?.find(
      (item) => item?.module_label == childSection?.replace('-', '_')
    );

  const employeeListingPermission =
    GlobalStateProvider.roles_permissions.permissions
      .find((item) => item.module_label == parentSection)
      ?.sub_modules?.find((item) => item?.module_label == 'employee_listing');

  const EmployeeProfileActionArray: EmployeeProfileActionArrayInterface[] = [
    ...(permissionData?.sub_modules?.find(
      (item) => item?.module_label == 'employee_details'
    )?.is_active &&
    permissionData?.sub_modules
      ?.find((item) => item?.module_label == 'employee_details')
      ?.permissions?.some((item) => item.label == 'view' && item.is_allowed)
      ? [
          {
            link: `/${organization}/employees/employee-profile/${employee_id}/employee-details`,
            classNames:
              'font-inter text-black font-medium capitalize text-sm px-3 py-1.5 border border-black/15 rounded-md h-full inline-block',
            label: 'employee_details',
            title: 'Employee Details',
          },
        ]
      : []),

    ...(employee_id === GlobalStateProvider?.user?.personal_info?.user_id ||
    (permissionData?.sub_modules?.find(
      (item) => item?.module_label == 'logged_in_device'
    )?.is_active &&
      permissionData?.sub_modules
        ?.find((item) => item?.module_label == 'logged_in_device')
        ?.permissions?.some((item) => item.label == 'view' && item.is_allowed))
      ? [
          {
            link: `/${organization}/employees/employee-profile/${employee_id}/logged-in-device`,
            classNames:
              'font-inter text-black font-medium capitalize text-sm px-3 py-1.5 border border-black/15 rounded-md h-full inline-block',
            label: 'logged_in_device',
            title: 'Logged In Device',
          },
        ]
      : []),
  ];

  const BreadcrumbsObjects = [
    {
      name: 'Home',
      label: 'home',
      link: `/${organization}/dashboard`,
    },
    ...(!employeeListingPermission ||
    employeeListingPermission.is_active ||
    employeeListingPermission?.permissions?.some(
      (item) => item?.label == 'view' && item?.is_allowed
    )
      ? [
          {
            name: 'Employee Listing',
            label: 'employee_listing',
            link: `/${organization}/employees/employee-listing`,
          },
        ]
      : []),

    {
      name: 'Employee Profile',
      label: 'employee-profile',
      link: `/${organization}/employees/employee-profile/${employee_id}/employee-details`,
    },
  ];

  if (
    !permissionData ||
    !permissionData?.sub_modules?.find(
      (item) => item?.module_label == 'employee_details'
    )?.is_active ||
    !permissionData?.sub_modules
      ?.find((item) => item?.module_label == 'employee_details')
      ?.permissions?.some((item) => item.label == 'view' && item.is_allowed)
  )
    return <HandelPathFunction />;
  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full h-full'>
        <div className='w-full h-full flex items-stretch justify-start'>
          <div className='w-[30%] max-w-[350px] bg-white border-r border-r-black/20 overflow-auto max-h-[calc(100vh-60px)] hide-scrollbar'>
            <div className='w-full h-full pt-10 pb-4'>
              <div className='w-full h-full flex flex-col items-center justify-between'>
                <div className='w-full flex flex-col'>
                  <div className='flex flex-col items-center justify-start gap-5 px-2 w-full pb-5 border-b border-b-black/20'>
                    <EmployeeProfilePicture
                      width={160}
                      height={160}
                      profilePicture={data?.personal_info?.profile_picture}
                      isLoading={isFetching}
                    />

                    <div className='flex flex-col items-center justify-start gap-2 w-full'>
                      {isFetching ? (
                        <Skeleton height={20} width={200} />
                      ) : (
                        <p className='text-base text-black font-inter font-medium max-w-[90%] text-ellipsis overflow-hidden text-center m-auto'>
                          {data?.personal_info?.full_name
                            ? data?.personal_info?.full_name
                            : data?.personal_info?.first_name +
                              ' ' +
                              data?.personal_info?.middle_name +
                              ' ' +
                              data?.personal_info?.last_name}
                        </p>
                      )}

                      {isFetching ? (
                        <Skeleton height={20} width={160} />
                      ) : (
                        <p className='text-sm text-black/60 font-inter font-medium max-w-[90%] text-ellipsis overflow-hidden text-center m-auto'>
                          {data?.employee_info?.designation || '-'}
                        </p>
                      )}

                      {isFetching ? (
                        <Skeleton height={26} width={110} borderRadius={8} />
                      ) : (
                        <p className='text-xs text-black bg-slate-50 py-1 px-3 border border-black/15 font-inter font-medium w-fit rounded-lg max-w-[90%] text-ellipsis overflow-hidden text-center m-auto mt-1'>
                          {data?.employee_info?.department || '-'}
                        </p>
                      )}
                    </div>
                    {permissionData?.sub_modules?.find(
                      (item) => item?.module_label == 'employee_details'
                    )?.is_active &&
                      permissionData?.sub_modules
                        ?.find(
                          (item) => item?.module_label == 'employee_details'
                        )
                        ?.permissions?.some(
                          (item) => item.label == 'edit' && item.is_allowed
                        ) && (
                        <>
                          {isFetching ? (
                            <Skeleton
                              height={42}
                              width={220}
                              borderRadius={8}
                            />
                          ) : (
                            <Button
                              type='button'
                              className='font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize'
                              onClick={() =>
                                setShowResetPasswordModal(
                                  !showResetPasswordModal
                                )
                              }
                            >
                              Send Reset Instructions
                            </Button>
                          )}
                        </>
                      )}
                  </div>
                  <div className='px-4 py-5 border-b border-b-black/20'>
                    <div className='flex items-center justify-between'>
                      <p className='text-black text-sm font-medium font-inter'>
                        Account Status:
                      </p>
                      {isFetching ? (
                        <Skeleton height={30} width={70} borderRadius={100} />
                      ) : (
                        <>
                          {data?.account_status ? (
                            <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-full'>
                              Active
                            </span>
                          ) : (
                            <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-full'>
                              Inactive
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className='px-4 py-5 border-b border-b-black/20'>
                    <div className='flex items-center justify-between'>
                      <p className='text-black text-sm font-medium font-inter'>
                        Experience In {data?.employee_info?.organization_name}:
                      </p>
                      {isFetching ? (
                        <Skeleton height={20} width={70} borderRadius={4} />
                      ) : (
                        <span className='text-sm font-medium font-inter text-black text-nowrap rounded-full'>
                          {getTotalExperience(
                            data?.employee_info?.joining_date
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='px-4 py-5'>
                    <div className='flex items-center justify-between'>
                      <p className='text-black text-sm font-medium font-inter'>
                        Employee Type:
                      </p>
                      {isFetching ? (
                        <Skeleton height={20} width={70} borderRadius={4} />
                      ) : (
                        <span className='text-sm font-medium font-inter text-black text-nowrap rounded-full'>
                          {data?.employee_info?.employee_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className='w-full py-4 border-t border-t-black/20 px-4 flex-grow'>
                  <p className='text-sm text-black/60 font-inter font-medium pb-2'>
                    Social Links
                  </p>
                  <div className='flex flex-wrap items-stretch gap-1.5 justify-start'>
                    {isFetching ? (
                      <>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Skeleton
                            height={38}
                            width={38}
                            borderRadius={6}
                            key={index}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        {data?.social_link?.map((link) => (
                          <a
                            key={link?.id}
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-[70%] flex-grow overflow-hidden'>
            <div className='w-full h-full relative'>
              <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
              <div className='w-full absolute top-[37px]'>
                <div className='w-full bg-white px-3 py-2.5 border-b border-black/20'>
                  <div className='flex items-stretch justify-between gap-4'>
                    <div className='flex items-center justify-start flex-grow gap-4'>
                      {isFetching ? (
                        <>
                          {Array?.from({ length: 3 }).map((_, index) => (
                            <Skeleton
                              height={35}
                              width={140}
                              borderRadius={6}
                              key={index}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {EmployeeProfileActionArray?.map((data, index) => {
                            return (
                              <Link
                                to={data?.link}
                                key={index}
                                className={classNames(`${data?.classNames}`, {
                                  'bg-[#EEF4FF] border border-[#C7D7FE] !text-[#3538CD]':
                                    navigation.pathname?.startsWith(data?.link),
                                })}
                              >
                                {data?.title}
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                    {(employee_id ==
                      GlobalStateProvider?.user?.personal_info?.user_id ||
                      (permissionData?.sub_modules?.find(
                        (item) => item?.module_label == 'employee_details'
                      )?.is_active &&
                        permissionData?.sub_modules
                          ?.find(
                            (item) => item?.module_label == 'employee_details'
                          )
                          ?.permissions?.some(
                            (item) => item.label == 'edit' && item.is_allowed
                          ))) && (
                      <div className='w-fit'>
                        {isFetching ? (
                          <Skeleton height={35} width={140} borderRadius={6} />
                        ) : (
                          <Link
                            to={`/${organization}/employees/manage/edit/${employee_id}`}
                            className='font-inter capitalize text-sm px-3 py-1.5 h-full inline-block rounded-md text-white font-medium bg-[var(--them-green-color)]'
                          >
                            Edit Profile
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='w-full h-[calc(100vh-60px)] pt-28 overflow-auto hide-scrollbar px-6'>
                <Routes>
                  {['/', '/employee-details'].map((eachPath, index) => (
                    <Route
                      path={eachPath}
                      key={index}
                      element={
                        <ProtectedRoute
                          element={
                            <EmployeeDetails
                              data={data}
                              isFetching={isFetching}
                              organizationInfo={
                                GlobalStateProvider?.organization
                              }
                            />
                          }
                        />
                      }
                    />
                  ))}

                  {(employee_id ===
                    GlobalStateProvider?.user?.personal_info?.user_id ||
                    (permissionData?.sub_modules?.find(
                      (item) => item?.module_label == 'logged_in_device'
                    )?.is_active &&
                      permissionData?.sub_modules
                        ?.find(
                          (item) => item?.module_label == 'logged_in_device'
                        )
                        ?.permissions?.some(
                          (item) => item.label == 'view' && item.is_allowed
                        ))) && (
                    <Route
                      path={'/logged-in-device'}
                      element={
                        <ProtectedRoute
                          element={
                            <LoggedInDevices
                              organizationInfo={
                                GlobalStateProvider?.organization
                              }
                            />
                          }
                        />
                      }
                    />
                  )}
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
      {permissionData?.sub_modules?.find(
        (item) => item?.module_label == 'employee_details'
      )?.is_active &&
        permissionData?.sub_modules
          ?.find((item) => item?.module_label == 'employee_details')
          ?.permissions?.some(
            (item) => item.label == 'edit' && item.is_allowed
          ) && (
          <ResetPasswordLinkModal
            isOpen={showResetPasswordModal}
            setIsOpen={setShowResetPasswordModal}
            handelSubmit={handelClickOnProceedButton}
            companyEmail={data?.employee_info?.employee_email}
            personalEmail={data?.personal_contact_info?.personal_email}
          />
        )}
    </SkeletonTheme>
  );
}

export default EmployeeProfile;
