import { useEffect, useState } from 'react';

import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa6';
import { MdContentCopy, MdOutlineSecurity } from 'react-icons/md';

import { ViewTurnStileModalPropsInterface } from '@/interface/ApiManager.interface';

import Button from '@/components/common/Button';
import DialogModalContainer from '@/components/common/DialogModalContainer';
import { decryptDataService } from '@/utils/helpers/encryption.helper';

const BooleanBadge = ({ value }: { value?: boolean }) => {
   return (
      <span
         className={`w-fit rounded-full px-3 py-1 text-xs font-medium border ${
            value
               ? 'bg-green-50 text-green-700 border-green-200'
               : 'bg-red-50 text-red-700 border-red-200'
         }`}
      >
         {value ? 'Enabled' : 'Disabled'}
      </span>
   );
};

const DetailRow = ({
   label,
   value,
}: {
   label: string;
   value?: string | number | null;
}) => {
   return (
      <div className='w-full flex flex-col gap-1'>
         <p className='text-xs font-medium text-black/50'>{label}</p>
         <p className='text-sm font-medium text-black break-all capitalize'>
            {value || '-'}
         </p>
      </div>
   );
};

const SecureSiteKeyField = ({
   encryptedSiteKey,
   handleClickOnCopyBtn,
}: {
   encryptedSiteKey?: string | null;
   handleClickOnCopyBtn: (text: string, message: string) => void;
}) => {
   const [siteKey, setSiteKey] = useState('');
   const [showSiteKey, setShowSiteKey] = useState(false);

   useEffect(() => {
      let isMounted = true;

      const decryptSiteKey = async () => {
         if (!encryptedSiteKey) {
            setSiteKey('');
            return;
         }

         try {
            const decryptedData = await decryptDataService(encryptedSiteKey);

            if (isMounted) {
               setSiteKey(
                  typeof decryptedData === 'string'
                     ? decryptedData
                     : encryptedSiteKey
               );
            }
         } catch (error) {
            console.log('Turnstile site key decrypt error', error);

            if (isMounted) {
               setSiteKey(encryptedSiteKey);
            }
         }
      };

      decryptSiteKey();

      return () => {
         isMounted = false;
      };
   }, [encryptedSiteKey]);

   if (!encryptedSiteKey) {
      return <p className='text-sm text-black/50'>-</p>;
   }

   return (
      <div className='w-full flex flex-col gap-1'>
         <p className='text-xs font-medium text-black/50'>Turnstile Site Key</p>

         <div className='w-full border border-black/10 bg-gray-100 pl-3 min-h-[38px] flex items-center justify-between rounded-lg overflow-hidden'>
            <div className='w-full overflow-hidden'>
               {showSiteKey ? (
                  <span className='font-inter text-sm font-medium text-black break-all'>
                     {siteKey || '-'}
                  </span>
               ) : (
                  <span className='flex items-center justify-start w-full h-full gap-0.5 text-black/80'>
                     {Array.from({
                        length: siteKey?.length || encryptedSiteKey?.length,
                     }).map((_, index) => (
                        <FaStarOfLife key={index} className='text-[8px]' />
                     ))}
                  </span>
               )}
            </div>

            <div className='flex items-center justify-end flex-shrink-0 pl-3'>
               <button
                  type='button'
                  className='w-[38px] h-[38px] hover:bg-black text-black hover:text-white flex items-center justify-center transition-all border border-black/10 border-y-0 border-r-0'
                  onClick={() =>
                     handleClickOnCopyBtn(
                        siteKey || encryptedSiteKey,
                        'Cloudflare Turnstile Site Key Copied Successfully'
                     )
                  }
               >
                  <MdContentCopy />
               </button>

               <button
                  type='button'
                  className='w-[38px] h-[38px] hover:bg-black text-black hover:text-white flex items-center justify-center transition-all border border-black/10 border-y-0 border-r-0'
                  onClick={() => setShowSiteKey((prev) => !prev)}
               >
                  {showSiteKey ? <FaEye /> : <FaEyeSlash />}
               </button>
            </div>
         </div>
      </div>
   );
};

function ViewTurnStileModal({
   showModal,
   setShowModal,
   turnstileData,
   handleClickOnCopyBtn,
}: ViewTurnStileModalPropsInterface) {
   const handleClose = () => {
      setShowModal(false);
   };

   return (
      <DialogModalContainer
         show={showModal}
         onClose={handleClose}
         loading={false}
         maxWidth='650px'
         modalTitle='Turnstile Details'
      >
         <div className='w-full'>
            <div className='px-5 py-6 flex flex-col gap-5 w-full'>
               {/* Status Box */}
               <div className='w-full bg-black/[0.03] rounded-lg px-4 py-3 flex items-start gap-3 border border-gray-200'>
                  <MdOutlineSecurity className='text-xl text-black mt-0.5' />

                  <div className='w-full'>
                     <p className='text-sm font-semibold text-black'>
                        Cloudflare Turnstile Protection
                     </p>

                     <p className='text-xs text-black/50 mt-0.5'>
                        Current Turnstile configuration for this inquiry form.
                     </p>

                     <div className='mt-3'>
                        <BooleanBadge
                           value={turnstileData?.turnstile_enabled}
                        />
                     </div>
                  </div>
               </div>

               {/* Main Fields */}
               <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <DetailRow
                     label='Email Notification'
                     value={
                        turnstileData?.email_notification
                           ? 'Enabled'
                           : 'Disabled'
                     }
                  />

                  <DetailRow
                     label='Turnstile Mode'
                     value={turnstileData?.turnstile_mode}
                  />
               </div>

               {/* Encrypted Site Key */}
               <SecureSiteKeyField
                  encryptedSiteKey={turnstileData?.turnstile_site_key}
                  handleClickOnCopyBtn={handleClickOnCopyBtn}
               />

               {/* Allowed Domains */}
               <div className='w-full'>
                  <p className='text-xs font-medium text-black/50 mb-2'>
                     Allowed Domains
                  </p>

                  {turnstileData?.allowed_domains &&
                  turnstileData.allowed_domains.length > 0 ? (
                     <div className='flex flex-wrap gap-2'>
                        {JSON.parse(turnstileData.allowed_domains).map(
                           (domain: string) => (
                              <span
                                 key={domain}
                                 className='w-fit inline-flex items-center gap-1.5 bg-black/[0.04] border border-black/10 text-black rounded-full px-3 py-1 text-xs font-medium'
                              >
                                 {domain}
                              </span>
                           )
                        )}
                     </div>
                  ) : (
                     <p className='text-sm text-black/50'>No domain added</p>
                  )}
               </div>
            </div>

            {/* Footer */}
            <div className='px-5 pb-5 w-full'>
               <Button
                  type='button'
                  className='w-full text-white bg-black py-2.5 rounded-lg border border-black hover:bg-white hover:text-black transition-colors text-sm font-medium'
                  onClick={handleClose}
               >
                  Close
               </Button>
            </div>
         </div>
      </DialogModalContainer>
   );
}

export default ViewTurnStileModal;
