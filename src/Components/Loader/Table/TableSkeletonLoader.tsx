import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { classNames } from "../../../Helper/HelperFunctions";

function TableSkeletonLoader({
  showHeaderLoader = true,
  showFilterLoader = true,
  showTableHeader = true,
  tableHeaderCount,
  tableValueCount,
  showPaginationLoader = true,
}: {
  showHeaderLoader?: boolean;
  showFilterLoader?: boolean;
  showTableHeader?: boolean;
  tableHeaderCount: number;
  tableValueCount: number;
  showPaginationLoader?: boolean;
}) {
  return (
    <SkeletonTheme baseColor="#d4d4d8" highlightColor="#e4e4e7">
      {showHeaderLoader && (
        <div className="w-full p-6 bg-white rounded-t-lg" aria-hidden="true">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-gray-800 font-semibold capitalize text-xl font-inter">
                <Skeleton width={250} height={28} className="inline-block" />
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Skeleton width={35} height={35} className="inline-block" />{" "}
              <Skeleton width={35} height={35} className="inline-block" />
            </div>
          </div>
        </div>
      )}
      {showFilterLoader && (
        <div aria-hidden="true" className="p-2 bg-gray-200 w-full relative">
          <div className="flex items-stretch justify-between h-10 -translate-y-1 gap-3">
            <div className="w-full">
              <Skeleton width={"100%"} height={"100%"} className="inline-block" />
            </div>
            <div className="min-w-20">
              <Skeleton width={"100%"} height={"100%"} className="inline-block" />
            </div>
          </div>
        </div>
      )}
      <div aria-hidden="true" className="w-full max-h-[calc(100vh-345px)] overflow-auto relative hide-scrollbar">
        {showTableHeader && (
          <div className="bg-[#eef0f4] flex items-center justify-start sticky top-0 z-10">
            {Array.from({ length: tableHeaderCount }).map((_, index) => (
              <div
                className={classNames("px-3 py-3 flex-grow flex items-center justify-center", {
                  "border-r border-r-[#d8d9dc]": tableHeaderCount != index + 1,
                })}
                key={index}
                aria-hidden="true">
                <Skeleton width={200} height={22} className="inline-block" />
              </div>
            ))}
          </div>
        )}
        {Array.from({ length: tableValueCount }).map((_, parentIndex) => (
          <div className="bg-white flex items-center justify-start" key={parentIndex}>
            {Array.from({ length: tableHeaderCount }).map((_, index) => (
              <div
                className={classNames("px-3 py-3 flex-grow flex items-center justify-center", {
                  "border-r border-r-[#d8d9dc]": tableHeaderCount != index + 1,
                })}
                key={index}
                aria-hidden="true">
                <Skeleton width={200} height={22} className="inline-block" />
              </div>
            ))}
          </div>
        ))}
      </div>
      {showPaginationLoader && (
        <div aria-hidden="true" className="w-full bg-white border-t border-t-[#d8d9dc] px-4 py-3 rounded-b-lg">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-start gap-2">
              <p>
                <Skeleton width={130} height={20} className="inline-block" />
              </p>
              <div>
                <Skeleton width={50} height={34} className="inline-block" />
              </div>
            </div>
            <div>
              <Skeleton width={430} height={34} className="inline-block" />
            </div>
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
}

export default TableSkeletonLoader;
