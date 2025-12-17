import React, { SetStateAction } from 'react';

import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

import { classNames } from '../../Helper/HelperFunctions';
import { returnPaginationRang } from '../../Helper/returnPaginationRange';
import DropDown from '../DropDown';

function TablePagination({
  paginationDropDownArray,
  recordsPerPage,
  setRecordsPerPage,
  selectedPage,
  setSelectedPage,
  totalPage,
  clickOnPaginationVal,
  handelClickOnDroDownVal,
}: {
  paginationDropDownArray: Array<number | string>;
  recordsPerPage: number | string;
  setRecordsPerPage?: React.Dispatch<SetStateAction<number | string>>;
  selectedPage: number;
  setSelectedPage?: React.Dispatch<SetStateAction<number>>;
  totalPage: number;
  clickOnPaginationVal?: (value: number) => void;
  handelClickOnDroDownVal?: (value: number) => void;
}) {
  const derivedPaginationArray = returnPaginationRang(
    totalPage,
    selectedPage,
    1
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handelDropDownClick = (value: any) => {
    if (handelClickOnDroDownVal) {
      handelClickOnDroDownVal(value as number);
    } else {
      if (setRecordsPerPage) setRecordsPerPage(value);
    }
  };
  const handelPaginationButtonClick = (value: number) => {
    if (clickOnPaginationVal) {
      clickOnPaginationVal(value);
    } else {
      if (setSelectedPage) setSelectedPage(value);
    }
  };
  const handelPreviousButton = () => {
    if (clickOnPaginationVal) {
      if (selectedPage !== 1) {
        clickOnPaginationVal(selectedPage - 1);
      }
    } else {
      if (selectedPage !== 1) {
        if (setSelectedPage) setSelectedPage(selectedPage - 1);
      }
    }
  };
  const handelNextPage = () => {
    if (clickOnPaginationVal) {
      if (selectedPage < totalPage) {
        clickOnPaginationVal(selectedPage + 1);
      }
    } else {
      if (selectedPage < totalPage) {
        if (setSelectedPage) setSelectedPage(selectedPage + 1);
      }
    }
  };

  return (
    <div className='w-full bg-white border border-black/10 border-t-0 px-4 py-3 rounded-b-lg'>
      <div className='w-full flex items-center justify-between'>
        <div className='flex items-center justify-start gap-2'>
          <p className='text-slate-950 font-medium text-sm capitalize'>
            records Per Page:
          </p>
          <DropDown
            dropDownSelectedValue={recordsPerPage}
            setDropDownSelectedValue={handelDropDownClick}
            dropdownMenuArray={paginationDropDownArray}
            dropdownPosition='top'
            maxHeight={100}
            minWidth={64}
          />
        </div>
        <div className='w-fit'>
          <ul className='flex items-center justify-end'>
            <li className='w-fit'>
              <button
                className={classNames(
                  'text-slate-950 text-sm capitalize flex items-center gap-1.5 bg-[#f4f4f4] px-3 py-1.5 border border-slate-400 rounded-l-lg disabled:cursor-not-allowed disabled:bg-black/10',
                  {
                    'hover:bg-gray-200': selectedPage > 1,
                  }
                )}
                onClick={handelPreviousButton}
                disabled={selectedPage <= 1}
              >
                <FaArrowLeftLong />
                <span>previous</span>
              </button>
            </li>
            {derivedPaginationArray.map((value, index) => (
              <li className='w-fit' key={index}>
                <button
                  className={classNames(
                    'text-slate-950 text-base capitalize flex items-center justify-center gap-1.5  px-3 py-1 border-t border-b border-t-slate-400 border-b-slate-400 w-9 font-medium',
                    {
                      'border-r border-r-slate-400':
                        derivedPaginationArray.length !== index + 1,
                      'bg-black/25': value === selectedPage,
                      'hover:bg-gray-100': value !== selectedPage,
                    }
                  )}
                  onClick={
                    value !== '...'
                      ? () => handelPaginationButtonClick(Number(value))
                      : undefined
                  }
                >
                  {value}
                </button>
              </li>
            ))}
            <li className='w-fit'>
              <button
                className={classNames(
                  'text-slate-950 text-sm capitalize flex items-center gap-1.5 bg-[#f4f4f4] px-3 py-1.5 border border-slate-400 rounded-r-lg disabled:cursor-not-allowed disabled:bg-black/10',
                  {
                    'hover:bg-gray-200': selectedPage < totalPage,
                  }
                )}
                onClick={handelNextPage}
                disabled={selectedPage == totalPage}
              >
                <span>next</span>
                <FaArrowRightLong />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TablePagination;
