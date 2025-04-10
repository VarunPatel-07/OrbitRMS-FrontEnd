import { useEffect, useRef, useState } from 'react';
import { HiOutlineCheckBadge } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';

import orbitLogo from '../assets/Images/orbitrms-final-logo-transperent.webp';
import MainSuspenseLoader from '../Components/Loader/MainSuspenseLoader';
import { multipleFetchApi } from '../Helper/api/multipleAPI';
import { classNames } from '../Helper/HelperFunctions';

export default function VerifyEmail() {
  const hasRun = useRef(false);
  const [searchParams] = useSearchParams();
  const [showGlobalLoader, setShowGlobalLoader] = useState<boolean>(false);
  const [alreadyVerified, setAlreadyVerified] = useState<boolean>(false);

  const verifyEmailFunction = async (organization_id: string | null) => {
    if (organization_id) {
      const endpointArray = [
        {
          endPoint: `organization/verify-organization?organization-id=${organization_id}`,
          protected: false,
        },
      ];
      const response = await multipleFetchApi(endpointArray);
      const res = response[0];
      if (res.success) {
        setShowGlobalLoader(false);
        setAlreadyVerified(res?.alreadyVerified);
      }
    }
  };

  useEffect(() => {
    if (!hasRun.current) {
      verifyEmailFunction(searchParams.get('organization-id'));
      hasRun.current = true;
    }
  }, [searchParams]);
  return (
    <>
      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='h-screen w-full bg-white'>
          <div className='w-full h-full flex flex-col'>
            <div className='navbar w-full absolute top-0 left-0 pt-3 px-5'>
              <img
                src={orbitLogo}
                alt='OrbitRMS Logo'
                className='max-w-[250px] h-fit max-h-[55px] lg:max-h-[75px]'
              />
            </div>
            <div className='w-full px-4 min-h-[350px] relative'>
              <div className='success-icon absolute -top-[5%] left-1/2 -translate-x-1/2'>
                <div className='w-full h-full'>
                  <div
                    className={classNames(
                      'w-[250px] h-[250px] flex items-center justify-center border rounded-full p-3',
                      {
                        'border-[#16a34a]/20': !alreadyVerified,
                        'border-[#e29c4d]/20': alreadyVerified,
                      }
                    )}
                  >
                    <div
                      className={classNames(
                        'w-full h-full flex items-center justify-center border rounded-full p-3',
                        {
                          'border-[#16a34a]/30': !alreadyVerified,
                          'border-[#e29c4d]/30': alreadyVerified,
                        }
                      )}
                    >
                      <div
                        className={classNames(
                          'w-full h-full flex items-center justify-center border rounded-full p-3',
                          {
                            'border-[#16a34a]/40': !alreadyVerified,
                            'border-[#e29c4d]/40': alreadyVerified,
                          }
                        )}
                      >
                        <div
                          className={classNames(
                            'w-full h-full flex items-center justify-center border rounded-full p-3',
                            {
                              'border-[#16a34a]/50': !alreadyVerified,
                              'border-[#e29c4d]/50': alreadyVerified,
                            }
                          )}
                        >
                          <div
                            className={classNames(
                              'w-full h-full flex items-center justify-center border rounded-full p-3',
                              {
                                'border-[#16a34a]/60': !alreadyVerified,
                                'border-[#e29c4d]/60': alreadyVerified,
                              }
                            )}
                          >
                            <div
                              className={classNames(
                                'w-full h-full flex items-center justify-center border rounded-full p-3',
                                {
                                  'border-[#16a34a]/70': !alreadyVerified,
                                  'border-[#e29c4d]/70': alreadyVerified,
                                }
                              )}
                            >
                              <HiOutlineCheckBadge
                                className={classNames('w-[70px] h-[70px]', {
                                  'text-green-600': !alreadyVerified,
                                  'text-[var(--them-orange-color)]':
                                    alreadyVerified,
                                })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full h-full flex items-end justify-center relative z-10 pb-14'>
                {alreadyVerified ? (
                  <h1 className='text-[var(--them-orange-color)] text-4xl font-bold font-inter text-pretty'>
                    We Already Verified Your Email Successfully!
                  </h1>
                ) : (
                  <h1 className='text-green-600 text-4xl font-bold font-inter text-pretty'>
                    Your Email Has Been Verified Successfully!
                  </h1>
                )}
              </div>
            </div>
            <div className='w-full h-full bg-gray-200/50'>
              <div className='w-full h-full flex items-center justify-center'>
                <div className='max-w-[60%] flex flex-col items-center gap-7'>
                  <p className='text-black/80 text-xl text-balance text-center font-inter'>
                    We're setting up your personalized Orbit to give you the
                    best experience. 🚀
                  </p>
                  <p className='text-black/60 font-normal text-xl text-balance text-center font-inter'>
                    This process may take{' '}
                    <span className='font-medium text-black'>
                      7-10 minutes,
                    </span>
                    , so hang tight! Once everything is ready, you'll receive an
                    email with a link to create your password. After that,
                    you’ll be able to sign in using your email and explore all
                    that Orbit has to offer.
                  </p>
                  <p className='text-black font-inter font-medium text-xl'>
                    Stay tuned—we’ll notify you soon! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
