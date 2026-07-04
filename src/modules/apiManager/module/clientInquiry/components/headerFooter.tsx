import Skeleton from 'react-loading-skeleton';

import { ClientInquiry } from '@/interface/ClientInquiry.interface';

import Loader from '@/components/common/Loader';

export function ApiManagerHeader({
   loading,
   formData,
}: {
   loading: boolean;
   formData: ClientInquiry;
}) {
   return (
      <>
         {loading ? (
            <div className='w-full h-[55px] flex items-center justify-between py-3 px-5 border border-black/15 bg-white border-b-0 rounded-t-lg'>
               <Skeleton width={200} height={22} />
               <Skeleton width={80} height={25} borderRadius={100} />
            </div>
         ) : (
            <div className='w-full h-fit flex items-center justify-between py-3 px-5 border border-black/15 bg-white rounded-t-lg border-b-0'>
               <h3 className='font-inter font-medium text-base text-black'>
                  Client Inquiry Api
               </h3>
               {formData?.status ? (
                  <span className='py-1 px-4 font-inter text-sm bg-green-200 border border-green-500 text-green-700 rounded-full'>
                     Active
                  </span>
               ) : (
                  <span className='py-1 px-4 font-inter text-sm bg-red-200 border border-red-500 text-red-700 rounded-full'>
                     Inactive
                  </span>
               )}
            </div>
         )}
      </>
   );
}

export function ApiManagerFooterBar({
   loading,
   buttonLoader,
   formData,
   handelEnableDisableOnClick,
}: {
   loading: boolean;
   buttonLoader: boolean;
   formData: ClientInquiry;
   handelEnableDisableOnClick: () => void;
}) {
   return (
      <>
         {loading ? (
            <div className='w-full h-fit border border-black/15 border-t-0 pt-1.5 pb-2.5 px-5 flex items-center justify-end gap-4 bg-white rounded-b-lg'>
               <Skeleton
                  width={140}
                  height={35}
                  className='inline-block'
                  borderRadius={10}
               />
            </div>
         ) : (
            <div className='w-full h-fit border border-black/15 border-t-0 py-2 px-5 flex items-center justify-end gap-4 bg-white rounded-b-lg'>
               <button
                  className={`px-5 py-2 rounded-lg border-0 text-white font-inter font-semibold text-base disabled:opacity-75 ${
                     formData?.status
                        ? 'bg-rose-600'
                        : 'bg-[var(--them-green-color)]'
                  }`}
                  onClick={handelEnableDisableOnClick}
                  disabled={buttonLoader}
               >
                  {buttonLoader ? (
                     <Loader
                        loaderText={
                           formData?.status ? 'Disabling....' : 'Enabling....'
                        }
                     />
                  ) : formData?.status ? (
                     'Disable Api'
                  ) : (
                     'Enable Api'
                  )}
               </button>
            </div>
         )}
      </>
   );
}
