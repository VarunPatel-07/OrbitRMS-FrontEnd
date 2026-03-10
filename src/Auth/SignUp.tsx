import './auth.css';

import React, { useContext, useEffect, useRef, useState } from 'react';

import { BiSupport } from 'react-icons/bi';
import { BsArrowLeft } from 'react-icons/bs';
import { FaStarOfLife } from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';

import signInGradientBgImage from '../assets/Images/gradient-bg.webp';
import orbitLogo from '../assets/Images/orbitrms-white-transperent-logo.webp';
import AlertModal from '../common/AlertModal';
import Input from '../common/Input';
import Loader from '../common/Loader';
import SearchDrop from '../common/SearchDrop';
import MainSuspenseLoader from '../Components/Loader/MainSuspenseLoader';
import {
  EmployeeCountArray,
  industryType,
  WebsiteUrlSafetyCheckErrorMessages,
} from '../constant/constant';
import { META_TITLE_DESCRIPTION } from '../constant/MetaTitleDescription';
import { PUBLIC_EMAIL_PROVIDERS } from '../constant/PublicEmailArray';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../Context/Notification/NotificationContextApi';
import { signUpApiFunction, verifyUsersLoginStatus } from '../Helper/api/api';
import { endpointObject, multiplePostApi } from '../Helper/api/multipleAPI';
import {
  countryObject,
  fetchFormattedCountryData,
} from '../Helper/countryDataHelper';
import HelmetSeo from '../Helper/HelmetSeo';
import {
  clearLocalSessionStorage,
  formateAndVerifyPhoneNumber,
  getDataFromSecureCookie,
  isValidEmail,
  verifyPhoneNumberLength,
} from '../Helper/HelperFunctions';
import { URLSafetyCheckerFunction } from '../Helper/URLSafetyCheckerFunction';
import { useDebounce } from '../Hooks/useDebounce';
import { signUpForm } from '../interface/funcParamInterface';
import { OrganizationFormInfoInterface } from '../interface/interface';

const defaultPortalUrlSlug = import.meta.env.VITE_FRONT_END_PORTAL_BASE_URL;

const initialOrganizationFormInfo: OrganizationFormInfoInterface = {
  organizationName: '',
  primaryEmail: '',
  defaultPortalUrlSlug: defaultPortalUrlSlug,
  websiteUrl: '',
  contactNumber: '',
  industry: { label: '', value: '' },
  employeeCount: '',
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
  () => import('../Components/Animation/AuthLottieAnimation')
);

