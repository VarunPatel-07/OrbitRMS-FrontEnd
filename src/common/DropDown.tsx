import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { classNames } from "../Helper/HelperFunctions";

function DropDown({
  dropDownSelectedValue,
  setDropDownSelectedValue,
  dropdownMenuArray,
}: {
  dropDownSelectedValue: string | number;
  setDropDownSelectedValue: React.Dispatch<SetStateAction<string | number>>;
  dropdownMenuArray: Array<string | number>;
}) {
  const refBox = useRef<HTMLDivElement>(null);
  const [showDropDownMenu, setShowDropDownMenu] = useState(false);

  const handelDropdownValueChange = (value: string | number) => {
    setDropDownSelectedValue(value);
    setShowDropDownMenu(false); // Hide the dropdown after selection
  };

  useEffect(() => {
    const handelClickOutSideTheBox = (event: MouseEvent) => {
      if (refBox.current && !refBox.current.contains(event.target as Node)) {
        setShowDropDownMenu(false);
      }
    };
    document.addEventListener("mousedown", handelClickOutSideTheBox);
    return () => {
      document.removeEventListener("mousedown", handelClickOutSideTheBox);
    };
  }, []);

  return (
    <div className="relative" ref={refBox}>
      <div
        className={classNames(
          "absolute bottom-full mb-1 text-black bg-white shadow-lg min-w-16 transition-all origin-bottom rounded-md",
          {
            "scale-y-100 opacity-100": showDropDownMenu,
            "scale-y-0 opacity-0": !showDropDownMenu,
          }
        )}>
        <ul className="w-full flex flex-col py-1">
          {dropdownMenuArray.map((value, index) => (
            <li key={index} className="w-full">
              <button
                className="w-full text-left text-sm px-3 py-1 hover:bg-gray-100"
                onClick={() => handelDropdownValueChange(value)}>
                {value}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="px-2.5 pr-8 py-1 bg-white border border-[#D0D5DD] rounded-lg relative min-w-16"
        onClick={() => setShowDropDownMenu(!showDropDownMenu)}>
        <span className="text-black font-inter text-sm">{dropDownSelectedValue}</span>
        <span className="absolute right-1 top-1/2 -translate-y-1/2">
          <IoIosArrowDown className="text-gray-600 text-base" />
        </span>
      </button>
    </div>
  );
}

export default DropDown;
