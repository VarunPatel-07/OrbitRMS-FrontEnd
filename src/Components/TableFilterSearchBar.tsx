import Input from "../common/Input";

export default function TableFilterSearchBar() {
  return (
    <div className="p-2 bg-gray-200 w-full">
      <div className="flex items-stretch justify-between gap-2">
        <div className="w-full">
          <Input ClassName="bg-white rounded-lg h-full" />
        </div>
        <div className="">
          <button className="font-inter font-semibold bg-[#EEF4FF] border border-[#C7D7FE] text-[#3538CD] text-base h-full px-5 py-2 rounded-lg capitalize">filter</button>
        </div>
      </div>
    </div>
  );
}