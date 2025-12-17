import './auth.css';

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import signInGradientBgImage from '../assets/Images/gradient-bg.webp';
import orbitLogo from '../assets/Images/orbitrms-white-transperent-logo.webp';
import Input from '../common/Input';
import Loader from '../common/Loader';
import MainSuspenseLoader from '../Components/Loader/MainSuspenseLoader';
import { MAX_SIGN_IN_ATTEMPT } from '../constant/constant';
import { MetaTitleDescription } from '../constant/MetaTitleDescription';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../Context/Notification/NotificationContextApi';
import { signInApiFunction, verifyUsersLoginStatus } from '../Helper/api/api';
import HelmetSeo from '../Helper/HelmetSeo';
import {
  classNames,
  clearLocalSessionStorage,
  getDataFromLocalStorage,
  getDataFromSecureCookie,
  isValidEmail,
  MaxLimitCountDownTimeFormatter,
  removeDataFromLocalStorage,
  storeDataInLocalStorage,
} from '../Helper/HelperFunctions';
import { useDebounce } from '../Hooks/useDebounce';

const AuthLottieAnimation = React.lazy(
  () => import('../Components/Animation/AuthLottieAnimation')
);

function SignIn() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);
  const navigate = useNavigate();

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>();
  const [expiryTimeUTCString, setExpiryTimeUTCString] = useState<string>('');

  const signInApiHandlerFunction = useDebounce(async () => {
    const data = {
      email,
      password,
      rememberMe: rememberMe == 'true' ? true : false,
    };

    const res = await signInApiFunction(
      'auth/sign-in',
      data,
      'POST',
      setLoading
    );

    if (res?.success) {
      setLoading(false);
      handelNotification(res, 'top-right');
      if (!res?.data?.organization_created) {
        navigate(`/onboarding?organization_id=${res?.data?.organization_id}`);
      } else {
        navigate(
          `/${res?.data?.organization_general_info?.portal_slug}/dashboard`
        );
      }
    } else {
      setLoading(false);
      handelNotification(res, 'top-right');
      if (res?.data?.expiry_time) {
        setExpiryTimeUTCString(res?.data?.expiry_time);
        storeDataInLocalStorage(res?.data?.expiry_time, MAX_SIGN_IN_ATTEMPT);
      }
    }
  }, 100);

  const isFormValid = useMemo(() => {
    return (
      email.trim().length > 0 && password.length >= 6 && isValidEmail(email)
    );
  }, [email, password]);

  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (isFormValid) {
      setLoading(true); // Set loading state immediately
      signInApiHandlerFunction(); // Await the API call
    } else {
      setShowError(true);
    }
  };

  const handelCountDownFunction = (utcString: string) => {
    if (intervalRef?.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      const expiryDate = new Date(utcString);
      const currentDate = new Date();
      const difference = expiryDate.getTime() - currentDate.getTime();
      if (difference <= 0) {
        setCountDown(0);
        removeDataFromLocalStorage(MAX_SIGN_IN_ATTEMPT);
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
      } else {
        setCountDown(difference);
      }
    }, 1000);
  };

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    (async () => {
      try {
        const tokenValue = getDataFromSecureCookie('authenticationToken');

        console.log("tokenValue",tokenValue)

        if (
          !tokenValue ||
          tokenValue === 'null' ||
          tokenValue === 'undefined'
        ) {
          return;
        }
        const response = await verifyUsersLoginStatus();
        if (!response) return;
        if (!response?.success) {
          handelNotification(response, 'top-right');
          clearLocalSessionStorage();
        } else {
          if (
            response?.data?.organization?.organization_created &&
            !response?.encrypted_org_id
          ) {
            navigate(
              `/${response?.data?.organization?.general_info?.portal_slug}/dashboard`,
              { replace: true, state: null }
            );
          } else {
            navigate(
              `/onboarding?organization_id=${response?.encrypted_org_id}`
            );
          }
        }
      } finally {
        if (document.readyState === 'complete') {
          setShowGlobalLoader(false);
        } else {
          window.addEventListener('load', () => {
            setShowGlobalLoader(false);
          });
        }
      }
    })();
  }, [handelNotification, navigate]);

  useEffect(() => {
    const localData = getDataFromLocalStorage(MAX_SIGN_IN_ATTEMPT);

    const data = localData || expiryTimeUTCString;

    if (data) {
      handelCountDownFunction(data);
    }
  }, [expiryTimeUTCString]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    if (loading) window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loading]);

  return (
    <>
      <HelmetSeo
        Title={MetaTitleDescription.signIn.title}
        Content={MetaTitleDescription.signIn.description}
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      <div className='h-screen w-screen bg-[var(--them-pink-color)] overflow-hidden'>
        <div className='w-full h-full flex items-stretch justify-start relative'>
          <img
            src={signInGradientBgImage}
            className='w-2/3 h-full absolute top-0 left-0'
            alt='linear gradient image'
            loading='lazy'
          />
          {/* Auth Lottie Animation  */}
          <AuthLottieAnimation />

          <div className='w-1/3 relative hidden md:block'>
            <div className='w-full h-full p-7'>
              <div>
                <img
                  src={orbitLogo}
                  className='max-w-[250px] h-fit max-h-[55px] lg:max-h-[75px]'
                  alt='OrbitRMS Logo'
                  loading='lazy'
                />
              </div>
              <div className='pt-7 '>
                <h1 className='font-syne text-base lg:text-xl text-white font-extrabold text-balance pl-0.5'>
                  OrbitRMS: Simplify, Streamline, Succeed.
                </h1>
              </div>
            </div>
          </div>
          <div className='rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px] relative z-10'>
            <div className='login-form w-full h-full relative z-20 flex items-center justify-center'>
              <div className='flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[400px] p-4 md:p-0'>
                <div className='flex flex-col items-start justify-start gap-2'>
                  <h1 className='font-inter text-2xl md:text-3xl lg:text-4xl font-bold text-black'>
                    Sign In to{' '}
                    <span className='text-[var(--them-orange-color)]'>
                      OrbitRMS!
                    </span>
                  </h1>
                  <p className='text-black text-sm font-normal font-inter'>
                    Sign in and Unite all your resources in one orbit!
                  </p>
                </div>
                <div className='grid grid-cols-1 gap-y-6  w-full'>
                  <div className='w-full'>
                    <Input
                      name='email'
                      className='border border-black/[.65] text-black'
                      labelFieldName='Email'
                      isRequiredField={true}
                      value={email}
                      type='email'
                      setValue={setEmail}
                      showError={showError}
                      errorMessage={
                        showError
                          ? email.trim() === ''
                            ? 'This field is required.'
                            : !isValidEmail(email)
                              ? 'Please enter a valid email address.'
                              : ''
                          : ''
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className='w-full grid grid-cols-1 gap-y-3'>
                    <div className='w-full'>
                      <Input
                        name='password'
                        className='border border-black/[.65]'
                        labelFieldName='Password'
                        isRequiredField={true}
                        type='password'
                        viewPasswordBtn={true}
                        value={password}
                        setValue={setPassword}
                        showError={showError}
                        errorMessage={
                          showError
                            ? password.trim().length === 0
                              ? 'This field is required.'
                              : password.trim().length < 6
                                ? 'Password must be at least 6 characters.'
                                : ''
                            : ''
                        }
                        disabled={loading}
                      />
                    </div>
                    <div className='w-full flex items-center justify-between'>
                      <div className='flex items-center justify-start gap-1.5'>
                        <Input
                          type='checkbox'
                          name='termsAccepted'
                          value={rememberMe}
                          setValue={setRememberMe}
                        />
                        <span className='text-black font-light text-sm font-inter'>
                          Remember Me
                        </span>
                      </div>

                      <Link
                        to={loading ? '#' : '/auth/forgot-password'}
                        className={classNames(
                          'text-[var(--them-orange-color)] font-semibold font-inter text-sm',

                          {
                            'cursor-pointer': !loading,
                            'cursor-not-allowed opacity-50': loading,
                          }
                        )}
                        aria-disabled={loading}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='w-full grid grid-cols-1 gap-y-8'>
                  <button
                    type='button'
                    className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed'
                    disabled={loading || countDown ? true : false}
                    onClick={handleFormSubmit}
                  >
                    {loading ? (
                      <Loader loaderText='Submitting...' />
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>

                  <div className='w-full flex flex-col items-center justify-center gap-2'>
                    <p className='text-center font-inter w-full text-sm text-black'>
                      Don’t have an account?{' '}
                      <Link to='/auth/sign-up'>
                        <span className=' text-[var(--them-orange-color)] cursor-pointer underline  font-bold'>
                          Sign Up
                        </span>
                      </Link>
                    </p>

                    {countDown ? (
                      <p className='text-red-600 flex items-center gap-1 justify-center text-sm mt-1'>
                        <span className='inline-block'>Try Again After:</span>
                        <span className='inline-block'>
                          {MaxLimitCountDownTimeFormatter(countDown)}
                        </span>
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;
