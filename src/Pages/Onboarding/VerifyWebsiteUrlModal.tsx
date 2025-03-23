import React, {
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MdContentCopy } from 'react-icons/md';

import Input from '../../common/Input';
import Loader from '../../common/Loader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '../../Context/Notification/NotificationContextApi';
import { endpointObject, multiplePostApi } from '../../Helper/api/multipleAPI';
import {
  classNames,
  UniqueMetaTagGeneratingFunction,
} from '../../Helper/HelperFunctions';
import { URLSafetyCheckerFunction } from '../../Helper/URLSafetyCheckerFunction';
import { useDebounce } from '../../Hooks/useDebounce';

export default function VerifyWebsiteUrlModal({
  showModal,
  setShowModal,
  addWebsiteUrlFunction,
  default_website_url,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
  addWebsiteUrlFunction: (
    url: string,
    meta_name: string,
    meta_value: string,
    meta_verified: boolean
  ) => void;
  default_website_url: string;
}) {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;

  const boxRef = useRef<HTMLDivElement>(null);

  const [websiteUrl, setWebsiteUrl] = useState<string>(default_website_url);
  const [urlSafetyStatus, setUrlSafetyStatus] = useState<{
    urlStatus: '' | 'invalid' | 'unsafe' | 'safe' | 'error';
    isError: boolean;
    isEmptyString: boolean;
  }>({ urlStatus: '', isError: false, isEmptyString: false });
  const [metaTag, setMetaTag] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const errorMessages: { [key: string]: string } = {
    invalid: 'The URL format is invalid. Please enter a valid website URL.',
    unsafe: 'This URL is marked as unsafe. Please check your website security.',
    error: 'An error occurred while verifying the URL. Try again later.',
  };

  const handleGenerateMetaTag = () => {
    if (websiteUrl && urlSafetyStatus.urlStatus == 'safe') {
      const tag = UniqueMetaTagGeneratingFunction(20);
      setMetaTag(tag);
    } else {
      setShowError(true);
    }
  };

  const verifyWithDebounce = useDebounce(async () => {
    const data = {
      website_url: websiteUrl,
      meta_name: 'orbitrms',
      meta_value: metaTag,
    };
    const endpointArray: Array<endpointObject> = [
      {
        endPoint: 'organization/verify-meta-tag',
        protected: false,
        data,
      },
    ];

    const response = await multiplePostApi(endpointArray);

    const res = response[0];

    if (res?.success) {
      handelNotification(
        {
          success: res?.match,
          message: res?.match
            ? 'Website Verified Successfully'
            : 'Oops! Meta tag mismatch!',
        },
        'top-right'
      );
      addWebsiteUrlFunction(websiteUrl, 'orbitrms', metaTag, res?.match);
      setShowModal(false);
    } else {
      handelNotification(
        {
          success: res?.match,
          message: 'Unable To Find Meta Tag',
        },
        'top-right'
      );
      addWebsiteUrlFunction(websiteUrl, 'orbitrms', metaTag, res?.match);
      setShowModal(false);
    }

    setLoading(false);
  }, 150);

  const handleVerifyMetaTag = () => {
    setLoading(true);
    verifyWithDebounce();
  };

  const handleUrlVerificationWithDebounce = useDebounce(async () => {
    const res = await URLSafetyCheckerFunction(websiteUrl);
    setUrlSafetyStatus(res);
  }, 500);

  useEffect(() => {
    if (websiteUrl) {
      handleUrlVerificationWithDebounce();
    }
  }, [websiteUrl]);

  const handelCopyButton = () => {
    const metaString = `<meta name="orbitrms" content="${metaTag}"/>`;
    window.navigator.clipboard
      .writeText(metaString)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 300);
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
      });
  };

  useEffect(() => {
    const handleClickOutSideTheBox = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSideTheBox);
    };
  }, [setShowModal]);

  return (
    <div
      className={classNames(
        'w-screen h-screen bg-black/30 absolute top-0 left-0 z-30 transition-all duration-200',
        { 'scale-0': !showModal, 'scale-100': showModal }
      )}
    >
      <div className='w-full h-full p-6 flex items-center justify-center'>
        <div
          className='w-full h-fit max-w-[500px] bg-white rounded-lg p-5'
          ref={boxRef}
        >
          <div className='flex flex-col items-center justify-center gap-6'>
            <div className='w-full'>
              <div className='w-full'>
                <Input
                  type='url'
                  name='general_info.organization_name'
                  labelFieldName='Website URL'
                  className='border border-black/45'
                  isRequiredField={true}
                  value={websiteUrl}
                  setValue={setWebsiteUrl}
                  showError={showError || urlSafetyStatus.urlStatus != 'safe'}
                  errorMessage={
                    websiteUrl.length == 0
                      ? showError
                        ? 'this is the required field to move further'
                        : ''
                      : urlSafetyStatus.urlStatus != 'safe'
                        ? errorMessages[urlSafetyStatus.urlStatus]
                        : ''
                  }
                />
              </div>
            </div>
            <div className='w-full'>
              <div className='w-full h-[200px] bg-black/10 rounded-lg flex items-center justify-center p-6 flex-wrap text-wrap relative'>
                {websiteUrl ? (
                  metaTag ? (
                    <p className='w-full text-wrap break-words whitespace-pre-wrap text-lg text-black font-semibold break-all'>
                      &lt;meta name="orbitrms" content="{metaTag}"/&gt;
                    </p>
                  ) : urlSafetyStatus.urlStatus == 'safe' ? (
                    <p className='text-black text-base font-semibold text-center'>
                      Ready to verify? Click below to generate your meta tag!
                    </p>
                  ) : (
                    <p className='text-black text-base font-semibold text-center'>
                      Enter A Valid URL Formate to generate Meta Tag and confirm
                      Your ownership.
                    </p>
                  )
                ) : (
                  <p className='text-black text-base font-semibold text-center'>
                    No meta tag yet! Enter your website URL to generate one and
                    confirm ownership.
                  </p>
                )}
                {metaTag ? (
                  <button
                    className='flex items-center justify-start text-white text-sm capitalize font-medium gap-1 bg-gray-500 px-2 py-1 rounded-md absolute top-1 right-1'
                    onClick={isCopied ? () => {} : handelCopyButton}
                  >
                    <span>{isCopied ? 'copied' : 'copy'}</span>{' '}
                    <MdContentCopy />
                  </button>
                ) : (
                  ''
                )}
              </div>
              <p className='text-black/60 text-sm font-medium text-start pt-2.5'>
                <span className='text-black font-bold'>Note: </span>Place your
                generated meta tag on all pages of your website. If you're using
                a CMS, check its documentation to apply it globally. Once added,
                click "Verify" to complete verification.
              </p>
            </div>
            <div className='w-full flex flex-col gap-3'>
              <button
                className='bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed'
                onClick={metaTag ? handleVerifyMetaTag : handleGenerateMetaTag}
                disabled={loading || urlSafetyStatus.urlStatus != 'safe'}
              >
                {metaTag ? (
                  loading ? (
                    <Loader loaderText='Verifying...' />
                  ) : (
                    'Verify Meta Tag'
                  )
                ) : (
                  'Generate Meta Tag'
                )}
              </button>
              <button
                className='py-2 border border-black/40 text-black w-full rounded-lg text-base transition-all font-semibold hover:bg-black/5'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
