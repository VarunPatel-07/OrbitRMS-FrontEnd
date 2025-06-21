import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineRedo } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import { MdDelete, MdEdit } from 'react-icons/md';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import Breadcrumbs from '../../../common/Breadcrumbs';
import Input from '../../../common/Input';
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
import { getDataFromLocalStorage } from '../../../Helper/HelperFunctions';
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

  const [receiveEmail, setIsReceiveEmail] = useState<boolean>(false);
  const [receivingAuthorityMail, setReceivingAuthorityMail] = useState<
    Array<string>
  >(['']);

  const localStorageData = getDataFromLocalStorage('organization-info');
  const organization =
    GlobalStateProvider?.organization?.general_info?.portal_slug ||
    JSON.parse(localStorageData)?.portal_slug;

  const BreadcrumbsObjects = [
    {
      name: 'Home',
      label: 'home',
      link: `/${organization}/dashboard`,
    },
    {
      name: 'Api Manager',
      label: 'api_manager',
      link: `/${organization}/api-manager`,
    },
    {
      name: 'Client Inquiry',
      label: 'client_inquiry',
      link: `/${organization}/api-manager/client-inquiry`,
    },
  ];

  const BACKEND_API_BASEURL = import.meta.env.VITE_BACKEND_API_BASEURL;

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

  const handelOnEditButton = () => {
    setReceivingAuthorityMail((perValue) => {
      if (perValue.every((item) => item?.trim() !== '')) {
        return [...perValue, ''];
      } else return [...perValue];
    });
  };
  const handelInputFieldOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setReceivingAuthorityMail((perValue) =>
      perValue?.map((item, i) => (i === index ? e.target.value : item))
    );
  };
  const handelDeleteButton = (index: number) => {
    const dummyArray = [...receivingAuthorityMail];
    const finalArray = dummyArray.filter((_, i) => i !== index);
    setReceivingAuthorityMail(finalArray);
  };

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
          <div className='p-4 2xl:p-5'>
            {/* Header */}
            {loading ? (
              <div className='w-full h-fit flex items-center justify-between py-3 px-5 border border-black/15 bg-white border-b-0 rounded-t-lg'>
                <Skeleton width={200} height={22} className='inline-block' />
                <Skeleton
                  width={80}
                  height={30}
                  className='inline-block'
                  borderRadius={100}
                />
              </div>
            ) : (
              <div className='w-full h-fit flex items-center justify-between py-3 px-5 border border-black/15 bg-white rounded-t-lg border-b-0'>
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
            )}
            {/* Body */}
            <div className='w-full h-[calc(100vh-240px)] overflow-auto hide-scrollbar bg-white border border-black/15 relative'>
              {loading ? (
                <div className='w-full h-full bg-white p-5'>
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
                    <div className='bg-gray-100/80 border border-black/10 rounded-lg w-full'>
                      <div className='w-full flex items-center justify-between p-4 border-b border-b-black/10'>
                        <Skeleton
                          width={300}
                          height={20}
                          className='inline-block'
                        />

                        <Skeleton
                          width={60}
                          height={20}
                          className='inline-block'
                          borderRadius={100}
                        />
                      </div>
                      <div className='p-4'>
                        <div className='w-full pb-3 border-b border-b-black/10'>
                          <Skeleton
                            width={300}
                            height={20}
                            className='inline-block'
                          />
                        </div>
                        <div className='flex items-stretch justify-between pt-7 gap-4'>
                          <div className='flex-grow'>
                            <Skeleton
                              width={'100%'}
                              height={40}
                              className='inline-block'
                            />
                          </div>
                          <div className='flex items-center justify-end gap-2 w-fit'>
                            <Skeleton
                              width={40}
                              height={40}
                              className='inline-block'
                            />
                            <Skeleton
                              width={40}
                              height={40}
                              className='inline-block'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='w-full pb-5'>
                      <Skeleton
                        width={'100%'}
                        height={150}
                        className='inline-block'
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className='w-full h-full'>
                  <div className='w-full h-full'>
                    <div className='w-full px-5 py-5'>
                      <div className='flex flex-col items-start justify-start gap-5 w-full'>
                        {' '}
                        <div className='flex items-stretch justify-start overflow-auto w-full hide-scrollbar'>
                          <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center min-w-[115px]'>
                            api_key
                          </p>
                          <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-8 pr-12 py-2 border-x-0 flex items-center justify-start relative group'>
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
                        <div className='flex items-stretch justify-start overflow-auto w-full hide-scrollbar'>
                          <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center min-w-[115px]'>
                            api_secrete
                          </p>
                          <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-8 pr-12 py-2 border-x-0 flex items-center justify-start relative group'>
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
                        <div className='bg-gray-100/80 border border-black/10 rounded-lg w-full'>
                          <div className='w-full flex items-center justify-between p-4 border-b border-b-black/10'>
                            <p className='font-inter text-black/80 font-medium text-base w-fit flex items-center'>
                              Get notified by email when a new client inquiry is
                              received.
                            </p>

                            <button
                              className={`w-10 h-[18px] rounded-full relative transition-all duration-200 border border-transparent disabled:opacity-75 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-black/20 ${receiveEmail ? 'bg-green-500' : 'bg-red-500'}`}
                              onClick={() => setIsReceiveEmail(!receiveEmail)}
                            >
                              <span
                                className={`w-3.5 h-3.5 bg-white rounded-full inline-block absolute top-1/2 -translate-y-1/2 transition-all duration-200 ${receiveEmail ? 'left-[22px]' : 'left-0.5'}`}
                              ></span>
                            </button>
                          </div>
                          <div className='p-4'>
                            <div className='w-full pb-3 border-b border-b-black/10'>
                              <p className='font-inter text-black/80 font-medium text-base w-fit flex items-center'>
                                Add the recipient's email for client inquiry
                                alerts.
                              </p>
                            </div>
                            <div className='flex items-stretch flex-col justify-between pt-7 gap-4'>
                              {receivingAuthorityMail?.map((item, index) => (
                                <div
                                  className='flex items-stretch justify-between gap-4'
                                  key={index}
                                >
                                  <div className='flex-grow'>
                                    <Input
                                      name='text'
                                      className='border border-black/45'
                                      value={item}
                                      disabled={!receiveEmail}
                                      onChange={(e) =>
                                        handelInputFieldOnChange(e, index)
                                      }
                                    />
                                  </div>
                                  <div className='flex items-center justify-end gap-2 w-fit'>
                                    {receivingAuthorityMail.length ==
                                      index + 1 && (
                                      <button
                                        className='text-black text-lg p-2 bg-white hover:bg-gray-100 h-full min-w-[40px] flex items-center justify-center border border-black/15 rounded-lg'
                                        onClick={handelOnEditButton}
                                      >
                                        <MdEdit />
                                      </button>
                                    )}
                                    {(receivingAuthorityMail.length !==
                                      index + 1 ||
                                      index !== 0) && (
                                      <button
                                        className='text-black text-lg p-2 bg-white hover:bg-gray-100 h-full min-w-[40px] flex items-center justify-center border border-black/15 rounded-lg'
                                        onClick={() =>
                                          handelDeleteButton(index)
                                        }
                                      >
                                        <MdDelete />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className='border border-black/10 rounded-lg w-full'>
                          <div className='p-2.5 border-b border-b-black/15'>
                            <p className='font-inter text-black/80 font-medium text-base'>
                              How To Use The API
                            </p>
                          </div>
                          <div className='p-2.5 space-y-4'>
                            <p className='font-inter text-sm text-black/70'>
                              To submit a new client inquiry, make a{' '}
                              <span className='font-semibold'>POST</span>{' '}
                              request to the following endpoint. You must
                              include a valid{' '}
                              <code className='bg-slate-950/20 text-black font-semibold font-inter p-1 rounded'>
                                api_key
                              </code>{' '}
                              and{' '}
                              <code className='bg-slate-950/20 text-black font-semibold font-inter p-1 rounded'>
                                api_secret
                              </code>{' '}
                              as query parameters for authentication.
                            </p>

                            <div className='bg-black p-2 rounded'>
                              <span className='font-inter text-white/85 font-medium'>
                                {BACKEND_API_BASEURL}
                                /app/v1/client-inquires/submit?api_key=
                                <span className='font-semibold text-white'>
                                  YOUR_API_KEY
                                </span>
                                &api_secret=
                                <span className='font-semibold text-white'>
                                  YOUR_API_SECRET
                                </span>
                              </span>
                            </div>

                            <p className='font-inter text-sm text-black/70'>
                              <span className='font-semibold'>
                                Request Method:
                              </span>{' '}
                              POST
                              <br />
                              <span className='font-semibold'>
                                Content-Type:
                              </span>{' '}
                              application/json
                            </p>

                            <p className='font-inter text-sm text-black/70'>
                              <span className='font-semibold'>Important:</span>{' '}
                              The request body must include all the fields that
                              are defined in the{' '}
                              <span className='font-semibold'>
                                config module
                              </span>
                              . Any field marked as{' '}
                              <span className='font-semibold'>required</span>{' '}
                              cannot be empty or missing. Additionally, the data
                              types of the submitted values must strictly match
                              the types defined in the config module’s form
                              field (e.g., string, number, array).
                            </p>

                            <p className='font-inter text-sm text-black/70'>
                              <span className='font-semibold'>
                                Sample Request Body:
                              </span>
                            </p>

                            <div className='bg-black p-2 rounded text-sm font-mono overflow-auto'>
                              <pre>
                                {`{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "message": "I'm interested in your services."
}`}
                              </pre>
                            </div>

                            <p className='font-inter text-sm text-black/70'>
                              Ensure that all required fields are provided and
                              that the API key and secret are kept confidential.
                              If your credentials are invalid or missing, the
                              API will respond with an authentication error.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* footer */}
            {loading ? (
              <div className='w-full h-fit border border-black/15 border-t-0 pt-1.5 pb-2.5 px-5 flex items-center justify-end gap-4 bg-white rounded-b-lg'>
                <Skeleton
                  width={140}
                  height={35}
                  className='inline-block'
                  borderRadius={10}
                />
              </div>
            ) : (
              <div className='w-full h-fit border border-black/15 border-t-0 py-2 px-5 flex items-center justify-end gap-4 bg-white rounded-b-lg'>
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
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default ClientInquiryApiManager;
