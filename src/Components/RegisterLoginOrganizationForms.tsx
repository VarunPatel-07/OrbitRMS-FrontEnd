import { useState } from "react";
import Input from "./common/Input";
import OrbitRMSLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import FormStepCount from "./common/FormStepCount";
import { FaArrowRightLong } from "react-icons/fa6";
import { PiTreeStructureFill } from "react-icons/pi";
import HelmetSeo from "../Helper/HelmetSeo";

function RegisterLoginOrganizationForms() {
  const [currentSliderCounter, setCurrentSliderCounter] = useState(1 as number);
  const [websiteUrl, setWebsiteUrl] = useState("" as string);
  const [urlErrorType, setUrlErrorType] = useState("");

  const counterStepsNameArray = [
    "Register Organization",
    "Add Meta Tag for Verification",
    "Set Organization Details",
    "Upload Organization Logo",
  ];
  const counterStepsSmallDescription = [
    "Provide your organization details along with the organization URL.",
    "Receive a meta tag, embed it in your website, and allow us to verify it.",
    "Enter your organization's name and configure a joining key.",
    "Upload the logo to personalize your organization profile.",
  ];
  return (
    <>
      <HelmetSeo
        Title="Register - Organization | OrbitRMS"
        Content="logIn To OrbitRMS to simplify your work, manage everything in one place, and stay ahead with ease!"
      />
      <div className="w-full h-screen bg-[var(--main-white-color)]">
        <div className="w-full h-full flex items-stretch justify-center">
          <div className="bg-[var(--main-blue-color)] w-[30%] overflow-hidden flex flex-col">
            <div className="logo py-3.5">
              <img src={OrbitRMSLogo} className="max-w-48 mx-auto" alt="orbitrms logo" />
            </div>
            <div className="header py-4">
              <div className="step-1 px-6 flex flex-col gap-2">
                <h2 className="font-serif text-white font-medium capitalize text-4xl">step 1</h2>
                <p className="font-sans text-slate-300 text-sm">
                  Start by registering your organization with essential details, including the official organization
                  URL. This ensures a unique and secure identity for your organization.
                </p>
              </div>
            </div>
            <div className="px-6 h-full flex flex-col items-center justify-center">
              <FormStepCount
                currentSliderCounter={currentSliderCounter}
                setCurrentSliderCounter={setCurrentSliderCounter}
                totalCounter={4}
                alignment="vertical"
                counterStepsNameArray={counterStepsNameArray}
              />
            </div>
          </div>
          <div className="form w-[70%] py-11 flex flex-col gap-10">
            <div className="w-full mx-auto px-8">
              <h2 className="text-2xl font-sans font-bold text-black transition-all">
                {counterStepsNameArray[currentSliderCounter]}
              </h2>
              <p className="text-slate-700 text-sm pt-1 transition-all">
                {counterStepsSmallDescription[currentSliderCounter]}
              </p>
            </div>
            <div className="bg-slate-50 shadow-lg h-full w-1/2 mx-auto rounded-lg px-4 py-6">
              <div className="grid grid-cols-1 items-center justify-center w-full mx-auto gap-y-10">
                <div className="w-full flex items-center justify-center">
                  <span className="bg-gray-400 w-20 h-20 flex items-center justify-center rounded-full">
                    <PiTreeStructureFill className="rotate-90 w-10 h-10 text-white" />
                  </span>
                </div>
                <div>
                  <ul className="flex flex-col gap-1 list-disc px-4">
                    <li className="text-slate-800 text-sm">Provide your official website URL.</li>
                    <li className="text-slate-800 text-sm">
                      Ensure the URL is well-formatted (e.g., starts with https://) and secure.
                    </li>
                    <li className="text-slate-800 text-sm">click the "Save & Next" button to proceed.</li>
                    <li className="text-slate-800 text-sm">
                      After submission, a meta tag will be generated for you to integrate into your website.
                    </li>
                  </ul>
                </div>
                <div className="w-full">
                  <Input
                    Type="url"
                    placeHolder="Enter Your Organization Url"
                    ClassName="border border-gray-600 rounded-lg text-base"
                    showLabelField={true}
                    labelFieldName="Organization URL"
                    isRequiredField={true}
                    value={websiteUrl}
                    setValue={setWebsiteUrl}
                    setUrlErrorType={setUrlErrorType}
                    showError={["invalid", "unsafe"].includes(urlErrorType) ? true : false}
                    errorMessage={
                      urlErrorType === "invalid"
                        ? "The URL is not well formatted"
                        : urlErrorType === "unsafe"
                        ? "The URL is unsafe"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 mx-auto flex items-center justify-end">
              <button className="bg-green-600 px-7 py-3 rounded-full text-base font-sans capitalize font-semibold text-white flex items-center justify-center gap-2">
                <span>save & next</span>
                <FaArrowRightLong className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterLoginOrganizationForms;