function SignUp() {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const useEffectRef = useRef(false);
  const CountryDataRef = useRef(false);
  const navigate = useNavigate();

  const [showGlobalLoader, setShowGlobalLoader] = useState(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [showErrorPageTwo, setShowErrorPageTwo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [portalUrl, setPortalUrl] = useState('' as string);
  const [formData, setFormData] = useState<OrganizationFormInfoInterface>(
    initialOrganizationFormInfo
  );
  const [urlSafetyStatus, setUrlSafetyStatus] = useState<{
    urlStatus: '' | 'invalid' | 'unsafe' | 'safe' | 'error';
    isError: boolean;
    isEmptyString: boolean;
  }>({ urlStatus: '', isError: false, isEmptyString: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState<string>('');
  const [dropDownSelectedValue, setDropDownSelectedValue] = useState<
    string | number
  >('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertModalPropsInfo, setAlertModalPropsInfo] = useState(
    initialAlertModalPropsInfo
  );
  const [countryOptionsDataArray, setCountryOptionsDataArray] = useState<
    Array<countryObject>
  >([]);

  const [resendMailLoader, setResendMailLoader] = useState<boolean>(false);

  const hostBlacklistMails = PUBLIC_EMAIL_PROVIDERS?.map((item) => item?.mail);

  const handleMoveToNextPage = () => {
    const is_verified = verifyPhoneNumberLength(
      formData.contactNumber?.trim(),
      dropDownSelectedValue
        ? JSON.parse(dropDownSelectedValue as string)?.country_code
        : 'IN'
    );

    if (
      formData?.organizationName?.trim() === '' ||
      !isValidEmail(formData?.primaryEmail, hostBlacklistMails) ||
      !is_verified
    ) {
      setShowError(true);
      setLoading(false);
      return;
    } else {
      setShowError(false);
      setCurrentPage(2);
    }
  };

  const getEmailErrorMessage = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    const check = PUBLIC_EMAIL_PROVIDERS.find((p) => p.mail === domain);
    if (check) {
      return `public email (${check.company} - ${check.mail}) Not Allowed`;
    }
    return 'Please enter a valid email address.';
  };

  const handelClickOnSearchDrop = (
    data: string | object,
    key: 'industry' | 'employeeCount'
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: data,
    }));
  };

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
  const handleUrlVerificationWithDebounce = async (websiteUrl: string) => {
    const res = await URLSafetyCheckerFunction(websiteUrl);
    setUrlSafetyStatus(res);
    return res;
  };
  const handleFormSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    const verificationResponse = await handleUrlVerificationWithDebounce(
      formData.websiteUrl
    );

    const is_verified = verifyPhoneNumberLength(
      formData.contactNumber?.trim(),
      dropDownSelectedValue
        ? JSON.parse(dropDownSelectedValue as string)?.country_code
        : 'IN'
    );

    if (
      is_verified &&
      termsAccepted == 'true' &&
      isValidEmail(formData?.primaryEmail, hostBlacklistMails) &&
      formData.industry.value !== '' &&
      formData.employeeCount !== '' &&
      verificationResponse.urlStatus == 'safe' &&
      !verificationResponse.isError
    ) {
      setLoading(true);
      const data: signUpForm = {
        organizationName: formData.organizationName,
        contactNumber: formData.contactNumber,
        countryInfo: dropDownSelectedValue as string,
        defaultPortalUrlSlug: formData.defaultPortalUrlSlug,
        portalUrl: portalUrl,
        primaryEmail: formData.primaryEmail,
        termsAccepted: termsAccepted == 'true' ? true : false,
        websiteUrl: formData.websiteUrl,
        industry: formData?.industry,
        employeeCount: formData?.employeeCount,
      };

      const response = await signUpApiFunction(
        'auth/sign-up',
        data,
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
    } else {
      setShowErrorPageTwo(true);
      setLoading(false);
    }
  };

  const handelInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handelBackPage = () => {
    setShowErrorPageTwo(false);
    setCurrentPage(1);
  };

  const SignUpFormFirstPage = () => {
    return (
      <div className='grid grid-cols-1 gap-y-5  w-full min-w-full px-5 transition-all duration-100 min-h-[340px]'>
        <div className='w-full'>
          <Input
            name='organizationName'
            className='border border-black/[.65] text-black'
            labelFieldName='Organization Name'
            isRequiredField={true}
            type='text'
            value={formData?.organizationName}
            onChange={(e) => handelInputFieldChange(e)}
            showError={showError && formData?.organizationName?.trim() === ''}
            errorMessage='This field is required.'
            disabled={loading}
          />
        </div>
        <div className='w-full'>
          <Input
            name='primaryEmail'
            className='border border-black/[.65] text-black'
            labelFieldName='Primary Email'
            isRequiredField={true}
            value={formData.primaryEmail}
            type='email'
            onChange={(e) => handelInputFieldChange(e)}
            showError={showError}
            errorMessage={
              showError
                ? formData.primaryEmail?.trim() === ''
                  ? 'This field is required.'
                  : !isValidEmail(formData?.primaryEmail, hostBlacklistMails)
                    ? getEmailErrorMessage(formData?.primaryEmail)
                    : ''
                : ''
            }
            disabled={loading}
          />
        </div>
        <div className='w-full'>
          <label
            htmlFor=''
            className='text-sm font-inter font-normal text-black/[.65] pb-2 inline-block'
          >
            <span className='flex gap-1'>
              <span>Portal Url</span>
              <FaStarOfLife className='w-1.5 text-red-700' />
            </span>
          </label>
          <div className='relative w-full flex items-stretch justify-start'>
            <div className='flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-5'>
              <span className='block text-nowrap text-ellipsis overflow-hidden max-w-[180px]'>
                {formData.defaultPortalUrlSlug}
              </span>
            </div>
            <Input
              name='portalUrl'
              className='border border-black/[.65] border-l-0 rounded-l-none text-black w-full'
              type='text'
              value={portalUrl?.toLocaleLowerCase()}
              setValue={setPortalUrl}
              disabled={loading}
            />
          </div>
          {showError && portalUrl.trim() === '' && (
            <span className='text-rose-600  text-xs  mt-1 block px-1.5 font-inter'>
              This field is required.
            </span>
          )}
        </div>
        <div className='w-full'>
          <Input
            type='number'
            name='contactNumber'
            className='border border-black/[.65] text-black rounded-lg rounded-l-none'
            labelFieldName='Contact Number'
            isRequiredField={true}
            value={formateAndVerifyPhoneNumber(
              formData?.contactNumber,
              dropDownSelectedValue
                ? JSON.parse(dropDownSelectedValue as string)?.country_code
                : 'IN'
            )}
            onChange={(e) => handelInputFieldChange(e)}
            showError={
              showError &&
              !verifyPhoneNumberLength(
                formData.contactNumber?.trim(),
                dropDownSelectedValue
                  ? JSON.parse(dropDownSelectedValue as string)?.country_code
                  : 'IN'
              )
            }
            countryDropDownPosition='bottom'
            dropDownSelectedValue={
              dropDownSelectedValue
                ? JSON.parse(dropDownSelectedValue as string)
                    ?.country_number_code
                : '+91'
            }
            setDropDownSelectedValue={setDropDownSelectedValue}
            errorMessage={
              showError &&
              !verifyPhoneNumberLength(
                formData.contactNumber?.trim(),
                dropDownSelectedValue
                  ? JSON.parse(dropDownSelectedValue as string)?.country_code
                  : 'IN'
              )
                ? 'Please Enter valid Phone No'
                : ''
            }
            countryOptionsData={countryOptionsDataArray}
            disabled={loading}
          />
        </div>
      </div>
    );
  };

  const SignUpFormSecondPage = () => {
    return (
      <div className='flex flex-col gap-y-5 justify-between w-full min-w-full px-5 transition-all duration-100 min-h-[340px]'>
        <div className='w-full'>
          <Input
            name='websiteUrl'
            className='border border-black/[.65] text-black'
            labelFieldName='Website URL'
            type='text'
            value={formData?.websiteUrl}
            onChange={(e) => handelInputFieldChange(e)}
            showError={showErrorPageTwo && urlSafetyStatus.urlStatus != 'safe'}
            errorMessage={
              formData?.websiteUrl.length == 0
                ? showError
                  ? 'this is the required field to move further'
                  : ''
                : urlSafetyStatus.urlStatus != 'safe'
                  ? WebsiteUrlSafetyCheckErrorMessages[
                      urlSafetyStatus.urlStatus
                    ]
                  : ''
            }
            disabled={loading}
          />
        </div>
        <div className='w-full'>
          <SearchDrop
            options={industryType}
            searchKey='value'
            isRequiredField={true}
            labelFieldName='Organization Type'
            selectedValue={formData.industry.value}
            onSelectValBtn={(data) => handelClickOnSearchDrop(data, 'industry')}
            position='bottom'
            emptyDataMessage={'No Option'}
            showError={showErrorPageTwo}
            errorMessage={
              showErrorPageTwo && formData.industry.value?.trim() == ''
                ? 'this is an required field'
                : ''
            }
            disabled={loading}
          />
        </div>
        <div className='w-full'>
          <SearchDrop
            options={EmployeeCountArray}
            searchKey=''
            isRequiredField={true}
            labelFieldName='Employee Strength'
            selectedValue={formData.employeeCount}
            onSelectValBtn={(data) =>
              handelClickOnSearchDrop(data, 'employeeCount')
            }
            position='bottom'
            emptyDataMessage={'No Option'}
            showError={showErrorPageTwo}
            errorMessage={
              showErrorPageTwo && formData.employeeCount?.trim() == ''
                ? 'this is an required field'
                : ''
            }
            disabled={loading}
          />
        </div>
        <div className='w-full'>
          <div className='w-full flex items-center justify-start gap-3.5 relative z-[25]'>
            <Input
              type='checkbox'
              name='termsAccepted'
              value={termsAccepted}
              setValue={setTermsAccepted}
            />
            <div>
              <p className='font-inter font-semibold text-sm text-black'>
                I agree to the terms and conditions
              </p>
              <p className='font-inter font-normal text-xs text-black'>
                Please read the Terms and Conditions before proceeding.
              </p>
            </div>
          </div>
          {showErrorPageTwo && termsAccepted != 'true' && (
            <span className='text-rose-600  text-xs  mt-1.5 block px-1.5 font-inter'>
              This field is required.
            </span>
          )}
        </div>
      </div>
    );
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
    setPortalUrl(
      formData.organizationName
        ?.toLocaleLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
    );
  }, [formData.organizationName]);

  useEffect(() => {
    const loadCountryData = async () => {
      if (CountryDataRef.current) return;
      CountryDataRef.current = true;
      if (countryOptionsDataArray.length === 0) {
        const response = await fetchFormattedCountryData();
        if (response?.success) {
          setCountryOptionsDataArray(response?.countryOptionsData);
          setDropDownSelectedValue(JSON.stringify(response.filteredCountry));
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

      <MainSuspenseLoader loading={showGlobalLoader} />
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
                      Join now and bring all your resources into one orbit!
                    </p>
                  </div>
                </div>
                <div className='w-full'>
                  <div className='w-full flex transition-all'>
                    {currentPage == 1
                      ? SignUpFormFirstPage()
                      : SignUpFormSecondPage()}
                    {/* Second Page */}
                  </div>
                </div>
                <div className='w-full grid grid-cols-1 gap-y-8 px-5'>
                  {currentPage == 1 ? (
                    <button
                      type='button'
                      className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all'
                      disabled={loading}
                      onClick={handleMoveToNextPage}
                    >
                      <span>Next</span>
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed'
                      disabled={loading}
                      onClick={handleFormSubmit}
                    >
                      {loading ? (
                        <Loader loaderText='Submitting...' />
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  )}
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

export default React.memo(SignUp);
