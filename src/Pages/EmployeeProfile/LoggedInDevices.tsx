import { useContext, useEffect, useRef, useState } from 'react';
import { CgLaptop } from 'react-icons/cg';
import { HiOutlineChip } from 'react-icons/hi';
import { IoMdTime } from 'react-icons/io';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Loader from '../../common/Loader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleDeleteApi,
  multipleFetchApi,
} from '../../Helper/api/multipleAPI';
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
                  className='w-full h-auto p-5 bg-white border border-black/20 rounded-lg'
                >
                  <div className='flex items-center justify-between gap-3 pb-5 border-b border-black/20'>
                    <div className='flex items-center justify-start gap-2'>
                      <CgLaptop className='w-8 h-8 text-black' />
                      <p className='font-inter text-base text-black font-medium flex items-center justify-start gap-2'>
                        <span className='inline-block'>
                          {info?.device_type}
                        </span>
                        <span className='inline-block'>{info?.browser}</span>
                      </p>
                    </div>
                    {info?.id === currentSessionId ? (
                      <span className='text-sm bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] px-2 rounded-md py-1 font-medium'>
                        Current Device
                      </span>
                    ) : (
                      <button
                        className='px-3.5 py-2 font-inter text-base text-black/70 font-medium border border-black/20 rounded-md hover:bg-black hover:text-white transition-all duration-150 disabled:bg-black disabled:cursor-not-allowed disabled:opacity-85'
                        onClick={() => handelSignOutButton(info?.id)}
                        disabled={
                          signOutLoader && deletingSessionId == info?.id
                        }
                      >
                        {signOutLoader && deletingSessionId == info?.id ? (
                          <span className='w-6 h-5 flex items-center justify-center ml-1'>
                            <Loader loaderText='' />
                          </span>
                        ) : (
                          'Sign Out'
                        )}
                      </button>
                    )}
                  </div>
                  <div className='pt-5 flex flex-col items-start justify-start gap-4'>
                    <div className='flex items-center justify-start gap-2'>
                      <HiOutlineChip className='w-5 h-5 text-black/80' />
                      <p className='font-inter text-sm text-black/80 font-medium flex items-center justify-start gap-2'>
                        {info?.os}
                      </p>
                    </div>
                    <div className='flex items-center justify-start gap-2'>
                      <IoMdTime className='w-5 h-5 text-black/80' />
                      <p className='font-inter text-sm text-black/80 font-medium flex items-center justify-start gap-2'>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default LoggedInDevices;
