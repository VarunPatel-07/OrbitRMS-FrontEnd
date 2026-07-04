import { useContext, useState } from 'react';

import { AiOutlineRedo } from 'react-icons/ai';
import { FaEye, FaEyeSlash, FaStarOfLife } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import Skeleton from 'react-loading-skeleton';

import {
   NotificationContext,
   NotificationContextApiProps,
} from '@/contexts/notification/NotificationContextApi';
import { ClientInquiry } from '@/interface/ClientInquiry.interface';

import { useDebounce } from '@/hooks/useDebounce';

import Loader from '@/components/common/Loader';
import { endpointObject, multiplePutApi } from '@/utils/api/multipleAPI';

function ApiCredential({
   loading,
   formData,
   fetchApiStatus,
}: {
   loading: boolean;
   formData: ClientInquiry;
   fetchApiStatus: () => void;
}) {
   const { handelNotification } = useContext(
      NotificationContext
   ) as NotificationContextApiProps;

   const [showApiKey, setShowApiKey] = useState<boolean>(false);
   const [showApiSecrete, setShowApiSecrete] = useState<boolean>(false);
   const [reGenerateCredentialLoader, setReGenerateCredentialLoader] =
      useState<{
         api_key: boolean;
         api_secrete: boolean;
      }>({ api_key: false, api_secrete: false });

   const handelReGenerateApiCredentialWithDebounce = useDebounce(
      async (id: string, field_name: 'api_secrete' | 'api_key') => {
         const endpointArr: endpointObject[] = [
            {
               endPoint: `api-manager/client-inquiry/re-generate?id=${id}&field_name=${field_name}`,
               protected: true,
            },
         ];
         const response = await multiplePutApi(endpointArr);
         const res = response[0];
         handelNotification(res, 'top-right');
         if (res?.success) {
            fetchApiStatus();
         }
         setReGenerateCredentialLoader((perValue) => ({
            ...perValue,
            [field_name]: false,
         }));
      },
      1000
   );

   const handelReGenerateApiCredential = (
      id: string,
      field_name: 'api_secrete' | 'api_key'
   ) => {
      setReGenerateCredentialLoader((perValue) => ({
         ...perValue,
         [field_name]: true,
      }));
      handelReGenerateApiCredentialWithDebounce(id, field_name);
   };

   const handleClickOnCopyBtn = (text: string, message: string) => {
      navigator.clipboard
         .writeText(text)
         .then(() => {
            const data = { success: true, message: message };
            handelNotification(data, 'center');
         })
         .catch(() => {
            console.error('Failed to copy');
         });
   };
   return (
      <>
         {loading ? (
            <div className='w-full h-full bg-white'>
               <div className='flex flex-col items-start justify-start gap-5 w-full'>
                  {Array.from({ length: 2 }).map((_, index) => (
                     <div
                        className='flex items-stretch justify-start overflow-auto w-full'
                        key={index}
                     >
                        <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center'>
                           <Skeleton
                              width={80}
                              height={17}
                              className='inline-block'
                           />
                        </p>
                        <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-3 py-2 border-x-0 flex items-center justify-start relative group overflow-auto'>
                           <Skeleton
                              width={400}
                              height={17}
                              className='inline-block'
                           />
                        </p>
                        <div className='border border-black/10 bg-gray-100 px-3 py-2 pb-2.5 rounded-r-lg'>
                           <Skeleton
                              width={80}
                              height={30}
                              borderRadius={100}
                              className='inline-block'
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         ) : (
            <>
               <div className='flex items-stretch justify-start overflow-auto w-full hide-scrollbar'>
                  <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center min-w-[115px]'>
                     api_key
                  </p>
                  <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-8 pr-12 py-2 border-x-0 flex items-center justify-start relative group'>
                     {showApiKey ? (
                        formData?.api_key
                     ) : (
                        <span className='flex items-center justify-start w-full h-full gap-0.5'>
                           {Array.from({
                              length: formData?.api_key?.length,
                           }).map((_, index) => (
                              <FaStarOfLife
                                 key={index}
                                 className='text-[8px]'
                              />
                           ))}
                        </span>
                     )}
                     <div className='absolute top-1/2 -translate-y-1/2 right-5 invisible group-hover:visible transition-all flex items-center justify-end gap-2'>
                        <button
                           className='w-fit hover:bg-black p-1 pl-[5px] rounded-md hover:text-white flex items-center justify-center transition-all'
                           onClick={() =>
                              handleClickOnCopyBtn(
                                 formData?.api_key,
                                 'Api Key Copied Successfully'
                              )
                           }
                        >
                           <MdContentCopy />
                        </button>
                        <button
                           className='w-fit hover:bg-black p-1 pl-[5px] rounded-md hover:text-white flex items-center justify-center transition-all'
                           onClick={() => setShowApiKey(!showApiKey)}
                        >
                           {showApiKey ? (
                              <FaEye className='transition-all' />
                           ) : (
                              <FaEyeSlash className='transition-all' />
                           )}
                        </button>
                     </div>
                  </p>
                  <div className='border border-black/10 bg-gray-100 px-3 py-2 rounded-r-lg'>
                     <button
                        className='py-1.5 px-3 border rounded-full flex items-center justify-center gap-1 bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD] text-sm w-fit disabled:opacity-80'
                        disabled={reGenerateCredentialLoader?.api_key}
                        onClick={() =>
                           handelReGenerateApiCredential(
                              formData?.id,
                              'api_key'
                           )
                        }
                     >
                        {reGenerateCredentialLoader?.api_key ? (
                           <Loader loaderText='ReGenerating...' theme='dark' />
                        ) : (
                           <>
                              <AiOutlineRedo className='text-lg rotate-180' />
                              <span>Regenerate</span>
                           </>
                        )}
                     </button>
                  </div>
               </div>
               <div className='flex items-stretch justify-start overflow-auto w-full hide-scrollbar'>
                  <p className='font-inter text-black/80 font-medium text-base w-fit border border-black/10 bg-gray-100 px-3 py-2 rounded-l-lg flex items-center min-w-[115px]'>
                     api_secret
                  </p>
                  <p className='flex-grow font-inter text-black/80 font-medium text-base border border-black/10 bg-gray-100 px-8 pr-12 py-2 border-x-0 flex items-center justify-start relative group'>
                     {showApiSecrete ? (
                        formData?.api_secrete
                     ) : (
                        <span className='flex items-center justify-start w-full h-full gap-0.5'>
                           {Array.from({
                              length: formData?.api_secrete?.length,
                           }).map((_, index) => (
                              <FaStarOfLife
                                 key={index}
                                 className='text-[8px]'
                              />
                           ))}
                        </span>
                     )}
                     <div className='absolute top-1/2 -translate-y-1/2 right-5 invisible group-hover:visible transition-all flex items-center justify-end gap-2'>
                        <button
                           className='w-fit hover:bg-black p-1 pl-[5px] rounded-md hover:text-white flex items-center justify-center transition-all'
                           onClick={() =>
                              handleClickOnCopyBtn(
                                 formData?.api_secrete,
                                 'Api Secrete Copied Successfully'
                              )
                           }
                        >
                           <MdContentCopy />
                        </button>
                        <button
                           className='w-fit hover:bg-black p-1 pl-[5px] rounded-md hover:text-white flex items-center justify-center transition-all'
                           onClick={() => setShowApiSecrete(!showApiSecrete)}
                        >
                           {showApiSecrete ? (
                              <FaEye className='transition-all' />
                           ) : (
                              <FaEyeSlash className='transition-all' />
                           )}
                        </button>
                     </div>
                  </p>
                  <div className='border border-black/10 bg-gray-100 px-3 py-2 rounded-r-lg'>
                     <button
                        className='py-1.5 px-3 border rounded-full flex items-center justify-center gap-1 bg-[#EEF4FF] border-[#C7D7FE] text-[#3538CD] text-sm w-fit disabled:opacity-80'
                        onClick={() =>
                           handelReGenerateApiCredential(
                              formData?.id,
                              'api_secrete'
                           )
                        }
                        disabled={reGenerateCredentialLoader?.api_secrete}
                     >
                        {reGenerateCredentialLoader?.api_secrete ? (
                           <Loader loaderText='ReGenerating...' theme='dark' />
                        ) : (
                           <>
                              <AiOutlineRedo className='text-lg rotate-180' />
                              <span>Regenerate</span>
                           </>
                        )}
                     </button>
                  </div>
               </div>
            </>
         )}
      </>
   );
}

export default ApiCredential;
