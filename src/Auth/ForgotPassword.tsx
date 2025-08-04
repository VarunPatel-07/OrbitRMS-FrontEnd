import './auth.css';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { IoMdRefresh } from 'react-icons/io';
import { LiaKeySolid } from 'react-icons/lia';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import signInGradientBgImage from '../assets/Images/gradient-bg.webp';
import orbitLogo from '../assets/Images/orbitrms-white-transperent-logo.webp';
import AlertModal from '../common/AlertModal';
import Button from '../common/Button';
import Input from '../common/Input';
import Loader from '../common/Loader';
import MainSuspenseLoader from '../Components/Loader/MainSuspenseLoader';
import { PASSWORD_RESET_KEY } from '../constant/constant';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../Context/Notification/NotificationContextApi';
import { verifyUsersLoginStatus } from '../Helper/api/api';
import { endpointObject, multiplePostApi } from '../Helper/api/multipleAPI';
import HelmetSeo from '../Helper/HelmetSeo';
import {
  getDataFromLocalStorage,
  isValidEmail,
  MaxLimitCountDownTimeFormatter,
  removeDataFromLocalStorage,
  storeDataInLocalStorage,
} from '../Helper/HelperFunctions';
import { useDebounce } from '../Hooks/useDebounce';
import { ModalInfoType } from '../interface/propsInterface';

const initialModalInfo = {
  success: false,
  protected: false,
  alertModalTitle: '',
  alertModelInfo: '',
  optionsButtonArray: [],
};

const AuthLottieAnimation = React.lazy(
  () => import('../Components/Animation/AuthLottieAnimation')
);

