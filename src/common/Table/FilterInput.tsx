import { FiSearch } from "react-icons/fi";
import { CgClose } from "react-icons/cg";
import { useEffect, useRef, useState } from "react";
import {
  clientInquiryFiltersArray,
  clientInquiryFiltersInterFace,
} from "../../Pages/ClientInquiry/ClientInquiryFilters";
import { classNames } from "../../Helper/HelperFunctions";

function FilterInput({ clientInquiryFilters }: { clientInquiryFilters: clientInquiryFiltersInterFace[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [showFilterDropDownMenu, setShowFilterDropDownMenu] = useState(false);
  const [currentFilterId, setCurrentFilterId] = useState("");
  const [currentOperatorId, setCurrentOperatorId] = useState("");
  const [currentOptionsId, setCurrentOptionsId] = useState("");
  const [filterObject, setFilterObject] = useState<Array<Array<{ label: string; value: string }>>>([]);

  // Utility function to update the filterObject state
  const updateFilterObject = (newItem: { label: string; value: string }) => {
    setFilterObject((prevArray) => {
      if (prevArray.length > 0 && prevArray[prevArray.length - 1].length < 5) {
        const updatedLastArray = [...prevArray[prevArray.length - 1], newItem];
        return [...prevArray.slice(0, -1), updatedLastArray];
      } else {
        return [...prevArray, [newItem]];
      }
    });
  };

  const handelClick = (id: string, filter: clientInquiryFiltersInterFace) => {
    setShowFilterDropDownMenu(true);
    setCurrentFilterId(id);
    setCurrentOperatorId(filter.id);
    updateFilterObject({ label: filter.label as unknown as string, value: filter.id });
  };

  const handelOperatorClick = (operator: { label: string; value: string }) => {
    setCurrentOperatorId("");
    setCurrentOptionsId(operator.value);
    updateFilterObject({ label: operator.label, value: operator.value });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setShowFilterDropDownMenu(false);
        setCurrentOperatorId("");
        setCurrentOptionsId("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative h-full" ref={boxRef}>
      <div className="relative flex items-stretch justify-start bg-white rounded-lg overflow-hidden h-full">
        <div className="w-fit">
          {filterObject.length > 0 && (
            <div className="w-fit py-1 pl-1 flex gap-2 h-full">
              {filterObject.map((arrayQuery, index) => (
                <div
                  key={`filter-group-${index}`}
                  className="bg-gray-200 h-full pl-1.5 pr-3 flex items-center justify-center rounded-md gap-2">
                  <div className="flex items-center gap-1">
                    {arrayQuery.map((query, idx) => (
                      <span
                        key={`query-${idx}`}
                        className="bg-white border border-slate-300 text-black rounded-md px-2 text-sm">
                        {query.value}
                      </span>
                    ))}
                  </div>
                  <button>
                    <CgClose className="text-black" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full">
          {filterObject.length === 0 && (
            <FiSearch className="absolute text-black top-1/2 -translate-y-1/2 left-2 text-xl" />
          )}
          <input
            type="text"
            value=""
            className="bg-white caret-black w-full h-full text-base focus:outline-none focus:ring-0 py-2.5 pl-9 pr-4 autofill:!bg-black autofill:text-black"
            style={{ border: 0, color: "black" }}
            placeholder={filterObject.length === 0 ? "Filter Search..." : ""}
            onFocus={() => setShowFilterDropDownMenu(true)}
          />
        </div>
      </div>
      <div className="drop-down absolute z-10 top-full mt-1">
        <div className="flex items-start justify-start gap-2">
          {/* Filter Dropdown */}
          <div
            className={classNames("shadow-xl rounded-md overflow-hidden origin-top transition-all", {
              "scale-y-0 opacity-0": !showFilterDropDownMenu,
              "scale-y-100 opacity-100": showFilterDropDownMenu,
            })}>
            {currentFilterId === "" &&
              clientInquiryFilters.map((item) => (
                <div
                  key={item.id}
                  className="dropdown-item py-2 px-10 text-black bg-white hover:bg-gray-100 cursor-pointer"
                  onClick={() => handelClick(item.id, item)}>
                  {item.label}
                </div>
              ))}
          </div>
          {/* Operator Dropdown */}
          <div
            className={classNames("shadow-xl rounded-md overflow-hidden origin-top transition-all left-10 relative", {
              "scale-y-0 opacity-0": currentOperatorId === "",
              "scale-y-100 opacity-100": currentOperatorId !== "",
            })}>
            {clientInquiryFiltersArray
              .find((val) => val.id === currentFilterId)
              ?.operator?.map((item) => (
                <div
                  key={item.value}
                  className="dropdown-item py-2 px-10 text-black bg-white hover:bg-gray-100 cursor-pointer"
                  onClick={() => handelOperatorClick(item)}>
                  {item.label}
                </div>
              ))}
          </div>
          {/* Options Dropdown */}
          <div
            className={classNames("shadow-xl rounded-md overflow-hidden origin-top transition-all left-10 relative", {
              "scale-y-0 opacity-0": currentOptionsId === "",
              "scale-y-100 opacity-100": currentOptionsId !== "",
            })}>
            {clientInquiryFiltersArray
              .find((val) => val.id === currentFilterId)
              ?.options?.map((item) => (
                <div
                  key={item.value}
                  className="dropdown-item py-2 px-10 text-black bg-white hover:bg-gray-100 cursor-pointer"
                  onClick={() => handelOperatorClick(item)}>
                  {item.label}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterInput;
