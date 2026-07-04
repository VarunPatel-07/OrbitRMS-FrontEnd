import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import {
   MdContentCopy,
   MdModeEdit,
   MdSecurity,
   MdVerified,
   MdVisibility,
} from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

import {
   ApiManagerInquiryFromInterface,
   ListInquiryFromColumnsInterface,
} from '@/interface/ApiManager.interface';
import { Column } from '@/interface/ComponentProps.interface';

import Button from '@/components/common/Button';
import { decryptDataService } from '@/utils/helpers/encryption.helper';

const TurnstileSiteKeyCell = ({
   data,
   showApiKey,
   setShowApiKey,
   handleClickOnCopyBtn,
}: {
   data: string;
   showApiKey: boolean;
   setShowApiKey: Dispatch<SetStateAction<boolean>>;
   handleClickOnCopyBtn: (text: string, message: string) => void;
}) => {
   const [siteKey, setSiteKey] = useState<string>('');

   useEffect(() => {
      let isMounted = true;

      const decryptSiteKey = async () => {
         if (!data) {
            setSiteKey('');
            return;
         }

         try {
            const decryptedData = await decryptDataService(data);

            if (isMounted) {
               setSiteKey(
                  typeof decryptedData === 'string' ? decryptedData : data
               );
            }
         } catch (error) {
            console.log('decryptedData Error', error);
            if (isMounted) {
               setSiteKey(data);
            }
         }
      };

      decryptSiteKey();

      return () => {
         isMounted = false;
      };
   }, [data]);

   return (
      <span className='w-fit font-inter text-sm font-medium inline-block'>
         {data ? (
            <div className='flex-grow border border-black/10 bg-gray-100 pl-2 h-[30px] flex items-center justify-start relative group rounded'>
               {showApiKey ? (
                  <span className='w-fit font-inter text-sm font-medium inline-block min-w-[240px]'>
                     {siteKey || '-'}
                  </span>
               ) : (
                  <span className='flex items-center justify-start w-full h-full gap-0.5 text-black/80 font-inter font-medium text-base min-w-[240px]'>
                     {Array.from({
                        length: siteKey?.length || data?.length,
                     }).map((_, index) => (
                        <FaStarOfLife key={index} className='text-[8px]' />
                     ))}
                  </span>
               )}
               <div className='flex items-center justify-end pl-5'>
                  <button
                     className='w-[30px] h-[30px] hover:bg-black  hover:text-white flex items-center justify-center transition-all border border-black/10 border-y-0 border-r-0'
                     onClick={() =>
                        handleClickOnCopyBtn(
                           siteKey || data,
                           'Cloudflare Turnstile Site Key Copied Successfully'
                        )
                     }
                  >
                     <MdContentCopy />
                  </button>
                  <button
                     className='hover:bg-black w-[30px] h-[30px] hover:text-white flex items-center justify-center transition-all border border-black/10 border-y-0 border-r-0'
                     onClick={() => setShowApiKey(!showApiKey)}
                  >
                     {showApiKey ? (
                        <FaEye className='transition-all' />
                     ) : (
                        <FaEyeSlash className='transition-all' />
                     )}
                  </button>
               </div>
            </div>
         ) : (
            '-'
         )}
      </span>
   );
};

