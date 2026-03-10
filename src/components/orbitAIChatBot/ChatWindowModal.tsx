import { useContext, useEffect, useRef, useState } from 'react';

import { IoClose } from 'react-icons/io5';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

// import Loader from '../../common/Loader';
import {
  NotificationContext,
  NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import { ChatWindowModalInterface } from '@/interface/OrbitAIChatBot.interface';

import { useDebounce } from '@/hooks/useDebounce';

import Button from '@/components/common/Button';
import Image from '@/components/common/Image';
import Input from '@/components/common/Input';
import { endpointObject, multiplePostApi } from '@/utils/api/multipleAPI';
import { classNames } from '@/utils/helpers/commonHelpers';

import OrbitAiIcon from '@/assets/Images/orbit-ai-icon-big.png';
import OrbitAiLogo from '@/assets/Images/orbitai-logo.png';

function ChatWindowModal(props: ChatWindowModalInterface) {
  const { handelNotification } = useContext(
    NotificationContext
  ) as NotificationContextApiProps;
  const {
    showModal,
    handelClickOnCloseBtn,
    orbitAiBaseData,
    successEventHandler,
  } = props;

  const [checkbox, setCheckbox] = useState<string>('false');

  const modalBoxRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(showModal);
  const [isMounted, setIsMounted] = useState(false);
  const [message, setMessage] = useState('');
  const [preUploadedImages, setPreUploadedImages] = useState<string[]>([]);
  const [orbitAiResponse, setOrbitAiResponse] = useState<
    { content: string; role: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultWrapperRef = useRef<HTMLDivElement>(null);
  const scrollDivReference = useRef<HTMLDivElement>(null);

  const handelClickOnSendButton = () => {
    if (message.length == 0) {
      setShowError(true);
    } else {
      setLoading(true);
      handelApiCallingWithDebounce();
    }
  };

  const handelApiCallingWithDebounce = useDebounce(async () => {
    const formData = new FormData();
    formData.append('user_input', message);
    formData.append('send_image_to_ai', checkbox === 'true' ? 'true' : 'false');
    if (orbitAiResponse) {
      formData.append('conversation', JSON.stringify(orbitAiResponse));
    }
    if (preUploadedImages.length > 0) {
      preUploadedImages?.map((item) => {
        formData.append('existing_images', item);
      });
    } else {
      orbitAiBaseData?.new_images?.map((item) => {
        formData.append('new_images', item.file);
      });
      orbitAiBaseData?.existing_images?.map((item) => {
        formData.append('existing_images', item);
      });
    }

    const multipartHeader = {
      'Content-Type': 'multipart/form-data',
    };

    const endpointArr: endpointObject[] = [
      {
        endPoint: 'orbit-ai/conversation',
        protected: true,
        data: formData,
        header: multipartHeader,
      },
    ];
    const response = await multiplePostApi(endpointArr);

    const res = response[0];

    if (res?.success) {
      setLoading(false);
      const orbitAiResponse = [
        { content: message, role: 'user' },
        ...res.data.ai_response,
      ];

      setPreUploadedImages(res?.data?.uploaded_images);
      setOrbitAiResponse((previousData) => [
        ...previousData,
        ...orbitAiResponse,
      ]);
      setMessage('');
      setTimeout(() => {
        const textarea = textareaRef.current;
        const resultWrapper = resultWrapperRef.current;
        const scrollDiv = scrollDivReference.current;
        if (!textarea) return;
        textarea.style.height = '50px';
        if (resultWrapper) resultWrapper.style.paddingBottom = `25px`;
        if (scrollDiv)
          scrollDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 10);
    } else {
      handelNotification(res, 'top-right');
    }
  }, 100);

  const handleCloseBtn = () => {
    handelClickOnCloseBtn();
    setOrbitAiResponse([]);
    setPreUploadedImages([]);
    setMessage('');
  };

  const OnSuccessButtonClick = (content: string) => {
    if (successEventHandler) successEventHandler(content);
    setLoading(false);
    handleCloseBtn();
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    const resultWrapper = resultWrapperRef.current;
    if (!textarea) return;

    textarea.style.height = '50px';
    const scrollHeight = textarea.scrollHeight;

    textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
    if (resultWrapper)
      resultWrapper.style.paddingBottom = `${Math.min(scrollHeight + 20, 250)}px`;
  }, [message]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loading]);

  useEffect(() => {
    if (showModal) {
      setIsMounted(true);
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setTimeout(() => {
        setIsMounted(false);
      }, 300);
    }
  }, [showModal]);

  if (!isMounted) return null;
  if (isMounted)
    return (
      <div
        className={classNames(
          'w-screen h-screen fixed top-0 left-0 bg-black/40 z-50 backdrop-blur-sm transition-all duration-300',
          {
            'opacity-0 pointer-events-none invisible': !isVisible,
            'opacity-100 visible': isVisible,
          }
        )}
      >
        <div className='w-full h-full flex items-center justify-center p-4'>
          <div
            className={classNames(
              'bg-white rounded-2xl w-full max-w-[720px] shadow-2xl mx-auto relative overflow-hidden transition-all duration-300 flex flex-col h-[85vh] max-h-[680px]',
              {
                'opacity-0 scale-95 invisible': !isVisible,
                'opacity-100 scale-100 visible': isVisible,
              }
            )}
            ref={modalBoxRef}
          >
            {/* Header */}
            <div className='relative bg-gradient-to-r from-indigo-200 to-purple-200 px-6 py-3.5 flex items-center justify-between shadow-lg'>
              <div className='flex items-center gap-3'>
                <div>
                  <Image
                    src={OrbitAiLogo}
                    width={120}
                    className='w-32 object-cover'
                    alt='Orbit Ai Logo'
                  />
                </div>
              </div>
              <Button
                type='button'
                className='bg-white hover:bg-white/90 backdrop-blur-sm rounded-full p-2 border-0 transition-all duration-200'
                onClick={() => handleCloseBtn()}
              >
                <IoClose className='text-gray-800 text-xl' />
              </Button>
            </div>

            <div className='relative flex-1 flex flex-col bg-gray-50 overflow-hidden'>
              <div className='flex-1 overflow-auto px-6 py-6 space-y-4 hide-scrollbar'>
                {loading ? (
                  <SkeletonTheme baseColor='#e5e7eb' highlightColor='#f3f4f6'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className={classNames('w-full flex', {
                          'justify-end': index % 2 === 1,
                          'justify-start': index % 2 === 0,
                        })}
                      >
                        <Skeleton
                          width={index % 2 === 1 ? '70%' : '85%'}
                          height={70}
                          borderRadius={16}
                        />
                      </div>
                    ))}
                  </SkeletonTheme>
                ) : (
                  <>
                    {orbitAiResponse?.map((data, index) => {
                      if (data?.role === 'assistant') {
                        return (
                          <div key={index} className='flex justify-start'>
                            <div className='bg-white border border-gray-200 px-5 py-4 rounded-2xl max-w-[85%] shadow-sm'>
                              <p className='text-gray-800 leading-relaxed text-[15px]'>
                                {data?.content}
                              </p>
                              <button
                                className='bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 mt-3 shadow-sm'
                                onClick={() =>
                                  OnSuccessButtonClick(data?.content)
                                }
                              >
                                Use This
                              </button>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={index} className='flex justify-end'>
                            <div className='bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 rounded-2xl max-w-[80%] shadow-sm'>
                              <p className='text-white leading-relaxed text-[15px]'>
                                {data?.content}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    })}
                  </>
                )}
                <div ref={resultWrapperRef}></div>
                <div ref={scrollDivReference}></div>
              </div>

              {/* Empty State */}
              <div
                className={classNames(
                  'absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center transition-all duration-300 z-10',
                  {
                    'opacity-0 pointer-events-none':
                      !loading && orbitAiResponse.length > 0,
                  }
                )}
              >
                <div className='flex items-center justify-center flex-col gap-4 px-6'>
                  <div className='relative'>
                    <Image
                      src={OrbitAiIcon}
                      className={classNames(
                        'w-32 h-32 object-cover drop-shadow-lg',
                        {
                          'animate-pulse': loading,
                        }
                      )}
                      alt='Orbit Ai Logo'
                    />
                    {loading && (
                      <div className='absolute -bottom-2 left-1/2 -translate-x-1/2'>
                        <div className='flex gap-1'>
                          <span
                            className='w-2 h-2 bg-indigo-500 rounded-full animate-bounce'
                            style={{ animationDelay: '0ms' }}
                          ></span>
                          <span
                            className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'
                            style={{ animationDelay: '150ms' }}
                          ></span>
                          <span
                            className='w-2 h-2 bg-indigo-500 rounded-full animate-bounce'
                            style={{ animationDelay: '300ms' }}
                          ></span>
                        </div>
                      </div>
                    )}
                  </div>
                  {loading ? (
                    <p className='text-gray-600 font-medium text-lg'>
                      Thinking...
                    </p>
                  ) : (
                    <div className='text-center'>
                      <p className='text-gray-700 font-semibold text-lg mb-1'>
                        Say hello to OrbitAI!
                      </p>
                      <p className='text-gray-500 text-sm'>
                        Ask me anything to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className='bg-white border-t border-gray-200 px-6 py-4'>
              <div
                className={classNames(
                  'w-full flex items-end bg-gray-50 rounded-xl overflow-hidden transition-all relative border-2',
                  {
                    'border-red-400': showError,
                    'border-gray-200 focus-within:border-indigo-400':
                      !showError,
                  }
                )}
              >
                <textarea
                  rows={1}
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder='Type your message here...'
                  className='grow resize-none border-none outline-none px-4 py-3 text-[15px] text-gray-900 bg-transparent min-h-[50px] max-h-[200px] transition-all hide-scrollbar disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400'
                  disabled={loading}
                />
                <Button
                  type='button'
                  className='bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed border-none outline-none p-2 rounded-lg m-2 transition-all shadow-sm'
                  onClick={handelClickOnSendButton}
                  disabled={loading || message?.length == 0}
                >
                  <MdKeyboardDoubleArrowRight className='text-2xl text-white' />
                </Button>
              </div>

              {orbitAiBaseData !== null && (
                <>
                  {(orbitAiBaseData?.new_images.length > 0 ||
                    orbitAiBaseData?.existing_images.length > 0) && (
                    <div className='flex items-center justify-start gap-2 px-1 pt-3'>
                      <Input
                        name='checkbox'
                        type='checkbox'
                        value={checkbox}
                        setValue={setCheckbox}
                      />
                      <p className='text-gray-600 text-sm'>
                        Send uploaded images to AI for better understanding
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default ChatWindowModal;
