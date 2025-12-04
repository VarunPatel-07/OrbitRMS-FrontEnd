import { useContext, useEffect, useRef, useState } from 'react';
import { CgLaptop } from 'react-icons/cg';
import { HiOutlineChip } from 'react-icons/hi';
import { IoMdTime } from 'react-icons/io';
import { IoLocationOutline } from 'react-icons/io5';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Loader from '../../common/Loader';
import { MetaTitleDescription } from '../../constant/MetaTitleDescription';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
} from '../../Helper/api/multipleAPI';
import HelmetSeo from '../../Helper/HelmetSeo';
import { formateDate } from '../../Helper/HelperFunctions';
import { useDebounce } from '../../Hooks/useDebounce';
import {
  Organization,
  UserSessionsInterFace,
} from '../../interface/UserProfileInterface';

function LoggedInDevices(props: { organizationInfo: Organization }) {
  const { organizationInfo } = props;
  const useEffectRef = useRef(false);

  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  // Some Of The State To Store The Data
  const [data, setData] = useState<UserSessionsInterFace[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [signOutLoader, setSignOutLoader] = useState<boolean>(false);
  const [deletingSessionId, setDeletingSessionsId] = useState<string>('');

  const fetchLoggedInDeviceWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `auth/fetch-sessions`,
        protected: true,
      },
    ];

    const response = await multipleFetchApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      setLoading(false);
      setData(res?.data);
      if (res?.current_session_id) setCurrentSessionId(res?.current_session_id);
    } else {
      setLoading(false);
    }
  }, 100);

  const deleteSessionWithDebounce = useDebounce(async (session_id: string) => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: `auth/delete-session?session_id=${session_id}`,
        protected: true,
      },
    ];

    const response = await multipleDeleteApi(endPointArr);
    const res = response[0];
    if (res?.success) {
      handelNotification(res, 'top-right');
      setSignOutLoader(false);
      setLoading(true);
      setDeletingSessionsId('');
      fetchLoggedInDeviceWithDebounce();
    } else {
      setSignOutLoader(false);
    }
  }, 100);

  const handelSignOutButton = (session_id: string) => {
    setSignOutLoader(true);
    setDeletingSessionsId(session_id);
    deleteSessionWithDebounce(session_id);
  };

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchLoggedInDeviceWithDebounce();
  }, [fetchLoggedInDeviceWithDebounce]);

  return (
    <>
      <HelmetSeo
        Title={MetaTitleDescription.employeeProfileSessionLogs.title}
        Content={MetaTitleDescription.employeeProfileSessionLogs.description}
      />
      <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
        <div className='w-full h-full pb-4'>
          <div className='w-full h-full overflow-auto hide-scrollbar'>
            {loading ? (
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className='w-full h-auto p-5 bg-white border border-black/20 rounded-lg'
                  >
                    <div className='flex items-center justify-between gap-3 pb-5 border-b border-black/20'>
                      <div className='flex items-center justify-start gap-2'>
                        <Skeleton width={35} height={35} circle />
                        <Skeleton width={150} height={22} />
                      </div>
                      <Skeleton width={100} height={38} />
                    </div>
                    <div className='pt-5 flex flex-col items-start justify-start gap-4'>
                      <div className='flex items-center justify-start gap-2'>
                        <Skeleton width={15} height={15} circle />
                        <Skeleton width={300} height={15} />
                      </div>
                      <div className='flex items-center justify-start gap-2'>
                        <Skeleton width={15} height={15} circle />
                        <Skeleton width={300} height={15} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                {data.map((info, index) => (
                  <div
                    key={index}
                    className='w-full bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden'
                  >
                    <div className='p-6'>
                      <div className='flex items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-200'>
                        <div className='flex items-center justify-start gap-3'>
                          <div className='p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg'>
                            <CgLaptop className='w-6 h-6 text-indigo-600' />
                          </div>
                          <div>
                            <p className='font-semibold text-lg text-slate-900 flex items-center gap-2'>
                              <span>{info?.device_type}</span>
                              <span className='text-slate-400'>•</span>
                              <span className='text-slate-600'>
                                {info?.browser}
                              </span>
                            </p>
                          </div>
                        </div>
                        {info?.id === currentSessionId ? (
                          <span className='text-sm bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5'>
                            <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></span>
                            Current Device
                          </span>
                        ) : (
                          <button
                            className='px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-200 disabled:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-70 min-w-[100px]'
                            onClick={() => handelSignOutButton(info?.id)}
                            disabled={
                              signOutLoader && deletingSessionId == info?.id
                            }
                          >
                            {signOutLoader && deletingSessionId == info?.id ? (
                              <span className='w-6 h-5 flex items-center justify-center'>
                                <Loader loaderText='' />
                              </span>
                            ) : (
                              'Sign Out'
                            )}
                          </button>
                        )}
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-150'>
                          <div className='p-2 bg-white rounded-md shadow-sm'>
                            <HiOutlineChip className='w-5 h-5 text-slate-600' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-xs text-slate-500 font-medium mb-0.5'>
                              Operating System
                            </p>
                            <p className='text-sm text-slate-900 font-semibold truncate'>
                              {info?.os}
                            </p>
                          </div>
                        </div>

                        {info.user_location_info !== null && (
                          <div className='flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-150'>
                            <div className='p-2 bg-white rounded-md shadow-sm'>
                              <IoLocationOutline className='w-5 h-5 text-slate-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-xs text-slate-500 font-medium mb-0.5'>
                                Location
                              </p>
                              <p className='text-sm text-slate-900 font-semibold truncate'>
                                {info.user_location_info.city}
                                <span className='text-slate-500 ml-1'>
                                  ({info.user_location_info.region})
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className='flex items-center gap-3 p-3 mt-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-150'>
                        <div className='p-2 bg-white rounded-md shadow-sm'>
                          <IoMdTime className='w-5 h-5 text-slate-600' />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs text-slate-500 font-medium mb-0.5'>
                            Last Active
                          </p>
                          <p className='text-sm text-slate-900 font-semibold truncate'>
                            {formateDate(
                              info?.updated_at
                                ? info?.updated_at
                                : info?.created_at,
                              organizationInfo?.organization_settings
                                ?.default_dateformat,
                              true
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SkeletonTheme>
    </>
  );
}

export default LoggedInDevices;
