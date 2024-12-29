/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaSortDown, FaSortUp } from "react-icons/fa";
import { classNames } from "../Helper/HelperFunctions";
import React from "react";

interface Column {
  key: string;
  title: string | React.ReactElement;
  isSortable: boolean;
  isSticky: boolean;
  canToggleVisibility: boolean;
  align?: "left" | "center" | "right";
  filterable?: boolean;
  renderContent: (data: any) => React.ReactElement;
  // onSortColumn: () => void;
}

function Table({
  columns,
  data,
  tableWrapperClass,
  stickyHeaderClass,
}: {
  columns: Array<Column>;
  data: any;
  tableWrapperClass?: string;
  stickyHeaderClass?: string;
}) {
  // Example data

  return (
    <div className={`overflow-auto ${tableWrapperClass}`}>
      <table className="table-auto border-collapse w-full relative">
        <thead>
          <tr className={`${stickyHeaderClass} shadow`}>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={classNames("px-4 py-2 text-left bg-[#F2F4F7] text-black", {
                  "border-r border-r-[#d8d9dc]": columns.length !== index + 1,
                })}>
                <span className="flex items-center justify-start gap-1">
                  <span>{column.title}</span>
                  <span className="flex flex-col items-center justify-center w-4">
                    <button className="h-4 flex items-center justify-center relative">
                      <FaSortUp className="h-4 w-4 absolute bottom-[-8px] text-gray-500" />
                    </button>
                    <button className="h-4 flex items-center justify-center relative">
                      <FaSortDown className="h-4 w-4 absolute top-[-8px] text-gray-500" />
                    </button>
                  </span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, rowIndex: number) => (
            <tr key={row.id} className="">
              {columns.map((column, index) => (
                <td
                  key={column.key}
                  className={classNames("bg-white px-4 py-2 text-black", {
                    "border-r border-r-[#d8d9dc]": columns.length !== index + 1,
                    "border-b border-b-[#d8d9dc]": data.length !== rowIndex + 1,
                  })}>
                  {column.renderContent(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
