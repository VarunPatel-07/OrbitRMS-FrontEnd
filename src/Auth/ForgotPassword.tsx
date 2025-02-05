/* eslint-disable @typescript-eslint/no-explicit-any */
import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import React, { useEffect, useState } from "react";
import { verifyUsersLoginStatus } from "../Helper/api/api";
import signInGradientBgImage from "../assets/Images/gradient-bg.png";
import signIn3dImage from "../assets/Images/sign-in-page-3d-image.webp";
import orbitLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import Button from "../common/Button";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import { Link } from "react-router-dom";
import { LiaKeySolid } from "react-icons/lia";
import { BsArrowLeft } from "react-icons/bs";
import Loader from "../common/Loader";
import AlertModal from "../common/AlertModal";
import { ModalInfoType } from "../interface/propsInterface";
import { IoMdRefresh } from "react-icons/io";
import { isValidEmail } from "../Helper/HelperFunctions";

const initialModalInfo = {
  success: false,
  protected: false,
  alertModalTitle: "",
  alertModelInfo: "",
  optionsButtonArray: [],
};

function ForgotPassword() {
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<ModalInfoType>(initialModalInfo);
  const [showError, setShowError] = useState<boolean>(false);

  const tryAgainFunction = () => {
    setShowAlertModal(false);
    setTimeout(() => setModalInfo(initialModalInfo), 350);
    setEmail("");
  };

  const errorAlertModalButtonArray = [
    {
      buttonTitle: "Contact Support",
      showButton: true,
      link: "support",
      classNames: "text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-sm font-medium",
    },
    {
      buttonTitle: "Try a Different Email",
      showButton: true,
      classNames: "font-medium font-inter cursor-pointer text-sm text-black/[0.65]",
      icon: <IoMdRefresh className="w-5 h-5" />,
      onclickFunction: () => tryAgainFunction(),
    },
  ];

  const successAlertModalButtonArray = [
    {
      buttonTitle: "Contact Support",
      showButton: true,
      classNames: "text-white bg-[var(--them-green-color)] py-2 rounded-lg font-inter text-sm font-medium",
    },
    {
      buttonTitle: "Back To Sign In",
      showButton: true,
      link: "/auth/sign-in",
      classNames: "font-medium font-inter cursor-pointer text-sm text-black/[0.65]",
      icon: <BsArrowLeft className="w-5 h-5" />,
    },
  ];

  const alertModalStateHandlerFunction = (success: boolean) => {
    if (!success) {
      setModalInfo({
        success: false,
        protected: true,
        alertModalTitle: "Oops! We Couldn’t Find Your Email",
        alertModelInfo: `We couldn’t find an account associated with the email <a href="mailto:${email}" class="text-blue-600 font-medium underline cursor-pointer">${email}</a>. Double-check for typos or try another email.`,
        optionsButtonArray: errorAlertModalButtonArray,
      });
      setShowAlertModal(true);
      return;
    }
    setModalInfo({
      success: true,
      protected: true,
      alertModalTitle: "You’re One Step Away from Resetting Your Password!",
      alertModelInfo: `We’ve just sent a password reset email to <a href="mailto:${email}" class="text-blue-600 font-medium underline cursor-pointer">${email}</a>. Follow the steps inside to regain access. 🚀 Check your spam folder if it doesn’t show up. 🔍`,
      optionsButtonArray: successAlertModalButtonArray,
    });
    setShowAlertModal(true);
  };

  const submitForgotPasswordHandler = async () => {
    // todo we will not hard cord the value it will totally depend to the api response
    if (email.trim().length < 1 && !isValidEmail(email)) {
      setShowError(true);
      return;
    }
    setLoading(true);
    setShowError(false);
    try {
      alertModalStateHandlerFunction(false);
    } catch {
      alertModalStateHandlerFunction(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    verifyUsersLoginStatus(setShowGlobalLoader);
  }, []);
  return (
    <>
      <HelmetSeo
        Title="Forgot Password | OrbitRMS"
        Content="Reset your password for OrbitRMS. Simplify your work and regain access to manage everything in one place effortlessly!"
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
                <div className="flex flex-col gap-8 sm:gap-10 items-start justify-start w-full max-w-[400px] p-4 md:p-0">
                  <div className="w-full flex flex-col items-center justify-center gap-7">
                    <div className="border border-black/[0.5] text-black rounded-lg p-3">
                      <LiaKeySolid className="w-8 h-8" />
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      <h1 className="font-inter text-2xl md:text-3xl text-center font-bold text-black">
                        Forgot your password?
                      </h1>
                      <p className="text-black text-sm text-center font-light font-inter">
                        Enter your email, and we’ll send you a reset link!{" "}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <Input
                      name="organizationEmail"
                      className="border border-black/[.65] text-black"
                      labelFieldName="Organization Email"
                      isRequiredField={true}
                      value={email}
                      type="email"
                      setValue={setEmail}
                      showError={showError}
                      errorMessage={
                        showError && email.trim().length < 1
                          ? "this is a required field"
                          : !isValidEmail(email)
                          ? "please enter a valid email address."
                          : ""
                      }
                    />
                  </div>
                  <div className="w-full grid grid-cols-1 gap-y-8">
                    <Button
                      Type="button"
                      className="bg-[var(--them-green-color)] w-full text-base py-2 font-semibold rounded-lg transition-all"
                      disabled={loading}
                      onClick={submitForgotPasswordHandler}>
                      {loading ? <Loader loaderText="Submitting..." /> : <span>Submit</span>}
                    </Button>
                    <Link
                      to={"/auth/sign-in"}
                      className="font-medium text-[var(--them-orange-color)] cursor-pointer text-sm">
                      <span className="flex items-center text-black/[0.65] justify-center gap-2">
                        <BsArrowLeft className="w-5 h-5" />
                        <span>Back To Sign In</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertModal ModalInfo={modalInfo} showAlertModal={showAlertModal} setShowAlertModal={setShowAlertModal} />
    </>
  );
}

export default ForgotPassword;
