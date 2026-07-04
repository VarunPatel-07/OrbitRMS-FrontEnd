import { useEffect, useRef, useState } from 'react';

import {
   MdCheck,
   MdContentCopy,
   MdErrorOutline,
   MdHourglassEmpty,
   MdOutlineSecurity,
   MdVerifiedUser,
} from 'react-icons/md';

import {
   RenderTurnstileInstructionState,
   TurnstileVerificationModalPropsInterface,
   VerificationModalState,
} from '@/interface/ApiManager.interface';

import Button from '@/components/common/Button';
import DialogModalContainer from '@/components/common/DialogModalContainer';

const REQUIRED_TURNSTILE_DOMAIN = 'app.orbitrms.com';
const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';
const TURNSTILE_SCRIPT_SRC =
   'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
   interface Window {
      turnstile?: {
         render: (
            container: HTMLElement,
            options: {
               sitekey: string;
               callback: (token: string) => void;
               'error-callback': () => void;
               'expired-callback': () => void;
            }
         ) => string;
         remove: (widgetId: string) => void;
         reset: (widgetId: string) => void;
      };
   }
}

const loadTurnstileScript = () =>
   new Promise<void>((resolve, reject) => {
      if (window.turnstile) {
         resolve();
         return;
      }

      const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);

      if (existingScript) {
         existingScript.addEventListener('load', () => resolve(), {
            once: true,
         });
         existingScript.addEventListener(
            'error',
            () => reject(new Error('Unable to load Turnstile verification.')),
            { once: true }
         );
         return;
      }

      const script = document.createElement('script');
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
         reject(new Error('Unable to load Turnstile verification.'));

      document.body.appendChild(script);
   });

const RenderInstructionState = ({
   handleCopyDomain,
   errorMessage,
   formId,
   siteKey,
   widgetContainerRef,
   widgetResetKey,
}: RenderTurnstileInstructionState) => (
   <>
      <div className='w-full bg-black/[0.03] rounded-lg px-4 py-3 flex items-start gap-3 border border-gray-200'>
         <MdOutlineSecurity className='text-xl text-black mt-0.5 flex-shrink-0' />

         <div className='w-full'>
            <p className='text-sm font-semibold text-black'>
               Verify Turnstile Setup
            </p>

            <p className='text-xs text-black/50 mt-1 leading-relaxed'>
               To verify your Turnstile setup, make sure app.orbitrms.com is
               added in your Cloudflare Turnstile allowed domains list.
            </p>
         </div>
      </div>

      <div className='w-full bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3'>
         <p className='text-xs font-medium text-yellow-700'>
            Required domain for verification
         </p>

         <div className='w-full mt-2 border border-yellow-300 bg-white pl-3 min-h-[42px] flex items-center justify-between rounded-lg overflow-hidden'>
            <span className='font-inter text-sm font-semibold text-black break-all'>
               {REQUIRED_TURNSTILE_DOMAIN}
            </span>

            <button
               type='button'
               aria-label='Copy app.orbitrms.com'
               className='w-[42px] h-[42px] hover:bg-black text-black hover:text-white flex items-center justify-center transition-all border border-yellow-300 border-y-0 border-r-0 flex-shrink-0'
               onClick={handleCopyDomain}
            >
               <MdContentCopy />
            </button>
         </div>

         <p className='text-xs text-yellow-700 mt-3 leading-relaxed'>
            After verification is completed, you can remove app.orbitrms.com
            from Cloudflare if it was only added for OrbitRMS verification.
         </p>
      </div>

      {errorMessage && (
         <div className='w-full bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-xs font-medium'>
            {errorMessage}
         </div>
      )}

      <div className='w-full border border-black/10 bg-gray-50 rounded-lg min-h-[96px] flex items-center justify-center px-4 py-5'>
         {!errorMessage && (
            <div className='min-h-[65px] flex items-center justify-center'>
               <div className='flex items-center gap-2 text-sm font-medium text-black/50'>
                  <span className='size-2 rounded-full bg-blue-500 animate-bounce' />
                  <span className='size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]' />
                  <span className='size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]' />
                  <span>Loading Turnstile verification...</span>
               </div>
            </div>
         )}

         {siteKey && formId ? (
            <div
               key={widgetResetKey}
               ref={widgetContainerRef}
               className='min-h-[65px] hidden items-center justify-center'
            >
               <div className='flex items-center gap-2 text-sm font-medium text-black/50'>
                  <span className='size-2 rounded-full bg-blue-500 animate-bounce' />
                  <span className='size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]' />
                  <span className='size-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]' />
                  <span>Loading Turnstile verification...</span>
               </div>
            </div>
         ) : (
            <p className='text-sm text-red-700 text-center'>{errorMessage}</p>
         )}
      </div>
   </>
);

