import { BsThreeDotsVertical } from 'react-icons/bs';
import { GrExpand } from 'react-icons/gr';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import {
  TableInfoHeaderInterface,
  TableInfoHeaderInterfaceButtonArrayObject,
} from '@/interface/ComponentProps.interface';

function TableInfoHeader(props: TableInfoHeaderInterface) {
  const {
    moduleName,
    badgeValue,
    buttonsArray,
    renderDateSelector = false,
    year,
    handelYearButton,
    loading = false,
    renderElement,
  } = props;

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
    <SkeletonTheme baseColor='#dcdce3' highlightColor='#ebebeb'>
      <div className='w-full p-6 bg-white rounded-t-lg border border-black/10 border-b-0'>
        <div className='w-full flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <p className='text-slate-950 font-semibold capitalize text-xl font-inter'>
              {moduleName}
            </p>
            {loading ? (
              <Skeleton
                width={120}
                height={20}
                className='inline-block mt-1'
                borderRadius={30}
              />
            ) : (
              <span className='px-2.5 py-0.5 bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] rounded-full text-sm font-inter font-medium'>
                {badgeValue}
              </span>
            )}
          </div>
          {renderDateSelector && handelYearButton && (
            <div className='flex items-stretch justify-between gap-2'>
              <button
                className='w-9 h-9 flex items-center justify-center border border-black/20 rounded-lg'
                onClick={() => handelYearButton('decrement')}
              >
                <RiArrowLeftSLine className='text-slate-900 text-2xl' />
              </button>
              <div className='border border-black/20 px-3 rounded-md flex items-center justify-center'>
                <span className='text-slate-900 text-sm inline-block'>
                  {year}
                </span>
              </div>
              <button
                className='w-9 h-9 flex items-center justify-center border border-black/20 rounded-lg'
                onClick={() => handelYearButton('increment')}
              >
                <RiArrowRightSLine className='text-slate-900 text-2xl' />
              </button>
            </div>
          )}

          <div className='flex items-center justify-end gap-3'>
            {buttonsArray ? (
              renderOptionsButtonArray(buttonsArray)
            ) : (
              <>
                <button className='text-slate-800 rounded-lg px-2 py-2 border border-[#D0D5DD] flex items-center justify-center'>
                  <GrExpand />
                </button>
                <button className='text-slate-800 rounded-lg px-2 py-2 border border-[#D0D5DD] flex items-center justify-center'>
                  <BsThreeDotsVertical />
                </button>
              </>
            )}
          </div>
          {renderElement && (
            <div className='flex items-center justify-end gap-3'>
              {renderElement}
            </div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
}

export default TableInfoHeader;
