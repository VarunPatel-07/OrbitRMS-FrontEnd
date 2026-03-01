import React, { useContext, useEffect, useRef, useState } from 'react';

import { BsArrowLeft } from 'react-icons/bs';
import { FiLock } from 'react-icons/fi';
import { LiaKeySolid } from 'react-icons/lia';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import signInGradientBgImage from '../assets/Images/gradient-bg.webp';
import orbitLogo from '../assets/Images/orbitrms-white-transperent-logo.webp';
import Input from '../common/Input';
import Loader from '../common/Loader';
import MainSuspenseLoader from '../Components/Loader/MainSuspenseLoader';
import { META_TITLE_DESCRIPTION } from '../constant/MetaTitleDescription';
import {
  NotificationContext,
  NotificationContextApiProps,
  NotificationFunctionParamsInterface,
} from '../Context/Notification/NotificationContextApi';
import { verifyUsersLoginStatus } from '../Helper/api/api';
import { endpointObject, multiplePostApi } from '../Helper/api/multipleAPI';
import HelmetSeo from '../Helper/HelmetSeo';
import { useDebounce } from '../Hooks/useDebounce';

const AuthLottieAnimation = React.lazy(
  () => import('../Components/Animation/AuthLottieAnimation')
);

function CreateResetPassword() {
  const useEffectRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentPath = location.pathname.split('/auth/')[1];

  // getting the context
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  // declaring the state variable
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [conformPassword, setConformPassword] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const createPasswordApiHandler = useDebounce(async () => {
    const userId = searchParams.get('user-id');
    const token = searchParams.get('token');
    if (!userId && !token) {
      const data = {
        success: false,
        message: 'Invalid request. Please use the correct link.',
      };
      handelNotification(data, 'top-right');
      setLoading(false);
      return;
    }
    const data = {
      password: password,
    };

    const endPointArray: Array<endpointObject> = [
      {
        endPoint: `auth/password/set-password?user-id=${userId}&token=${token}&type=${currentPath == 'create-password' ? 'create' : 'reset'}`,
        protected: false,
        data: data,
      },
    ];
    const response = await multiplePostApi(endPointArray);
    const res = response[0];
    if (res?.success) {
      setLoading(false);
      handelNotification(res, 'top-right');
      const data: NotificationFunctionParamsInterface = {
        success: true,
        message: 'Redirecting To Sign In Page',
      };
      setTimeout(() => {
        handelNotification(data, 'top-right');
      }, 500);
      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 2000);
    } else {
      setLoading(false);
      handelNotification(res, 'top-right');
    }
  }, 100);

  const createResetPasswordHandler = async () => {
    if (
      password.trim().length < 5 ||
      conformPassword.trim().length < 5 ||
      password != conformPassword
    ) {
      setShowError(true);
      return;
    }
    setLoading(true);
    if (['create-password', 'reset-password'].includes(currentPath)) {
      createPasswordApiHandler();
    }
  };

  useEffect(() => {
    if (useEffectRef.current) return;
    useEffectRef.current = true;

    const userId = searchParams.get('user-id');
    const token = searchParams.get('token');

    if (!userId && !token) {
      const data = {
        message: 'Access denied.',
        success: false,
      };
      handelNotification(data, 'top-right');
      navigate('/auth/sign-in');
    }
    (async () => {
      const response = await verifyUsersLoginStatus();
      if (!response?.success) {
        setShowGlobalLoader(false);
      } else {
        setShowGlobalLoader(false);
      }
    })();
  }, []);
  return (
    <>
      <HelmetSeo
        Title={
          currentPath == 'create-password'
            ? META_TITLE_DESCRIPTION.CREATE_PASSWORD.title
            : META_TITLE_DESCRIPTION.RESET_PASSWORD.title
        }
        Content={
          currentPath == 'create-password'
            ? META_TITLE_DESCRIPTION.CREATE_PASSWORD.description
            : META_TITLE_DESCRIPTION.RESET_PASSWORD.description
        }
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='h-screen w-screen bg-[var(--them-pink-color)] overflow-hidden'>
          <div className='w-full h-full flex items-stretch justify-start relative'>
            <img
              src={signInGradientBgImage}
              className='w-2/3 h-full absolute top-0 left-0'
            />
            {/* Auth Lottie Animation  */}
            <AuthLottieAnimation />
            <div className='w-1/3 relative z-20 hidden md:block'>
              <div className='w-full h-full p-7'>
                <div>
                  <img
                    src={orbitLogo}
                    className='max-w-[250px] h-fit max-h-[55px] lg:max-h-[75px]'
                    alt=''
                  />
                </div>
                <div className='pt-7 '>
                  <h1 className='font-syne text-base lg:text-xl text-white font-extrabold text-balance pl-0.5'>
                    OrbitRMS: Simplify, Streamline, Succeed.
                  </h1>
                </div>
              </div>
            </div>
            <div className='rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px] relative z-20'>
              <div className='login-form w-full h-full relative z-20 flex items-center justify-center'>
                <div className='flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[400px] p-4 md:p-0'>
                  <div className='w-full flex flex-col items-center justify-center gap-7'>
                    <div className='border border-black/[0.5] text-black rounded-lg p-3.5'>
                      {currentPath == 'create-password' && (
                        <FiLock className='w-7 h-7' />
                      )}
                      {currentPath == 'reset-password' && (
                        <LiaKeySolid className='w-8 h-8' />
                      )}
                    </div>
                    <div className='w-full flex flex-col items-center justify-center gap-2'>
                      <h1 className='font-inter text-2xl md:text-3xl text-center font-bold text-black'>
                        {currentPath == 'create-password' &&
                          'Create Your Password'}
                        {currentPath == 'reset-password' &&
                          'Set Your New Password'}
                      </h1>
                      <p className='text-black text-sm text-center text-pretty font-light font-inter'>
                        {currentPath == 'create-password' &&
                          `Set a strong password to secure your account. Make sure it’s unique and memorable for easy
                        access.`}
                        {currentPath == 'reset-password' &&
                          `Enter a new password for your account to regain access. Ensure it is secure and different from your previous one.`}
                      </p>
                    </div>
                  </div>
                  <div className='w-full'>
                    <Input
                      name='password'
                      className='border border-black/[.65] text-black'
                      labelFieldName='Password'
                      isRequiredField={true}
                      value={password}
                      type='password'
                      viewPasswordBtn={true}
                      setValue={setPassword}
                      showError={showError}
                      disabled={loading}
                      errorMessage={
                        showError && password.trim().length < 1
                          ? 'this field is required.'
                          : password.trim().length < 6
                            ? 'password must be at least 6 characters.'
                            : ''
                      }
                    />
                  </div>
                  <div className='w-full'>
                    <Input
                      name='conformPassword'
                      className='border border-black/[.65] text-black'
                      labelFieldName='Conform Password'
                      isRequiredField={true}
                      value={conformPassword}
                      type='password'
                      viewPasswordBtn={true}
                      setValue={setConformPassword}
                      showError={showError}
                      disabled={loading}
                      errorMessage={
                        showError && conformPassword.trim().length < 1
                          ? 'This field is required.'
                          : conformPassword.trim().length < 6
                            ? 'Password must be at least 6 characters.'
                            : password != conformPassword
                              ? "The passwords don't match."
                              : ''
                      }
                    />
                  </div>
                  <div className='w-full grid grid-cols-1 gap-y-8'>
                    {currentPath == 'create-password' ? (
                      <button
                        type='button'
                        className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed'
                        disabled={loading}
                        onClick={createResetPasswordHandler}
                      >
                        {loading ? (
                          <Loader loaderText='Submitting...' />
                        ) : (
                          <span>Submit</span>
                        )}
                      </button>
                    ) : (
                      <button
                        type='button'
                        className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed'
                        disabled={loading}
                        onClick={createResetPasswordHandler}
                      >
                        {loading ? (
                          <Loader loaderText='Submitting...' />
                        ) : (
                          <span>Submit</span>
                        )}
                      </button>
                    )}

                    <Link
                      to={'/auth/sign-in'}
                      className='font-medium text-[var(--them-orange-color)] cursor-pointer text-sm'
                    >
                      <span className='flex items-center text-black/[0.65] justify-center gap-2'>
                        <BsArrowLeft className='w-5 h-5' />
                        <span>Back To Sign In</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateResetPassword;
