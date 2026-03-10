import { useEffect, useRef, useState } from 'react';

import { BsCheckCircle } from 'react-icons/bs';
import { MdOutlineDoNotDisturbOn } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { classNames } from '../Helper/HelperFunctions';
import { AlertModalProps } from '../interface/propsInterface';
import Button from './Button';
import Loader from './Loader';

function AlertModal(props: AlertModalProps) {
  const { ModalInfo, showAlertModal, setShowAlertModal, loader } = props;

  const [showModalAnimation, setShowModalAnimation] = useState<boolean>(false);
  const [renderComponent, setRenderComponent] = useState<boolean>(false);

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (!ModalInfo?.protected) {
        if (
          boxRef.current &&
          !boxRef.current.contains(event.target as Node) &&
          !loader
        ) {
          setShowAlertModal(false);
        }
      }
    };
    if (!loader)
      document.addEventListener('mousedown', handelClickOutSideTheBox);
    return () => {
      document.removeEventListener('mousedown', handelClickOutSideTheBox);
    };
  }, [ModalInfo?.protected, setShowAlertModal]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (showAlertModal) {
      setRenderComponent(true); // Mount modal

      // Trigger show animation slightly later
      timeout = setTimeout(() => {
        setShowModalAnimation(true);
      }, 100); // Small delay for transition to kick in
    } else {
      setShowModalAnimation(false); // Start hide animation

      // After animation duration, unmount the modal
      timeout = setTimeout(() => {
        setRenderComponent(false);
      }, 500); // Match with your CSS `duration-300`
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showAlertModal]);

  if (renderComponent)
    return (
      <div
        role='dialog'
        title='alert-modal-title'
        aria-describedby='alert-modal-description'
        className={classNames(
          'w-screen h-screen absolute top-0 left-0 z-50 bg-black/[0.6] backdrop-blur-[1px] transition-all ease-in-out',

          {
            'opacity-0 pointer-events-none invisible': !showModalAnimation,
            'opacity-100 visible': showModalAnimation,
          }
        )}
      >
        <div
          className={classNames(
            'w-full h-full flex items-center justify-center p-4 transition-all ease-in-out',
            {
              'scale-70 pointer-events-none invisible opacity-0':
                !showModalAnimation,
              'scale-100 visible opacity-100': showModalAnimation,
            }
          )}
        >
          <div
            className='min-w-1/2 max-w-[500px] rounded-lg bg-white px-8 py-10'
            ref={boxRef}
            tabIndex={-1}
          >
            <div className='grid grid-cols-1 gap-8'>
              {/* It Is used To Show Case The Icon Related To The Action Modal */}
              <div className='w-full flex items-center justify-center'>
                <div className='w-[110px] h-[110px] relative'>
                  <span
                    className={classNames(
                      'rounded-full flex items-center justify-center aspect-square w-[90px] h-[90px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]',
                      {
                        'border-2 border-red-700/[0.1]': !ModalInfo.success,
                        'border-2 border-green-700/[0.1]': ModalInfo.success,
                      }
                    )}
                  ></span>
                  <span
                    className={classNames(
                      'rounded-full flex items-center justify-center aspect-square w-[75px] h-[75px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2]',
                      {
                        'border-2 border-red-700/[0.25]': !ModalInfo.success,
                        'border-2 border-green-700/[0.25]': ModalInfo.success,
                      }
                    )}
                  ></span>
                  <span
                    className={classNames(
                      'rounded-full flex items-center justify-center aspect-square w-[60px] h-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3]',
                      {
                        'border-2 border-red-700/[0.35]': !ModalInfo.success,
                        'border-2 border-green-700/[0.35]': ModalInfo.success,
                      }
                    )}
                  ></span>
                  <span
                    className={classNames(
                      'rounded-full flex items-center justify-center aspect-square w-[45px] h-[45px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[4]',
                      {
                        'border-2 border-red-700/[0.6]': !ModalInfo.success,
                        'border-2 border-green-700/[0.6]': ModalInfo.success,
                      }
                    )}
                  ></span>
                  {ModalInfo.success ? (
                    <BsCheckCircle className='text-green-700 w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]' />
                  ) : (
                    <MdOutlineDoNotDisturbOn className='text-red-700 w-7 h-7 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]' />
                  )}
                </div>
              </div>
              <div className='w-full'>
                <h3 className='text-black text-2xl font-semibold font-inter text-pretty text-center'>
                  {ModalInfo?.alertModalTitle}
                </h3>
              </div>
              <div className='w-full'>
                <p
                  className='text-black font-inter text-sm text-pretty'
                  dangerouslySetInnerHTML={{
                    __html: ModalInfo?.alertModelInfo,
                  }}
                ></p>
              </div>
              <div className='w-full'>
                <div className='grid grid-cols-1 gap-5 items-center justify-center'>
                  {ModalInfo?.optionsButtonArray?.map((item, index) => {
                    const isButton = !item?.link;
                    const commonContent = (
                      <span className='flex items-center justify-center gap-2'>
                        {item?.icon}
                        <span>{item?.buttonTitle || 'Default Title'}</span>
                      </span>
                    );

                    return isButton ? (
                      <Button
                        type='button'
                        className={item?.classNames || 'default-class'}
                        onClick={item?.onclickFunction}
                        key={index}
                        disabled={loader}
                      >
                        {loader ? <Loader loaderText='' /> : commonContent}
                      </Button>
                    ) : (
                      <Link
                        to={item?.link || '#'}
                        className={item?.classNames || 'default-class'}
                        key={index}
                      >
                        {commonContent}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AlertModal;