function ForgotPassword() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const navigate = useNavigate();
  const [queryParameter] = useSearchParams();

  const useEffectRef = useRef(false);

  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalInfoType>(initialModalInfo);
  const [showError, setShowError] = useState<boolean>(false);
  const [countDown, setCountDown] = useState<number>();
  const [expiryTimeUTCString, setExpiryTimeUTCString] = useState<string>('');
  const tryAgainFunction = () => {
    setShowAlertModal(false);
    setTimeout(() => setModalInfo(initialModalInfo), 350);
    setEmail('');
  };

  const errorAlertModalButtonArray = [
    {
      buttonTitle: 'Contact Support',
      showButton: true,
      link: 'support',
      classNames:
        'text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-sm font-medium',
    },
    {
      buttonTitle: 'Try a Different Email',
      showButton: true,
      classNames:
        'font-medium font-inter cursor-pointer text-sm text-black/[0.65]',
      icon: <IoMdRefresh className='w-5 h-5' />,
      onclickFunction: () => tryAgainFunction(),
    },
  ];

  const successAlertModalButtonArray = [
    {
      buttonTitle: 'Contact Support',
      showButton: true,
      classNames:
        'text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-sm font-medium',
    },
    {
      buttonTitle: 'Back To Sign In',
      showButton: true,
      link: '/auth/sign-in',
      classNames:
        'font-medium font-inter cursor-pointer text-sm text-black/[0.65]',
      icon: <BsArrowLeft className='w-5 h-5' />,
    },
  ];

  const alertModalStateHandlerFunction = (success: boolean) => {
    if (!success) {
      setModalInfo({
        success: false,
        protected: true,
        alertModalTitle: 'Oops! We Couldn’t Find Your Email',
        alertModelInfo: `We couldn’t find an account associated with the email <a href="mailto:${email}" class="text-blue-600 font-medium underline cursor-pointer">${email}</a>. Double-check for typos or try another email.`,
        optionsButtonArray: errorAlertModalButtonArray,
      });
      setShowAlertModal(true);
      return;
    }
    setModalInfo({
      success: true,
      protected: true,
      alertModalTitle: 'You’re One Step Away from Resetting Your Password!',
      alertModelInfo: `We’ve just sent a password reset email to <a href="mailto:${email}" class="text-blue-600 font-medium underline cursor-pointer">${email}</a>. Follow the steps inside to regain access. 🚀 Check your spam folder if it doesn’t show up. 🔍`,
      optionsButtonArray: successAlertModalButtonArray,
    });
    setShowAlertModal(true);
  };

  const handelFormSubmitWithDebounce = useDebounce(async () => {
    const endPointArr: endpointObject[] = [
      {
        endPoint: 'auth/password-reset/request',
        protected: false,
        data: {
          email,
        },
      },
    ];
    const response = await multiplePostApi(endPointArr);
    const res = response[0];

    if (res?.success) {
      navigate(`/auth/forgot-password?success=true&email=${email}`);
      alertModalStateHandlerFunction(res?.success);
    } else {
      alertModalStateHandlerFunction(res?.success);
      if (res?.data?.expiry_time) {
        setExpiryTimeUTCString(res?.data?.expiry_time);
        storeDataInLocalStorage(res?.data?.expiry_time, PASSWORD_RESET_KEY);
      }
    }
    setLoading(false);
  }, 100);

  const submitForgotPasswordHandler = async () => {
    if (email.trim().length < 1 && !isValidEmail(email)) {
      setShowError(true);
      return;
    }
    setLoading(true);
    setShowError(false);
    handelFormSubmitWithDebounce();
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
        removeDataFromLocalStorage(PASSWORD_RESET_KEY);
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
      } else {
        setCountDown(difference);
      }
    }, 1000);
  };

  useEffect(() => {
    const filterQuery = queryParameter.get('success');
    const queryEmail = queryParameter.get('email');
    if (filterQuery && queryEmail) {
      setModalInfo({
        success: true,
        protected: true,
        alertModalTitle: 'You’re One Step Away from Resetting Your Password!',
        alertModelInfo: `We’ve just sent a password reset email to <a href="mailto:${queryEmail}" class="text-blue-600 font-medium underline cursor-pointer">${queryEmail}</a>. Follow the steps inside to regain access. 🚀 Check your spam folder if it doesn’t show up. 🔍`,
        optionsButtonArray: successAlertModalButtonArray,
      });
      setShowAlertModal(true);
    }
    if (useEffectRef.current) return;
    useEffectRef.current = true;
    (async () => {
      const response = await verifyUsersLoginStatus();
      if (!response) return;
      if (!response?.success) {
        handelNotification(response, 'top-right');
        setShowGlobalLoader(false);
        removeDataFromLocalStorage('authenticationToken');
        removeDataFromLocalStorage('organization-info');
      } else {
        setShowGlobalLoader(false);
      }
    })();
  }, []);

  useEffect(() => {
    const localData = getDataFromLocalStorage(PASSWORD_RESET_KEY);

    const data = localData || expiryTimeUTCString;

    if (data) {
      handelCountDownFunction(data);
    }
  }, [expiryTimeUTCString]);

  return (
    <>
      <HelmetSeo
        Title='Forgot Password | OrbitRMS'
        Content='Reset your password for OrbitRMS. Simplify your work and regain access to manage everything in one place effortlessly!'
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className='h-screen w-screen bg-[var(--them-pink-color)] overflow-hidden'>
          <div className='w-full h-full flex items-stretch justify-start relative'>
            <img
              src={signInGradientBgImage}
              className='w-2/3 h-full absolute top-0 z-10 left-0'
            />

            {/* Auth Lottie Animation  */}
            <AuthLottieAnimation />

            <div className='w-1/3 relative z-20 hidden md:block'>
              <div className='w-full h-full p-7 relative z-20'>
                <div className='w-full'>
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
            <div className='rounded-none z-20 w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px] relative'>
              <div className='login-form w-full h-full relative z-20 flex items-center justify-center'>
                <div className='flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[400px] p-4 md:p-0'>
                  <div className='w-full flex flex-col items-center justify-center gap-7'>
                    <div className='border border-black/[0.5] text-black rounded-lg p-3'>
                      <LiaKeySolid className='w-8 h-8' />
                    </div>
                    <div className='w-full flex flex-col items-center justify-center gap-2'>
                      <h1 className='font-inter text-2xl md:text-3xl text-center font-bold text-black'>
                        Forgot your password?
                      </h1>
                      <p className='text-black text-sm text-center font-light font-inter'>
                        Enter your email, and we’ll send you a reset link!{' '}
                      </p>
                    </div>
                  </div>
                  <div className='w-full'>
                    <Input
                      name='organizationEmail'
                      className='border border-black/[.65] text-black'
                      labelFieldName='Organization Email'
                      isRequiredField={true}
                      value={email}
                      type='email'
                      setValue={setEmail}
                      showError={showError}
                      errorMessage={
                        showError && email.trim().length < 1
                          ? 'this is a required field'
                          : !isValidEmail(email)
                            ? 'please enter a valid email address.'
                            : ''
                      }
                      disabled={countDown ? true : false}
                    />
                    {countDown ? (
                      <p className='text-red-600 flex items-center gap-1 justify-end text-sm mt-1'>
                        <span className='inline-block'>Try Again After:</span>
                        <span className='inline-block'>
                          {MaxLimitCountDownTimeFormatter(countDown)}
                        </span>
                      </p>
                    ) : (
                      ''
                    )}
                  </div>

                  <div className='w-full grid grid-cols-1 gap-y-8'>
                    <Button
                      Type='button'
                      className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all'
                      disabled={loading || countDown ? true : false}
                      onClick={submitForgotPasswordHandler}
                    >
                      {loading ? (
                        <Loader loaderText='Submitting...' />
                      ) : (
                        <span>Submit</span>
                      )}
                    </Button>
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

      <AlertModal
        ModalInfo={modalInfo}
        showAlertModal={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      />
    </>
  );
}

export default ForgotPassword;
