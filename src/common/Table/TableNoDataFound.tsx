import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { TableInfoHeaderInterfaceButtonArrayObject } from '../../interface/propsInterface';

function TableNoDataFound({
  tableWrapperClass = 'max-h-[calc(100%-85px)]',
  notFoundTitle,
  notFoundMessage,
  notFoundOptionsButtonsArray,
}: {
  tableWrapperClass: string;
  notFoundTitle: string;
  notFoundMessage: string;
  notFoundOptionsButtonsArray: Array<TableInfoHeaderInterfaceButtonArrayObject>;
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
      className={`w-full bg-white h-full ${tableWrapperClass} border border-black/10 border-t-0`}
    >
      <div className='w-full h-full flex items-center justify-center'>
        <div className='flex flex-col items-center justify-center gap-5 max-w-[450px]'>
          <span className='bg-gradient-to-b from-[#f5f7f7] to-[#eaedf0] p-2 flex items-center justify-center max-w-[90px] max-h-[90px] rounded-full'>
            <DotLottieReact
              src='https://lottie.host/b8387a72-e1df-4d93-b58b-6e8b867551df/if9rYDkN1u.lottie'
              loop
              autoplay
              height={75}
              width={75}
            />
          </span>
          <div className='flex items-center justify-center gap-1.5 flex-col'>
            <h6 className='text-lg font-semibold font-inter text-black/90 text-center'>
              {notFoundTitle}
            </h6>
            <p className='text-black/70 text-base font-inter text-center'>
              {notFoundMessage}
            </p>
          </div>
          {notFoundOptionsButtonsArray && (
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
