import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import Input from "./common/Input";
import { FaArrowRightLong } from "react-icons/fa6";

function RegisterLoginOrganizationForms() {
  const [currentSliderCounter, setCurrentSliderCounter] = useState(1 as number);
  const handelSliderIndicatorNavbarButton = (sliderButton: number) => {
    setCurrentSliderCounter(sliderButton);
  };
  return (
    <>
      <div className="w-full h-screen bg-white p-6">
        <div className="w-full h-full bg-[var(--main-white-color)] rounded-2xl shadow-2xl">
          <div className="border-b border-b-gray-600 grid grid-cols-2 px-7 py-3.5">
            <div className="flex items-center justify-start w-full h-full">
              <h5 className="text-lg font-sans font-semibold text-slate-900">Register Your Organization</h5>
            </div>
            <div className="w-full flex items-center justify-end gap-3">
              <button className="px-5 py-2 bg-green-600 rounded-full font-sans text-base font-semibold capitalize flex items-center justify-center gap-1">
                <span>save & next</span> <FaArrowRightLong className="w-7 h-[18px]" />
              </button>
              <button className="px-5 py-2 bg-slate-900 rounded-full flex items-center justify-center gap-1 font-sans text-base font-semibold capitalize">
                <FiLogOut />
                <span>back</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3.5 pt-9">
            <button
              className={`min-w-12 min-h-12 rounded-full  text-xl font-sans font-bold transition-all duration-500 ${
                currentSliderCounter >= 1 ? "bg-green-600" : "bg-gray-500"
              }`}
              onClick={() => handelSliderIndicatorNavbarButton(1)}>
              1
            </button>
            <span className="inline-block relative min-h-1 min-w-60">
              <span className="bg-gray-500 inline-block rounded-sm min-h-1 min-w-60 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2"></span>
              <span
                className={`bg-green-600 inline-block rounded-sm min-h-1 min-w-60 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 origin-left transition-all duration-500 ${
                  currentSliderCounter >= 2 ? "scale-x-100" : "scale-x-0"
                }`}></span>
            </span>
            <button
              className={`min-w-12 min-h-12 rounded-full  text-xl font-sans font-bold transition-all duration-500 ${
                currentSliderCounter >= 2 ? "bg-green-600" : "bg-gray-500"
              }`}
              onClick={() => handelSliderIndicatorNavbarButton(2)}>
              2
            </button>
            <span className="inline-block relative min-h-1 min-w-60">
              <span className="bg-gray-500 inline-block rounded-sm min-h-1 min-w-60 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2"></span>
              <span
                className={`bg-green-600 inline-block rounded-sm min-h-1 min-w-60 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 origin-left transition-all duration-500 ${
                  currentSliderCounter >= 3 ? "scale-x-100" : "scale-x-0"
                }`}></span>
            </span>
            <button
              className={`min-w-12 min-h-12 rounded-full  text-xl font-sans font-bold transition-all duration-500 ${
                currentSliderCounter >= 3 ? "bg-green-600" : "bg-gray-500"
              }`}
              onClick={() => handelSliderIndicatorNavbarButton(3)}>
              3
            </button>
            <span className="inline-block relative min-h-1 min-w-60">
              <span className="bg-gray-500 inline-block rounded-sm min-h-1 min-w-60 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2"></span>
              <span
                className={`bg-green-600 inline-block rounded-sm min-h-1 min-w-60 absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 origin-left transition-all duration-500 ${
                  currentSliderCounter >= 4 ? "scale-x-100" : "scale-x-0"
                }`}></span>
            </span>
            <button
              className={`min-w-12 min-h-12 rounded-full  text-xl font-sans font-bold transition-all duration-500 ${
                currentSliderCounter >= 4 ? "bg-green-600" : "bg-gray-500"
              }`}
              onClick={() => handelSliderIndicatorNavbarButton(4)}>
              4
            </button>
          </div>
          <div className="form pt-14 w-full">
            <div className="grid grid-cols-1 items-center justify-center w-[38%] mx-auto gap-y-10">
              <div className="flex flex-col gap-2 items-center">
                <Input
                  Type="file"
                  placeHolder="Enter Your Organization Name"
                  ClassName="border border-gray-600 rounded-lg text-base"
                  showLabelField={true}
                  labelFieldName="Organization Profile Picture"
                  isRequiredField={true}
                  RequiredFileTypeArray={[
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                    "image/svg+xml",
                    "image/bmp",
                    "image/tiff",
                    "image/x-icon",
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  Type="url"
                  placeHolder="Enter Your Organization Url"
                  ClassName="border border-gray-600 rounded-lg text-base"
                  showLabelField={true}
                  labelFieldName="Organization URL"
                  isRequiredField={true}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  Type="text"
                  placeHolder="Enter Your Organization Name"
                  ClassName="border border-gray-600 rounded-lg text-base"
                  showLabelField={true}
                  labelFieldName="Organization Name"
                  isRequiredField={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterLoginOrganizationForms;
