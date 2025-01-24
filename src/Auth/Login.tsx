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

function Login() {
  const defaultInputRef = useRef<HTMLInputElement>(null);

  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim().length === 0 || password.length < 5 || !isValidEmail(email)) {
      setShowError(true);
      return;
    }
    if (email.trim().length != 0 && password.length >= 6 && isValidEmail(email)) {
      setLoading(true);
    }
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
            <div className="rounded-none w-full md:w-2/3 bg-white md:rounded-l-[24px] lg:rounded-l-[40px] relative z-10">
              <div className="login-form w-full h-full relative z-20 flex items-center justify-center">
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
                  <div className="grid grid-cols-1 gap-y-6 sm:gap-y-8 w-full">
                    <div className="w-full">
                      <Input
                        ClassName="border border-black/[.65] text-black"
                        showLabelField={true}
                        labelFieldName="Email"
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
                    <div className="w-full grid grid-cols-1 gap-y-3">
                      <div className="w-full">
                        <Input
                          ClassName="border border-black/[.65]"
                          showLabelField={true}
                          labelFieldName="Password"
                          isRequiredField={true}
                          Type="password"
                          viewPasswordBtn={true}
                          value={password}
                          setValue={setPassword}
                          showError={showError}
                          errorMessage={
                            showError
                              ? password.trim().length === 0
                                ? "This field is required."
                                : password.trim().length < 6
                                ? "Password must be at least 6 characters."
                                : ""
                              : ""
                          }
                        />
                      </div>
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center justify-start gap-1.5">
                          <Input Type="checkbox" />
                          <span className="text-black font-light text-sm font-inter">Remember Me</span>
                        </div>
                        <span className="text-[var(--them-orange-color)] font-semibold font-inter text-sm cursor-pointer">
                          Forgot Password?
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-1 gap-y-8">
                    <Button
                      Type="submit"
                      className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all"
                      disabled={loading}>
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="mr-3 -ml-1 size-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              stroke-width="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Signing In...</span>
                        </span>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </Button>
                    <p className="font-inter w-full text-sm text-black">
                      Don’t have an account?{" "}
                      <span className="font-medium text-[var(--them-orange-color)] cursor-pointer">Sign Up</span>
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

export default Login;