const RenderVerifyingState = () => (
   <div className='w-full min-h-[250px] px-4 py-8 flex flex-col items-center justify-center gap-5 text-center'>
      <div className='relative size-24 flex items-center justify-center'>
         <div className='absolute inset-0 rounded-full border border-blue-100 bg-blue-50/60 animate-ping' />
         <div className='absolute inset-2 rounded-full border border-blue-100 bg-white shadow-sm' />

         <div className='relative size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20'>
            <MdVerifiedUser className='text-2xl' />
         </div>
      </div>

      <div className='max-w-[410px]'>
         <p className='text-base font-semibold text-black'>
            Verifying Turnstile
         </p>

         <p className='text-sm text-black/50 mt-1 leading-relaxed'>
            Please wait while we verify your Turnstile setup.
         </p>

         <div className='mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-medium text-black/60'>
            <MdHourglassEmpty className='text-base animate-pulse' />
            <span>Checking secure challenge response</span>
            <span className='flex items-center gap-0.5' aria-hidden='true'>
               <span className='size-1 rounded-full bg-blue-500 animate-bounce' />
               <span className='size-1 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]' />
               <span className='size-1 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]' />
            </span>
         </div>
      </div>
   </div>
);

const RenderSuccessState = () => (
   <div className='w-full min-h-[250px] px-4 py-8 flex flex-col items-center justify-center gap-5 text-center'>
      <div className='size-20 rounded-full bg-green-50 text-green-700 flex items-center justify-center border border-green-200 shadow-sm animate-pulse'>
         <div className='size-14 rounded-full bg-green-100 flex items-center justify-center'>
            <MdCheck className='text-4xl' />
         </div>
      </div>

      <div className='max-w-[420px]'>
         <p className='text-base font-semibold text-black'>
            Turnstile Verified Successfully
         </p>

         <p className='text-sm text-black/50 mt-1 leading-relaxed'>
            Your Turnstile setup has been verified and protection is now active
            for this inquiry form.
         </p>

         <div className='mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700'>
            <MdCheck className='text-base' />
            Verification completed
         </div>

         <p className='text-xs text-green-700 mt-3 leading-relaxed'>
            You can now remove app.orbitrms.com from your Cloudflare allowed
            domains list if you only added it for verification.
         </p>
      </div>
   </div>
);

const RenderFailedState = ({ errorMessage }: { errorMessage: string }) => (
   <div className='w-full flex flex-col gap-5'>
      <div className='w-full bg-red-50 border border-red-200 rounded-lg px-4 py-4 flex items-start gap-3'>
         <MdErrorOutline className='text-2xl text-red-700 mt-0.5 flex-shrink-0' />

         <div className='w-full'>
            <p className='text-sm font-semibold text-red-800'>
               Verification Failed
            </p>

            <p className='text-xs text-red-700 mt-1 leading-relaxed'>
               {errorMessage ||
                  'We could not verify your Turnstile setup. Please make sure app.orbitrms.com is added in your Cloudflare Turnstile allowed domains list and try again.'}
            </p>
         </div>
      </div>

      <div className='w-full bg-black/[0.03] border border-black/10 rounded-lg px-4 py-3'>
         <p className='text-xs font-semibold text-black mb-2'>
            Possible reasons
         </p>

         <ul className='list-disc pl-4 text-xs text-black/60 leading-6'>
            <li>app.orbitrms.com is not added in allowed domains</li>
            <li>Site key is incorrect</li>
            <li>Secret key is incorrect</li>
            <li>Turnstile token expired</li>
            <li>Cloudflare widget is not active</li>
         </ul>
      </div>
   </div>
);

