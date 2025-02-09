import React, { SetStateAction } from "react";
import DropDown from "../DropDown";
import { returnPaginationRang } from "../../Helper/returnPaginationRange";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { classNames } from "../../Helper/HelperFunctions";

function TablePagination({
  paginationDropDownArray,
  recordsPerPage,
  setRecordsPerPage,
  selectedPage,
  setSelectedPage,
  totalPage,
}: {
  paginationDropDownArray: Array<number | string>;
  recordsPerPage: number | string;
  setRecordsPerPage: React.Dispatch<SetStateAction<number | string>>;
  selectedPage: number;
  setSelectedPage: React.Dispatch<SetStateAction<number>>;
  totalPage: number;
}) {
  const derivedPaginationArray = returnPaginationRang(totalPage, selectedPage, 1);
  const handelPaginationButtonClick = (value: number) => {
    setSelectedPage(value);
  };
  const handelPreviousButton = () => {
    if (selectedPage !== 1) {
      setSelectedPage(selectedPage - 1);
    }
  };
  const handelNextPage = () => {
    if (selectedPage < totalPage) {
      setSelectedPage(selectedPage + 1);
    }
  };

  return (
    <div className="w-full bg-white border-t border-t-[#d8d9dc] px-4 py-3 rounded-b-lg">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center justify-start gap-2">
          <p className="text-slate-950 font-medium text-sm capitalize">records Per Page:</p>
          <DropDown
            dropDownSelectedValue={recordsPerPage}
            setDropDownSelectedValue={setRecordsPerPage}
            dropdownMenuArray={paginationDropDownArray}
          />
        </div>
        <div className="w-fit">
          <ul className="flex items-center justify-end">
            <li className="w-fit">
              <button
                className="text-slate-950 text-sm capitalize flex items-center gap-1.5 bg-[#F9FAFB] px-3 py-1.5 border border-slate-400 rounded-l-lg hover:bg-slate-200"
                onClick={handelPreviousButton}>
                <FaArrowLeftLong />
                <span>previous</span>
              </button>
            </li>
            {derivedPaginationArray.map((value, index) => (
              <li className="w-fit">
                <button
                  className={classNames(
                    "text-slate-950 text-sm capitalize flex items-center justify-center gap-1.5  px-3 py-1.5 border-t border-b border-t-slate-400 border-b-slate-400 w-9",
                    {
                      "border-r border-r-slate-400": derivedPaginationArray.length !== index + 1,
                      "bg-gray-300": value === selectedPage,
                      "hover:bg-gray-100": value !== selectedPage,
                    }
                  )}
                  onClick={value !== "..." ? () => handelPaginationButtonClick(Number(value)) : undefined}>
                  {value}
                </button>
              </li>
            ))}
            <li className="w-fit">
              <button
                className="text-slate-950 text-sm capitalize flex items-center gap-1.5 bg-[#F9FAFB] px-3 py-1.5 border border-slate-400 rounded-r-lg hover:bg-slate-200"
                onClick={handelNextPage}>
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
