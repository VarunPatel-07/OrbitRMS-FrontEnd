import '@/modules/auth/styles/auth.css';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { BiSupport } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { GrPowerReset } from 'react-icons/gr';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';

import {
   NotificationContext,
   NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import { signUpFormFormDataInterface } from '@/interface/FunctionParams.interface';
import {
   SignUpFormStepOne,
   SignUpFormStepTwo,
} from '@/modules/auth/pages/SignUp/utils';

import { useDebounce } from '@/hooks/useDebounce';

import AlertModal from '@/components/common/AlertModal';
import AppSuspenseLoader from '@/components/loaders/AppSuspenseLoader';
import { signUpApiFunction, verifyUsersLoginStatus } from '@/utils/api/api';
import { endpointObject, multiplePostApi } from '@/utils/api/multipleAPI';
import { META_TITLE_DESCRIPTION } from '@/utils/constants/seo.constants';
import {
   clearLocalSessionStorage,
   getDataFromSecureCookie,
} from '@/utils/helpers/commonHelpers';
import {
   countryObject,
   fetchFormattedCountryData,
} from '@/utils/helpers/countryData';
import HelmetSeo from '@/utils/helpers/HelmetSeo';

import signInGradientBgImage from '@/assets/images/gradient-bg.webp';
import orbitLogo from '@/assets/images/orbitrms-white-transperent-logo.webp';

const defaultPortalUrlSlug = import.meta.env.VITE_FRONT_END_PORTAL_BASE_URL;

const INITIAL_FORM_DATA: signUpFormFormDataInterface = {
   organizationName: '',
   primaryEmail: '',
   defaultPortalUrlSlug: defaultPortalUrlSlug,
   websiteUrl: '',
   contactNumber: '',
   industry: { label: '', value: '' },
   employeeCount: '',
   portalUrl: '',
   countryInfo: '',
   termsAccepted: false,
};

const alertModalErrorButtonArray = [
   {
      buttonTitle: 'Contact Support',
      showButton: true,
      classNames:
         'bg-blue-600 text-white text-base w-fit px-16 py-2 font-semibold rounded-lg mx-auto',
      icon: <BiSupport className='text-lg' />,
      onclickFunction: () => {},
   },
   {
      buttonTitle: 'Back To Sign In',
      showButton: true,
      classNames:
         'text-black text-base w-fit px-16 py-2 font-medium rounded-lg mx-auto',
      icon: <HiOutlineArrowLeft className='text-lg' />,
      link: '/auth/sign-in',
      onclickFunction: () => {},
   },
];

const alertModalSuccessButtonArray = [
   {
      buttonTitle: 'Resend Mail',
      showButton: true,
      classNames:
         'bg-blue-600 text-white text-base w-fit px-16 py-2 font-semibold rounded-lg mx-auto',
      icon: <GrPowerReset />,
      onclickFunction: () => {},
   },
   {
      buttonTitle: 'Back To Sign In',
      showButton: true,
      classNames:
         'text-black text-base w-fit px-16 py-2 font-medium rounded-lg mx-auto',
      icon: <HiOutlineArrowLeft className='text-lg' />,
      link: '/auth/sign-in',
      onclickFunction: () => {},
   },
];

const initialAlertModalPropsInfo = {
   success: false,
   protected: true,
   alertModalTitle: 'string',
   alertModelInfo: 'string',
   optionsButtonArray: alertModalSuccessButtonArray,
};

const AuthLottieAnimation = React.lazy(
   () => import('@/components/animations/AuthAnimation')
);

function SignUp() {
   const { handelNotification } = useContext(
      NotificationContext
   ) as NotificationContextApiProps;

   const useEffectRef = useRef(false);
   const CountryDataRef = useRef(false);
   const navigate = useNavigate();

   const [showGlobalLoader, setShowGlobalLoader] = useState(true);

   const [loading, setLoading] = useState<boolean>(false);
   const [formData, setFormData] =
      useState<signUpFormFormDataInterface>(INITIAL_FORM_DATA);

   const [currentPage, setCurrentPage] = useState(1);
   const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
   const [alertModalPropsInfo, setAlertModalPropsInfo] = useState(
      initialAlertModalPropsInfo
   );
   const [countryOptionsDataArray, setCountryOptionsDataArray] = useState<
      Array<countryObject>
   >([]);

   const [resendMailLoader, setResendMailLoader] = useState<boolean>(false);

   const handelReSendMailWithDebounce = useDebounce(async (email: string) => {
      const endPointArr: endpointObject[] = [
         {
            endPoint: 'auth/resend-verification-mail',
            protected: false,
            data: { email: email },
         },
      ];
      const response = await multiplePostApi(endPointArr);
      const res = response[0];
      setResendMailLoader(false);
      handelNotification(res, 'top-right');
   });

   const handelClickOnResendMail = (email: string) => {
      setResendMailLoader(true);
      handelReSendMailWithDebounce(email);
   };

   const handelSignUpSubmitForm = async (
      e: React.FormEvent<HTMLFormElement>
   ) => {
      e.preventDefault();
      const response = await signUpApiFunction(
         'auth/sign-up',
         formData,
         'POST',
         setLoading
      );
      if (response) {
         setShowAlertModal(response?.showModal);

         alertModalSuccessButtonArray[0].onclickFunction = () =>
            handelClickOnResendMail(formData.primaryEmail);
         setAlertModalPropsInfo({
            success: response?.success,
            alertModalTitle: response?.title,
            protected: true,
            alertModelInfo: response?.message,
            optionsButtonArray: response?.success
               ? alertModalSuccessButtonArray
               : alertModalErrorButtonArray,
         });
      }
   };

   const handelBackPage = () => {
      setCurrentPage(1);
   };

   useEffect(() => {
      if (useEffectRef.current) return;
      useEffectRef.current = true;
      (async () => {
         try {
            const tokenValue = getDataFromSecureCookie('authenticationToken');
            if (
               !tokenValue ||
               tokenValue === 'null' ||
               tokenValue === 'undefined'
            ) {
               return;
            }
            const response = await verifyUsersLoginStatus();
            if (!response?.success) {
               clearLocalSessionStorage();
            } else {
               navigate(
                  `/${response?.data?.organization?.general_info?.portal_slug}/config/project-status`
               );
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
   }, []);

   useEffect(() => {
      const loadCountryData = async () => {
         if (CountryDataRef.current) return;
         CountryDataRef.current = true;
         if (countryOptionsDataArray.length === 0) {
            const response = await fetchFormattedCountryData();
            if (response?.success) {
               setCountryOptionsDataArray(response?.countryOptionsData);

               setFormData((prev) => ({
                  ...prev,
                  countryInfo: JSON.stringify(response.filteredCountry),
               }));
            }
         }
      };
      loadCountryData();
   }, []);

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
            Title={META_TITLE_DESCRIPTION.SIGN_UP.title}
            Content={META_TITLE_DESCRIPTION.SIGN_UP.description}
         />

         <AppSuspenseLoader loading={showGlobalLoader} />
         <div className='h-screen w-screen bg-[var(--them-pink-color)] overflow-hidden'>
            <div className='w-full h-full flex items-stretch justify-start relative'>
               <img
                  src={signInGradientBgImage}
                  className='w-2/3 h-full absolute top-0 left-0'
                  alt='Gradient Background'
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
               <div className='rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px]  z-10 overflow-hidden'>
                  <div className='login-form w-full h-full  z-20 flex items-center justify-center'>
                     <div className='flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[480px] py-8 relative'>
                        {currentPage == 2 && (
                           <button
                              className='font-medium text-[var(--them-orange-color)] cursor-pointer text-sm transition-all absolute top-0 left-5'
                              onClick={handelBackPage}
                           >
                              <span className='flex items-center text-black/[0.65] justify-center gap-2'>
                                 <BsArrowLeft className='w-5 h-5' />
                                 <span>Back</span>
                              </span>
                           </button>
                        )}
                        <div className={'w-full px-5 transition-all'}>
                           <div className='flex flex-col items-start justify-start gap-2'>
                              <h1 className='font-inter text-2xl md:text-3xl lg:text-4xl font-bold text-black'>
                                 Sign Up for{' '}
                                 <span className='text-[var(--them-orange-color)]'>
                                    OrbitRMS!
                                 </span>
                              </h1>
                              <p className='text-black text-sm font-normal font-inter'>
                                 Join now and bring all your resources into one
                                 orbit!
                              </p>
                           </div>
                        </div>
                        <div className='w-full'>
                           <div className='w-full flex transition-all'>
                              {currentPage == 1 ? (
                                 <SignUpFormStepOne
                                    loading={loading}
                                    formData={formData}
                                    countryOptionsDataArray={
                                       countryOptionsDataArray
                                    }
                                    setFormData={setFormData}
                                    setCurrentPage={setCurrentPage}
                                 />
                              ) : (
                                 <SignUpFormStepTwo
                                    loading={loading}
                                    formData={formData}
                                    setFormData={setFormData}
                                    handelSignUpSubmitForm={
                                       handelSignUpSubmitForm
                                    }
                                 />
                              )}
                              {/* Second Page */}
                           </div>
                        </div>
                        <div className='w-full grid grid-cols-1 gap-y-8 px-5'>
                           <p className='text-center font-inter w-full text-sm text-black'>
                              Already have an account?{' '}
                              <Link to='/auth/sign-in'>
                                 <span className=' text-[var(--them-orange-color)] cursor-pointer underline  font-bold'>
                                    Sign In
                                 </span>
                              </Link>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <AlertModal
            ModalInfo={alertModalPropsInfo}
            showAlertModal={showAlertModal}
            setShowAlertModal={setShowAlertModal}
            loader={resendMailLoader}
         />
      </>
   );
}

export default SignUp;
