import { BsThreeDotsVertical } from "react-icons/bs";
import { GrExpand } from "react-icons/gr";

function TableInfoHeader() {
  return (
    <div className="w-full p-6 bg-white rounded-t-lg">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-slate-950 font-semibold capitalize text-xl font-inter">client inquiries</p>
          <span className="px-2.5 py-0.5 bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] rounded-full text-sm font-inter font-medium">
            1-10 of 14 Inquiries
          </span>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button className="text-slate-800 rounded-lg px-2 py-2 border border-[#D0D5DD] flex items-center justify-center">
            <GrExpand />
          </button>
          <button className="text-slate-800 rounded-lg px-2 py-2 border border-[#D0D5DD] flex items-center justify-center">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableInfoHeader;
