import { useState } from "react";
import Input from "../Components/common/Input";
import OrbitRMSLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import FormStepCount from "../Components/common/FormStepCount";
import { PiTreeStructureFill } from "react-icons/pi";
import HelmetSeo from "../Helper/HelmetSeo";
import { GoOrganization } from "react-icons/go";
import { MdContentCopy, MdDone } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";
import { UniqueMetaTagGeneratingFunction } from "../Helper/HelperFunctions";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";

function RegisterOrganizationForm() {
  const [currentSliderCounter, setCurrentSliderCounter] = useState(1 as number);
  const [websiteUrl, setWebsiteUrl] = useState("" as string);
  const [urlErrorType, setUrlErrorType] = useState("");
  const [organizationName, setOrganizationName] = useState("" as string);
  const [organizationAccessKey, setOrganizationAccessKey] = useState("" as string);
  const [isCopied, setIsCopied] = useState(false as boolean);
  const [uniqueMetaTagString, setUniqueMetaTagString] = useState("" as string);
  const [verifyingYourWebsite, setVerifyingYourWebsite] = useState<{ verifying: boolean; is_verified: boolean }>({
    verifying: false,
    is_verified: false,
  });
  const [showError, setShowError] = useState(false as boolean);

  const counterStepsNameArray = [
    "Register Organization",
    "Add Meta Tag for Verification",
    "Set Organization Details",
    "Upload Organization Logo",
  ];
  const counterStepsSmallDescription = [
    "Provide your organization details along with the organization URL.",
    "Receive a meta tag, embed it in your website, and allow us to verify it.",
    "Enter your organization's name and configure a Access key.",
    "Upload the logo to personalize your organization profile.",
  ];

  const IncrementTheSliderCounter = () => {
    if (currentSliderCounter >= counterStepsNameArray.length) return;
    setCurrentSliderCounter(currentSliderCounter + 1);
  };

  const validateInputAndAdvanceSlider = async (counter: number) => {
    switch (counter) {
      case 1:
        if (websiteUrl.length <= 0) setShowError(true);
        if (urlErrorType == "safe") {
          IncrementTheSliderCounter();
        }
        break;
      case 2:
        if (!verifyingYourWebsite.verifying && verifyingYourWebsite.is_verified) {
          IncrementTheSliderCounter();
        }
        setVerifyingYourWebsite({ verifying: true, is_verified: false });
        IncrementTheSliderCounter();
        break;
      case 3:
        if (
          organizationName.length <= 0 ||
          organizationAccessKey.length <= 0 ||
          organizationAccessKey.trim() === websiteUrl.trim()
        ) {
          setShowError(true);
        } else {
          setShowError(false);
          IncrementTheSliderCounter();
        }
    }

    if (uniqueMetaTagString.length === 0) {
      const uniqueString = await UniqueMetaTagGeneratingFunction(15);
      setUniqueMetaTagString(uniqueString);
    }
  };
  const handelTheSidebarStepsButton = async (counter: number) => {
    console.log(counter);
    switch (counter) {
      case 1:
        if (websiteUrl.length <= 0) setShowError(true);
        if (urlErrorType == "safe") {
          setCurrentSliderCounter(2);
        }
        break;
      case 2:
        if (verifyingYourWebsite.verifying && !verifyingYourWebsite.is_verified) {
          setCurrentSliderCounter(3);
        } else {
          setVerifyingYourWebsite({ verifying: true, is_verified: false });
          // setCurrentSliderCounter(3);
        }

        break;
      case 3:
        if (
          organizationName.length <= 0 ||
          organizationAccessKey.length <= 0 ||
          organizationAccessKey.trim() === websiteUrl.trim()
        ) {
          setShowError(true);
        } else {
          setShowError(false);
          setCurrentSliderCounter(4);
        }
    }
    if (uniqueMetaTagString.length === 0) {
      const uniqueString = await UniqueMetaTagGeneratingFunction(15);
      setUniqueMetaTagString(uniqueString);
    }
  };

  const saveAndContinueButtonHandler = async () => {
    validateInputAndAdvanceSlider(currentSliderCounter);
  };
  const handelBackButton = () => {
    if (currentSliderCounter <= 1) return;
    setCurrentSliderCounter(currentSliderCounter - 1);
  };
  const handelTheCopyButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    const metaTag = e.currentTarget.closest(".group")?.querySelector("code");
    if (metaTag) {
      const textToCopy = metaTag.textContent || "";
      navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
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
            <div className="header py-3">
              <div
                className="flex items-start justify-start flex-nowrap transition-all duration-500"
                style={{ transform: `translateX(-${currentSliderCounter - 1}00%)` }}>
                {/* step1 */}
                <div className="step-1 px-6 flex flex-col gap-2 min-w-full">
                  <h2 className="font-serif text-white font-medium capitalize text-4xl">step 1</h2>
                  <p className="font-sans text-slate-300 text-sm">
                    Start by registering your organization with essential details, including the official organization
                    URL. This ensures a unique and secure identity for your organization.
                  </p>
                </div>
                {/* step2 */}
                <div className="step-1 px-6 flex flex-col gap-2 min-w-full">
                  <h2 className="font-serif text-white font-medium capitalize text-4xl">step 2</h2>
                  <p className="font-sans text-slate-300 text-sm">
                    Generate a meta tag and embed it in the header section of all pages on your website. Once done, our
                    system will automatically verify the tag to confirm ownership and authenticity.
                  </p>
                </div>
                {/* step3 */}
                <div className="step-1 px-6 flex flex-col gap-2 min-w-full">
                  <h2 className="font-serif text-white font-medium capitalize text-4xl">step 3</h2>
                  <p className="font-sans text-slate-300 text-sm">
                    Provide additional information like your organization's name and create a unique Access key. This
                    key will be used to manage access and ensure secure collaboration.
                  </p>
                </div>
                {/* step4 */}
                <div className="step-1 px-6 flex flex-col gap-2 min-w-full">
                  <h2 className="font-serif text-white font-medium capitalize text-4xl">step 4</h2>
                  <p className="font-sans text-slate-300 text-sm">
                    Upload a high-quality version of your organization's logo to visually represent your brand across
                    the platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 h-full flex flex-col items-center justify-center">
              <FormStepCount
                currentSliderCounter={currentSliderCounter}
                totalCounter={counterStepsNameArray.length}
                alignment="vertical"
                counterStepsNameArray={counterStepsNameArray}
                validateInputAndAdvanceSlider={handelTheSidebarStepsButton}
              />
            </div>
          </div>
          <div className="form w-[70%] py-10 flex flex-col gap-6">
            <div className="w-full mx-auto px-8">
              <h2 className="text-2xl font-sans font-bold text-black transition-all">
                {counterStepsNameArray[currentSliderCounter - 1]}
              </h2>
              <p className="text-slate-700 text-sm pt-1 transition-all">
                {counterStepsSmallDescription[currentSliderCounter - 1]}
              </p>
            </div>
            <div className="overflow-hidden h-full w-full max-w-[525px] mx-auto flex items-center justify-center">
              <div
                className="flex items-center justify-start flex-nowrap w-full h-full transition-all duration-500"
                style={{ transform: `translateX(-${currentSliderCounter - 1}00%)` }}>
                {/* first step page */}
                <div className="min-w-full h-full p-2">
                  <div className="flex flex-col items-center justify-around min-w-full mx-auto bg-slate-50 px-6 py-6 rounded-lg shadow-md h-full overflow-auto">
                    <div className="w-full flex items-center justify-center">
                      <span className="bg-gray-400 w-20 h-20 flex items-center justify-center rounded-full">
                        <PiTreeStructureFill className="rotate-90 w-10 h-10 text-white" />
                      </span>
                    </div>
                    <div className="w-full">
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
                    <div className="w-full py-3">
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
                        showError={showError ? true : ["invalid", "unsafe"].includes(urlErrorType) ? true : false}
                        errorMessage={
                          websiteUrl.length <= 0
                            ? "Please enter a website URL."
                            : urlErrorType === "invalid"
                            ? "The provided URL format is incorrect. Please check and try again."
                            : urlErrorType === "unsafe"
                            ? "The entered URL is flagged as unsafe. Please use a secure URL."
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>
                {/* second step page */}
                <div className="min-w-full h-full p-2 relative">
                  <div className="flex flex-col items-center justify-around min-w-full mx-auto gap-4 bg-slate-50 px-6 py-6 shadow-md h-full overflow-auto rounded-lg">
                    <div className="w-full flex items-center justify-center">
                      <span className="bg-gray-400 w-20 h-20 flex items-center justify-center rounded-full">
                        <GoOrganization className="w-10 h-10 text-white" />
                      </span>
                    </div>
                    <div className="w-full">
                      <p className="text-base text-pretty font-sans text-black">
                        To enable proper integration with OrbitRMS, add the following meta tag to all pages of your
                        website. This tag uniquely identifies your site with OrbitRMS and ensures seamless
                        functionality. Once you've added it, click <strong>'Save and Continue'</strong> to proceed.
                      </p>
                    </div>
                    <div className="text-black px-4 py-4 bg-gray-300 rounded-sm text-balance font-sans font-medium relative group">
                      <code className="break-words">
                        &lt;meta name="orbitrms" content= "{uniqueMetaTagString}" &gt;
                      </code>
                      <button
                        className="absolute top-1 right-2 p-1.5 transition-all hover:bg-gray-400 rounded-full text-black opacity-0 group-hover:opacity-100"
                        onClick={handelTheCopyButton}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={isCopied ? "Copied" : "Copy"}>
                        {isCopied ? <MdDone /> : <MdContentCopy />}
                        <Tooltip id="my-tooltip" place="left" />
                      </button>
                    </div>

                    <div className="w-full px-4">
                      <p className="text-sm text-gray-600 italic">
                        <strong>Note:</strong> Ensure the meta tag is placed inside the <code>&lt;head&gt;</code>{" "}
                        section of your HTML. If you are using a CMS, check its documentation for adding meta tags
                        globally.
                      </p>
                    </div>
                  </div>
                  {verifyingYourWebsite.verifying ? (
                    <div className="absolute top-0 left-0 w-full h-full  p-2 transition-all">
                      <div className="bg-[rgb(0,0,0,0.25)] w-full h-full rounded-lg backdrop-blur-sm flex items-center justify-center">
                        <div className="flex items-center justify-center gap-2.5 bg-slate-50 py-10 px-14 rounded-md">
                          <AiOutlineLoading3Quarters className="animate-spin text-2xl text-slate-950 font-bold" />
                          <p className="text-slate-950 capitalize text-2xl font-bold">verifying...</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                {/* step three page */}
                <div className="min-w-full h-full p-2">
                  <div className="flex flex-col items-center justify-start min-w-full mx-auto gap-4 bg-slate-50 px-6 py-6 rounded-lg shadow-md h-full overflow-auto">
                    <div className="w-full flex items-center justify-center">
                      <span className="bg-gray-400 w-20 h-20 flex items-center justify-center rounded-full">
                        <GoOrganization className="w-10 h-10 text-white" />
                      </span>
                    </div>
                    <div className="w-full py-3">
                      <p className="text-base text-pretty font-sans text-black">
                        Please provide your Organization Name and Organization Access Key to integrate with OrbitRMS.
                        These details uniquely identify your organization. Click <strong>'Save and Continue'</strong> to
                        proceed.
                      </p>
                    </div>
                    <div className="w-full flex flex-col gap-7 py-3">
                      <div className="w-full">
                        <Input
                          Type="text"
                          placeHolder="Enter Your Organization Name"
                          ClassName="border border-gray-600 rounded-lg text-base"
                          showLabelField={true}
                          labelFieldName="Organization Name"
                          isRequiredField={true}
                          value={organizationName}
                          setValue={setOrganizationName}
                          showError={showError}
                          errorMessage={organizationName.length < 1 ? "Please provide a valid organization name" : ""}
                        />
                      </div>
                      <div className="w-full">
                        <Input
                          Type="password"
                          placeHolder="Set A Strong Organization Access Key"
                          ClassName="border border-gray-600 rounded-lg text-base text-black"
                          showLabelField={true}
                          labelFieldName="Organization Access Key"
                          isRequiredField={true}
                          value={organizationAccessKey}
                          setValue={setOrganizationAccessKey}
                          showError={organizationAccessKey.trim() == websiteUrl.trim() ? true : showError}
                          viewPasswordBtn={true}
                          errorMessage={
                            organizationAccessKey.trim() === websiteUrl.trim()
                              ? "The access key cannot be the same as the website URL."
                              : organizationAccessKey.length < 1
                              ? "Please provide a strong access key for your organization."
                              : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* step four page */}
                <div className="min-w-full h-full p-2">
                  <div className="flex flex-col items-center justify-start min-w-full mx-auto gap-4 bg-slate-50 px-6 py-6 rounded-lg shadow-md h-full overflow-auto">
                    <div className="w-full flex items-center justify-center">
                      <span className="bg-gray-400 w-20 h-20 flex items-center justify-center rounded-full">
                        <GoOrganization className="w-10 h-10 text-white" />
                      </span>
                    </div>
                    <div className="w-full py-3">
                      <p className="text-base text-pretty font-sans text-black">
                        Upload your Organization Logo (optional). If no logo is uploaded, your website's favicon will be
                        used as the organization logo. Once done, click <strong>'Register Organization'</strong> to
                        complete your organization setup.
                      </p>
                    </div>
                    <div className="w-full relative">
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
                        showDropFileScreenInFullScreen={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-[525px] mx-auto flex flex-row-reverse items-center justify-start gap-3 px-2">
              {currentSliderCounter === counterStepsNameArray.length ? (
                <button className="bg-green-600 px-6 py-2.5 rounded-full text-base font-sans capitalize font-semibold text-white flex items-center justify-center gap-2 transition-all">
                  <span>Register Organization</span>
                </button>
              ) : (
                <button
                  className="bg-green-600 px-6 py-2.5 rounded-full text-base font-sans capitalize font-semibold text-white flex items-center justify-center gap-2 transition-all"
                  onClick={saveAndContinueButtonHandler}>
                  <span>Save and Continue</span>
                  <FaArrowRightLong className="w-4" />
                </button>
              )}

              {currentSliderCounter > 1 && (
                <button
                  className="bg-gray-700 px-6 py-2.5 rounded-full text-base font-sans capitalize font-semibold text-white flex items-center justify-center gap-2 transition-all"
                  onClick={handelBackButton}>
                  <FaArrowLeftLong className="w-4" />
                  <span>back</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <MainSuspenseLoader />
    </>
  );
}

export default RegisterOrganizationForm;
