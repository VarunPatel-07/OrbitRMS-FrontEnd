/* eslint-disable @typescript-eslint/no-explicit-any */
import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import React, { useEffect, useRef, useState } from "react";
import { verifyUsersLoginStatus } from "../Helper/api/api";
import signInGradientBgImage from "../assets/Images/gradient-bg.png";
import signIn3dImage from "../assets/Images/sign-in-page-3d-image.webp";
import orbitLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import { classNames, formateAndVerifyPhoneNumber, isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";
import { FaStarOfLife } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import Loader from "../common/Loader";

const initialOrganizationFormInfo = {
  organizationName: "",
  primaryEmail: "",
  defaultPortalUrlSlug: "https://orbitrms.com/",
  websiteUrl: "",
  contactNumber: "",
};

function SignIn() {
  const defaultInputRef = useRef<HTMLInputElement>(null);

  const [showGlobalLoader, setShowGlobalLoader] = useState(true);
  const [showError, setShowError] = useState<boolean>(false);
  const [showErrorPageTwo, setShowErrorPageTwo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [portalUrl, setPortalUrl] = useState("" as string);
  const [formData, setFormData] = useState(initialOrganizationFormInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState<string>("");
  const [dropDownSelectedValue, setDropDownSelectedValue] = useState<string | number>("");

  const handleMoveToNextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData?.organizationName?.trim() === "" || !isValidEmail(formData?.primaryEmail)) {
      setShowError(true);
      setLoading(false);
      return;
    }
    setCurrentPage(2);
  };

  const handleFormSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.contactNumber?.trim() != "" && termsAccepted == "true") {
      setLoading(true);
    } else {
      setShowErrorPageTwo(true);
    }
  };

  const handelInputFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    defaultInputRef.current?.focus();

    verifyUsersLoginStatus(setShowGlobalLoader);
  }, []);

  const handelBackPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    setPortalUrl(formData.organizationName?.toLocaleLowerCase());
  }, [formData.organizationName]);

  return (
    <>
      <HelmetSeo
        Title="Sign Up | OrbitRMS"
        Content="Create an account on OrbitRMS to streamline your work, access all features, and manage everything effortlessly!"
      />

      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className="h-screen w-screen bg-[var(--them-pink-color)]">
          <div className="w-full h-full flex items-stretch justify-start relative">
            <img src={signInGradientBgImage} className="w-2/3 h-full absolute top-0 left-0" />
            <img
              src={signIn3dImage}
              className="w-[43%] absolute bottom-0 left-[20px] lg:left-[8%] z-20 hidden md:block"
              alt=""
            />
            <div className="w-1/3 relative hidden md:block">
              <div className="w-full h-full p-7">
                <div>
                  <img src={orbitLogo} className="max-w-[250px] h-fit max-h-[55px] lg:max-h-[75px]" alt="" />
                </div>
                <div className="pt-7 ">
                  <h1 className="font-syne text-base lg:text-xl text-white font-extrabold text-balance pl-0.5">
                    OrbitRMS: Simplify, Streamline, Succeed.
                  </h1>
                </div>
              </div>
            </div>
            <div className="rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px]  z-10 overflow-hidden">
              <div className="login-form w-full h-full  z-20 flex items-center justify-center">
                <div className="flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[480px] py-8 relative">
                  {currentPage == 2 && (
                    <button
                      className="font-medium text-[var(--them-orange-color)] cursor-pointer text-sm transition-all absolute top-0 left-5"
                      onClick={handelBackPage}>
                      <span className="flex items-center text-black/[0.65] justify-center gap-2">
                        <BsArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                      </span>
                    </button>
                  )}
                  <div className={"w-full px-5 transition-all"}>
                    <div className="flex flex-col items-start justify-start gap-2">
                      <h1 className="font-inter text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                        Sign Into <span className="text-[var(--them-orange-color)]">OrbitRMS!</span>
                      </h1>
                      <p className="text-black text-sm font-light font-inter">
                        Sign in and unite all your resources in one orbit!"
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <div
                      className={classNames("w-full flex transition-all", {
                        "translate-x-0": currentPage == 1,
                        "-translate-x-full": currentPage == 2,
                      })}>
                      <div
                        className={classNames(
                          "grid grid-cols-1 gap-y-5  w-full min-w-full px-5 transition-all duration-100",
                          {
                            "invisible , opacity-0": currentPage == 2,
                          }
                        )}>
                        <div className="w-full">
                          <Input
                            name="organizationName"
                            ref={defaultInputRef}
                            className="border border-black/[.65] text-black"
                            labelFieldName="Organization Name"
                            isRequiredField={true}
                            type="text"
                            value={formData?.organizationName}
                            onChange={(e) => handelInputFieldChange(e)}
                            showError={showError && formData?.organizationName?.trim() === ""}
                            errorMessage="This field is required."
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            name="primaryEmail"
                            className="border border-black/[.65] text-black"
                            labelFieldName="Primary Email"
                            isRequiredField={true}
                            value={formData.primaryEmail}
                            type="email"
                            onChange={(e) => handelInputFieldChange(e)}
                            showError={showError}
                            errorMessage={
                              showError
                                ? formData.primaryEmail?.trim() === ""
                                  ? "This field is required."
                                  : !isValidEmail(formData?.primaryEmail)
                                  ? "Please enter a valid email address."
                                  : ""
                                : ""
                            }
                          />
                        </div>
                        <div className="w-full">
                          <label
                            htmlFor=""
                            className="text-sm font-inter font-normal text-black/[.65] pb-2 inline-block">
                            <span className="flex gap-1">
                              <span>Portal Url</span>
                              <FaStarOfLife className="w-1.5 text-red-700" />
                            </span>
                          </label>
                          <div className="relative w-full flex items-stretch justify-start">
                            <div className="flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-5">
                              {formData.defaultPortalUrlSlug}
                            </div>
                            <Input
                              name="portalUrl"
                              className="border border-black/[.65] border-l-0 rounded-l-none text-black w-full"
                              type="text"
                              value={portalUrl?.toLocaleLowerCase()}
                              setValue={setPortalUrl}
                            />
                          </div>
                          {showError && portalUrl.trim() === "" && (
                            <span className="text-rose-600  text-xs  mt-1 block px-1.5 font-inter">
                              This field is required.
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={classNames(
                          "flex flex-col gap-y-5 justify-between w-full min-w-full px-5 transition-all duration-100",
                          {
                            "invisible opacity-0": currentPage == 1,
                          }
                        )}>
                        <div className="w-full">
                          <Input
                            name="websiteUrl"
                            className="border border-black/[.65] text-black"
                            labelFieldName="Website URL"
                            type="text"
                            value={formData?.websiteUrl}
                            onChange={(e) => handelInputFieldChange(e)}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            type="number"
                            name="contactNumber"
                            className="border border-black/[.65] text-black rounded-lg rounded-l-none"
                            labelFieldName="Contact Number"
                            isRequiredField={true}
                            value={formateAndVerifyPhoneNumber(
                              formData?.contactNumber,
                              dropDownSelectedValue ? JSON.parse(dropDownSelectedValue as string)?.country_code : "IN"
                            )}
                            onChange={(e) => handelInputFieldChange(e)}
                            showError={showErrorPageTwo && formData.contactNumber?.trim() == ""}
                            countryDropDownPosition="bottom"
                            dropDownSelectedValue={
                              dropDownSelectedValue
                                ? JSON.parse(dropDownSelectedValue as string)?.country_number_code
                                : ""
                            }
                            setDropDownSelectedValue={setDropDownSelectedValue}
                            errorMessage={
                              showErrorPageTwo
                                ? formData?.contactNumber?.trim() === ""
                                  ? "This field is required."
                                  : ""
                                : ""
                            }
                          />
                        </div>
                        <div className="w-full">
                          <div className="w-full flex items-center justify-start gap-3.5 relative z-[25]">
                            <Input
                              type="checkbox"
                              name="termsAccepted"
                              value={termsAccepted}
                              setValue={setTermsAccepted}
                            />
                            <div>
                              <p className="font-inter font-semibold text-sm text-black">
                                I agree to the terms and conditions
                              </p>
                              <p className="font-inter font-normal text-xs text-black">
                                Please read the Terms and Conditions before proceeding.
                              </p>
                            </div>
                          </div>
                          {showErrorPageTwo && termsAccepted != "true" && (
                            <span className="text-rose-600  text-xs  mt-1.5 block px-1.5 font-inter">
                              This field is required.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-1 gap-y-8 px-5">
                    {currentPage == 1 ? (
                      <button
                        type="button"
                        className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all"
                        disabled={loading}
                        onClick={handleMoveToNextPage}>
                        <span>Next</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                        disabled={loading}
                        onClick={handleFormSubmit}>
                        {loading ? <Loader loaderText="Submitting..." /> : <span>Submit</span>}
                      </button>
                    )}
                    <p className="text-center font-inter w-full text-sm text-black">
                      Already have an account?{" "}
                      <Link to="/auth/sign-in">
                        <span className=" text-[var(--them-orange-color)] cursor-pointer underline  font-bold">
                          Sign In
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;