export const InquiryFromColumns = ({
   showApiKey,
   showModal,
   setShowTurnStileDetailModal,
   setViewTurnStileDetails,
   setInquiryFormId,
   setShowModal,
   setShowApiKey,
   handleClickOnCopyBtn,
   completeVerificationBtn,
   handleEditTurnstile,
}: ListInquiryFromColumnsInterface): Column[] => [
   {
      key: 'form_id',
      title: 'Form Id',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
         <span className='w-fit font-inter text-sm font-medium inline-block'>
            {data || '-'}
         </span>
      ),
   },
   {
      key: 'form_name',
      title: 'Form Name',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
         <span className='w-fit font-inter text-sm font-medium inline-block'>
            {data || '-'}
         </span>
      ),
   },
   {
      key: 'status',
      title: 'Forms Status',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
         <div className='w-full'>
            {data ? (
               <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
                  Active
               </span>
            ) : (
               <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
                  Inactive
               </span>
            )}
         </div>
      ),
   },

   {
      key: 'turnstile_enabled',
      title: 'TurnStile Enabled',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: boolean) => (
         <div className='w-full'>
            {data ? (
               <span className='text-xs font-medium font-inter bg-green-100 text-green-700 border border-green-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
                  Active
               </span>
            ) : (
               <span className='text-xs font-medium font-inter bg-red-100 text-red-700 border border-red-500 px-4 py-1.5 rounded-full min-w-[80px] max-w-[80px] block text-center'>
                  Inactive
               </span>
            )}
         </div>
      ),
   },
   {
      key: 'turnstile_site_key',
      title: 'Turnstile Site Key',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
         <TurnstileSiteKeyCell
            data={data}
            showApiKey={showApiKey}
            setShowApiKey={setShowApiKey}
            handleClickOnCopyBtn={handleClickOnCopyBtn}
         />
      ),
   },
   {
      key: 'turnstile_mode',
      title: 'TurnStile Mode',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => (
         <span className='w-fit font-inter text-sm font-medium inline-block'>
            {data || '-'}
         </span>
      ),
   },
   {
      key: 'allowed_domains',
      title: 'Allowed Domains',
      isSortable: true,
      isSticky: false,
      canToggleVisibility: true,
      renderContent: (data: string) => {
         let domains: string[] = [];

         try {
            domains = typeof data === 'string' ? JSON.parse(data) : [];
         } catch {
            domains = [];
         }

         const visibleDomains = domains.slice(0, 4);
         const hasMoreDomains = domains.length > 4;

         return (
            <div className='flex flex-wrap gap-2'>
               {visibleDomains.length > 0 ? (
                  <>
                     {visibleDomains.map((item: string, index: number) => (
                        <span
                           key={`${item}-${index}`}
                           className='flex-shrink-0 text-sm font-medium border border-black/20 rounded-lg px-2 py-1 bg-white text-black transition-colors'
                        >
                           {item || '-'}
                        </span>
                     ))}

                     {hasMoreDomains && (
                        <span className='w-fit font-inter text-sm font-medium inline-block'>
                           ...
                        </span>
                     )}
                  </>
               ) : (
                  '-'
               )}
            </div>
         );
      },
   },
   {
      key: 'action',
      title: 'Action',
      isSortable: false,
      isSticky: true,
      canToggleVisibility: true,
      renderContent: (data: ApiManagerInquiryFromInterface) => {
         const isTurnstileEnabled = data.turnstile_enabled;

         return (
            <div className='w-full h-full flex items-center justify-start gap-2'>
               {!isTurnstileEnabled ? (
                  <Button
                     type='button'
                     className='text-blue-700 border border-blue-300 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium'
                     data-tooltip-id={`turnstile_setup_button_${data?.id}`}
                     data-tooltip-content='Setup Turnstile'
                     onClick={() => {
                        setInquiryFormId(data?.id);
                        setShowModal(!showModal);
                     }}
                  >
                     <MdSecurity className='text-[18px]' />
                  </Button>
               ) : (
                  <>
                     <Button
                        type='button'
                        className='text-black/80 p-1.5'
                        data-tooltip-id={`turnstile_view_button_${data?.id}`}
                        data-tooltip-content='View'
                        onClick={() => {
                           setShowTurnStileDetailModal(true);
                           setViewTurnStileDetails({
                              allowed_domains: data?.allowed_domains,
                              email_notification: data.email_notification,
                              turnstile_enabled: data?.turnstile_enabled,
                              turnstile_mode: data?.turnstile_mode,
                              turnstile_site_key: data?.turnstile_site_key,
                           });
                        }}
                     >
                        <MdVisibility className='text-[22px]' />
                     </Button>

                     <Button
                        type='button'
                        className='text-black/80 p-1.5'
                        data-tooltip-id={`turnstile_edit_button_${data?.id}`}
                        data-tooltip-content='Edit'
                        onClick={() => {
                           setInquiryFormId(data?.id);
                           handleEditTurnstile(data);
                        }}
                     >
                        <MdModeEdit className='text-[22px]' />
                     </Button>

                     {data?.turnstile_verification_status !== 'verified' && (
                        <Button
                           type='button'
                           className='text-black/80 p-1.5'
                           data-tooltip-id={`turnstile_verify_button_${data?.id}`}
                           data-tooltip-content='Turnstile verification is pending. Complete verification to use this form.'
                           onClick={() => completeVerificationBtn(data)}
                        >
                           <MdVerified className='text-[22px] text-yellow-700' />
                        </Button>
                     )}
                  </>
               )}

               <Tooltip
                  id={`turnstile_setup_button_${data?.id}`}
                  opacity={'100'}
                  className='z-[15] bg-white'
                  place='left'
               />

               <Tooltip
                  id={`turnstile_view_button_${data?.id}`}
                  opacity={'100'}
                  className='z-[15] bg-white'
                  place='left'
               />

               <Tooltip
                  id={`turnstile_edit_button_${data?.id}`}
                  opacity={'100'}
                  className='z-[15] bg-white'
                  place='left'
               />
               {data?.turnstile_verification_status !== 'verified' && (
                  <Tooltip
                     id={`turnstile_verify_button_${data?.id}`}
                     opacity={'100'}
                     className='z-[15] bg-white'
                     place='left'
                  />
               )}
            </div>
         );
      },
   },
];