function TurnstileVerificationModal({
   showModal,
   setShowModal,
   formId,
   siteKey,
   handleClickOnCopyBtn,
   onVerifyToken,
   onVerified,
}: TurnstileVerificationModalPropsInterface) {
   const widgetContainerRef = useRef<HTMLDivElement>(null);
   const widgetIdRef = useRef<string | null>(null);
   const [verificationState, setVerificationState] =
      useState<VerificationModalState>('instruction');
   const [errorMessage, setErrorMessage] = useState<string>('');
   const [widgetResetKey, setWidgetResetKey] = useState<number>(0);

   const canClose = verificationState !== 'verifying';

   const handleClose = () => {
      if (!canClose) return;

      setShowModal(false);
   };

   const handleCopyDomain = () => {
      handleClickOnCopyBtn(
         REQUIRED_TURNSTILE_DOMAIN,
         'Cloudflare Turnstile Verification Domain Copied Successfully'
      );
   };

   const resetWidget = () => {
      if (widgetIdRef.current && window.turnstile) {
         window.turnstile.remove(widgetIdRef.current);
      }

      widgetIdRef.current = null;
      setErrorMessage('');
      setVerificationState('instruction');
      setWidgetResetKey((prev) => prev + 1);
   };

   const handleVerifyToken = async (token: string) => {
      setVerificationState('verifying');
      setErrorMessage('');

      const response = await onVerifyToken(token);

      if (response.success) {
         setVerificationState('success');
         onVerified?.();
         return;
      }

      setErrorMessage(
         response.message ||
            'We could not verify your Turnstile setup. Please try again.'
      );
      setVerificationState('failed');
   };

   useEffect(() => {
      if (!showModal) {
         return;
      }

      setVerificationState('instruction');
      setErrorMessage('');
      setWidgetResetKey((prev) => prev + 1);
   }, [showModal]);

   useEffect(() => {
      let isMounted = true;

      if (
         !showModal ||
         verificationState !== 'instruction' ||
         !widgetContainerRef.current
      ) {
         return;
      }

      if (!siteKey) {
         setErrorMessage(
            'Turnstile site key is missing. Please update your Turnstile setup and try again.'
         );
         return;
      }

      if (!formId) {
         setErrorMessage(
            'Inquiry form is missing. Please close this modal and try again.'
         );
         return;
      }

      loadTurnstileScript()
         .then(() => {
            if (
               !isMounted ||
               !window.turnstile ||
               !widgetContainerRef.current
            ) {
               return;
            }

            widgetContainerRef.current.innerHTML = '';
            widgetIdRef.current = window.turnstile.render(
               widgetContainerRef.current,
               {
                  sitekey: siteKey,
                  callback: handleVerifyToken,
                  'error-callback': () => {
                     setErrorMessage(
                        'We could not load the Turnstile challenge. Please make sure app.orbitrms.com is added in Cloudflare.'
                     );
                     setVerificationState('failed');
                  },
                  'expired-callback': () => {
                     setErrorMessage(
                        'Turnstile token expired. Please retry verification.'
                     );
                     setVerificationState('failed');
                  },
               }
            );
         })
         .catch((error: Error) => {
            if (!isMounted) return;

            setErrorMessage(error.message);
            setVerificationState('failed');
         });

      return () => {
         isMounted = false;

         if (widgetIdRef.current && window.turnstile) {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
         }
      };
   }, [formId, showModal, siteKey, verificationState, widgetResetKey]);

   return (
      <DialogModalContainer
         show={showModal}
         onClose={canClose ? handleClose : () => undefined}
         loading={!canClose}
         maxWidth='600px'
         closeWhenClickOutside={false}
         modalTitle={
            verificationState === 'success'
               ? 'Turnstile Verified Successfully'
               : verificationState === 'failed'
                 ? 'Verification Failed'
                 : verificationState === 'verifying'
                   ? 'Verifying Turnstile'
                   : 'Verify Turnstile Setup'
         }
      >
         <div className='w-full'>
            <div className='px-5 py-6 flex flex-col gap-5 w-full'>
               {verificationState === 'instruction' &&
                  RenderInstructionState({
                     handleCopyDomain,
                     errorMessage,
                     formId,
                     siteKey,
                     widgetContainerRef,
                     widgetResetKey,
                  })}
               {verificationState === 'verifying' && RenderVerifyingState()}
               {verificationState === 'success' && RenderSuccessState()}
               {verificationState === 'failed' &&
                  RenderFailedState({ errorMessage })}
            </div>

            {verificationState === 'instruction' && (
               <div className='px-5 pb-5 w-full'>
                  <Button
                     type='button'
                     className='w-full text-black bg-white py-2.5 rounded-lg border border-black/10 hover:bg-black hover:text-white transition-colors text-sm font-medium'
                     onClick={handleClose}
                  >
                     Cancel
                  </Button>
               </div>
            )}

            {verificationState === 'success' && (
               <div className='px-5 pb-5 w-full'>
                  <Button
                     type='button'
                     className='w-full text-white bg-black py-2.5 rounded-lg border border-black hover:bg-white hover:text-black transition-colors text-sm font-medium'
                     onClick={handleClose}
                  >
                     Done
                  </Button>
               </div>
            )}

            {verificationState === 'failed' && (
               <div className='px-5 pb-5 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                  <Button
                     type='button'
                     className='text-black bg-white py-2.5 rounded-lg border border-black/10 hover:bg-black hover:text-white transition-colors text-sm font-medium'
                     onClick={handleClose}
                  >
                     Close
                  </Button>

                  <Button
                     type='button'
                     className='text-white bg-black py-2.5 rounded-lg border border-black hover:bg-white hover:text-black transition-colors text-sm font-medium'
                     onClick={resetWidget}
                  >
                     Retry Verification
                  </Button>
               </div>
            )}
         </div>
      </DialogModalContainer>
   );
}

export default TurnstileVerificationModal;
