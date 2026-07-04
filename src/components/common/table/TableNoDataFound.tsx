import React from 'react';

import { TableInfoHeaderInterfaceButtonArrayObject } from '@/interface/ComponentProps.interface';
import { twMerge } from 'tailwind-merge';

import DefaultLotiAnimation from '@/assets/lottie/DefaultAnimation.lottie';

const DotLottieReact = React.lazy(() =>
   import('@lottiefiles/dotlottie-react').then((mod) => ({
      default: mod.DotLottieReact,
   }))
);

function TableNoDataFound({
   tableWrapperClass = 'max-h-[calc(100%-85px)]',
   notFoundTitle,
   notFoundMessage,
   notFoundOptionsButtonsArray,
   defaultAnimation,
}: {
   tableWrapperClass: string;
   notFoundTitle: string;
   notFoundMessage: string;
   notFoundOptionsButtonsArray: Array<TableInfoHeaderInterfaceButtonArrayObject>;
   defaultAnimation?: React.ReactElement;
}) {
   const renderOptionsButtonArray = (
      OptionsButtonArray: Array<TableInfoHeaderInterfaceButtonArrayObject>
   ) => {
      return OptionsButtonArray?.map((eachBtn, index) => (
         <button
            className={eachBtn?.classNames}
            key={index}
            onClick={eachBtn?.onclickFunction}
         >
            <span>{eachBtn?.buttonTitle}</span>
            <span>{eachBtn?.icon}</span>
         </button>
      ));
   };

   return (
      <div
         className={twMerge(
            `w-full bg-white h-full border border-black/10 border-t-0`,
            tableWrapperClass
         )}
      >
         <div className='w-full h-full flex items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-5 max-w-[450px]'>
               {defaultAnimation ? (
                  defaultAnimation
               ) : (
                  <span className='bg-gradient-to-b from-[#f5f7f7] to-[#eaedf0] p-2 flex items-center justify-center max-w-[90px] max-h-[90px] overflow-hidden rounded-full'>
                     <DotLottieReact
                        src={DefaultLotiAnimation}
                        loop
                        autoplay
                        height={75}
                        width={75}
                     />
                  </span>
               )}

               <div className='flex items-center justify-center gap-1.5 flex-col'>
                  <h6 className='text-lg font-semibold font-inter text-black/90 text-center'>
                     {notFoundTitle}
                  </h6>
                  <p className='text-black/70 text-base font-inter text-center'>
                     {notFoundMessage}
                  </p>
               </div>
               {notFoundOptionsButtonsArray.length !== 0 && (
                  <div className='pt-3'>
                     {renderOptionsButtonArray(notFoundOptionsButtonsArray)}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default TableNoDataFound;
