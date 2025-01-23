/* eslint-disable @typescript-eslint/no-explicit-any */
import Illustration from "../assets/Images/a-minimalistic-illustration-of-a-professional-woma-qB-EvpaUTCW_7VPIzQCwAA-liCsDCsyRx6jUnjJ69VBsw.jpeg";
import OrbitRMS from "../assets/Images/OrbitRMS-White-Transperent-Logo.png";
import Input from "../common/Input";
import "./auth.css";
import HelmetSeo from "../Helper/HelmetSeo";
import { useEffect, useRef, useState } from "react";
import { isValidEmail } from "../Helper/HelperFunctions";
import { Link } from "react-router-dom";
import { loginForm } from "../interface/funcParamInterface";
import { loginApiFunction, verifyUsersLoginStatus } from "../Helper/api/api";
import MainSuspenseLoader from "../Components/Loader/MainSuspenseLoader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function Login() {
  const defaultInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("" as string);
  const [password, setPassword] = useState("" as string);
  const [showError, setShowError] = useState(false as boolean);
  const [loading, setLoading] = useState(false as boolean);
  const [showGlobalLoader, setShowGlobalLoader] = useState(true as boolean);

  const handelLoginSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (email.length < 1 || password.length < 4) {
      setShowError(true);
    } else {
      if (!isValidEmail(email)) {
        setShowError(true);
      }
    }
    if (email.length > 1 && password.length > 4 && isValidEmail(email)) {
      const loginData: loginForm = {
        email: email,
        password: password,
      };
      setLoading(true);
      await loginApiFunction("auth/login", loginData, "POST", setLoading);
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
        <div className="w-full h-screen transition-all fade-in">
          <div className="w-full h-full flex items-center justify-center bg-white overflow-hidden">
            <div className="w-full h-full flex items-stretch justify-center overflow-hidden">
              <div className="w-[40%] h-full bg-[var(--main-blue-color)] flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-center py-3">
                  <img src={OrbitRMS} alt="" className="w-48" />
                </div>
                <img src={Illustration} alt="A Woman Setting On The Computer" className="w-full h-fit object-cover" />
              </div>
              <div className="w-[60%] bg-[var(--main-white-color)] relative">
                <div className="w-full h-full px-4 pt-4 pb-8 flex flex-col justify-center">
                  <div className="w-full px-3 py-3  max-w-[500px] me-auto">
                    <h1 className="text-[#242c40] text-4xl font-serif text-nowrap text-start">
                      logIn To <span className="font-semibold">Orbit</span>RMS
                    </h1>
                    <p className="font-serif text-[#242c40] font-normal text-sm capitalize pt-2">
                      to simplify your work, manage everything in one place, and stay ahead with ease!
                    </p>
                  </div>
                  <div className="w-full flex items-center justify-center h-full">
                    <div className="login-form min-w-[50%] bg-[var(--main-white-color)2f] backdrop-blur-sm py-14 px-14 relative z-10 flex items-center justify-center border border-[#242c40] rounded-lg">
                      <div className="grid grid-cols-1 w-full gap-4 ">
                        <div className="w-full">
                          <Input
                            ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                            placeHolder="Email"
                            Type="email"
                            value={email}
                            setValue={setEmail}
                            placeholderColor="text-gray-500"
                            showError={showError} // Pass the showError state
                            isRequiredField={true}
                            showLabelField={true}
                            labelFieldName="Organization Email"
                            ref={defaultInputRef}
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
                            ClassName="border-[1.5px] border-slate-500 text-black rounded-lg bg-slate-50"
                            placeHolder="Password"
                            Type="password"
                            value={password}
                            setValue={setPassword}
                            placeholderColor="text-gray-500"
                            viewPasswordBtn={true}
                            isRequiredField={true}
                            labelFieldName="Password"
                            showLabelField={true}
                            showError={showError} // Pass the showError state
                            errorMessage={password.length < 4 ? "password is required" : ""}
                          />
                          <div className="w-full flex items-center justify-end pt-1">
                            <span className="text-blue-700 capitalize text-sm font-medium">Forgot Password</span>
                          </div>
                        </div>
                        <div className="w-full pt-3">
                          <button
                            className="login bg-[var(--main-blue-color)] w-full px-4 py-2.5 rounded-full disabled:opacity-70 disabled:cursor-not-allowed"
                            onClick={handelLoginSubmit}
                            disabled={loading}>
                            {loading ? (
                              <span className="flex items-center justify-center gap-3" role="status" aria-live="polite">
                                <span>
                                  <AiOutlineLoading3Quarters className="animate-spin text-base font-extrabold text-primary" />
                                </span>
                                <span>Logging in...</span>
                              </span>
                            ) : (
                              "Log in"
                            )}
                          </button>
                        </div>
                        <div className="w-full">
                          <p className="text-center text-sm text-slate-800 capitalize">
                            don't have account?{" "}
                            <Link
                              to={"/auth/signup"}
                              className="hover:underline hover:text-rose-600 cursor-pointer inline-block">
                              SignUp
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#b79c6f] w-60 h-60 rounded-full absolute -right-32 -bottom-32 circle-box-shadow"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
