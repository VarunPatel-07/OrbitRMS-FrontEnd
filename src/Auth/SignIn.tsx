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
import { isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";

function SignIn() {
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
        Title="Sign In | OrbitRMS"
        Content="Log in to OrbitRMS and start managing everything in one place with ease and efficiency!"
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
                      Sign In to <span className="text-[var(--them-orange-color)]">OrbitRMS!</span>
                    </h1>
                    <p className="text-black text-sm font-normal font-inter">
                      Sign in and Unite all your resources in one orbit!
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6  w-full">
                    <div className="w-full">
                      <Input
                        name="email"
                        className="border border-black/[.65] text-black"
                        labelFieldName="Email"
                        isRequiredField={true}
                        value={email}
                        type="email"
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
                          name="password"
                          className="border border-black/[.65]"
                          labelFieldName="Password"
                          isRequiredField={true}
                          type="password"
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
                          <Input type="checkbox" name="checkbox" />
                          <span className="text-black font-light text-sm font-inter">Remember Me</span>
                        </div>
                        <Link
                          to={"/auth/forgot-password"}
                          className="text-[var(--them-orange-color)] font-semibold font-inter text-sm cursor-pointer">
                          Forgot Password?
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="w-full grid grid-cols-1 gap-y-8">
                    <button
                      type="submit"
                      className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all"
                      disabled={loading}>
                      {loading ? <Loader loaderText="Signing In..." /> : <span>Sign In</span>}
                    </button>
                    <p className="text-center font-inter w-full text-sm text-black">
                      Don’t have an account?{" "}
                      <Link to="/auth/sign-up">
                        <span className=" text-[var(--them-orange-color)] cursor-pointer underline  font-bold">
                          Sign Up
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
