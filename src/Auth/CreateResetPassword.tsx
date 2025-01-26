import { Link, useLocation } from "react-router-dom";
import HelmetSeo from "../Helper/HelmetSeo";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import signInGradientBgImage from "../assets/Images/gradient-bg.png";
import signIn3dImage from "../assets/Images/sign-in-page-3d-image.webp";
import orbitLogo from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import Button from "../common/Button";
import { useEffect, useState } from "react";
import { LiaKeySolid } from "react-icons/lia";
import { BsArrowLeft } from "react-icons/bs";
import { verifyUsersLoginStatus } from "../Helper/api/api";
import Loader from "../common/Loader";
import { FiLock } from "react-icons/fi";

function CreateResetPassword() {
  const location = useLocation();
  const currentPath = location.pathname.split("/auth/")[1];
  // declaring the state variable
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [conformPassword, setConformPassword] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  const submitForgotPasswordHandler = async () => {
    // todo we will not hard cord the value it will totally depend to the api response
    if (password.trim().length < 5 && conformPassword.trim().length < 5) {
      setShowError(true);
      return;
    }
    if (password != conformPassword) {
      setShowError(true);
      return;
    }
    setLoading(true);
    setShowError(false);
  };
  useEffect(() => {
    verifyUsersLoginStatus(setShowGlobalLoader);
  }, []);

  return (
    <>
      <HelmetSeo
        Title={currentPath == "create-password" ? "Create Password | OrbitRMS" : "Reset Password | OrbitRMS"}
        Content={
          currentPath == "create-password"
            ? "Create a secure password to protect your OrbitRMS account. Ensure your password is strong and easy to remember."
            : "Reset your password to regain access to OrbitRMS. Set a new password and get back to managing everything securely."
        }
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
                    <div className="border border-black/[0.5] text-black rounded-lg p-3.5">
                      {currentPath == "create-password" && <FiLock className="w-7 h-7" />}
                      {currentPath == "reset-password" && <LiaKeySolid className="w-8 h-8" />}
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                      <h1 className="font-inter text-2xl md:text-3xl text-center font-bold text-black">
                        {currentPath == "create-password" && "Create Your Password"}
                        {currentPath == "reset-password" && "Set Your New Password"}
                      </h1>
                      <p className="text-black text-sm text-center text-pretty font-light font-inter">
                        {currentPath == "create-password" &&
                          `Set a strong password to secure your account. Make sure it’s unique and memorable for easy
                        access.`}
                        {currentPath == "reset-password" &&
                          `Enter a new password for your account to regain access. Ensure it is secure and different from your previous one.`}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <Input
                      ClassName="border border-black/[.65] text-black"
                      showLabelField={true}
                      labelFieldName="Password"
                      isRequiredField={true}
                      value={password}
                      Type="password"
                      viewPasswordBtn={true}
                      setValue={setPassword}
                      showError={showError}
                      errorMessage={
                        showError && password.trim().length < 1
                          ? "this field is required."
                          : password.trim().length < 6
                          ? "password must be at least 6 characters."
                          : ""
                      }
                    />
                  </div>
                  <div className="w-full">
                    <Input
                      ClassName="border border-black/[.65] text-black"
                      showLabelField={true}
                      labelFieldName="Conform Password"
                      isRequiredField={true}
                      value={conformPassword}
                      Type="password"
                      viewPasswordBtn={true}
                      setValue={setConformPassword}
                      showError={showError}
                      errorMessage={
                        showError && conformPassword.trim().length < 1
                          ? "This field is required."
                          : conformPassword.trim().length < 6
                          ? "Password must be at least 6 characters."
                          : password != conformPassword
                          ? "The passwords don't match."
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
    </>
  );
}

export default CreateResetPassword;
