import { MdContentCopy, MdKey, MdOutlineSecurity } from 'react-icons/md';

import { TurnstileSecretKeyVerificationModalPropsInterface } from '@/interface/ApiManager.interface';

import Button from '@/components/common/Button';
import DialogModalContainer from '@/components/common/DialogModalContainer';

const REQUIRED_TURNSTILE_DOMAIN = 'app.orbitrms.com';

function TurnstileSecretKeyVerificationModal({
   showModal,
   setShowModal,
   handleClickOnCopyBtn,
   onCloseModal,
   onVerifySetup,
}: TurnstileSecretKeyVerificationModalPropsInterface) {
   const handleClose = () => {
      setShowModal(false);

      if (onCloseModal) {
         onCloseModal();
      }
   };

   const handleVerifySetup = () => {
      onVerifySetup();
   };

   const handleCopyDomain = () => {
      handleClickOnCopyBtn(
         REQUIRED_TURNSTILE_DOMAIN,
         'Cloudflare Turnstile Verification Domain Copied Successfully'
      );
   };

   return (
      <DialogModalContainer
         show={showModal}
         onClose={handleClose}
         loading={false}
         maxWidth='600px'
         modalTitle='Turnstile Keys Saved'
         closeWhenClickOutside={false}
      >
         <div className='w-full'>
            <div className='px-5 py-6 flex flex-col gap-5 w-full'>
               <div className='w-full bg-green-50 rounded-lg px-4 py-4 flex items-start gap-3 border border-green-200'>
                  <div className='w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0'>
                     <MdKey className='text-2xl' />
                  </div>

                  <div className='w-full'>
                     <p className='text-sm font-semibold text-green-800'>
                        Your Turnstile keys have been saved successfully.
                     </p>

                     <p className='text-xs text-green-700 mt-1 leading-relaxed'>
                        To activate Turnstile protection, please verify your
                        setup once.
                     </p>
                  </div>
               </div>

               <div className='w-full bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 flex items-start gap-3'>
                  <MdOutlineSecurity className='text-xl text-yellow-700 mt-0.5 flex-shrink-0' />

                  <div className='w-full'>
                     <p className='text-sm font-semibold text-yellow-800'>
                        Before verifying, add app.orbitrms.com to your
                        Cloudflare Turnstile allowed domains list.
                     </p>

                     <div className='w-full mt-3 border border-yellow-300 bg-white pl-3 min-h-[42px] flex items-center justify-between rounded-lg overflow-hidden'>
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
                        This allows OrbitRMS to render the Turnstile widget and
                        complete verification. Once verification is completed,
                        you can remove app.orbitrms.com from the allowed domains
                        list if you only added it for verification.
                     </p>
                  </div>
               </div>
            </div>

            <div className='px-5 pb-5 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
               <Button
                  type='button'
                  className='text-black bg-white py-2.5 rounded-lg border border-black/10 hover:bg-black hover:text-white transition-colors text-sm font-medium'
                  onClick={handleClose}
               >
                  Verify Later
               </Button>

               <Button
                  type='button'
                  className='text-white bg-black py-2.5 rounded-lg border border-black hover:bg-white hover:text-black transition-colors text-sm font-medium'
                  onClick={handleVerifySetup}
               >
                  Verify Setup
               </Button>
            </div>
         </div>
      </DialogModalContainer>
   );
}

export default TurnstileSecretKeyVerificationModal;
