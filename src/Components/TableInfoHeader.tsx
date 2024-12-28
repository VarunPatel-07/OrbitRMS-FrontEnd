import { FaExpandAlt } from "react-icons/fa";

function TableInfoHeader() {
  return (
    <div className="w-full p-6 bg-white rounded-t-lg">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-slate-950 font-semibold capitalize text-xl">client inquiry</p>
        </div>
        <div>
          <button>
            <FaExpandAlt />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableInfoHeader;
