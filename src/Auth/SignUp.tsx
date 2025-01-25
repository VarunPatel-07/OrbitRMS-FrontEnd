/* eslint-disable @typescript-eslint/no-explicit-any */
import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import React, { useEffect, useRef, useState } from "react";
import { verifyUsersLoginStatus } from "../Helper/api/api";
import signInGradientBgImage from "../assets/Images/gradient-bg.png";
import signIn3dImage from "../assets/Images/sign-in-page-3d-image.png";
import orbitLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import Button from "../common/Button";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import { isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";

function SignIn() {
  const defaultInputRef = useRef<HTMLInputElement>(null);

  const [showGlobalLoader, setShowGlobalLoader] = useState(true);
  const [text, setText] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
    const [portalUrl, setPortalUrl] = useState("" as string);


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim() === "" || !isValidEmail(email)) {
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

  return (
    <>
      <HelmetSeo
        Title="Login | OrbitRMS"
        Content="logIn To OrbitRMS to simplify your work, manage everything in one place, and stay ahead with ease!"
      />
      <MainSuspenseLoader loading={showGlobalLoader} />
      {!showGlobalLoader && (
        <div className="h-screen w-screen bg-[var(--them-pink-color)]">
          <div className="w-full h-full flex items-stretch justify-start relative">
            <img
              src={signInGradientBgImage}
              className="w-2/3 h-full absolute top-0 left-0"
            />
            <img
              src={signIn3dImage}
              className="w-[43%] absolute bottom-0 left-[20px] lg:left-[8%] z-20 hidden md:block"
              alt=""
            />
            <div className="w-1/3 relative hidden md:block">
              <div className="w-full h-full p-7">
                <div>
                  <img
                    src={orbitLogo}
                    className="max-w-[250px] h-fit max-h-[55px] lg:max-h-[75px]"
                    alt=""
                  />
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
                  onSubmit={handleFormSubmit}
                >
                  <div className="flex flex-col items-start justify-start gap-2">
                    <h1 className="font-inter text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                      Sign Into{" "}
                      <span className="text-[var(--them-orange-color)]">
                        OrbitRMS!
                      </span>
                    </h1>
                    <p className="text-black text-sm font-light font-inter">
                      Sign in and unite all your resources in one orbit!"
                    </p>
                  </div>
<<<<<<< Updated upstream
                  <div className="grid grid-cols-1 gap-y-6  w-full">
                    <div className="w-full">
                      <Input
                        ref={defaultInputRef}
                        ClassName="border border-black/[.65] text-black"
                        showLabelField={true}
                        labelFieldName="Organization Name"
                        isRequiredField={true}
                        Type="text"
                        value={text}
                        setValue={setText}
                        showError={showError && text.trim() === ""}
                        errorMessage="This field is required."
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        ClassName="border border-black/[.65] text-black"
                        showLabelField={true}
                        labelFieldName="Primary Email"
                        isRequiredField={true}
                        value={email}
                        Type="email"
                        setValue={setEmail}
                        showError={showError}
                        errorMessage={
                          showError
                            ? email.trim() === ""
                              ? "This field is required."
                              : !isValidEmail(email)
                              ? "Please enter a valid email address."
                              : ""
                            : ""
                        }
                      />
                    </div>
                    <div className="relative w-full border">
                      <Input
                        ref={defaultInputRef}
                        ClassName=" border border-black/[.65] text-black pl-[120px]"
                        showLabelField={true}
                        labelFieldName="Protal Url Slug"
                        isRequiredField={true}
                        Type="text"
                        value={portalUrl}
                        setValue={setPortalUrl}
                        showError={showError && text.trim() === ""}
                        errorMessage="This field is required."
                      />
                      <div className="absolute flex items-center justify-center left-0 top-8 border-r border-black/[.65] text-black w-1/3 h-[40px] bg-[#7FAB984D] rounded-l-lg text-[14px]">
                        orbitrms.com
=======
                  <div className="w-full flex items-center justify-center h-full">
                    <div className="login-form min-w-[50%] bg-[#e8e2e02f] backdrop-blur-sm relative z-10 rounded-lg border border-[#242c40]">
                      <div className="py-10 px-12 max-h-[555px] overflow-auto hide-scrollbar scroll-mt-6">
                        <div className="grid grid-cols-1 w-full gap-5">
                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                              placeHolder="Organization Name"
                              Type="text"
                              value={organizationName}
                              setValue={setOrganizationName}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Organization Name"
                              showLabelField={true}
                              showError={showError} // Pass the showError state
                              errorMessage={organizationName.length < 1 ? "This field is required" : ""}
                            />
                          </div>
                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                              placeHolder="Organization Email"
                              Type="email"
                              value={email}
                              setValue={setEmail}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Organization Email"
                              showLabelField={true}
                              showError={showError} // Pass the showError state
                              errorMessage={email.length < 1 ? "This field is required" : ""}
                            />
                          </div>
                          <div className="w-full">
                            <label
                              htmlFor=""
                              className="text-sm font-sans font-normal text-[var(--main-blue-color)] pb-2 inline-block">
                              <span className="flex gap-1">
                                <span>Portal Url</span>
                                <FaStarOfLife className="w-1.5 text-red-700" />
                              </span>
                            </label>
                            <div className="flex items-center">
                              <div className="h-full flex items-end w-fit">
                                <span className="h-[42px] flex items-center justify-start text-black bg-slate-100 border-[1.5px] border-slate-500 border-r-0 py-2.5 px-4 rounded-l-lg opacity-50">
                                  http://localhost:5173
                                </span>
                              </div>
                              <div className="w-full">
                                <Input
                                  ClassName="border-[1.5px] border-slate-500 !text-blue-700 rounded-lg rounded-l-none bg-slate-50"
                                  placeHolder="Url Slug"
                                  Type="text"
                                  value={portalUrl.toLocaleLowerCase()}
                                  setValue={setPortalUrl}
                                  placeholderColor="text-gray-500"
                                  showError={showError} // Pass the showError state
                                  errorMessage={userName.length < 1 ? "This field is required" : ""}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                              placeHolder="Email"
                              Type="email"
                              value={email}
                              setValue={setEmail}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Website Url"
                              showLabelField={true}
                              showError={showError} // Pass the showError state
                              errorMessage={
                                email.length < 1
                                  ? "This field is required"
                                  : !isValidEmail(email)
                                  ? "Invalid email address"
                                  : ""
                              }
                            />
                          </div>
                          <div className="w-full">
                            <Input
                              ClassName="border-[1.5px] border-slate-500 text-black rounded-lg rounded-l-none bg-slate-50"
                              placeHolder="Password"
                              Type="number"
                              value={password}
                              setValue={setPassword}
                              placeholderColor="text-gray-500"
                              isRequiredField={true}
                              labelFieldName="Contact Number"
                              showLabelField={true}
                              viewPasswordBtn={true}
                              showError={showError} // Pass the showError state
                              errorMessage={password.length < 4 ? "password is required" : ""}
                              showCountryCodeSlug={true}
                            />
                          </div>
                          <div className="w-full pt-3">
                            <button
                              className="login bg-[var(--main-blue-color)] w-full px-4 py-2.5 rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
                              onClick={handelLoginSubmit}
                              disabled={buttonLoader}>
                              {buttonLoader ? (
                                <span
                                  className="flex items-center justify-center gap-3"
                                  role="status"
                                  aria-live="polite">
                                  <span>
                                    <AiOutlineLoading3Quarters className="animate-spin text-base font-extrabold text-primary" />
                                  </span>
                                  <span>Signing in...</span>
                                </span>
                              ) : (
                                "SignUp"
                              )}
                            </button>
                          </div>

                          <div className="w-full">
                            <p className="text-center text-sm text-slate-800 capitalize">
                              all ready have an account?{" "}
                              <Link
                                to={"/auth/sign-in"}
                                className="hover:underline hover:text-rose-600 cursor-pointer inline-block">
                                login
                              </Link>
                            </p>
                          </div>
                        </div>
>>>>>>> Stashed changes
                      </div>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-1 gap-y-8">
                    <Button
                      Type="submit"
                      className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all"
                      disabled={loading}
                    >
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
