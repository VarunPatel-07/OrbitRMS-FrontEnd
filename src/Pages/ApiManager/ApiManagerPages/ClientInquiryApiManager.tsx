import { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineRedo } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Breadcrumbs from '../../../common/Breadcrumbs';
import Loader from '../../../common/Loader';
import {
  GlobalStateContext,
  GlobalStateContextApiProps,
} from '../../../Context/globalState/GlobalStateContectApi';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../../Context/Notification/NotificationContextApi';
import {
  endpointObject,
  multipleFetchApi,
  multiplePutApi,
} from '../../../Helper/api/multipleAPI';
import { useDebounce } from '../../../Hooks/useDebounce';
import { ClientInquiry } from '../../../interface/ClientInquiry';

function ClientInquiryApiManager() {
  const { GlobalStateProvider } = useContext(
    GlobalStateContext
  ) as GlobalStateContextApiProps;
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const initialState: ClientInquiry = {
    api_key: '',
    api_secrete: '',
    status: false,
    id: '',
    organization_id: '',
  };
  const useEffectRef = useRef(false);
  const [formData, setFormData] = useState<ClientInquiry>(initialState);
  const [loading, setLoading] = useState<boolean>(true);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [showApiSecrete, setShowApiSecrete] = useState<boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [reGenerateCredentialLoader, setReGenerateCredentialLoader] = useState<{
    api_key: boolean;
    api_secrete: boolean;
  }>({ api_key: false, api_secrete: false });

  const BreadcrumbsObjects = [
    {
      name: 'Home',
      label: 'home',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/dashboard`,
    },
    {
      name: 'Api Manager',
      label: 'api_manager',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/api-manager`,
    },
    {
      name: 'Client Inquiry',
      label: 'client_inquiry',
      link: `/${GlobalStateProvider?.organization?.general_info?.portal_slug}/api-manager/client-inquiry`,
    },
  ];

  const fetchApiStatusWithDebounce = useDebounce(async () => {
    const endpointArr: endpointObject[] = [
      { endPoint: 'client-inquires/status/fetch', protected: true },
    ];
    const response = await multipleFetchApi(endpointArr);
    const res = response[0];
    if (res?.success) {
      setFormData(res?.data);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, 1000);

  const handelEnableDisableWithDebounce = useDebounce(async () => {
    const endpointArr: endpointObject[] = [
      { endPoint: 'client-inquires/enable-api', protected: true },
    ];
    const response = await multiplePutApi(endpointArr);
    const res = response[0];
    handelNotification(res, 'top-right');
    if (res?.success) {
      setLoading(true);
      fetchApiStatusWithDebounce();
    }
    setButtonLoader(false);
  }, 100);
  const handelEnableDisableOnClick = () => {
    setButtonLoader(true);
    handelEnableDisableWithDebounce();
  };

  const handelReGenerateApiCredentialWithDebounce = useDebounce(
    async (id: string, field_name: 'api_secrete' | 'api_key') => {
      const endpointArr: endpointObject[] = [
        {
          endPoint: `client-inquires/re-generate?id=${id}&field_name=${field_name}`,
          protected: true,
        },
      ];
      const response = await multiplePutApi(endpointArr);
      const res = response[0];
      handelNotification(res, 'top-right');
      if (res?.success) {
        fetchApiStatusWithDebounce();
      }
      setReGenerateCredentialLoader((perValue) => ({
        ...perValue,
        [field_name]: false,
      }));
    },
    1000
  );

  const handelReGenerateApiCredential = (
    id: string,
    field_name: 'api_secrete' | 'api_key'
  ) => {
    setReGenerateCredentialLoader((perValue) => ({
      ...perValue,
      [field_name]: true,
    }));
    handelReGenerateApiCredentialWithDebounce(id, field_name);
  };

  console.log(reGenerateCredentialLoader);

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    fetchApiStatusWithDebounce();
  }, []);

  return (
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full h-full relative'>
        <Breadcrumbs BreadcrumbsNavigationFlow={BreadcrumbsObjects} />
        <div className='pt-9 w-full h-full'>
          <div className='w-full h-full p-4 2xl:p-5'>
            {loading ? (
              <div className='w-full h-full bg-white rounded-lg  border border-black/15 relative'>
                <div className='w-full h-full'>
                  <div className='w-full h-fit flex items-center justify-between py-3 px-5 border-b border-b-black/15'>
                    <Skeleton
                      width={200}
                      height={22}
                      className='inline-block'
                    />
                    <Skeleton
                      width={80}
                      height={30}
                      className='inline-block'
                      borderRadius={100}
                    />
                  </div>
                  <div className='w-full px-5 py-5 h-[calc(100%-80px)] overscroll-auto hide-scrollbar'>
                    <div className='flex flex-col items-start justify-start gap-5 w-full'>
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div
                          className='flex items-stretch justify-start overflow-auto w-full'
                          key={index}
                        >
                          <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center'>
                            <Skeleton
                              width={80}
                              height={17}
                              className='inline-block'
                            />
                          </p>
                          <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-3 py-2 border-x-0 flex items-center justify-start relative group overflow-auto'>
                            <Skeleton
                              width={400}
                              height={17}
                              className='inline-block'
                            />
                          </p>
                          <div className='border border-black/10 bg-gray-100 px-3 py-2 pb-2.5 rounded-r-lg'>
                            <Skeleton
                              width={80}
                              height={30}
                              borderRadius={100}
                              className='inline-block'
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='w-full h-fit absolute bottom-0 left-0 border-t border-t-black/15 pt-1.5 pb-2.5 px-5 flex items-center justify-end gap-4 bg-white rounded-b-lg'>
                  <Skeleton
                    width={140}
                    height={35}
                    className='inline-block'
                    borderRadius={10}
                  />
                </div>
              </div>
            ) : (
              <div className='w-full h-full bg-white rounded-lg  border border-black/15 relative'>
                <div className='w-full h-full'>
                  <div className='w-full h-fit flex items-center justify-between py-3 px-5 border-b border-b-black/15'>
                    <h3 className='font-inter font-medium text-base text-black'>
                      Client Inquiry Api
                    </h3>
                    {formData?.status ? (
                      <span className='py-1 px-4 font-inter text-sm bg-green-200 border border-green-500 text-green-700 rounded-full'>
                        Active
                      </span>
                    ) : (
                      <span className='py-1 px-4 font-inter text-sm bg-red-200 border border-red-500 text-red-700 rounded-full'>
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className='w-full px-5 py-5 h-[calc(100%-80px)] overscroll-auto hide-scrollbar'>
                    <div className='flex flex-col items-start justify-start gap-5 w-full'>
                      {' '}
                      <div className='flex items-stretch justify-start overflow-auto w-full'>
                        <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center'>
                          api_key
                        </p>
                        <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-3 py-2 border-x-0 flex items-center justify-start relative group'>
                          {showApiKey ? (
                            formData?.api_key
                          ) : (
                            <span className='flex items-center justify-start w-full h-full gap-0.5'>
                              {Array.from({
                                length: formData?.api_key?.length,
                              }).map((_, index) => (
                                <FaStarOfLife
                                  key={index}
                                  className='text-[8px]'
                                />
                              ))}
                            </span>
                          )}
                          <button
                            className='absolute top-1/2 -translate-y-1/2 right-5 invisible group-hover:visible transition-all'
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? (
                              <FaEye className='transition-all' />
                            ) : (
                              <FaEyeSlash className='transition-all' />
                            )}
                          </button>
                        </p>
                        <div className='border border-black/10 bg-gray-100 px-3 py-2 rounded-r-lg'>
                          <button
                            className='py-1.5 px-3 border rounded-full flex items-center justify-center gap-1 bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD] text-sm w-fit disabled:opacity-80'
                            disabled={reGenerateCredentialLoader?.api_key}
                            onClick={() =>
                              handelReGenerateApiCredential(
                                formData?.id,
                                'api_key'
                              )
                            }
                          >
                            {reGenerateCredentialLoader?.api_key ? (
                              <Loader loaderText='ReGenerating...' />
                            ) : (
                              <>
                                {' '}
                                <AiOutlineRedo className='text-lg rotate-180' />
                                <span>Regenerate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className='flex items-stretch justify-start overflow-auto w-full'>
                        <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center'>
                          api_secrete
                        </p>
                        <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-3 py-2 border-x-0 flex items-center justify-start relative group'>
                          {showApiSecrete ? (
                            formData?.api_secrete
                          ) : (
                            <span className='flex items-center justify-start w-full h-full gap-0.5'>
                              {Array.from({
                                length: formData?.api_secrete?.length,
                              }).map((_, index) => (
                                <FaStarOfLife
                                  key={index}
                                  className='text-[8px]'
                                />
                              ))}
                            </span>
                          )}
                          <button
                            className='absolute top-1/2 -translate-y-1/2 right-5 invisible group-hover:visible transition-all'
                            onClick={() => setShowApiSecrete(!showApiSecrete)}
                          >
                            {showApiSecrete ? (
                              <FaEye className='transition-all' />
                            ) : (
                              <FaEyeSlash className='transition-all' />
                            )}
                          </button>
                        </p>
                        <div className='border border-black/10 bg-gray-100 px-3 py-2 rounded-r-lg'>
                          <button
                            className='py-1.5 px-3 border rounded-full flex items-center justify-center gap-1 bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD] text-sm w-fit disabled:opacity-80'
                            onClick={() =>
                              handelReGenerateApiCredential(
                                formData?.id,
                                'api_secrete'
                              )
                            }
                            disabled={reGenerateCredentialLoader?.api_secrete}
                          >
                            {reGenerateCredentialLoader?.api_secrete ? (
                              <Loader loaderText='ReGenerating...' />
                            ) : (
                              <>
                                {' '}
                                <AiOutlineRedo className='text-lg rotate-180' />
                                <span>Regenerate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='w-full h-fit absolute bottom-0 left-0 border-t border-t-black/15 py-2 px-5 flex items-center justify-end gap-4 bg-white rounded-b-lg'>
                  <button
                    className={`px-5 py-2 rounded-lg border-0 text-white font-inter font-semibold text-base disabled:opacity-75 ${
                      formData?.status
                        ? 'bg-rose-600'
                        : 'bg-[var(--them-green-color)]'
                    }`}
                    onClick={handelEnableDisableOnClick}
                    disabled={buttonLoader}
                  >
                    {buttonLoader ? (
                      <Loader
                        loaderText={
                          formData?.status ? 'Disabling....' : 'Enabling....'
                        }
                      />
                    ) : formData?.status ? (
                      'Disable Api'
                    ) : (
                      'Enable Api'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default ClientInquiryApiManager;
