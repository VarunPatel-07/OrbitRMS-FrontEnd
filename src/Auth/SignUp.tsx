/* eslint-disable @typescript-eslint/no-explicit-any */
import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import React, { useEffect, useRef, useState } from "react";
import { verifyUsersLoginStatus } from "../Helper/api/api";
import signInGradientBgImage from "../assets/Images/gradient-bg.png";
import signIn3dImage from "../assets/Images/sign-in-page-3d-image.webp";
import orbitLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import Button from "../common/Button";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import { isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";
import { FaStarOfLife } from "react-icons/fa";

function SignIn() {
  const defaultInputRef = useRef<HTMLInputElement>(null);

  const [showGlobalLoader, setShowGlobalLoader] = useState(true);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [primaryEmail, setPrimaryEmail] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [portalUrl, setPortalUrl] = useState("" as string);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (organizationName.trim() === "" || !isValidEmail(primaryEmail)) {
      setShowError(true);
      return;
    }
    setLoading(true);
    // Simulate API call or validation
    setTimeout(() => {
      setLoading(false);
      alert("Sign-in successful!");
    }, 1500);
  };

  useEffect(() => {
    verifyUsersLoginStatus(setShowGlobalLoader);
    defaultInputRef.current?.focus();
  }, []);

  useEffect(() => {
    setPortalUrl(organizationName.toLocaleLowerCase());
  }, [organizationName]);

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
            <div className="rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px]  z-10">
              <div className="login-form w-full h-full  z-20 flex items-center justify-center">
                <form
                  className="flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[400px] p-4 md:p-0"
                  onSubmit={handleFormSubmit}>
                  <div className="flex flex-col items-start justify-start gap-2">
                    <h1 className="font-inter text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                      Sign Into <span className="text-[var(--them-orange-color)]">OrbitRMS!</span>
                    </h1>
                    <p className="text-black text-sm font-light font-inter">
                      Sign in and unite all your resources in one orbit!"
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6  w-full">
                    <div className="w-full">
                      <Input
                        ref={defaultInputRef}
                        ClassName="border border-black/[.65] text-black"
                        showLabelField={true}
                        labelFieldName="Organization Name"
                        isRequiredField={true}
                        Type="text"
                        value={organizationName}
                        setValue={setOrganizationName}
                        showError={showError && organizationName.trim() === ""}
                        errorMessage="This field is required."
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        ClassName="border border-black/[.65] text-black"
                        showLabelField={true}
                        labelFieldName="Primary Email"
                        isRequiredField={true}
                        value={primaryEmail}
                        Type="email"
                        setValue={setPrimaryEmail}
                        showError={showError}
                        errorMessage={
                          showError
                            ? primaryEmail.trim() === ""
                              ? "This field is required."
                              : !isValidEmail(primaryEmail)
                              ? "Please enter a valid email address."
                              : ""
                            : ""
                        }
                      />
                    </div>
                    <div className="w-full">
                      <label htmlFor="" className="text-sm font-inter font-normal text-black/[.65] pb-2 inline-block">
                        <span className="flex gap-1">
                          <span>Portal Url</span>
                          <FaStarOfLife className="w-1.5 text-red-700" />
                        </span>
                      </label>
                      <div className="relative w-full flex items-stretch justify-start">
                        <div className="flex items-center justify-center border border-black/[.65] text-black w-fit bg-[#7FAB984D] rounded-l-lg text-[14px] px-5">
                          orbitrms.com
                        </div>
                        <Input
                          ref={defaultInputRef}
                          ClassName="border border-black/[.65] border-l-0 rounded-l-none text-black w-full"
                          showLabelField={true}
                          Type="text"
                          value={portalUrl.toLocaleLowerCase()}
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
                  <div className="w-full grid grid-cols-1 gap-y-8">
                    <Button
                      Type="submit"
                      className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all"
                      disabled={loading}>
                      <span>Next</span>
                    </Button>
                    <p className="text-center font-inter w-full text-sm text-black">
                      Already have an account?{" "}
                      <Link to="/auth/sign-in">
                        <span className=" text-[var(--them-orange-color)] cursor-pointer underline  font-bold">
                          Sign In
                        </span>
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;
